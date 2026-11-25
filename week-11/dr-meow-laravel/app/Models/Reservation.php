<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reservation extends Model
{
    protected $primaryKey = 'reservation_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'reservation_id',
        'service_id',
        'customer_id',
        'cat_id',
        'service_method',
        'work_status',
        'notification_h1',
        'total_bill',
        'paymen_status',
        'before_after',
    ];

    protected $casts = [
        'notification_h1' => 'boolean',
        'total_bill' => 'integer',
        'before_after' => 'array',
    ];

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class, 'service_id', 'id');
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'customer_id');
    }

    public function cat(): BelongsTo
    {
        return $this->belongsTo(Cat::class, 'cat_id', 'cat_id');
    }
}
