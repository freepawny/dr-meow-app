<?php

declare(strict_types=1);
header("Content-Type: application/json; charset=utf-8");

$method = $_SERVER["REQUEST_METHOD"] ?? "GET";
$path = parse_url($_SERVER["REQUEST_URI"]?? "/",PHP_URL_PATH );

$services = [
    ['id' => 1, 'name' => 'Basic Grooming', 'price' => 50000, 'active' => true],
    ['id' => 2, 'name' => 'Full Grooming', 'price' => 85000, 'active' => true],
    ['id' => 3, 'name' => 'Kitten Grooming', 'price' => 45000, 'active' => true],
    ['id' => 4, 'name' => 'Archived Service', 'price' => 30000, 'active' => false]
];

function respond(int $status, array $payload): never{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    exit;
}


if($method === "GET" && $path === "/api/health"){
    respond(
        200, [
            'success' => true,
            'message'=> ' API sedang berjalan',
            'data'=> ['status'=> 'ok']
        ]
    );
}

if($method ==="GET" && $path === "/api/services"){
    $activeServices = [];

    foreach($services as $service){
        if($service['active'] === true){
            $activeServices[] = $service;
        }
    }

    $id= isset($_GET['id']) ? filter_var($_GET['id'],FILTER_VALIDATE_INT) : null;

    if (isset($_GET['id'])&& ($id === null || $id === false || $id < 1) ){
        respond(400, [
            'success' => false,
            'message' => 'Invalid Service ID',
            'errors' => ['id'=> 'ID harus berupa bilangan bulat positif']
        ]);
    }


    if ($id !== null){
        foreach($activeServices as $service){
            if($service['id'] === $id){
                respond(200, [
                    'success' => true,
                    'message'=> 'Service retrieved successfully',
                    'data' => $service
                ]);
            }


        }


        respond(400, [
            'success' => false,
            'message' => 'Service not found',
            'errors' => []
        ]);
    }
   respond(200, [
        'success' => true,
        'message' => 'Services retrieved successfully',
        'data' => $activeServices
    ]);
}

respond(404, [
    'success' => false,
    'message' => 'Route not found',
    'errors' => []
]);
