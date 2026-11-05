<?php
declare(strict_types=1);

// ====================================================
// 1. AUTOLOAD CLASS App\ -> src/
// ====================================================
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
use App\Entities\Customer;
use App\Entities\Cat;
use App\Entities\Reservation;

use App\Repositories\JsonDatabase;
use App\Repositories\ServiceRepository;
use App\Repositories\CustomerRepository;
use App\Repositories\CatRepository;
use App\Repositories\ReservationRepository;


// ====================================================
// 2. HELPER RESPONSE JSON
// ====================================================
function sendResponse(int $status, array $body): never
{
    http_response_code($status);

    header('Content-Type: application/json; charset=utf-8');

    echo json_encode(
        $body,
        JSON_UNESCAPED_UNICODE
        | JSON_UNESCAPED_SLASHES
        | JSON_PRETTY_PRINT
    );

    exit;
}

function sendSuccess(
    mixed $data = null,
    string $message = 'Request successful',
    int $status = 200
): never {
    sendResponse($status, [
        'success' => true,
        'message' => $message,
        'data' => $data,
        'errors' => []
    ]);
}

function sendError(
    string $message,
    int $status = 400,
    array $errors = []
): never {
    sendResponse($status, [
        'success' => false,
        'message' => $message,
        'data' => null,
        'errors' => $errors
    ]);
}


// ====================================================
// 3. CORS
// ====================================================
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

header('Vary: Origin');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept, X-Requested-With');

// Handle preflight OPTIONS request
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}


// ====================================================
// 4. DATABASE & REPOSITORY INITIALIZATION
// ====================================================
$database = new JsonDatabase(__DIR__ . '/../storage/db.json');

$serviceRepository = new ServiceRepository($database);
$customerRepository = new CustomerRepository($database);
$catRepository = new CatRepository($database);
$reservationRepository = new ReservationRepository($database);


// ====================================================
// 5. REQUEST INFORMATION
// ====================================================
$path = parse_url(
    $_SERVER['REQUEST_URI'] ?? '/',
    PHP_URL_PATH
);

$path = rtrim((string) $path, '/') ?: '/';

$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');


// ====================================================
// 6. PARSE JSON REQUEST BODY
// ====================================================
$rawBody = file_get_contents('php://input');

$body = [];

if ($rawBody !== false && trim($rawBody) !== '') {
    $decoded = json_decode($rawBody, true);

    if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
        if ($method === 'POST' || $method === 'PUT') {
            sendError('Invalid JSON payload in request body', 400);
        }
    } else {
        $body = $decoded;
    }
}


// ====================================================
// 7. HELPER VALIDATION
// ====================================================

/**
 * Validasi field Service.
 */
function validateServiceInput(array $input, bool $isCreating = true): void
{
    $allowed = [
        'id',
        'name',
        'badge_label',
        'badgeLabel',
        'description',
        'is_popular',
        'isPopular',
        'base_price',
        'basePrice',
        'tier_prices',
        'tierPrices',
        'features',
        'is_active',
        'isActive'
    ];

    $unknown = array_diff(array_keys($input), $allowed);

    if ($unknown !== []) {
        throw new InvalidArgumentException(
            'Unknown fields: ' . implode(', ', $unknown)
        );
    }

    if ($isCreating) {
        $hasBadge = array_key_exists('badge_label', $input)
            || array_key_exists('badgeLabel', $input);

        $hasBasePrice = array_key_exists('base_price', $input)
            || array_key_exists('basePrice', $input);

        if (
            !array_key_exists('name', $input)
            || !array_key_exists('description', $input)
            || !$hasBadge
            || !$hasBasePrice
        ) {
            throw new InvalidArgumentException(
                "Fields 'name', 'badge_label', 'description', and 'base_price' are required."
            );
        }
    }

    if (
        isset($input['name'])
        && (!is_string($input['name']) || trim($input['name']) === '')
    ) {
        throw new InvalidArgumentException(
            'Name must be a non-empty string.'
        );
    }

    $badge = $input['badge_label'] ?? ($input['badgeLabel'] ?? null);

    if (
        $badge !== null
        && (!is_string($badge) || trim($badge) === '')
    ) {
        throw new InvalidArgumentException(
            'badge_label must be a non-empty string.'
        );
    }

    if (
        isset($input['description'])
        && (!is_string($input['description']) || trim($input['description']) === '')
    ) {
        throw new InvalidArgumentException(
            'Description must be a non-empty string.'
        );
    }

    $price = $input['base_price'] ?? ($input['basePrice'] ?? null);

    if ($price !== null && (!is_int($price) || $price < 0)) {
        throw new InvalidArgumentException(
            'base_price must be a non-negative integer.'
        );
    }

    if (isset($input['features']) && !is_array($input['features'])) {
        throw new InvalidArgumentException(
            'Features must be an array.'
        );
    }
}


