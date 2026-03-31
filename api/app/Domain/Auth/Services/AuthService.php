<?php

namespace App\Domain\Auth\Services;

use App\Models\LoginLog;
use App\Models\Role;
use App\Models\User;
use App\Models\VerificationToken;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthService
{
    private const EMAIL_VERIFICATION_TOKEN_TYPE = 'email_verification';

    public function csrfCookie(Request $request): array
    {
        $request->session()->regenerateToken();

        return [
            'token' => csrf_token(),
        ];
    }

    public function login(Request $request, array $credentials, bool $remember = false): array
    {
        $attemptedEmail = strtolower($credentials['email']);

        if (! Auth::guard('web')->attempt([
            'email' => $attemptedEmail,
            'password' => $credentials['password'],
        ], $remember)) {
            LoginLog::query()->create([
                'email' => $attemptedEmail,
                'success' => false,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'failure_reason' => 'invalid_credentials',
            ]);

            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        /** @var User $user */
        $user = $request->user();

        if ($user->status !== 'active') {
            Auth::guard('web')->logout();

            throw ValidationException::withMessages([
                'email' => ['This account is not allowed to sign in.'],
            ]);
        }

        $request->session()->regenerate();

        $user->forceFill([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ])->save();

        LoginLog::query()->create([
            'user_id' => $user->id,
            'email' => $user->email,
            'success' => true,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return $this->userPayload($user);
    }

    public function register(Request $request, array $payload): array
    {
        $user = User::query()->create([
            'full_name' => $payload['fullName'],
            'email' => strtolower($payload['email']),
            'phone' => $payload['phone'] ?? null,
            'password' => Hash::make($payload['password']),
            'status' => 'active',
        ]);

        $user->profile()->create();

        $tenantRole = Role::query()->where('name', 'tenant')->first();

        if ($tenantRole !== null) {
            $user->roles()->syncWithoutDetaching([$tenantRole->id]);
        }

        Auth::guard('web')->login($user, true);
        $request->session()->regenerate();

        LoginLog::query()->create([
            'user_id' => $user->id,
            'email' => $user->email,
            'success' => true,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return $this->userPayload($user);
    }

    public function logout(Request $request): array
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return [
            'message' => 'Logged out successfully.',
        ];
    }

    public function currentUser(?Authenticatable $user): ?array
    {
        if (! $user instanceof User) {
            return null;
        }

        return $this->userPayload($user);
    }

    public function forgotPassword(array $payload): array
    {
        Password::broker('users')->sendResetLink([
            'email' => strtolower($payload['email']),
        ]);

        return [
            'message' => 'If an account exists for that email, a reset link has been issued.',
        ];
    }

    public function resetPassword(array $payload): array
    {
        $status = Password::broker('users')->reset(
            [
                'email' => strtolower($payload['email']),
                'password' => $payload['password'],
                'password_confirmation' => $payload['password'],
                'token' => $payload['token'],
            ],
            function (User $user, string $password): void {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                DB::table('sessions')
                    ->where('user_id', $user->id)
                    ->delete();

                event(new PasswordReset($user));
            },
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'token' => [__($status)],
            ]);
        }

        return [
            'message' => 'Password reset successfully.',
        ];
    }

    public function listSessions(Request $request): array
    {
        /** @var User $user */
        $user = $request->user();
        $currentSessionId = $request->session()->getId();

        return DB::table('sessions')
            ->where('user_id', $user->id)
            ->orderByDesc('last_activity')
            ->get()
            ->map(function (object $session) use ($currentSessionId): array {
                return [
                    'id' => $session->id,
                    'ipAddress' => $session->ip_address,
                    'userAgent' => $session->user_agent,
                    'lastSeenAt' => now()
                        ->setTimestamp($session->last_activity)
                        ->toIso8601String(),
                    'expiresAt' => now()
                        ->setTimestamp($session->last_activity)
                        ->addMinutes(config('session.lifetime'))
                        ->toIso8601String(),
                    'isCurrent' => $session->id === $currentSessionId,
                ];
            })
            ->all();
    }

    public function revokeSession(Request $request, string $sessionId): array
    {
        /** @var User $user */
        $user = $request->user();

        DB::table('sessions')
            ->where('user_id', $user->id)
            ->where('id', $sessionId)
            ->delete();

        if ($request->session()->getId() === $sessionId) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return [
            'message' => 'Session revoked.',
        ];
    }

    public function logoutAll(Request $request): array
    {
        /** @var User $user */
        $user = $request->user();

        DB::table('sessions')
            ->where('user_id', $user->id)
            ->delete();

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return [
            'message' => 'All active sessions were signed out.',
        ];
    }

    public function requestEmailVerification(User $user): array
    {
        if ($user->email_verified_at !== null) {
            return [
                'message' => 'Email address is already verified.',
            ];
        }

        $rawToken = Str::random(48);

        VerificationToken::query()->create([
            'identifier' => $user->id,
            'token_hash' => $this->hashToken($rawToken),
            'type' => self::EMAIL_VERIFICATION_TOKEN_TYPE,
            'expires_at' => now()->addDay(),
        ]);

        return [
            'message' => 'Verification instructions have been issued.',
            'debugToken' => app()->isProduction() ? null : $rawToken,
        ];
    }

    public function verifyEmail(string $token): array
    {
        $verificationToken = VerificationToken::query()
            ->where('token_hash', $this->hashToken($token))
            ->where('type', self::EMAIL_VERIFICATION_TOKEN_TYPE)
            ->whereNull('consumed_at')
            ->where('expires_at', '>', now())
            ->first();

        if ($verificationToken === null) {
            throw ValidationException::withMessages([
                'token' => ['This verification token is invalid or expired.'],
            ]);
        }

        User::query()
            ->where('id', $verificationToken->identifier)
            ->update([
                'email_verified_at' => now(),
            ]);

        $verificationToken->forceFill([
            'consumed_at' => now(),
        ])->save();

        return [
            'message' => 'Email verified successfully.',
        ];
    }

    private function hashToken(string $token): string
    {
        return hash('sha256', $token);
    }

    private function userPayload(User $user): array
    {
        $user->loadMissing('roles');

        return [
            'id' => $user->id,
            'fullName' => $user->full_name,
            'email' => $user->email,
            'emailVerifiedAt' => $user->email_verified_at?->toIso8601String(),
            'phone' => $user->phone,
            'avatarUrl' => null,
            'roles' => $user->roles->pluck('name')->values()->all(),
            'permissions' => $user->effectivePermissions()->pluck('name')->values()->all(),
            'backendMode' => 'laravel_api',
        ];
    }
}
