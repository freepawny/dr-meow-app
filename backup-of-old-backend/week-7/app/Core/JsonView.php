<?php

declare(strict_types=1);

namespace App\Core;

final class JsonView
{
    private static function render(array $payload, int $status): never
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        $json = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
        if ($json === false) {
            http_response_code(500);
            echo '{"success":false,"message":"Could not encode response","data":null,"errors":[]}';
            exit;
        }
        echo $json;
        exit;
    }

    public static function success(mixed $data = null, string $message = 'Request successful', int $status = 200): never
    {
        self::render(['success' => true, 'message' => $message, 'data' => $data, 'errors' => []], $status);
    }

    public static function error(string $message, int $status = 400, array $errors = []): never
    {
        self::render(['success' => false, 'message' => $message, 'data' => null, 'errors' => $errors], $status);
    }
}
