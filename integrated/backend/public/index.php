<?php

declare(strict_types=1);

// Autoload class App\ -> src/
spl_autoload_register(static function (string $class): void {
    $prefix = 'App\\';
    if (!str_starts_with($class, $prefix)) {
        return;
    }
    $relative = substr($class, strlen($prefix));
    $file = __DIR__ . '/../src/' . str_replace('\\', '/', $relative) . '.php';
    if (is_file($file)) {
        require_once $file;
    }
});

use App\Entities\Service;
use App\Repositories\JsonDatabase;
use App\Repositories\ServiceRepository;

// Helper response JSON
function sendResponse(int $status, array $body): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    exit;
}

function sendSuccess(mixed $data = null, string $message = 'Request successful', int $status = 200): never
{
    sendResponse($status, [
        'success' => true,
        'message' => $message,
        'data' => $data,
        'errors' => []
    ]);
}

function sendError(string $message, int $status = 400, array $errors = []): never
{
    sendResponse($status, [
        'success' => false,
        'message' => $message,
        'data' => null,
        'errors' => $errors
    ]);
}

// ----------------------------------------------------
// 1. Dukungan CORS (Cross-Origin Resource Sharing)
// ----------------------------------------------------
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
];

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: {$origin}");
    header('Access-Control-Allow-Credentials: true');
} else {
    header('Access-Control-Allow-Origin: *');
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept, X-Requested-With');

// Tangani Preflight OPTIONS Request
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ----------------------------------------------------
// 2. Inisialisasi Database & Repository OOP
// ----------------------------------------------------
$database = new JsonDatabase(__DIR__ . '/../storage/db.json');
$repository = new ServiceRepository($database);

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$path = rtrim($path, '/') ?: '/';
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

// Parsing JSON body untuk method POST dan PUT
$rawBody = file_get_contents('php://input');
$body = [];
if (!empty($rawBody)) {
    $decoded = json_decode($rawBody, true);
    if (is_array($decoded)) {
        $body = $decoded;
    } elseif ($method === 'POST' || $method === 'PUT') {
        sendError('Invalid JSON payload in request body', 400);
    }
}

// Helper validasi input data service
function validateServiceInput(array $input, bool $isCreating = true): void
{
    $allowed = ['name', 'description', 'price', 'duration_minutes', 'category', 'is_active'];
    $unknown = array_diff(array_keys($input), $allowed);
    if ($unknown !== []) {
        throw new \InvalidArgumentException('Unknown fields: ' . implode(', ', $unknown));
    }

    if ($isCreating) {
        foreach (['name', 'price', 'duration_minutes', 'category'] as $field) {
            if (!array_key_exists($field, $input)) {
                throw new \InvalidArgumentException("Field '{$field}' is required.");
            }
        }
    }

    if (isset($input['name']) && (!is_string($input['name']) || trim($input['name']) === '')) {
        throw new \InvalidArgumentException('Name must be a non-empty string.');
    }
    if (isset($input['description']) && !is_string($input['description'])) {
        throw new \InvalidArgumentException('Description must be a string.');
    }
    if (array_key_exists('price', $input) && (!is_int($input['price']) || $input['price'] < 0)) {
        throw new \InvalidArgumentException('Price must be a non-negative integer.');
    }
    if (array_key_exists('duration_minutes', $input) && (!is_int($input['duration_minutes']) || $input['duration_minutes'] < 1)) {
        throw new \InvalidArgumentException('Duration must be a positive integer.');
    }
    if (isset($input['category']) && (!is_string($input['category']) || trim($input['category']) === '')) {
        throw new \InvalidArgumentException('Category must be a non-empty string.');
    }
    if (array_key_exists('is_active', $input) && !is_bool($input['is_active'])) {
        throw new \InvalidArgumentException('is_active must be a boolean.');
    }
}

// ----------------------------------------------------
// 3. RESTful Path Routing & FULL CRUD
// ----------------------------------------------------
try {
    // GET /api/v1/health
    if ($method === 'GET' && $path === '/api/v1/health') {
        sendSuccess(['status' => 'ok'], 'API health check passed');
    }

    // GET /api/v1/services
    if ($method === 'GET' && $path === '/api/v1/services') {
        $activeOnly = ($rawActive = $_GET['active'] ?? '') === 'true' || $rawActive === '1';
        $services = $repository->findAll($activeOnly);
        $data = array_map(static fn(Service $s): array => $s->toArray(), $services);
        sendSuccess($data, 'Services retrieved successfully');
    }

    // GET /api/v1/services/{id}
    if ($method === 'GET' && preg_match('#^/api/v1/services/(\d+)$#', $path, $matches)) {
        $id = (int) $matches[1];
        $service = $repository->findById($id);
        if ($service === null) {
            sendError('Service not found', 404);
        }
        sendSuccess($service->toArray(), 'Service retrieved successfully');
    }

    // POST /api/v1/services
    if ($method === 'POST' && $path === '/api/v1/services') {
        validateServiceInput($body, true);
        $created = $repository->create($body);
        sendSuccess($created->toArray(), 'Service created successfully', 201);
    }

    // PUT /api/v1/services/{id}
    if ($method === 'PUT' && preg_match('#^/api/v1/services/(\d+)$#', $path, $matches)) {
        $id = (int) $matches[1];
        $existing = $repository->findById($id);
        if ($existing === null) {
            sendError('Service not found', 404);
        }
        validateServiceInput($body, false);
        $updated = $repository->update($id, $body);
        if ($updated === null) {
            sendError('Service not found', 404);
        }
        sendSuccess($updated->toArray(), 'Service updated successfully');
    }

    // DELETE /api/v1/services/{id}
    if ($method === 'DELETE' && preg_match('#^/api/v1/services/(\d+)$#', $path, $matches)) {
        $id = (int) $matches[1];
        if (!$repository->delete($id)) {
            sendError('Service not found', 404);
        }
        sendSuccess(null, 'Service deleted successfully');
    }

    // Route tidak ditemukan
    sendError('Route not found', 404);

} catch (\InvalidArgumentException $e) {
    sendError($e->getMessage(), 400);
} catch (\RuntimeException $e) {
    sendError($e->getMessage(), 500);
} catch (\Throwable $e) {
    sendError('Internal server error: ' . $e->getMessage(), 500);
}
