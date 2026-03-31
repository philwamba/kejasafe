<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Domain\Auth\Services\AuthService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function __construct(
        private readonly AuthService $authService,
    ) {
    }

    public function csrfCookie(Request $request): JsonResponse
    {
        $payload = $this->authService->csrfCookie($request);

        return response()
            ->json(['data' => $payload])
            ->cookie(
                'XSRF-TOKEN',
                csrf_token(),
                config('session.lifetime'),
                config('session.path'),
                config('session.domain'),
                (bool) config('session.secure'),
                false,
                false,
                (string) config('session.same_site', 'lax'),
            );
    }

    public function login(Request $request): JsonResponse
    {
        $payload = $this->authService->login(
            $request,
            $request->validate([
                'email' => ['required', 'email'],
                'password' => ['required', 'string'],
            ]),
            $request->boolean('rememberMe'),
        );

        return response()->json(['data' => $payload]);
    }

    public function register(Request $request): JsonResponse
    {
        $payload = $this->authService->register(
            $request,
            $request->validate([
                'fullName' => ['required', 'string', 'min:3', 'max:120'],
                'email' => ['required', 'email', 'max:255', 'unique:users,email'],
                'phone' => ['nullable', 'string', 'max:20', 'unique:users,phone'],
                'password' => ['required', 'string', 'min:8'],
            ]),
        );

        return response()->json(['data' => $payload], Response::HTTP_CREATED);
    }

    public function logout(Request $request): JsonResponse
    {
        return response()->json($this->authService->logout($request));
    }

    public function me(Request $request): JsonResponse
    {
        $payload = $this->authService->currentUser($request->user());

        if ($payload === null) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], Response::HTTP_UNAUTHORIZED);
        }

        return response()->json(['data' => $payload]);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        return response()->json(
            $this->authService->forgotPassword(
                $request->validate([
                    'email' => ['required', 'email'],
                ]),
            ),
        );
    }

    public function resetPassword(Request $request): JsonResponse
    {
        return response()->json(
            $this->authService->resetPassword(
                $request->validate([
                    'email' => ['required', 'email'],
                    'token' => ['required', 'string'],
                    'password' => ['required', 'string', 'min:8'],
                ]),
            ),
        );
    }

    public function sessions(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $this->authService->listSessions($request),
        ]);
    }

    public function revokeSession(Request $request, string $sessionId): JsonResponse
    {
        return response()->json(
            $this->authService->revokeSession($request, $sessionId),
        );
    }

    public function logoutAll(Request $request): JsonResponse
    {
        return response()->json(
            $this->authService->logoutAll($request),
        );
    }

    public function requestEmailVerification(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        return response()->json([
            'data' => $this->authService->requestEmailVerification($user),
        ]);
    }

    public function verifyEmail(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $this->authService->verifyEmail(
                $request->validate([
                    'token' => ['required', 'string'],
                ])['token'],
            ),
        ]);
    }
}
