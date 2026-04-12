import type {
    AuthProvider,
    LoginInput,
    PasswordResetInput,
    PasswordResetRequestInput,
    RegisterInput,
    VerifyEmailInput,
} from '@/lib/core/contracts/auth'
import type {
    AuthContext,
    BackendMode,
    RequestContext,
} from '@/lib/core/contracts/common'
import { getProvider } from '@/lib/core/providers/provider-registry'

function provider(mode: BackendMode): AuthProvider {
    return getProvider(mode).auth
}

export async function getCurrentUser(mode: BackendMode, ctx: RequestContext) {
    return provider(mode).me(ctx)
}

export async function loginWithProvider(
    mode: BackendMode,
    input: LoginInput,
    ctx: RequestContext,
) {
    return provider(mode).login(input, ctx)
}

export async function registerWithProvider(
    mode: BackendMode,
    input: RegisterInput,
    ctx: RequestContext,
) {
    return provider(mode).register(input, ctx)
}

export async function logoutCurrentSession(
    mode: BackendMode,
    ctx: RequestContext,
) {
    return provider(mode).logout(ctx)
}

export async function requestPasswordReset(
    mode: BackendMode,
    input: PasswordResetRequestInput,
    ctx: RequestContext,
) {
    return provider(mode).forgotPassword(input, ctx)
}

export async function resetPasswordWithProvider(
    mode: BackendMode,
    input: PasswordResetInput,
    ctx: RequestContext,
) {
    return provider(mode).resetPassword(input, ctx)
}

export async function listActiveSessions(ctx: AuthContext) {
    return provider(ctx.backendMode).listSessions(ctx)
}

export async function revokeActiveSession(sessionId: string, ctx: AuthContext) {
    return provider(ctx.backendMode).revokeSession(sessionId, ctx)
}

export async function logoutAllSessions(ctx: AuthContext) {
    return provider(ctx.backendMode).logoutAll(ctx)
}

export async function requestEmailVerificationForUser(ctx: AuthContext) {
    return provider(ctx.backendMode).requestEmailVerification(ctx)
}

export async function verifyEmailWithProvider(
    mode: BackendMode,
    input: VerifyEmailInput,
    ctx: RequestContext,
) {
    return provider(mode).verifyEmail(input, ctx)
}
