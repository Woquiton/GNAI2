<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Domain\Models;

use App\Domains\Auth\Domain\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class CaseStudyContribution extends Model
{
    public $timestamps = false;

    protected $table = 'case_study_contributions';

    protected $fillable = [
        'case_study_id',
        'author_id',
        'role',
        'content',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function caseStudy(): BelongsTo
    {
        return $this->belongsTo(CaseStudy::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
