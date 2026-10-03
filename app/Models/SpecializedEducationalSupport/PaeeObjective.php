<?php

namespace App\Models\SpecializedEducationalSupport;

use App\Enums\SpecializedEducationalSupport\ObjectiveTerm;
use App\Models\Traits\Reportable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaeeObjective extends Model
{
    use HasFactory, Reportable;

    protected $fillable = [
        'paee_id',
        'linked_barrier_id',
        'description',
        'term',
    ];

    protected $casts = [
        'term' => ObjectiveTerm::class,
    ];

    public static function getReportLabel(): string
    {
        return 'Objetivos do PAEE';
    }

    public function paee(): BelongsTo
    {
        return $this->belongsTo(Paee::class);
    }

    public function linkedBarrier(): BelongsTo
    {
        return $this->belongsTo(CaseStudyBarrier::class, 'linked_barrier_id');
    }
}
