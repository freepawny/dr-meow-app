<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

abstract class ApiResponse
{
    static public function success(mixed $data = null, string $message = 'Request successful', int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'errors' => [],
        ], $status);
    }

    static public function error(string $message, int $status = 400, array $errors = []): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'data' => null,
            'errors' => $errors,
        ], $status);
    }
}
