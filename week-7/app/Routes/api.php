<?php

declare(strict_types=1);

use App\Controllers\HealthController;
use App\Controllers\ServiceController;
use App\Core\Router;
use App\Repositories\JsonDatabase;
use App\Repositories\ServiceRepository;
use App\Services\ServiceService;

$database = new JsonDatabase(dirname(__DIR__, 2) . '/storage/db.json');
$serviceRepository = new ServiceRepository($database);
$serviceService = new ServiceService($serviceRepository);
$serviceController = new ServiceController($serviceService);
$healthController = new HealthController();

$router = new Router();
$router->get('/api/v1/health', static fn() => $healthController->index());
$router->get('/api/v1/services', static fn($request) => $serviceController->index($request));
$router->get('/api/v1/services/{id}', static fn($request, $params) => $serviceController->show($request, $params));
$router->post('/api/v1/services', static fn($request) => $serviceController->store($request));
$router->put('/api/v1/services/{id}', static fn($request, $params) => $serviceController->update($request, $params));
$router->delete('/api/v1/services/{id}', static fn($request, $params) => $serviceController->destroy($request, $params));

return $router;
