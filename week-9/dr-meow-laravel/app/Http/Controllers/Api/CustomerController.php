<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CustomerController extends Controller
{
    public function index(): JsonResponse
    {
        return $this->success(Customer::all(), 'Customers retrieved successfully');
    }

    public function show(string $id): JsonResponse
    {
        $customer = Customer::find($id);
        if (!$customer) {
            return $this->error('Customer not found', 404);
        }
        return $this->success($customer, 'Customer retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->all();
        if (empty($data['customer_id'])) {
            $data['customer_id'] = 'CUS-' . strtoupper(Str::random(8));
        }
        $customer = Customer::create($data);
        return $this->success($customer, 'Customer created successfully', 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $customer = Customer::find($id);
        if (!$customer) {
            return $this->error('Customer not found', 404);
        }
        $customer->update($request->all());
        return $this->success($customer, 'Customer updated successfully');
    }

    public function destroy(string $id): JsonResponse
    {
        $customer = Customer::find($id);
        if (!$customer) {
            return $this->error('Customer not found', 404);
        }
        $customer->delete();
        return $this->success(null, 'Customer deleted successfully');
    }

    public function cats(string $customerId): JsonResponse
    {
        $customer = Customer::find($customerId);
        if (!$customer) {
            return $this->error('Customer not found', 404);
        }
        return $this->success($customer->cats, 'Customer cats retrieved successfully');
    }

    public function reservations(string $customerId): JsonResponse
    {
        $customer = Customer::find($customerId);
        if (!$customer) {
            return $this->error('Customer not found', 404);
        }
        return $this->success($customer->reservations, 'Customer reservations retrieved successfully');
    }
}
