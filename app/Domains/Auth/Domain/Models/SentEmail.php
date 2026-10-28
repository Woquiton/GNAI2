<?php

declare(strict_types=1);

namespace App\Domains\Auth\Domain\Models;

use Illuminate\Database\Eloquent\Model;

final class SentEmail extends Model
{
    public $timestamps = false;

    protected $table = 'sent_emails';

    public const STATUS_SENT = 'sent';

    public const STATUS_FAILED = 'failed';

    protected $fillable = [
        'recipient',
        'type',
        'status',
        'error',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];
}
