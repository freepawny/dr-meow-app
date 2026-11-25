<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'name',
        'badge_label',
        'description',
        'is_popular',
        'base_price',
        'tier_prices',
        'features',
        'is_active',
        'category',
        'duration_minutes',
    ];

    protected $casts = [
        'is_popular' => 'boolean',
        'base_price' => 'integer',
        'is_active' => 'boolean',
        'tier_prices' => 'array',
        'features' => 'array',
    ];

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class, 'service_id', 'id');
    }
}
