<?php
declare(strict_types=1);

/**
 * Procedural data processing functions for Services (Week 5).
 */

function normalizeServiceRecord(array $row): array
{
    $tierPrices = [];
    $rawTiers = $row['tier_prices'] ?? ($row['tierPrices'] ?? []);
    if (is_array($rawTiers)) {
        foreach ($rawTiers as $tier => $price) {
            $tierPrices[(string) $tier] = (int) $price;
        }
    }

    $features = [];
    $rawFeatures = $row['features'] ?? [];
    if (is_array($rawFeatures)) {
        foreach ($rawFeatures as $item) {
            if (is_string($item)) {
                $features[] = $item;
            } elseif (is_array($item) && isset($item['text'])) {
                $features[] = (string) $item['text'];
            }
        }
    }

    $isPopular = $row['is_popular'] ?? ($row['isPopular'] ?? false);
    $isActive = $row['is_active'] ?? ($row['isActive'] ?? true);

    return [
        'id' => trim((string) ($row['id'] ?? '')),
        'name' => trim((string) ($row['name'] ?? '')),
        'badge_label' => trim((string) ($row['badge_label'] ?? ($row['badgeLabel'] ?? ''))),
        'description' => trim((string) ($row['description'] ?? '')),
        'is_popular' => normalizeBooleanFlag($isPopular),
        'base_price' => (int) ($row['base_price'] ?? ($row['basePrice'] ?? 0)),
        'tier_prices' => $tierPrices,
        'features' => $features,
        'is_active' => normalizeBooleanFlag($isActive),
    ];
}

function validateServicePayload(array $input, bool $isCreating = true): void
{
    $allowed = [
        'id', 'name', 'badge_label', 'badgeLabel', 'description',
        'is_popular', 'isPopular', 'base_price', 'basePrice',
        'tier_prices', 'tierPrices', 'features', 'is_active', 'isActive'
    ];

    $unknown = array_diff(array_keys($input), $allowed);
    if ($unknown !== []) {
        throw new InvalidArgumentException('Unknown fields: ' . implode(', ', $unknown));
    }

    if ($isCreating) {
        $hasBadge = array_key_exists('badge_label', $input) || array_key_exists('badgeLabel', $input);
        $hasPrice = array_key_exists('base_price', $input) || array_key_exists('basePrice', $input);
        if (!array_key_exists('name', $input) || !array_key_exists('description', $input) || !$hasBadge || !$hasPrice) {
            throw new InvalidArgumentException("Fields 'name', 'badge_label', 'description', and 'base_price' are required.");
        }
    }

    if (isset($input['name']) && (!is_string($input['name']) || trim($input['name']) === '')) {
        throw new InvalidArgumentException('Name must be a non-empty string.');
    }

    $badge = $input['badge_label'] ?? ($input['badgeLabel'] ?? null);
    if ($badge !== null && (!is_string($badge) || trim($badge) === '')) {
        throw new InvalidArgumentException('badge_label must be a non-empty string.');
    }

    if (isset($input['description']) && (!is_string($input['description']) || trim($input['description']) === '')) {
        throw new InvalidArgumentException('Description must be a non-empty string.');
    }

    $price = $input['base_price'] ?? ($input['basePrice'] ?? null);
    if ($price !== null && (!is_int($price) || $price < 0)) {
        throw new InvalidArgumentException('base_price must be a non-negative integer.');
    }

    if (isset($input['features']) && !is_array($input['features'])) {
        throw new InvalidArgumentException('Features must be an array.');
    }
}

function findAllServices(string $dbPath, bool $activeOnly = false): array
{
    $db = readJsonDatabase($dbPath);
    $rows = $db['services'] ?? [];
    $services = [];

    foreach ($rows as $row) {
        $normalized = normalizeServiceRecord($row);
        if (!$activeOnly || $normalized['is_active'] === true) {
            $services[] = $normalized;
        }
    }

    return $services;
}

function findServiceById(string $dbPath, string $id): ?array
{
    $services = findAllServices($dbPath, false);
    foreach ($services as $service) {
        if ($service['id'] === $id) {
            return $service;
        }
    }
    return null;
}

function createServiceRecord(string $dbPath, array $attributes): array
{
    $db = readJsonDatabase($dbPath);
    $rows = $db['services'] ?? [];

    if (empty($attributes['id'])) {
        $slug = strtolower(trim((string) preg_replace('/[^A-Za-z0-9-]+/', '-', (string) ($attributes['name'] ?? 'service')), '-'));
        $attributes['id'] = $slug !== '' ? $slug : 'service-' . uniqid();
    }

    $record = normalizeServiceRecord($attributes);
    $rows[] = $record;
    $db['services'] = $rows;
    writeJsonDatabase($dbPath, $db);

    return $record;
}

function updateServiceRecord(string $dbPath, string $id, array $attributes): ?array
{
    $db = readJsonDatabase($dbPath);
    $rows = $db['services'] ?? [];

    foreach ($rows as $index => $row) {
        if ((string) ($row['id'] ?? '') === $id) {
            $merged = array_merge($row, $attributes, ['id' => $id]);
            $updated = normalizeServiceRecord($merged);
            $rows[$index] = $updated;
            $db['services'] = $rows;
            writeJsonDatabase($dbPath, $db);
            return $updated;
        }
    }

    return null;
}

function deleteServiceRecord(string $dbPath, string $id): bool
{
    $db = readJsonDatabase($dbPath);
    $rows = $db['services'] ?? [];

    foreach ($rows as $index => $row) {
        if ((string) ($row['id'] ?? '') === $id) {
            array_splice($rows, $index, 1);
            $db['services'] = $rows;
            writeJsonDatabase($dbPath, $db);
            return true;
        }
    }

    return false;
}
