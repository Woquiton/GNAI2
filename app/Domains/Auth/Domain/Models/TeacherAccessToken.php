<?php

declare(strict_types=1);

namespace App\Domains\Auth\Domain\Models;

use App\Domains\SpecializedEducationalSupport\Domain\Models\Teacher;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class TeacherAccessToken extends Model
{
    public $timestamps = false;

    protected $table = 'teacher_access_tokens';

    protected $fillable = [
        'teacher_id',
        'token_hash',
        'expires_at',
        'used_at',
        'requester_ip',
        'created_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isUsed(): bool
    {
        return $this->used_at !== null;
    }

    public function isValid(): bool
    {
        return ! $this->isExpired() && ! $this->isUsed();
    }

    public function markAsUsed(): void
    {
        $this->used_at = now();
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }
}
