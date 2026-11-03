<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Domain\Models;

use App\Domains\Audit\Domain\Contracts\Auditable;
use App\Domains\Audit\Domain\ValueObjects\AuditedField;
use App\Domains\Audit\Infrastructure\Eloquent\AuditsChanges;
use App\Domains\Auth\Domain\Models\User;
use App\Domains\Inclusion\Domain\Concerns\BelongsToOriginSemester;
use App\Domains\Inclusion\Domain\Concerns\RecordsOperationStatusChanges;
use App\Domains\Inclusion\Domain\DTOs\SupportRequests\SupportRequestDTO;
use App\Domains\Inclusion\Domain\Enums\RequestedSupport;
use App\Domains\Inclusion\Domain\Enums\SupportDiagnosisStatus;
use App\Domains\Inclusion\Domain\Enums\SupportRequesterRole;
use App\Domains\Inclusion\Domain\Enums\SupportRequestReasonType;
use App\Domains\Inclusion\Domain\Enums\SupportRequestStatus;
use App\Domains\Inclusion\Domain\Exceptions\InvalidSupportRequest;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class SupportRequest extends Model implements Auditable
{
    use AuditsChanges;
    use BelongsToOriginSemester;
    use RecordsOperationStatusChanges;

    public const SEMESTER_DATE = 'request_date';

    public const HISTORY_FIELDS = ['status'];

    protected $guarded = ['id'];

    protected $casts = [
        'request_date' => 'date',
        'course_id' => 'integer',
        'requested_supports' => 'array',
        'requester_role' => SupportRequesterRole::class,
        'diagnosis_status' => SupportDiagnosisStatus::class,
        'status' => SupportRequestStatus::class,
        'reason_type' => SupportRequestReasonType::class,
    ];

    public static function register(Student $student, int $creatorId, SupportRequestDTO $data): self
    {
        return new self([
            ...$data->attributes(),
            'student_id' => $student->getKey(),
            'created_by' => $creatorId,
            'status' => SupportRequestStatus::RECEIVED->value,
            'analysis_notes' => null,
            'referrals' => null,
        ]);
    }

    public function revise(SupportRequestDTO $data): void
    {
        $this->fill($data->attributes());
    }

    public function assignCourse(?Course $course): void
    {
        if ($course !== null && ! $course->is_active && (int) $course->id !== $this->course_id) {
            throw new InvalidSupportRequest('Selecione um curso ativo cadastrado.');
        }

        if ($course === null && $this->course_id === null) {
            return;
        }

        $this->fill([
            'course_id' => $course?->getKey(),
            'academic_context' => $course?->name,
        ]);
    }

    public static function auditType(): string
    {
        return 'support_request';
    }

    public static function auditLabel(): string
    {
        return 'Solicitação de atendimento';
    }

    public function auditDescription(): string
    {
        return 'a solicitação de atendimento #'.$this->getKey();
    }

    public static function auditedFields(): array
    {
        return [
            'semester_id' => AuditedField::reference('Semestre de origem', Semester::class, 'label'),
            'student_id' => AuditedField::reference('Aluno', Student::class, 'person.name'),
            'created_by' => AuditedField::reference('Registrada por', User::class),
            'request_date' => AuditedField::date('Data da solicitação'),
            'course_id' => AuditedField::reference('Curso', Course::class),
            'academic_context' => AuditedField::text('Curso no momento da solicitação'),
            'requester_name' => AuditedField::text('Solicitante'),
            'requester_role' => AuditedField::enum('Vínculo do solicitante', SupportRequesterRole::class),
            'requester_other' => AuditedField::text('Outro vínculo'),
            'requester_contact' => AuditedField::text('Contato do solicitante'),
            'reason_type' => AuditedField::enum('Motivo da solicitação', SupportRequestReasonType::class),
            'reason_profiles' => AuditedField::list('Perfis de atendimento da solicitação', model: Deficiency::class),
            'reason' => AuditedField::text('Descrição do motivo'),
            'school_difficulties' => AuditedField::text('Dificuldades escolares'),
            'diagnosis_status' => AuditedField::enum('Situação diagnóstica informada', SupportDiagnosisStatus::class),
            'diagnosis_notes' => AuditedField::text('Observações do diagnóstico'),
            'requested_supports' => AuditedField::list('Apoios solicitados', enum: RequestedSupport::class),
            'other_support' => AuditedField::text('Outro apoio'),
            'status' => AuditedField::enum('Situação', SupportRequestStatus::class),
            'analysis_notes' => AuditedField::text('Análise inicial'),
            'referrals' => AuditedField::text('Encaminhamentos'),
        ];
    }

    /** @return array<string, mixed> */
    public function auditExtraValues(): array
    {
        return $this->exists
            ? ['reason_profiles' => $this->reasonProfiles()->pluck('deficiencies.id')->all()]
            : [];
    }

    /** @param Collection<int, Deficiency> $profiles */
    public function syncReasonProfiles(Collection $profiles): void
    {
        $before = $this->reasonProfiles()->pluck('deficiencies.id')->map(fn ($id): int => (int) $id)->all();
        $profileIds = [];

        if ($this->reason_type === SupportRequestReasonType::PROFILE) {
            if ($profiles->isEmpty()) {
                throw new InvalidSupportRequest('Selecione ao menos um perfil de atendimento ativo cadastrado.');
            }
            foreach ($profiles as $profile) {
                if (! $profile->is_active && ! in_array((int) $profile->id, $before, true)) {
                    throw new InvalidSupportRequest('Selecione um perfil de atendimento ativo cadastrado.');
                }
                $profileIds[] = (int) $profile->id;
            }
        }

        $this->reasonProfiles()->sync($profileIds);
        $this->recordAuditFieldChange('reason_profiles', $before, $profileIds);
    }

    public function reasonProfiles(): BelongsToMany
    {
        return $this->belongsToMany(Deficiency::class, 'support_request_profiles')->withTimestamps();
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(SupportRequestAttachment::class);
    }
}
