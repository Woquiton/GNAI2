<?php

namespace App\Models\SpecializedEducationalSupport;

use App\Enums\SpecializedEducationalSupport\BarrierType;
use App\Models\Traits\Reportable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CaseStudyBarrier extends Model
{
    use HasFactory, Reportable;

    protected $fillable = [
        'case_study_id',
        'type',
        'observed_situation',
        'participation_implication',
    ];

    protected $casts = [
        'type' => BarrierType::class,
    ];

    public static function getReportLabel(): string
    {
        return 'Barreiras do Estudo de Caso';
    }

    public function caseStudy(): BelongsTo
    {
        return $this->belongsTo(CaseStudy::class);
    }

    public function strategies(): HasMany
    {
        return $this->hasMany(CaseStudyStrategy::class, 'linked_barrier_id');
    }
}
