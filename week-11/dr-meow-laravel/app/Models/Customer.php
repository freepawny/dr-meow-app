<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    protected $primaryKey = 'customer_id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'customer_id',
        'name',
        'phone_number',
        'email',
        'schedule',
        'address',
        'preference_notification',
    ];

    protected $casts = [
        'preference_notification' => 'boolean',
    ];

    public function cats(): HasMany
    {
        return $this->hasMany(Cat::class, 'customer_id', 'customer_id');
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class, 'customer_id', 'customer_id');
    }
}
