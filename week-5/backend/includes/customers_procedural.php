<?php
declare(strict_types=1);

/**
 * Procedural data processing functions for Customers (Week 5).
 */

function normalizeCustomerRecord(array $row): array
{
    return [
        'customer_id' => trim((string) ($row['customer_id'] ?? '')),
        'name' => trim((string) ($row['name'] ?? '')),
        'phone_number' => trim((string) ($row['phone_number'] ?? '')),
        'schedule' => trim((string) ($row['schedule'] ?? '')),
        'address' => trim((string) ($row['address'] ?? '')),
        'preference_notification' => normalizeBooleanFlag($row['preference_notification'] ?? true),
    ];
}

function validateCustomerPayload(array $input, bool $isCreating = true): void
{
    $allowed = ['customer_id', 'name', 'phone_number', 'schedule', 'address', 'preference_notification'];
    $unknown = array_diff(array_keys($input), $allowed);
    if ($unknown !== []) {
        throw new InvalidArgumentException('Unknown fields: ' . implode(', ', $unknown));
    }

    $required = ['name', 'phone_number', 'schedule', 'address'];
    if ($isCreating) {
        foreach ($required as $field) {
            if (!array_key_exists($field, $input)) {
                throw new InvalidArgumentException("Field '{$field}' is required.");
            }
        }
    }

    foreach ($required as $field) {
        if (array_key_exists($field, $input) && (!is_string($input[$field]) || trim($input[$field]) === '')) {
            throw new InvalidArgumentException("{$field} must be a non-empty string.");
        }
    }

    if (isset($input['phone_number']) && !preg_match('/^\+?[0-9]{10,15}$/', trim((string) $input['phone_number']))) {
        throw new InvalidArgumentException('Customer phone number format is invalid.');
    }

    if (array_key_exists('preference_notification', $input) && !is_bool($input['preference_notification'])) {
        throw new InvalidArgumentException('preference_notification must be a boolean.');
    }
}

function findAllCustomers(string $dbPath): array
{
    $db = readJsonDatabase($dbPath);
    $rows = $db['customers'] ?? [];
    $customers = [];

    foreach ($rows as $row) {
        $customers[] = normalizeCustomerRecord($row);
    }

    return $customers;
}

function findCustomerById(string $dbPath, string $customerId): ?array
{
    foreach (findAllCustomers($dbPath) as $customer) {
        if ($customer['customer_id'] === $customerId) {
            return $customer;
        }
    }
    return null;
}

function createCustomerRecord(string $dbPath, array $attributes): array
{
    $db = readJsonDatabase($dbPath);
    $rows = $db['customers'] ?? [];

    if (empty($attributes['customer_id'])) {
        $attributes['customer_id'] = 'CUS-' . strtoupper(bin2hex(random_bytes(4)));
    }

    $record = normalizeCustomerRecord($attributes);
    $rows[] = $record;
    $db['customers'] = $rows;
    writeJsonDatabase($dbPath, $db);

    return $record;
}

function updateCustomerRecord(string $dbPath, string $customerId, array $attributes): ?array
{
    $db = readJsonDatabase($dbPath);
    $rows = $db['customers'] ?? [];

    foreach ($rows as $index => $row) {
        if ((string) ($row['customer_id'] ?? '') === $customerId) {
            $merged = array_merge($row, $attributes, ['customer_id' => $customerId]);
            $updated = normalizeCustomerRecord($merged);
            $rows[$index] = $updated;
            $db['customers'] = $rows;
            writeJsonDatabase($dbPath, $db);
            return $updated;
        }
    }

    return null;
}

function deleteCustomerRecord(string $dbPath, string $customerId): bool
{
    $db = readJsonDatabase($dbPath);
    $rows = $db['customers'] ?? [];

    foreach ($rows as $index => $row) {
        if ((string) ($row['customer_id'] ?? '') === $customerId) {
            array_splice($rows, $index, 1);
            $db['customers'] = $rows;
            writeJsonDatabase($dbPath, $db);
            return true;
        }
    }

    return false;
}
