import type { AuthContext, RequestContext } from '@/lib/core/contracts/common'
import type {
    AuthMutationResult,
    AuthUserDto,
    LoginInput,
    MessageResult,
    PasswordResetInput,
    PasswordResetRequestInput,
    RegisterInput,
    SessionSummaryDto,
    VerifyEmailInput,
} from '@/lib/shared/types/auth'

export type {
    AuthCookiesDto,
    AuthMutationResult,
    AuthUserDto,
    LoginInput,
    MessageResult,
    PasswordResetInput,
    PasswordResetRequestInput,
    RegisterInput,
    SessionSummaryDto,
    VerifyEmailInput,
} from '@/lib/shared/types/auth'

export interface AuthProvider {
    me(ctx: RequestContext): Promise<AuthUserDto | null>
    login(input: LoginInput, ctx: RequestContext): Promise<AuthMutationResult>
    register(
        input: RegisterInput,
        ctx: RequestContext,
    ): Promise<AuthMutationResult>
    logout(ctx: RequestContext): Promise<MessageResult>
    logoutAll(ctx: AuthContext): Promise<MessageResult>
    listSessions(ctx: AuthContext): Promise<SessionSummaryDto[]>
    revokeSession(sessionId: string, ctx: AuthContext): Promise<void>
    forgotPassword(
        input: PasswordResetRequestInput,
        ctx: RequestContext,
    ): Promise<MessageResult>
    resetPassword(
        input: PasswordResetInput,
        ctx: RequestContext,
    ): Promise<MessageResult>
    requestEmailVerification(ctx: AuthContext): Promise<MessageResult>
    verifyEmail(
        input: VerifyEmailInput,
        ctx: RequestContext,
    ): Promise<MessageResult>
}
