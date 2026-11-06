<?php

declare(strict_types=1);

namespace App\Domains\Domain\Models\Semesters;

use App\Domains\Domain\Models\Auth\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/** Eventos preservados mesmo quando a operação original é removida. */
final class OperationStatusChange extends Model
{
    public $timestamps = false;

    protected $guarded = ['id'];

    protected $casts = [
        'occurred_at' => 'datetime',
        'recorded_at' => 'datetime',
    ];

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }
}
