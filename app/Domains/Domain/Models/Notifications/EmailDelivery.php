<?php

declare(strict_types=1);

namespace App\Domains\Domain\Models\Notifications;

use App\Domains\Domain\Enums\Notifications\EmailDeliveryStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'received_at' => 'datetime',
        'gmail_synced_at' => 'datetime',
    ];

    public function mailboxStates(): HasMany
    {
        return $this->hasMany(EmailMailboxState::class);
    }

    public function inReplyTo(): BelongsTo
    {
        return $this->belongsTo(self::class, 'in_reply_to_id');
    }
}
