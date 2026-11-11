<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\JsonView;
use App\Core\Request;
use App\Services\CatService;
use App\Services\CustomerService;
use App\Services\ReservationService;

final class CustomerController
{
    public function __construct(
        private CustomerService $customerService,
        private CatService $catService,
        private ReservationService $reservationService
    ) {}

    public function index(Request $request): never
    {
        JsonView::success(
            $this->customerService->listCustomers(),
            'Customers retrieved successfully'
        );
    }

    public function show(Request $request, array $params): never
    {
        $id = $this->requireId($params, 'id');
        JsonView::success(
            $this->customerService->getCustomer($id),
            'Customer retrieved successfully'
        );
    }

    public function store(Request $request): never
    {
        JsonView::success(
            $this->customerService->createCustomer($request->body),
            'Customer created successfully',
            201
        );
    }

    public function update(Request $request, array $params): never
    {
        $id = $this->requireId($params, 'id');
        JsonView::success(
            $this->customerService->updateCustomer($id, $request->body),
            'Customer updated successfully'
        );
    }

    public function destroy(Request $request, array $params): never
    {
        $id = $this->requireId($params, 'id');
        $this->customerService->deleteCustomer($id);
        JsonView::success(null, 'Customer deleted successfully');
    }

    public function cats(Request $request, array $params): never
    {
        $customerId = $this->requireId($params, 'customerId');
        JsonView::success(
            $this->catService->listCatsByCustomer($customerId),
            'Customer cats retrieved successfully'
        );
    }

    public function reservations(Request $request, array $params): never
    {
        $customerId = $this->requireId($params, 'customerId');
        JsonView::success(
            $this->reservationService->listReservationsByCustomer($customerId),
            'Customer reservations retrieved successfully'
        );
    }

    private function requireId(array $params, string $key): string
    {
        $id = trim((string) ($params[$key] ?? ''));
        if ($id === '') {
            JsonView::error('Customer ID is required', 400);
        }
        return $id;
    }
}
