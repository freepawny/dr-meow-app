<?php
declare(strict_types=1);

use App\Controllers\CatController;
use App\Controllers\CustomerController;
use App\Controllers\HealthController;
use App\Controllers\ReservationController;
use App\Controllers\ServiceController;
use App\Core\Router;
use App\Repositories\CatRepository;
use App\Repositories\CustomerRepository;
use App\Repositories\JsonDatabase;
use App\Repositories\ReservationRepository;
use App\Repositories\ServiceRepository;
use App\Services\CatService;
use App\Services\CustomerService;
use App\Services\ReservationService;
use App\Services\ServiceService;

$database = new JsonDatabase(dirname(__DIR__, 2) . '/storage/db.json');

$serviceRepository = new ServiceRepository($database);
$customerRepository = new CustomerRepository($database);
$catRepository = new CatRepository($database);
$reservationRepository = new ReservationRepository($database);

$serviceService = new ServiceService($serviceRepository);
$customerService = new CustomerService($customerRepository);
$catService = new CatService($catRepository, $customerRepository);
$reservationService = new ReservationService(
    $reservationRepository,
    $customerRepository,
    $catRepository,
    $serviceRepository
);

$healthController = new HealthController();
$serviceController = new ServiceController($serviceService);
$customerController = new CustomerController(
    $customerService,
    $catService,
    $reservationService
);
$catController = new CatController($catService);
$reservationController = new ReservationController($reservationService);

$router = new Router();

// Health Check
$router->get('/api/v1/health', static fn() => $healthController->index());

// Service Endpoints
$router->get('/api/v1/services', static fn($req) => $serviceController->index($req));
$router->get('/api/v1/services/{id}', static fn($req, $params) => $serviceController->show($req, $params));
$router->post('/api/v1/services', static fn($req) => $serviceController->store($req));
$router->put('/api/v1/services/{id}', static fn($req, $params) => $serviceController->update($req, $params));
$router->delete('/api/v1/services/{id}', static fn($req, $params) => $serviceController->destroy($req, $params));

// Customer Endpoints & Nested Relations
$router->get('/api/v1/customers', static fn($req) => $customerController->index($req));
$router->get('/api/v1/customers/{id}', static fn($req, $params) => $customerController->show($req, $params));
$router->post('/api/v1/customers', static fn($req) => $customerController->store($req));
$router->put('/api/v1/customers/{id}', static fn($req, $params) => $customerController->update($req, $params));
$router->delete('/api/v1/customers/{id}', static fn($req, $params) => $customerController->destroy($req, $params));
$router->get('/api/v1/customers/{customerId}/cats', static fn($req, $params) => $customerController->cats($req, $params));
$router->get('/api/v1/customers/{customerId}/reservations', static fn($req, $params) => $customerController->reservations($req, $params));

// Cat Endpoints
$router->get('/api/v1/cats', static fn($req) => $catController->index($req));
$router->get('/api/v1/cats/{id}', static fn($req, $params) => $catController->show($req, $params));
$router->post('/api/v1/cats', static fn($req) => $catController->store($req));
$router->put('/api/v1/cats/{id}', static fn($req, $params) => $catController->update($req, $params));
$router->delete('/api/v1/cats/{id}', static fn($req, $params) => $catController->destroy($req, $params));

// Reservation Endpoints
$router->get('/api/v1/reservations', static fn($req) => $reservationController->index($req));
$router->get('/api/v1/reservations/{id}', static fn($req, $params) => $reservationController->show($req, $params));
$router->post('/api/v1/reservations', static fn($req) => $reservationController->store($req));
$router->put('/api/v1/reservations/{id}', static fn($req, $params) => $reservationController->update($req, $params));
$router->delete('/api/v1/reservations/{id}', static fn($req, $params) => $reservationController->destroy($req, $params));

return $router;
