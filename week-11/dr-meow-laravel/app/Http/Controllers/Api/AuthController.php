<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use PHPOpenSourceSaver\JWTAuth\JWTGuard;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        /** @var JWTGuard $guard */
        $guard = auth('api');

        if (! $token = $guard->attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password Invalid',
                'data' => null,
                'errors' => [],
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Login Berhasil',
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => $guard->factory()->getTTL() * 60,
        ], 200);
    }

    public function me(): JsonResponse
    {
        /** @var JWTGuard $guard */
        $guard = auth('api');

        return $this->success($guard->user(), 'Authenticated user retrieved successfully');
    }

    public function logout(): JsonResponse
    {
        /** @var JWTGuard $guard */
        $guard = auth('api');
        $guard->logout();

        return $this->success(null, 'Successfully logged out');
    }
}
