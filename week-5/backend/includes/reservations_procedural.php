<?php
declare(strict_types=1);

/**
 * Procedural data processing functions for Reservations (Week 5).
 */

function normalizeReservationRecord(array $row): array
{
    $beforeAfter = $row['before_after'] ?? ['before' => null, 'after' => null];
    if (!is_array($beforeAfter)) {
        $beforeAfter = ['before' => null, 'after' => null];
    }

    return [
        'reservation_id' => trim((string) ($row['reservation_id'] ?? '')),
        'service_id' => trim((string) ($row['service_id'] ?? '')),
        'customer_id' => trim((string) ($row['customer_id'] ?? '')),
        'cat_id' => trim((string) ($row['cat_id'] ?? '')),
        'service_method' => trim((string) ($row['service_method'] ?? '')),
        'work_status' => trim((string) ($row['work_status'] ?? 'Pending')),
        'notification_h1' => normalizeBooleanFlag($row['notification_h1'] ?? false),
        'total_bill' => (int) ($row['total_bill'] ?? 0),
        'paymen_status' => trim((string) ($row['paymen_status'] ?? 'Unpaid')),
        'before_after' => $beforeAfter,
    ];
}

function validateReservationPayload(array $input, bool $isCreating = true): void
{
    $allowed = [
        'reservation_id', 'service_id', 'customer_id', 'cat_id',
        'service_method', 'work_status', 'notification_h1',
        'total_bill', 'paymen_status', 'before_after'
    ];

    $unknown = array_diff(array_keys($input), $allowed);
    if ($unknown !== []) {
        throw new InvalidArgumentException('Unknown fields: ' . implode(', ', $unknown));
    }

    $required = ['service_id', 'customer_id', 'cat_id', 'service_method'];
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

    if (array_key_exists('notification_h1', $input) && !is_bool($input['notification_h1'])) {
        throw new InvalidArgumentException('notification_h1 must be a boolean.');
    }

    if (array_key_exists('total_bill', $input) && (!is_int($input['total_bill']) || $input['total_bill'] < 0)) {
        throw new InvalidArgumentException('total_bill must be a non-negative integer.');
    }

    if (array_key_exists('before_after', $input) && !is_array($input['before_after'])) {
        throw new InvalidArgumentException('before_after must be an object or array.');
    }
}

function findAllReservations(string $dbPath): array
{
    $db = readJsonDatabase($dbPath);
    $rows = $db['reservations'] ?? [];
    $reservations = [];

    foreach ($rows as $row) {
        $reservations[] = normalizeReservationRecord($row);
    }

    return $reservations;
}

function findReservationById(string $dbPath, string $reservationId): ?array
{
    foreach (findAllReservations($dbPath) as $reservation) {
        if ($reservation['reservation_id'] === $reservationId) {
            return $reservation;
        }
    }
    return null;
}

function findReservationsByCustomerId(string $dbPath, string $customerId): array
{
    $reservations = [];
    foreach (findAllReservations($dbPath) as $reservation) {
        if ($reservation['customer_id'] === $customerId) {
            $reservations[] = $reservation;
        }
    }
    return $reservations;
}

function createReservationRecord(string $dbPath, array $attributes): array
{
    $db = readJsonDatabase($dbPath);
    $rows = $db['reservations'] ?? [];

    if (empty($attributes['reservation_id'])) {
        $attributes['reservation_id'] = 'RES-' . strtoupper(bin2hex(random_bytes(4)));
    }

    $record = normalizeReservationRecord($attributes);
    $rows[] = $record;
    $db['reservations'] = $rows;
    writeJsonDatabase($dbPath, $db);

    return $record;
}

function updateReservationRecord(string $dbPath, string $reservationId, array $attributes): ?array
{
    $db = readJsonDatabase($dbPath);
    $rows = $db['reservations'] ?? [];

    foreach ($rows as $index => $row) {
        if ((string) ($row['reservation_id'] ?? '') === $reservationId) {
            $merged = array_merge($row, $attributes, ['reservation_id' => $reservationId]);
            $updated = normalizeReservationRecord($merged);
            $rows[$index] = $updated;
            $db['reservations'] = $rows;
            writeJsonDatabase($dbPath, $db);
            return $updated;
        }
    }

    return null;
}

function deleteReservationRecord(string $dbPath, string $reservationId): bool
{
    $db = readJsonDatabase($dbPath);
    $rows = $db['reservations'] ?? [];

    foreach ($rows as $index => $row) {
        if ((string) ($row['reservation_id'] ?? '') === $reservationId) {
            array_splice($rows, $index, 1);
            $db['reservations'] = $rows;
            writeJsonDatabase($dbPath, $db);
            return true;
        }
    }

    return false;
}
