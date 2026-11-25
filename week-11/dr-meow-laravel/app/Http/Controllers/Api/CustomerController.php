<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CustomerRequest;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
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
        if (! $customer) {
            return $this->error('Customer not found', 404);
        }

        return $this->success($customer, 'Customer retrieved successfully');
    }

    public function store(CustomerRequest $request): JsonResponse
    {
        $data = $this->mapData($request->validated(), true);

        if (empty($data['customer_id'])) {
            $data['customer_id'] = 'CUS-'.strtoupper(Str::random(8));
        }

        $customer = Customer::create($data);

        return $this->success($customer, 'Customer created successfully', 201);
    }

    public function update(CustomerRequest $request, string $id): JsonResponse
    {
        $customer = Customer::find($id);
        if (! $customer) {
            return $this->error('Customer not found', 404);
        }

        $customer->update($this->mapData($request->validated(), false));

        return $this->success($customer, 'Customer updated successfully');
    }

    public function destroy(string $id): JsonResponse
    {
        $customer = Customer::find($id);
        if (! $customer) {
            return $this->error('Customer not found', 404);
        }
        $customer->delete();

        return $this->success(null, 'Customer deleted successfully');
    }

    public function cats(string $customerId): JsonResponse
    {
        $customer = Customer::find($customerId);
        if (! $customer) {
            return $this->error('Customer not found', 404);
        }

        return $this->success($customer->cats, 'Customer cats retrieved successfully');
    }

    public function reservations(string $customerId): JsonResponse
    {
        $customer = Customer::find($customerId);
        if (! $customer) {
            return $this->error('Customer not found', 404);
        }

        return $this->success($customer->reservations, 'Customer reservations retrieved successfully');
    }

    private function mapData(array $validated, bool $isCreate): array
    {
        $data = [
            'name' => $validated['name'],
            'phone_number' => $validated['phone'],
            'email' => $validated['email'] ?? null,
            'address' => $validated['address'] ?? '',
        ];

        if ($isCreate || array_key_exists('schedule', $validated)) {
            $data['schedule'] = $validated['schedule'] ?? '';
        }

        foreach (['customer_id', 'preference_notification'] as $field) {
            if (array_key_exists($field, $validated)) {
                $data[$field] = $validated[$field];
            }
        }

        return $data;
    }
}
