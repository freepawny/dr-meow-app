<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cat extends Model
{
    protected $primaryKey = 'cat_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'cat_id',
        'customer_id',
        'name',
        'weight',
        'breeds',
        'vital_temperature',
        'tempramen',
        'medical_history',
        'last_picture',
    ];

    protected $casts = [
        'weight' => 'float',
        'vital_temperature' => 'float',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'customer_id');
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class, 'cat_id', 'cat_id');
    }
}
