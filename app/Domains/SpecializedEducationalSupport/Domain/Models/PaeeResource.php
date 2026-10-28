<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Domain\Models;

use App\Domains\InclusiveRadar\Domain\Models\AssistiveTechnology;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class PaeeResource extends Model
{
    protected $table = 'paee_resources';

    protected $fillable = [
        'paee_id',
        'description',
        'acquisition_type',
        'assistive_technology_id',
    ];

    public function paee(): BelongsTo
    {
        return $this->belongsTo(Paee::class);
    }

    public function assistiveTechnology(): BelongsTo
    {
        return $this->belongsTo(AssistiveTechnology::class);
    }
}
