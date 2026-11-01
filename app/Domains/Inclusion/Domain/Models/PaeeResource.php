<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Domain\Models;

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

    /** Tecnologia assistiva, guardada em `items` desde a unificação com os materiais. */
    public function assistiveTechnology(): BelongsTo
    {
        return $this->belongsTo(Item::class, 'assistive_technology_id');
    }
}
