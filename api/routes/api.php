<?php

use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Properties\PropertyController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')
    ->name('api.v1.')
    ->group(function (): void {
        Route::get('/health', function () {
            return response()->json([
                'name' => config('app.name'),
                'status' => 'ok',
                'timestamp' => now()->toIso8601String(),
            ]);
        })->name('health');

        Route::prefix('auth')->middleware('web')->name('auth.')->group(function (): void {
            Route::get('/csrf-cookie', [AuthController::class, 'csrfCookie'])->name('csrf-cookie');
            Route::post('/login', [AuthController::class, 'login'])->name('login');
            Route::post('/register', [AuthController::class, 'register'])->name('register');
            Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->name('forgot-password');
            Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('reset-password');
            Route::post('/verify-email/confirm', [AuthController::class, 'verifyEmail'])->name('verify-email.confirm');
        });

        Route::prefix('auth')
            ->middleware(['web', 'auth:web'])
            ->name('auth.')
            ->group(function (): void {
            Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
            Route::post('/logout-all', [AuthController::class, 'logoutAll'])->name('logout-all');
            Route::get('/me', [AuthController::class, 'me'])->name('me');
            Route::get('/sessions', [AuthController::class, 'sessions'])->name('sessions');
            Route::delete('/sessions/{sessionId}', [AuthController::class, 'revokeSession'])->name('sessions.revoke');
            Route::post('/verify-email/request', [AuthController::class, 'requestEmailVerification'])->name('verify-email.request');
        });

        Route::prefix('public')->group(function (): void {
            Route::get('/properties', [PropertyController::class, 'index'])->name('public.properties.index');
            Route::get('/properties/{slug}', [PropertyController::class, 'show'])->name('public.properties.show');
            Route::get('/locations', fn () => response()->json([
                'message' => 'Location endpoint scaffolded for Phase 2.',
            ]));
        });

        Route::middleware(['web', 'auth:web'])->group(function (): void {
            Route::post('/properties', [PropertyController::class, 'store'])->name('properties.store');
        });

        Route::prefix('admin')
            ->middleware(['web', 'auth:web'])
            ->name('admin.')
            ->group(function (): void {
                Route::get('/backend/health', fn () => response()->json([
                    'message' => 'Backend health endpoint scaffolded for Phase 2.',
                ]));
                Route::get('/properties/moderation', [PropertyController::class, 'moderationQueue'])->name('properties.moderation.index');
                Route::post('/properties/{id}/approve', [PropertyController::class, 'approve'])->name('properties.approve');
                Route::post('/properties/{id}/reject', [PropertyController::class, 'reject'])->name('properties.reject');
            });
    });
