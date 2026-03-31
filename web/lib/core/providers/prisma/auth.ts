import argon2 from "argon2";
import type {
  Prisma,
  Session as PrismaSession,
} from "@prisma/client";

import { prisma } from "@/lib/core/prisma/client";
import type {
  AuthMutationResult,
  AuthProvider,
  AuthUserDto,
  LoginInput,
  MessageResult,
  PasswordResetInput,
  PasswordResetRequestInput,
  RegisterInput,
  SessionSummaryDto,
  VerifyEmailInput,
} from "@/lib/core/contracts/auth";
import type { AuthContext, RequestContext } from "@/lib/core/contracts/common";
import { authCookieNames } from "@/lib/core/auth/constants";
import { generateOpaqueToken, hashOpaqueToken } from "@/lib/core/auth/token";

const EMAIL_VERIFICATION_TOKEN_TYPE = "email_verification";

type UserWithRolesAndPermissions = Prisma.UserGetPayload<{
  include: {
    userRoles: {
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true;
              };
            };
          };
        };
      };
    };
  };
}>;

function parseCookieValue(cookieHeader: string | null | undefined, name: string) {
  if (!cookieHeader) {
    return null;
  }

  const entry = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  if (!entry) {
    return null;
  }

  return entry.slice(name.length + 1);
}

function sessionDuration(rememberMe?: boolean) {
  return rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7;
}

function toAuthUserDto(user: UserWithRolesAndPermissions): AuthUserDto {
  const roles = user.userRoles.map((item) => item.role.name);
  const permissions = [
    ...new Set(
      user.userRoles.flatMap((item) =>
        item.role.rolePermissions.map((permission) => permission.permission.name),
      ),
    ),
  ];

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    roles,
    permissions,
    backendMode: "prisma_neon",
  };
}

async function mapUser(userId: string): Promise<AuthUserDto> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return toAuthUserDto(user);
}

async function createSession(
  userId: string,
  ctx: RequestContext,
  rememberMe?: boolean,
) {
  const sessionToken = generateOpaqueToken();
  const refreshToken = generateOpaqueToken();
  const expiresAt = new Date(Date.now() + sessionDuration(rememberMe) * 1000);

  await prisma.session.create({
    data: {
      userId,
      sessionTokenHash: hashOpaqueToken(sessionToken),
      refreshTokenHash: hashOpaqueToken(refreshToken),
      userAgent: ctx.userAgent,
      ipAddress: ctx.ipAddress ?? undefined,
      lastSeenAt: new Date(),
      expiresAt,
    },
  });

  return {
    sessionToken,
    refreshToken,
    expiresAt,
  };
}

