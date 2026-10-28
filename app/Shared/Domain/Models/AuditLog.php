<?php

declare(strict_types=1);

namespace App\Shared\Domain\Models;

use App\Domains\Auth\Domain\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class AuditLog extends Model
{
    public $timestamps = false;

    protected $table = 'audit_logs';

    public const ACTION_VIEWED = 'viewed';

    public const ACTION_CREATED = 'created';

    public const ACTION_UPDATED = 'updated';

    public const ACTION_DELETED = 'deleted';

    protected $fillable = [
        'user_id',
        'action',
        'auditable_type',
        'auditable_id',
        'student_id',
        'student_name',
        'detail',
        'changes',
        'ip_address',
        'created_at',
    ];

    protected $casts = [
        'changes' => 'array',
        'created_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
