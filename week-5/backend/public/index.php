<?php
declare(strict_types=1);

// ====================================================
// WEEK 5 — PROCEDURAL SERVER-SIDE PHP FRONT CONTROLLER
// (Tanpa Class/Object OOP maupun MVC)
// ====================================================

require_once __DIR__ . '/../includes/storage.php';
require_once __DIR__ . '/../includes/response.php';
require_once __DIR__ . '/../includes/services_procedural.php';
require_once __DIR__ . '/../includes/customers_procedural.php';
require_once __DIR__ . '/../includes/cats_procedural.php';
require_once __DIR__ . '/../includes/reservations_procedural.php';

applyCorsHeaders();

$dbPath = __DIR__ . '/../storage/db.json';
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$path = rtrim((string) $path, '/') ?: '/';
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
$body = readJsonRequestBody($method);

try {
    // ------------------------------------------------
    // HEALTH CHECK
    // ------------------------------------------------
    if ($method === 'GET' && $path === '/api/v1/health') {
        sendJsonSuccess(['status' => 'ok'], 'API health check passed');
    }

    // ================================================
    // SERVICE ROUTES
    // ================================================
    if ($method === 'GET' && $path === '/api/v1/services') {
        $rawActive = $_GET['active'] ?? '';
        $activeOnly = ($rawActive === 'true' || $rawActive === '1');
        $services = findAllServices($dbPath, $activeOnly);
        sendJsonSuccess($services, 'Services retrieved successfully');
    }

    if ($method === 'GET' && preg_match('#^/api/v1/services/([a-zA-Z0-9_-]+)$#', $path, $matches)) {
        $service = findServiceById($dbPath, (string) $matches[1]);
        if ($service === null) {
            sendJsonError('Service not found', 404);
        }
        sendJsonSuccess($service, 'Service retrieved successfully');
    }

    if ($method === 'POST' && $path === '/api/v1/services') {
        validateServicePayload($body, true);
        $created = createServiceRecord($dbPath, $body);
        sendJsonSuccess($created, 'Service created successfully', 201);
    }

    if ($method === 'PUT' && preg_match('#^/api/v1/services/([a-zA-Z0-9_-]+)$#', $path, $matches)) {
        $id = (string) $matches[1];
        if (findServiceById($dbPath, $id) === null) {
            sendJsonError('Service not found', 404);
        }
        validateServicePayload($body, false);
        $updated = updateServiceRecord($dbPath, $id, $body);
        sendJsonSuccess($updated, 'Service updated successfully');
    }

    if ($method === 'DELETE' && preg_match('#^/api/v1/services/([a-zA-Z0-9_-]+)$#', $path, $matches)) {
        if (!deleteServiceRecord($dbPath, (string) $matches[1])) {
            sendJsonError('Service not found', 404);
        }
        sendJsonSuccess(null, 'Service deleted successfully');
    }

    // ================================================
    // CUSTOMER ROUTES
    // ================================================
    if ($method === 'GET' && $path === '/api/v1/customers') {
        sendJsonSuccess(findAllCustomers($dbPath), 'Customers retrieved successfully');
    }

    if ($method === 'GET' && preg_match('#^/api/v1/customers/([a-zA-Z0-9_-]+)$#', $path, $matches)) {
        $customer = findCustomerById($dbPath, (string) $matches[1]);
        if ($customer === null) {
            sendJsonError('Customer not found', 404);
        }
        sendJsonSuccess($customer, 'Customer retrieved successfully');
    }

    if ($method === 'POST' && $path === '/api/v1/customers') {
        validateCustomerPayload($body, true);
        $created = createCustomerRecord($dbPath, $body);
        sendJsonSuccess($created, 'Customer created successfully', 201);
    }

    if ($method === 'PUT' && preg_match('#^/api/v1/customers/([a-zA-Z0-9_-]+)$#', $path, $matches)) {
        $id = (string) $matches[1];
        if (findCustomerById($dbPath, $id) === null) {
            sendJsonError('Customer not found', 404);
        }
        validateCustomerPayload($body, false);
        $updated = updateCustomerRecord($dbPath, $id, $body);
        sendJsonSuccess($updated, 'Customer updated successfully');
    }

    if ($method === 'DELETE' && preg_match('#^/api/v1/customers/([a-zA-Z0-9_-]+)$#', $path, $matches)) {
        if (!deleteCustomerRecord($dbPath, (string) $matches[1])) {
            sendJsonError('Customer not found', 404);
        }
        sendJsonSuccess(null, 'Customer deleted successfully');
    }

    // ================================================
    // CAT ROUTES
    // ================================================
    if ($method === 'GET' && $path === '/api/v1/cats') {
        sendJsonSuccess(findAllCats($dbPath), 'Cats retrieved successfully');
    }

    if ($method === 'GET' && preg_match('#^/api/v1/cats/([a-zA-Z0-9_-]+)$#', $path, $matches)) {
        $cat = findCatById($dbPath, (string) $matches[1]);
        if ($cat === null) {
            sendJsonError('Cat not found', 404);
        }
        sendJsonSuccess($cat, 'Cat retrieved successfully');
    }

    if ($method === 'GET' && preg_match('#^/api/v1/customers/([a-zA-Z0-9_-]+)/cats$#', $path, $matches)) {
        $customerId = (string) $matches[1];
        if (findCustomerById($dbPath, $customerId) === null) {
            sendJsonError('Customer not found', 404);
        }
        sendJsonSuccess(findCatsByCustomerId($dbPath, $customerId), 'Customer cats retrieved successfully');
    }

    if ($method === 'POST' && $path === '/api/v1/cats') {
        validateCatPayload($body, true);
        if (findCustomerById($dbPath, (string) $body['customer_id']) === null) {
            sendJsonError('Customer not found', 404);
        }
        $created = createCatRecord($dbPath, $body);
        sendJsonSuccess($created, 'Cat created successfully', 201);
    }

    if ($method === 'PUT' && preg_match('#^/api/v1/cats/([a-zA-Z0-9_-]+)$#', $path, $matches)) {
        $id = (string) $matches[1];
        if (findCatById($dbPath, $id) === null) {
            sendJsonError('Cat not found', 404);
        }
        validateCatPayload($body, false);
        if (isset($body['customer_id']) && findCustomerById($dbPath, (string) $body['customer_id']) === null) {
            sendJsonError('Customer not found', 404);
        }
        $updated = updateCatRecord($dbPath, $id, $body);
        sendJsonSuccess($updated, 'Cat updated successfully');
    }

    if ($method === 'DELETE' && preg_match('#^/api/v1/cats/([a-zA-Z0-9_-]+)$#', $path, $matches)) {
        if (!deleteCatRecord($dbPath, (string) $matches[1])) {
            sendJsonError('Cat not found', 404);
        }
        sendJsonSuccess(null, 'Cat deleted successfully');
    }

    // ================================================
    // RESERVATION ROUTES
    // ================================================
    if ($method === 'GET' && $path === '/api/v1/reservations') {
        sendJsonSuccess(findAllReservations($dbPath), 'Reservations retrieved successfully');
    }

    if ($method === 'GET' && preg_match('#^/api/v1/reservations/([a-zA-Z0-9_-]+)$#', $path, $matches)) {
        $reservation = findReservationById($dbPath, (string) $matches[1]);
        if ($reservation === null) {
            sendJsonError('Reservation not found', 404);
        }
        sendJsonSuccess($reservation, 'Reservation retrieved successfully');
    }

    if ($method === 'GET' && preg_match('#^/api/v1/customers/([a-zA-Z0-9_-]+)/reservations$#', $path, $matches)) {
        $customerId = (string) $matches[1];
        if (findCustomerById($dbPath, $customerId) === null) {
            sendJsonError('Customer not found', 404);
        }
        sendJsonSuccess(findReservationsByCustomerId($dbPath, $customerId), 'Customer reservations retrieved successfully');
    }

    if ($method === 'POST' && $path === '/api/v1/reservations') {
        validateReservationPayload($body, true);

        $customerId = (string) $body['customer_id'];
        $catId = (string) $body['cat_id'];
        $serviceId = (string) $body['service_id'];

        $customer = findCustomerById($dbPath, $customerId);
        if ($customer === null) {
            sendJsonError('Customer not found', 404);
        }

        $cat = findCatById($dbPath, $catId);
        if ($cat === null) {
            sendJsonError('Cat not found', 404);
        }

        if ($cat['customer_id'] !== $customerId) {
            sendJsonError('The selected cat does not belong to this customer', 422);
        }

        $service = findServiceById($dbPath, $serviceId);
        if ($service === null) {
            sendJsonError('Service not found', 404);
        }

        if ($service['is_active'] !== true) {
            sendJsonError('Service is currently inactive', 422);
        }

        $created = createReservationRecord($dbPath, $body);
        sendJsonSuccess($created, 'Reservation created successfully', 201);
    }

    if ($method === 'PUT' && preg_match('#^/api/v1/reservations/([a-zA-Z0-9_-]+)$#', $path, $matches)) {
        $id = (string) $matches[1];
        if (findReservationById($dbPath, $id) === null) {
            sendJsonError('Reservation not found', 404);
        }
        validateReservationPayload($body, false);

        if (isset($body['customer_id']) && findCustomerById($dbPath, (string) $body['customer_id']) === null) {
            sendJsonError('Customer not found', 404);
        }
        if (isset($body['cat_id']) && findCatById($dbPath, (string) $body['cat_id']) === null) {
            sendJsonError('Cat not found', 404);
        }
        if (isset($body['service_id']) && findServiceById($dbPath, (string) $body['service_id']) === null) {
            sendJsonError('Service not found', 404);
        }

        $updated = updateReservationRecord($dbPath, $id, $body);
        sendJsonSuccess($updated, 'Reservation updated successfully');
    }

    if ($method === 'DELETE' && preg_match('#^/api/v1/reservations/([a-zA-Z0-9_-]+)$#', $path, $matches)) {
        if (!deleteReservationRecord($dbPath, (string) $matches[1])) {
            sendJsonError('Reservation not found', 404);
        }
        sendJsonSuccess(null, 'Reservation deleted successfully');
    }

    sendJsonError('Route not found', 404);
} catch (InvalidArgumentException $e) {
    sendJsonError($e->getMessage(), 400);
} catch (RuntimeException $e) {
    sendJsonError($e->getMessage(), 500);
} catch (Throwable $e) {
    sendJsonError('Internal server error: ' . $e->getMessage(), 500);
}