async function currentSession(ctx: RequestContext) {
  const sessionToken = parseCookieValue(ctx.cookieHeader, authCookieNames.session);

  if (!sessionToken) {
    return null;
  }

  return prisma.session.findFirst({
    where: {
      sessionTokenHash: hashOpaqueToken(sessionToken),
      revokedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
  });
}

export const prismaAuthProvider: AuthProvider = {
  async me(ctx) {
    const session = await currentSession(ctx);

    if (!session) {
      return null;
    }

    await prisma.session.update({
      where: { id: session.id },
      data: {
        lastSeenAt: new Date(),
        ipAddress: ctx.ipAddress ?? undefined,
        userAgent: ctx.userAgent ?? undefined,
      },
    });

    return mapUser(session.userId);
  },

  async login(input, ctx): Promise<AuthMutationResult> {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    const passwordValid =
      user !== null && (await argon2.verify(user.passwordHash, input.password));

    await prisma.loginLog.create({
      data: {
        userId: user?.id,
        email: input.email.toLowerCase(),
        success: passwordValid,
        ipAddress: ctx.ipAddress ?? undefined,
        userAgent: ctx.userAgent ?? undefined,
        failureReason: passwordValid ? null : "invalid_credentials",
      },
    });

    if (!user || !passwordValid) {
      throw new Error("The provided credentials are incorrect.");
    }

    if (user.status !== "active") {
      throw new Error("This account is not allowed to sign in.");
    }

    const session = await createSession(user.id, ctx, input.rememberMe);

    return {
      user: await mapUser(user.id),
      cookies: {
        backendMode: "prisma_neon",
        sessionToken: session.sessionToken,
        refreshToken: session.refreshToken,
        expiresAt: session.expiresAt.toISOString(),
      },
    };
  },

  async register(input, ctx): Promise<AuthMutationResult> {
    const passwordHash = await argon2.hash(input.password);

    const user = await prisma.user.create({
      data: {
        fullName: input.fullName,
        email: input.email.toLowerCase(),
        phone: input.phone,
        passwordHash,
        profile: {
          create: {},
        },
      },
    });

    const tenantRole = await prisma.role.findUnique({
      where: { name: "tenant" },
    });

    if (tenantRole) {
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: tenantRole.id,
        },
      });
    }

    const session = await createSession(user.id, ctx, true);

    return {
      user: await mapUser(user.id),
      cookies: {
        backendMode: "prisma_neon",
        sessionToken: session.sessionToken,
        refreshToken: session.refreshToken,
        expiresAt: session.expiresAt.toISOString(),
      },
    };
  },

  async logout(ctx): Promise<MessageResult> {
    const session = await currentSession(ctx);

    if (session) {
      await prisma.session.update({
        where: { id: session.id },
        data: {
          revokedAt: new Date(),
        },
      });
    }

    return {
      message: "Logged out successfully.",
    };
  },

  async logoutAll(ctx): Promise<MessageResult> {
    await prisma.session.updateMany({
      where: {
        userId: ctx.userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    return {
      message: "All active sessions were signed out.",
    };
  },

  async listSessions(ctx): Promise<SessionSummaryDto[]> {
    const sessions = await prisma.session.findMany({
      where: {
        userId: ctx.userId,
        revokedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const currentToken = parseCookieValue(ctx.cookieHeader, authCookieNames.session);
    const currentTokenHash = currentToken ? hashOpaqueToken(currentToken) : null;

    return sessions.map((session: PrismaSession) => ({
      id: session.id,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      lastSeenAt: session.lastSeenAt?.toISOString() ?? null,
      expiresAt: session.expiresAt.toISOString(),
      isCurrent: currentTokenHash === session.sessionTokenHash,
    }));
  },

  async revokeSession(sessionId, ctx): Promise<void> {
    await prisma.session.updateMany({
      where: {
        id: sessionId,
        userId: ctx.userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  },

  async forgotPassword(
    input,
  ): Promise<MessageResult> {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (!user) {
      return {
        message: "If an account exists for that email, a reset link has been issued.",
      };
    }

    const rawToken = generateOpaqueToken(24);

    await prisma.passwordResetToken.create({
      data: {
        email: user.email,
        tokenHash: hashOpaqueToken(rawToken),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    return {
      message: "If an account exists for that email, a reset link has been issued.",
      debugToken: process.env.NODE_ENV === "production" ? undefined : rawToken,
    };
  },

  async resetPassword(input): Promise<MessageResult> {
    const token = await prisma.passwordResetToken.findFirst({
      where: {
        email: input.email.toLowerCase(),
        tokenHash: hashOpaqueToken(input.token),
        consumedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!token) {
      throw new Error("This password reset token is invalid or expired.");
    }

    const passwordHash = await argon2.hash(input.password);

    await prisma.$transaction([
      prisma.user.update({
        where: { email: input.email.toLowerCase() },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: token.id },
        data: { consumedAt: new Date() },
      }),
      prisma.session.updateMany({
        where: {
          user: {
            email: input.email.toLowerCase(),
          },
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      }),
    ]);

    return {
      message: "Password reset successfully.",
    };
  },

  async requestEmailVerification(ctx): Promise<MessageResult> {
    const user = await prisma.user.findUnique({
      where: { id: ctx.userId },
    });

    if (!user) {
      throw new Error("Unable to issue a verification request.");
    }

    if (user.emailVerifiedAt) {
      return {
        message: "Email address is already verified.",
      };
    }

    const rawToken = generateOpaqueToken(24);

    await prisma.verificationToken.create({
      data: {
        identifier: user.id,
        tokenHash: hashOpaqueToken(rawToken),
        type: EMAIL_VERIFICATION_TOKEN_TYPE,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return {
      message: "Verification instructions have been issued.",
      debugToken: process.env.NODE_ENV === "production" ? undefined : rawToken,
    };
  },

  async verifyEmail(input: VerifyEmailInput): Promise<MessageResult> {
    const token = await prisma.verificationToken.findFirst({
      where: {
        tokenHash: hashOpaqueToken(input.token),
        type: EMAIL_VERIFICATION_TOKEN_TYPE,
        consumedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!token) {
      throw new Error("This verification token is invalid or expired.");
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: token.identifier },
        data: {
          emailVerifiedAt: new Date(),
        },
      }),
      prisma.verificationToken.update({
        where: { id: token.id },
        data: {
          consumedAt: new Date(),
        },
      }),
    ]);

    return {
      message: "Email verified successfully.",
    };
  },
};
