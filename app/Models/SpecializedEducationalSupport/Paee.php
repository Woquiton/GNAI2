<?php

namespace App\Models\SpecializedEducationalSupport;

use App\Enums\SpecializedEducationalSupport\AttendanceFormat;
use App\Enums\SpecializedEducationalSupport\AttendanceLocation;
use App\Enums\SpecializedEducationalSupport\PaeeStatus;
use App\Models\Traits\Auditable;
use App\Models\Traits\Reportable;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Paee extends Model
{
    use HasFactory, Reportable, Auditable;

    protected $fillable = [
        'case_study_id',
        'student_id',
        'creator_id',
        'semester_id',
        'version',
        'is_current',
        'status',
        'attendance_frequency_per_week',
        'attendance_duration_minutes',
        'attendance_format',
        'attendance_location',
        'assistive_technology_needed',
        'assistive_technology_notes',
        'support_professional_needed',
        'support_professional_justification',
        'school_professionals_orientation',
        'common_teachers_articulation',
        'family_articulation',
        'intersectoral_articulation',
        'training_demands',
        'next_review_date',
    ];

    protected $casts = [
        'status' => PaeeStatus::class,
        'attendance_format' => AttendanceFormat::class,
        'attendance_location' => AttendanceLocation::class,
        'is_current' => 'boolean',
        'assistive_technology_needed' => 'boolean',
        'support_professional_needed' => 'boolean',
        'next_review_date' => 'date',
    ];

    public static function getReportLabel(): string
    {
        return 'Programas de Atendimento Educacional Especializado (PAEE)';
    }

    public static function getReportColumns(): array
    {
        return [
            'id',
            'version',
            'status',
            'attendance_frequency_per_week',
            'attendance_format',
            'attendance_location',
            'next_review_date',
            'created_at',
            'creator.name',
        ];
    }

    public static function getReportColumnLabels(): array
    {
        return [
            'id' => 'ID do PAEE',
            'version' => 'Versão',
            'status' => 'Situação',
            'attendance_frequency_per_week' => 'Frequência Semanal',
            'attendance_format' => 'Formato do Atendimento',
            'attendance_location' => 'Local do Atendimento',
            'next_review_date' => 'Próxima Revisão',
            'created_at' => 'Data de Criação',
            'creator.name' => 'Criado por',
        ];
    }

    public static function getEmbeddedRelations(): array
    {
        return ['creator'];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }

    public function caseStudy(): BelongsTo
    {
        return $this->belongsTo(CaseStudy::class);
    }

    public function objectives(): HasMany
    {
        return $this->hasMany(PaeeObjective::class);
    }

    public function resources(): HasMany
    {
        return $this->hasMany(PaeeResource::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(PaeeReview::class)->orderByDesc('reviewed_at');
    }

    public function scopeStudent($query, ?int $studentId)
    {
        if (!$studentId) {
            return $query;
        }

        return $query->where('student_id', $studentId);
    }

    public function scopeCurrent($query, bool $onlyCurrent = true)
    {
        if (!$onlyCurrent) {
            return $query;
        }

        return $query->where('is_current', true);
    }

    public function scopeStatus($query, $status)
    {
        if (!$status) {
            return $query;
        }

        return $query->where('status', $status instanceof PaeeStatus ? $status->value : $status);
    }

    public function ensureCanBeEdited(): void
    {
        if ($this->status === PaeeStatus::UNDER_REVIEW) {
            throw new \DomainException('Este PAEE está em revisão e não pode ser editado diretamente. Registre a revisão primeiro.');
        }
    }

    public function ensureIsOwner(): void
    {
        if ((int) $this->creator_id !== (int) auth()->id()) {
            throw new \DomainException('Acesso negado: apenas o criador deste PAEE pode realizar esta ação.');
        }
    }
}
