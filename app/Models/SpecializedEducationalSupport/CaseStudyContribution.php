<?php

namespace App\Models\SpecializedEducationalSupport;

use App\Models\Traits\Reportable;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CaseStudyContribution extends Model
{
    use HasFactory, Reportable;

    public $timestamps = false;

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

    public static function getReportLabel(): string
    {
        return 'Contribuições do Estudo de Caso';
    }

    public function caseStudy(): BelongsTo
    {
        return $this->belongsTo(CaseStudy::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
