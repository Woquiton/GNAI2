<?php

declare(strict_types=1);

namespace App\Domains\Domain\Models\PeiDisciplineRevisions;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\PeiDisciplines\PeiDiscipline;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class PeiDisciplineRevision extends Model
{
    public const AUTOMATIC_REASON = 'Revisão registrada automaticamente ao salvar a edição da adaptação.';

    protected $table = 'pei_discipline_revisions';

    protected $fillable = [
        'pei_discipline_id',
        'reviewed_at',
        'what_changed',
        'why',
        'reviewer_id',
    ];

    protected $casts = [
        'reviewed_at' => 'date',
    ];

    public function peiDiscipline(): BelongsTo
    {
        return $this->belongsTo(PeiDiscipline::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
