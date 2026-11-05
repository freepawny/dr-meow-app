<?php
declare(strict_types=1);

/**
 * Procedural data processing functions for Cats (Week 5).
 */

function normalizeCatRecord(array $row): array
{
    $vitalTemperature = $row['vital_temperature'] ?? null;
    $lastPicture = $row['last_picture'] ?? null;

    return [
        'cat_id' => trim((string) ($row['cat_id'] ?? '')),
        'customer_id' => trim((string) ($row['customer_id'] ?? '')),
        'name' => trim((string) ($row['name'] ?? '')),
        'weight' => (float) ($row['weight'] ?? 0),
        'breeds' => trim((string) ($row['breeds'] ?? '')),
        'vital_temperature' => $vitalTemperature === null ? null : (float) $vitalTemperature,
        'tempramen' => trim((string) ($row['tempramen'] ?? 'Friendly')),
        'medical_history' => trim((string) ($row['medical_history'] ?? '')),
        'last_picture' => $lastPicture === null ? null : trim((string) $lastPicture),
    ];
}

function validateCatPayload(array $input, bool $isCreating = true): void
{
    $allowed = [
        'cat_id', 'customer_id', 'name', 'weight', 'breeds',
        'vital_temperature', 'tempramen', 'medical_history', 'last_picture'
    ];

    $unknown = array_diff(array_keys($input), $allowed);
    if ($unknown !== []) {
        throw new InvalidArgumentException('Unknown fields: ' . implode(', ', $unknown));
    }

    $required = ['customer_id', 'name', 'weight', 'breeds'];
    if ($isCreating) {
        foreach ($required as $field) {
            if (!array_key_exists($field, $input)) {
                throw new InvalidArgumentException("Field '{$field}' is required.");
            }
        }
    }

    foreach (['customer_id', 'name', 'breeds'] as $field) {
        if (array_key_exists($field, $input) && (!is_string($input[$field]) || trim($input[$field]) === '')) {
            throw new InvalidArgumentException("{$field} must be a non-empty string.");
        }
    }

    if (array_key_exists('weight', $input) && (!is_numeric($input['weight']) || (float) $input['weight'] <= 0)) {
        throw new InvalidArgumentException('weight must be a positive number.');
    }

    if (array_key_exists('vital_temperature', $input) && $input['vital_temperature'] !== null && !is_numeric($input['vital_temperature'])) {
        throw new InvalidArgumentException('vital_temperature must be a number or null.');
    }

    foreach (['tempramen', 'medical_history', 'last_picture'] as $field) {
        if (array_key_exists($field, $input) && $input[$field] !== null && !is_string($input[$field])) {
            throw new InvalidArgumentException("{$field} must be a string or null.");
        }
    }
}

function findAllCats(string $dbPath): array
{
    $db = readJsonDatabase($dbPath);
    $rows = $db['cats'] ?? [];
    $cats = [];

    foreach ($rows as $row) {
        $cats[] = normalizeCatRecord($row);
    }

    return $cats;
}

function findCatById(string $dbPath, string $catId): ?array
{
    foreach (findAllCats($dbPath) as $cat) {
        if ($cat['cat_id'] === $catId) {
            return $cat;
        }
    }
    return null;
}

function findCatsByCustomerId(string $dbPath, string $customerId): array
{
    $cats = [];
    foreach (findAllCats($dbPath) as $cat) {
        if ($cat['customer_id'] === $customerId) {
            $cats[] = $cat;
        }
    }
    return $cats;
}

function createCatRecord(string $dbPath, array $attributes): array
{
    $db = readJsonDatabase($dbPath);
    $rows = $db['cats'] ?? [];

    if (empty($attributes['cat_id'])) {
        $attributes['cat_id'] = 'CAT-' . strtoupper(bin2hex(random_bytes(4)));
    }

    $record = normalizeCatRecord($attributes);
    $rows[] = $record;
    $db['cats'] = $rows;
    writeJsonDatabase($dbPath, $db);

    return $record;
}

function updateCatRecord(string $dbPath, string $catId, array $attributes): ?array
{
    $db = readJsonDatabase($dbPath);
    $rows = $db['cats'] ?? [];

    foreach ($rows as $index => $row) {
        if ((string) ($row['cat_id'] ?? '') === $catId) {
            $merged = array_merge($row, $attributes, ['cat_id' => $catId]);
            $updated = normalizeCatRecord($merged);
            $rows[$index] = $updated;
            $db['cats'] = $rows;
            writeJsonDatabase($dbPath, $db);
            return $updated;
        }
    }

    return null;
}

function deleteCatRecord(string $dbPath, string $catId): bool
{
    $db = readJsonDatabase($dbPath);
    $rows = $db['cats'] ?? [];

    foreach ($rows as $index => $row) {
        if ((string) ($row['cat_id'] ?? '') === $catId) {
            array_splice($rows, $index, 1);
            $db['cats'] = $rows;
            writeJsonDatabase($dbPath, $db);
            return true;
        }
    }

    return false;
}
