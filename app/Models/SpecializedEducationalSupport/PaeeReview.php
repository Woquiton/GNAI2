<?php

namespace App\Models\SpecializedEducationalSupport;

use App\Models\Traits\Reportable;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaeeReview extends Model
{
    use HasFactory, Reportable;

    protected $fillable = [
        'paee_id',
        'reviewed_at',
        'what_changed',
        'why',
        'reviewer_id',
    ];

    protected $casts = [
        'reviewed_at' => 'date',
    ];

    public static function getReportLabel(): string
    {
        return 'Revisões do PAEE';
    }

    public function paee(): BelongsTo
    {
        return $this->belongsTo(Paee::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
