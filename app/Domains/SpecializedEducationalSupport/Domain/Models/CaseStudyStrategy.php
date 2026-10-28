<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class CaseStudyStrategy extends Model
{
    protected $table = 'case_study_strategies';

    protected $fillable = [
        'case_study_id',
        'linked_barrier_id',
        'description',
    ];

    public function caseStudy(): BelongsTo
    {
        return $this->belongsTo(CaseStudy::class);
    }

    public function linkedBarrier(): BelongsTo
    {
        return $this->belongsTo(CaseStudyBarrier::class, 'linked_barrier_id');
    }
}
