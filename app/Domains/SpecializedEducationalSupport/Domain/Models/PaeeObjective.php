<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class PaeeObjective extends Model
{
    protected $table = 'paee_objectives';

    protected $fillable = [
        'paee_id',
        'linked_barrier_id',
        'description',
        'term',
    ];

    public function paee(): BelongsTo
    {
        return $this->belongsTo(Paee::class);
    }

    public function linkedBarrier(): BelongsTo
    {
        return $this->belongsTo(CaseStudyBarrier::class, 'linked_barrier_id');
    }
}
