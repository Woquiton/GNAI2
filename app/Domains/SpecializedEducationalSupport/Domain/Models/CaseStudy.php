<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Domain\Models;

use App\Domains\Auth\Domain\Models\User;
use App\Domains\SpecializedEducationalSupport\Domain\DTOs\CaseStudies\CaseStudyDTO;
use App\Domains\SpecializedEducationalSupport\Domain\Exceptions\InvalidCaseStudy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class CaseStudy extends Model
{
    use HasFactory;

    public const STATUS_DRAFT = 'draft';

    public const STATUS_IN_PROGRESS = 'in_progress';

    public const STATUS_COMPLETED = 'completed';

    protected $table = 'case_studies';

    protected $fillable = [
        'student_id',
        'creator_id',
        'semester_id',
        'version',
        'is_current',
        'status',
        'demand_origin',
        'participants_summary',
        'study_date',
        'student_observation',
        'student_family_listening',
        'teachers_listening',
        'other_info',
        'care_network_notes',
        'favorable_aspects',
        'potentials_interests',
        'needed_supports',
        'needed_supports_justification',
        'acceptance_status',
        'acceptance_date',
        'completed_at',
    ];

    protected $casts = [
        'version' => 'integer',
        'is_current' => 'boolean',
        'needed_supports' => 'array',
        'study_date' => 'date',
        'acceptance_date' => 'date',
        'completed_at' => 'datetime',
    ];

    public static function register(Student $student, Semester $semester, int $creatorId, int $version, CaseStudyDTO $data): self
    {
        if (! $student->exists || ! $semester->exists) {
            throw new InvalidCaseStudy('O Estudo de Caso deve ser vinculado a aluno e semestre persistidos.');
        }

        return new self([
            'student_id' => $student->getKey(),
            'creator_id' => $creatorId,
            'semester_id' => $semester->getKey(),
            'version' => $version,
            'is_current' => true,
            'status' => self::STATUS_IN_PROGRESS,
            ...self::attributesFrom($data),
        ]);
    }

    public function revise(CaseStudyDTO $data): void
    {
        $this->ensureCanBeEdited();
        $this->fill(self::attributesFrom($data));
    }

    /** @throws InvalidCaseStudy */
    public function ensureCanBeEdited(): void
    {
        if ($this->status === self::STATUS_COMPLETED) {
            throw new InvalidCaseStudy('Este Estudo de Caso já foi concluído e não pode mais ser editado.');
        }
    }

    /** @throws InvalidCaseStudy */
    public function ensureCanBeCompleted(): void
    {
        $this->ensureCanBeEdited();

        if ($this->barriers()->count() < 1) {
            throw new InvalidCaseStudy('É necessário registrar ao menos uma barreira antes de concluir o Estudo de Caso.');
        }

        if ($this->strategies()->count() < 1) {
            throw new InvalidCaseStudy('É necessário registrar ao menos uma estratégia antes de concluir o Estudo de Caso.');
        }
    }

    public function markAsCompleted(): void
    {
        $this->status = self::STATUS_COMPLETED;
        $this->completed_at = now();
    }

    public function markAsHistorical(): void
    {
        $this->is_current = false;
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }

    public function barriers(): HasMany
    {
        return $this->hasMany(CaseStudyBarrier::class);
    }

    public function strategies(): HasMany
    {
        return $this->hasMany(CaseStudyStrategy::class);
    }

    public function contributions(): HasMany
    {
        return $this->hasMany(CaseStudyContribution::class);
    }

    public function paees(): HasMany
    {
        return $this->hasMany(Paee::class);
    }

    private static function attributesFrom(CaseStudyDTO $data): array
    {
        return [
            'demand_origin' => $data->demandOrigin,
            'participants_summary' => self::nullableText($data->participantsSummary),
            'study_date' => $data->studyDate,
            'student_observation' => $data->studentObservation,
            'student_family_listening' => $data->studentFamilyListening,
            'teachers_listening' => $data->teachersListening,
            'other_info' => self::nullableText($data->otherInfo),
            'care_network_notes' => self::nullableText($data->careNetworkNotes),
            'favorable_aspects' => $data->favorableAspects,
            'potentials_interests' => $data->potentialsInterests,
            'needed_supports' => $data->neededSupports,
            'needed_supports_justification' => self::nullableText($data->neededSupportsJustification),
            'acceptance_status' => $data->acceptanceStatus,
            'acceptance_date' => $data->acceptanceDate,
        ];
    }

    private static function nullableText(?string $value): ?string
    {
        $value = trim((string) $value);

        return $value === '' ? null : $value;
    }
}
