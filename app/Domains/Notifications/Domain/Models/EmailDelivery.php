<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Domain\Models;

use App\Domains\Notifications\Domain\Enums\EmailDeliveryStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

final class EmailDelivery extends Model
{
    use HasUuids;

    protected $guarded = ['id'];

    protected $hidden = ['recipient_email', 'recipient_name', 'payload'];

    protected $casts = [
        'status' => EmailDeliveryStatus::class,
        'recipient_email' => 'encrypted',
        'recipient_name' => 'encrypted',
        'payload' => 'encrypted:array',
        'attempts' => 'integer',
        'last_attempt_at' => 'datetime',
        'sent_at' => 'datetime',
    ];
}