/**
 * Validasi dasar Customer.
 *
 * Field mengikuti struktur customer pada db.json:
 * customer_id, name, phone_number, schedule,
 * address, preference_notification.
 */
function validateCustomerInput(array $input, bool $isCreating = true): void
{
    $allowed = [
        'customer_id',
        'name',
        'phone_number',
        'schedule',
        'address',
        'preference_notification'
    ];

    $unknown = array_diff(array_keys($input), $allowed);

    if ($unknown !== []) {
        throw new InvalidArgumentException(
            'Unknown fields: ' . implode(', ', $unknown)
        );
    }

    $required = [
        'name',
        'phone_number',
        'schedule',
        'address'
    ];

    if ($isCreating) {
        foreach ($required as $field) {
            if (!array_key_exists($field, $input)) {
                throw new InvalidArgumentException(
                    "Field '{$field}' is required."
                );
            }
        }
    }

    foreach (['name', 'phone_number', 'schedule', 'address'] as $field) {
        if (
            array_key_exists($field, $input)
            && (!is_string($input[$field]) || trim($input[$field]) === '')
        ) {
            throw new InvalidArgumentException(
                "{$field} must be a non-empty string."
            );
        }
    }

    if (
        array_key_exists('preference_notification', $input)
        && !is_bool($input['preference_notification'])
    ) {
        throw new InvalidArgumentException(
            'preference_notification must be a boolean.'
        );
    }
}


/**
 * Validasi dasar Cat.
 *
 * Field mengikuti struktur cat pada db.json.
 */
function validateCatInput(array $input, bool $isCreating = true): void
{
    $allowed = [
        'cat_id',
        'customer_id',
        'name',
        'weight',
        'breeds',
        'vital_temperature',
        'tempramen',
        'medical_history',
        'last_picture'
    ];

    $unknown = array_diff(array_keys($input), $allowed);

    if ($unknown !== []) {
        throw new InvalidArgumentException(
            'Unknown fields: ' . implode(', ', $unknown)
        );
    }

    $required = [
        'customer_id',
        'name',
        'weight',
        'breeds'
    ];

    if ($isCreating) {
        foreach ($required as $field) {
            if (!array_key_exists($field, $input)) {
                throw new InvalidArgumentException(
                    "Field '{$field}' is required."
                );
            }
        }
    }

    foreach (['customer_id', 'name', 'breeds'] as $field) {
        if (
            array_key_exists($field, $input)
            && (!is_string($input[$field]) || trim($input[$field]) === '')
        ) {
            throw new InvalidArgumentException(
                "{$field} must be a non-empty string."
            );
        }
    }

    if (
        array_key_exists('weight', $input)
        && (!is_numeric($input['weight']) || (float) $input['weight'] <= 0)
    ) {
        throw new InvalidArgumentException(
            'weight must be a positive number.'
        );
    }

    if (
        array_key_exists('vital_temperature', $input)
        && $input['vital_temperature'] !== null
        && !is_numeric($input['vital_temperature'])
    ) {
        throw new InvalidArgumentException(
            'vital_temperature must be a number or null.'
        );
    }

    foreach (['tempramen', 'medical_history', 'last_picture'] as $field) {
        if (
            array_key_exists($field, $input)
            && $input[$field] !== null
            && !is_string($input[$field])
        ) {
            throw new InvalidArgumentException(
                "{$field} must be a string or null."
            );
        }
    }
}


