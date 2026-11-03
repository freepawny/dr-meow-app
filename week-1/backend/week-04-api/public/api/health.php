<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Grooming Dr. Meow API is running',
    'data' => ['status' => 'ok']
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
