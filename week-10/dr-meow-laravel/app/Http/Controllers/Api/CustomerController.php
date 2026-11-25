<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
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

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), $this->rules());

        if ($validator->fails()) {
            return $this->error('Validation error', 422, $validator->errors()->toArray());
        }

        $data = $this->mapData($validator->validated(), true);

        if (empty($data['customer_id'])) {
            $data['customer_id'] = 'CUS-'.strtoupper(Str::random(8));
        }

        $customer = Customer::create($data);

        return $this->success($customer, 'Customer created successfully', 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $customer = Customer::find($id);
        if (! $customer) {
            return $this->error('Customer not found', 404);
        }

        $validator = Validator::make($request->all(), $this->rules());

        if ($validator->fails()) {
            return $this->error('Validation error', 422, $validator->errors()->toArray());
        }

        $customer->update($this->mapData($validator->validated(), false));

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

    private function rules(): array
    {
        return [
            'name' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:100',
            'address' => 'nullable|string|max:255',
            'customer_id' => 'nullable|string|max:100',
            'schedule' => 'nullable|string|max:255',
            'preference_notification' => 'boolean',
        ];
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