/**
 * Validasi dasar Reservation.
 *
 * Field mengikuti struktur reservation pada db.json.
 */
function validateReservationInput(
    array $input,
    bool $isCreating = true
): void {
    $allowed = [
        'reservation_id',
        'service_id',
        'customer_id',
        'cat_id',
        'service_method',
        'work_status',
        'notification_h1',
        'total_bill',
        'paymen_status',
        'before_after'
    ];

    $unknown = array_diff(array_keys($input), $allowed);

    if ($unknown !== []) {
        throw new InvalidArgumentException(
            'Unknown fields: ' . implode(', ', $unknown)
        );
    }

    $required = [
        'service_id',
        'customer_id',
        'cat_id',
        'service_method'
    ];

    if ($isCreating) {
        foreach ($required as $field) {
            if (!array_key_exists($field, $input)) {
                throw new InvalidArgumentException(
                    "Field '{$field}' is required."
                );
            }
        }
    }

    foreach (
        [
            'service_id',
            'customer_id',
            'cat_id',
            'service_method'
        ] as $field
    ) {
        if (
            array_key_exists($field, $input)
            && (!is_string($input[$field]) || trim($input[$field]) === '')
        ) {
            throw new InvalidArgumentException(
                "{$field} must be a non-empty string."
            );
        }
    }

    if (
        array_key_exists('notification_h1', $input)
        && !is_bool($input['notification_h1'])
    ) {
        throw new InvalidArgumentException(
            'notification_h1 must be a boolean.'
        );
    }

    if (
        array_key_exists('total_bill', $input)
        && (!is_int($input['total_bill']) || $input['total_bill'] < 0)
    ) {
        throw new InvalidArgumentException(
            'total_bill must be a non-negative integer.'
        );
    }

    if (
        array_key_exists('before_after', $input)
        && !is_array($input['before_after'])
    ) {
        throw new InvalidArgumentException(
            'before_after must be an object or array.'
        );
    }
}


