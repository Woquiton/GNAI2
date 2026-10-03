<?php

namespace App\Models\SpecializedEducationalSupport;

use App\Models\Traits\Reportable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CaseStudyStrategy extends Model
{
    use HasFactory, Reportable;

    protected $fillable = [
        'case_study_id',
        'linked_barrier_id',
        'description',
    ];

    public static function getReportLabel(): string
    {
        return 'Estratégias do Estudo de Caso';
    }

    public function caseStudy(): BelongsTo
    {
        return $this->belongsTo(CaseStudy::class);
    }

    public function linkedBarrier(): BelongsTo
    {
        return $this->belongsTo(CaseStudyBarrier::class, 'linked_barrier_id');
    }
}
