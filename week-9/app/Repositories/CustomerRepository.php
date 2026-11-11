<?php
declare(strict_types=1);

namespace App\Repositories;

use App\Models\Customer;

final class CustomerRepository implements CustomerRepositoryInterface
{
    public function __construct(private JsonDatabase $database) {}

    public function findAll(): array
    {
        $data = $this->database->read();
        $rows = $data['customers'] ?? [];
        $customers = [];

        foreach ($rows as $row) {
            $customers[] = Customer::fromArray($row);
        }

        return $customers;
    }

    public function findById(string $customerId): ?Customer
    {
        foreach ($this->findAll() as $customer) {
            if ($customer->getCustomerId() === $customerId) {
                return $customer;
            }
        }
        return null;
    }

    public function create(array $attributes): Customer
    {
        $data = $this->database->read();
        $rows = $data['customers'] ?? [];

        if (empty($attributes['customer_id'])) {
            $attributes['customer_id'] = 'CUS-' . strtoupper(bin2hex(random_bytes(4)));
        }

        $customer = Customer::fromArray($attributes);
        $rows[] = $customer->toArray();

        $data['customers'] = $rows;
        $this->database->write($data);

        return $customer;
    }

    public function update(string $customerId, array $attributes): ?Customer
    {
        $data = $this->database->read();
        $rows = $data['customers'] ?? [];

        foreach ($rows as $index => $row) {
            if ((string) ($row['customer_id'] ?? '') !== $customerId) {
                continue;
            }

            $merged = array_merge($row, $attributes, ['customer_id' => $customerId]);
            $customer = Customer::fromArray($merged);
            $rows[$index] = $customer->toArray();

            $data['customers'] = $rows;
            $this->database->write($data);

            return $customer;
        }

        return null;
    }

    public function delete(string $customerId): bool
    {
        $data = $this->database->read();
        $rows = $data['customers'] ?? [];

        foreach ($rows as $index => $row) {
            if ((string) ($row['customer_id'] ?? '') === $customerId) {
                array_splice($rows, $index, 1);
                $data['customers'] = $rows;
                $this->database->write($data);
                return true;
            }
        }

        return false;
    }
}
