<?php

namespace App\Models\SpecializedEducationalSupport;

use App\Enums\SpecializedEducationalSupport\ResourceAcquisitionType;
use App\Models\InclusiveRadar\AssistiveTechnology;
use App\Models\Traits\Reportable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaeeResource extends Model
{
    use HasFactory, Reportable;

    protected $fillable = [
        'paee_id',
        'description',
        'acquisition_type',
        'assistive_technology_id',
    ];

    protected $casts = [
        'acquisition_type' => ResourceAcquisitionType::class,
    ];

    public static function getReportLabel(): string
    {
        return 'Recursos do PAEE';
    }

    public function paee(): BelongsTo
    {
        return $this->belongsTo(Paee::class);
    }

    public function assistiveTechnology(): BelongsTo
    {
        return $this->belongsTo(AssistiveTechnology::class);
    }
}