// ====================================================
// 8. REST API ROUTING
// ====================================================
try {

    // ------------------------------------------------
    // HEALTH CHECK
    // GET /api/v1/health
    // ------------------------------------------------
    if ($method === 'GET' && $path === '/api/v1/health') {
        sendSuccess(
            ['status' => 'ok'],
            'API health check passed'
        );
    }


    // =================================================
    // SERVICE ROUTES
    // =================================================

    // GET /api/v1/services
    if ($method === 'GET' && $path === '/api/v1/services') {
        $activeOnly = (
            ($rawActive = $_GET['active'] ?? '') === 'true'
            || $rawActive === '1'
        );

        $services = $serviceRepository->findAll($activeOnly);

        $data = array_map(
            static fn(Service $service): array => $service->toArray(),
            $services
        );

        sendSuccess($data, 'Services retrieved successfully');
    }

    // GET /api/v1/services/{id}
    if (
        $method === 'GET'
        && preg_match(
            '#^/api/v1/services/([a-zA-Z0-9_-]+)$#',
            $path,
            $matches
        )
    ) {
        $id = (string) $matches[1];

        $service = $serviceRepository->findById($id);

        if ($service === null) {
            sendError('Service not found', 404);
        }

        sendSuccess(
            $service->toArray(),
            'Service retrieved successfully'
        );
    }

    // POST /api/v1/services
    if ($method === 'POST' && $path === '/api/v1/services') {
        validateServiceInput($body, true);

        $created = $serviceRepository->create($body);

        sendSuccess(
            $created->toArray(),
            'Service created successfully',
            201
        );
    }

    // PUT /api/v1/services/{id}
    if (
        $method === 'PUT'
        && preg_match(
            '#^/api/v1/services/([a-zA-Z0-9_-]+)$#',
            $path,
            $matches
        )
    ) {
        $id = (string) $matches[1];

        $existing = $serviceRepository->findById($id);

        if ($existing === null) {
            sendError('Service not found', 404);
        }

        validateServiceInput($body, false);

        $updated = $serviceRepository->update($id, $body);

        if ($updated === null) {
            sendError('Service not found', 404);
        }

        sendSuccess(
            $updated->toArray(),
            'Service updated successfully'
        );
    }

    // DELETE /api/v1/services/{id}
    if (
        $method === 'DELETE'
        && preg_match(
            '#^/api/v1/services/([a-zA-Z0-9_-]+)$#',
            $path,
            $matches
        )
    ) {
        $id = (string) $matches[1];

        if (!$serviceRepository->delete($id)) {
            sendError('Service not found', 404);
        }

        sendSuccess(null, 'Service deleted successfully');
    }


    // =================================================
    // CUSTOMER ROUTES
    // =================================================

    // GET /api/v1/customers
    if ($method === 'GET' && $path === '/api/v1/customers') {
        $customers = $customerRepository->findAll();

        $data = array_map(
            static fn(Customer $customer): array => $customer->toArray(),
            $customers
        );

        sendSuccess($data, 'Customers retrieved successfully');
    }

    // GET /api/v1/customers/{id}
    if (
        $method === 'GET'
        && preg_match(
            '#^/api/v1/customers/([a-zA-Z0-9_-]+)$#',
            $path,
            $matches
        )
    ) {
        $id = (string) $matches[1];

        $customer = $customerRepository->findById($id);

        if ($customer === null) {
            sendError('Customer not found', 404);
        }

        sendSuccess(
            $customer->toArray(),
            'Customer retrieved successfully'
        );
    }

    // POST /api/v1/customers
    if ($method === 'POST' && $path === '/api/v1/customers') {
        validateCustomerInput($body, true);

        $created = $customerRepository->create($body);

        sendSuccess(
            $created->toArray(),
            'Customer created successfully',
            201
        );
    }

    // PUT /api/v1/customers/{id}
    if (
        $method === 'PUT'
        && preg_match(
            '#^/api/v1/customers/([a-zA-Z0-9_-]+)$#',
            $path,
            $matches
        )
    ) {
        $id = (string) $matches[1];

        $existing = $customerRepository->findById($id);

        if ($existing === null) {
            sendError('Customer not found', 404);
        }

        validateCustomerInput($body, false);

        $updated = $customerRepository->update($id, $body);

        if ($updated === null) {
            sendError('Customer not found', 404);
        }

        sendSuccess(
            $updated->toArray(),
            'Customer updated successfully'
        );
    }

    // DELETE /api/v1/customers/{id}
    if (
        $method === 'DELETE'
        && preg_match(
            '#^/api/v1/customers/([a-zA-Z0-9_-]+)$#',
            $path,
            $matches
        )
    ) {
        $id = (string) $matches[1];

        if (!$customerRepository->delete($id)) {
            sendError('Customer not found', 404);
        }

        sendSuccess(null, 'Customer deleted successfully');
    }


    // =================================================
    // CAT ROUTES
    // =================================================

    // GET /api/v1/cats
    if ($method === 'GET' && $path === '/api/v1/cats') {
        $cats = $catRepository->findAll();

        $data = array_map(
            static fn(Cat $cat): array => $cat->toArray(),
            $cats
        );

        sendSuccess($data, 'Cats retrieved successfully');
    }

    // GET /api/v1/cats/{id}
    if (
        $method === 'GET'
        && preg_match(
            '#^/api/v1/cats/([a-zA-Z0-9_-]+)$#',
            $path,
            $matches
        )
    ) {
        $id = (string) $matches[1];

        $cat = $catRepository->findById($id);

        if ($cat === null) {
            sendError('Cat not found', 404);
        }

        sendSuccess(
            $cat->toArray(),
            'Cat retrieved successfully'
        );
    }

    // GET /api/v1/customers/{customerId}/cats
    if (
        $method === 'GET'
        && preg_match(
            '#^/api/v1/customers/([a-zA-Z0-9_-]+)/cats$#',
            $path,
            $matches
        )
    ) {
        $customerId = (string) $matches[1];

        $customer = $customerRepository->findById($customerId);

        if ($customer === null) {
            sendError('Customer not found', 404);
        }

        $cats = $catRepository->findByCustomerId($customerId);

        $data = array_map(
            static fn(Cat $cat): array => $cat->toArray(),
            $cats
        );

        sendSuccess(
            $data,
            'Customer cats retrieved successfully'
        );
    }

    // POST /api/v1/cats
    if ($method === 'POST' && $path === '/api/v1/cats') {
        validateCatInput($body, true);

        // Pastikan Customer yang dipilih memang ada.
        $customerId = (string) $body['customer_id'];

        $customer = $customerRepository->findById($customerId);

        if ($customer === null) {
            sendError('Customer not found', 404);
        }

        $created = $catRepository->create($body);

        sendSuccess(
            $created->toArray(),
            'Cat created successfully',
            201
        );
    }

    // PUT /api/v1/cats/{id}
    if (
        $method === 'PUT'
        && preg_match(
            '#^/api/v1/cats/([a-zA-Z0-9_-]+)$#',
            $path,
            $matches
        )
    ) {
        $id = (string) $matches[1];

        $existing = $catRepository->findById($id);

        if ($existing === null) {
            sendError('Cat not found', 404);
        }

        validateCatInput($body, false);

        // Jika customer_id diubah, validasi Customer baru.
        if (isset($body['customer_id'])) {
            $customer = $customerRepository->findById(
                (string) $body['customer_id']
            );

            if ($customer === null) {
                sendError('Customer not found', 404);
            }
        }

        $updated = $catRepository->update($id, $body);

        if ($updated === null) {
            sendError('Cat not found', 404);
        }

        sendSuccess(
            $updated->toArray(),
            'Cat updated successfully'
        );
    }

    // DELETE /api/v1/cats/{id}
    if (
        $method === 'DELETE'
        && preg_match(
            '#^/api/v1/cats/([a-zA-Z0-9_-]+)$#',
            $path,
            $matches
        )
    ) {
        $id = (string) $matches[1];

        if (!$catRepository->delete($id)) {
            sendError('Cat not found', 404);
        }

        sendSuccess(null, 'Cat deleted successfully');
    }


    // =================================================
    // RESERVATION ROUTES
    // =================================================

    // GET /api/v1/reservations
    if ($method === 'GET' && $path === '/api/v1/reservations') {
        $reservations = $reservationRepository->findAll();

        $data = array_map(
            static fn(Reservation $reservation): array => $reservation->toArray(),
            $reservations
        );

        sendSuccess(
            $data,
            'Reservations retrieved successfully'
        );
    }

    // GET /api/v1/reservations/{id}
    if (
        $method === 'GET'
        && preg_match(
            '#^/api/v1/reservations/([a-zA-Z0-9_-]+)$#',
            $path,
            $matches
        )
    ) {
        $id = (string) $matches[1];

        $reservation = $reservationRepository->findById($id);

        if ($reservation === null) {
            sendError('Reservation not found', 404);
        }

        sendSuccess(
            $reservation->toArray(),
            'Reservation retrieved successfully'
        );
    }

    // GET /api/v1/customers/{customerId}/reservations
    if (
        $method === 'GET'
        && preg_match(
            '#^/api/v1/customers/([a-zA-Z0-9_-]+)/reservations$#',
            $path,
            $matches
        )
    ) {
        $customerId = (string) $matches[1];

        $customer = $customerRepository->findById($customerId);

        if ($customer === null) {
            sendError('Customer not found', 404);
        }

        $reservations = $reservationRepository->findByCustomerId(
            $customerId
        );

        $data = array_map(
            static fn(Reservation $reservation): array => $reservation->toArray(),
            $reservations
        );

        sendSuccess(
            $data,
            'Customer reservations retrieved successfully'
        );
    }

    // POST /api/v1/reservations
    if ($method === 'POST' && $path === '/api/v1/reservations') {
        validateReservationInput($body, true);

        $customerId = (string) $body['customer_id'];
        $catId = (string) $body['cat_id'];
        $serviceId = (string) $body['service_id'];

        // Validasi Customer
        $customer = $customerRepository->findById($customerId);

        if ($customer === null) {
            sendError('Customer not found', 404);
        }

        // Validasi Cat
        $cat = $catRepository->findById($catId);

        if ($cat === null) {
            sendError('Cat not found', 404);
        }

        // Validasi bahwa Cat milik Customer yang dipilih.
        if ($cat->getCustomerId() !== $customerId) {
            sendError(
                'The selected cat does not belong to this customer',
                422
            );
        }

        // Validasi Service
        $service = $serviceRepository->findById($serviceId);

        if ($service === null) {
            sendError('Service not found', 404);
        }

        // Cegah reservasi menggunakan Service nonaktif.
        if (!$service->isActive()) {
            sendError('Service is currently inactive', 422);
        }

        /*
         * Catatan:
         * total_bill belum dihitung otomatis di sini.
         * Perhitungan harga harus mengikuti aturan tier_prices
         * pada Service dan aturan berat Cat yang kamu tetapkan.
         */

        $created = $reservationRepository->create($body);

        sendSuccess(
            $created->toArray(),
            'Reservation created successfully',
            201
        );
    }

    // PUT /api/v1/reservations/{id}
    if (
        $method === 'PUT'
        && preg_match(
            '#^/api/v1/reservations/([a-zA-Z0-9_-]+)$#',
            $path,
            $matches
        )
    ) {
        $id = (string) $matches[1];

        $existing = $reservationRepository->findById($id);

        if ($existing === null) {
            sendError('Reservation not found', 404);
        }

        validateReservationInput($body, false);

        // Validasi relasi jika customer_id dikirim.
        if (isset($body['customer_id'])) {
            $customer = $customerRepository->findById(
                (string) $body['customer_id']
            );

            if ($customer === null) {
                sendError('Customer not found', 404);
            }
        }

        // Validasi relasi jika cat_id dikirim.
        if (isset($body['cat_id'])) {
            $cat = $catRepository->findById(
                (string) $body['cat_id']
            );

            if ($cat === null) {
                sendError('Cat not found', 404);
            }
        }

        // Validasi relasi jika service_id dikirim.
        if (isset($body['service_id'])) {
            $service = $serviceRepository->findById(
                (string) $body['service_id']
            );

            if ($service === null) {
                sendError('Service not found', 404);
            }
        }

        $updated = $reservationRepository->update($id, $body);

        if ($updated === null) {
            sendError('Reservation not found', 404);
        }

        sendSuccess(
            $updated->toArray(),
            'Reservation updated successfully'
        );
    }

    // DELETE /api/v1/reservations/{id}
    if (
        $method === 'DELETE'
        && preg_match(
            '#^/api/v1/reservations/([a-zA-Z0-9_-]+)$#',
            $path,
            $matches
        )
    ) {
        $id = (string) $matches[1];

        if (!$reservationRepository->delete($id)) {
            sendError('Reservation not found', 404);
        }

        sendSuccess(
            null,
            'Reservation deleted successfully'
        );
    }


    // =================================================
    // 404 - ROUTE NOT FOUND
    // =================================================
    sendError('Route not found', 404);

} catch (InvalidArgumentException $e) {
    sendError($e->getMessage(), 400);

} catch (RuntimeException $e) {
    sendError($e->getMessage(), 500);

} catch (Throwable $e) {
    // Untuk development. Jangan tampilkan detail exception
    // kepada client pada production.
    sendError(
        'Internal server error: ' . $e->getMessage(),
        500
    );
}
