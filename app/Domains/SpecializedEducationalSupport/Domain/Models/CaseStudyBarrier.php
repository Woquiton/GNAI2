<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class CaseStudyBarrier extends Model
{
    protected $table = 'case_study_barriers';

    protected $fillable = [
        'case_study_id',
        'type',
        'observed_situation',
        'participation_implication',
    ];

    public function caseStudy(): BelongsTo
    {
        return $this->belongsTo(CaseStudy::class);
    }
}
