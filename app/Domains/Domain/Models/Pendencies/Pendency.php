<?php

declare(strict_types=1);

namespace App\Domains\Domain\Models\Pendencies;

use App\Domains\Domain\Contracts\Audit\Auditable;
use App\Domains\Domain\ValueObjects\Audit\AuditedField;
use App\Domains\Infrastructure\Eloquent\Audit\AuditsChanges;
use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\DTOs\Pendencies\CreatePendencyDTO;
use App\Domains\Domain\DTOs\Pendencies\UpdatePendencyDTO;
use App\Domains\Domain\Exceptions\Pendencies\InvalidPendency;
use App\Domains\Domain\Models\Professionals\Professional;
use App\Domains\Domain\Concerns\Semesters\BelongsToOriginSemester;
use App\Domains\Domain\Concerns\Semesters\RecordsOperationStatusChanges;
use App\Domains\Domain\Models\Semesters\Semester;
use App\Shared\Domain\Enums\Priority;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

final class Pendency extends Model implements Auditable
{
    use AuditsChanges;
    use BelongsToOriginSemester;
    use RecordsOperationStatusChanges;

    public const SEMESTER_DATE = 'created_at';

    public const HISTORY_FIELDS = ['is_completed'];

    use HasFactory;

    protected $table = 'pendencies';

    protected $fillable = [
        'created_by',
        'assigned_to',
        'title',
        'description',
        'priority',
        'due_date',
        'is_completed',
    ];

    protected $casts = [
        'completed_at' => 'datetime',
        'is_completed' => 'boolean',
        'due_date' => 'date',
        'priority' => Priority::class,
    ];

    public static function auditType(): string
    {
        return 'pendency';
    }

    public static function auditLabel(): string
    {
        return 'Pendência';
    }

    public static function auditedFields(): array
    {
        return [
            'completed_at' => AuditedField::dateTime('Concluída em'),
            'semester_id' => AuditedField::reference('Semestre de origem', Semester::class, 'label'),
            'created_by' => AuditedField::reference('Criada por', User::class),
            // O nome do profissional mora em `people`; o histórico guarda o vínculo pelo id.
            'assigned_to' => AuditedField::reference('Profissional responsável', Professional::class, 'person.name'),
            'title' => AuditedField::text('Título'),
            'description' => AuditedField::text('Descrição'),
            'priority' => AuditedField::enum('Prioridade', Priority::class),
            'due_date' => AuditedField::date('Data de vencimento'),
            'is_completed' => AuditedField::boolean('Concluída'),
        ];
    }

    public function auditDescription(): string
    {
        $title = trim((string) $this->title);

        return $title !== '' ? "a pendência {$title}" : "a pendência #{$this->getKey()}";
    }

    public static function register(User $creator, Professional $assignedProfessional, CreatePendencyDTO $data): self
    {
        $assignedProfessional->ensureIsActive();

        return new self([
            'created_by' => $creator->getKey(),
            'assigned_to' => $assignedProfessional->getKey(),
            'title' => trim($data->title),
            'description' => self::normalizeDescription($data->description),
            'priority' => $data->priority->value,
            'due_date' => self::normalizeDueDate($data->dueDate),
            'is_completed' => false,
        ]);
    }

    public function revise(Professional $assignedProfessional, UpdatePendencyDTO $data): void
    {
        $assignedProfessional->ensureIsActive();

        $this->fill([
            'assigned_to' => $assignedProfessional->getKey(),
            'title' => trim($data->title),
            'description' => self::normalizeDescription($data->description),
            'priority' => $data->priority->value,
            'due_date' => self::normalizeDueDate($data->dueDate),
        ]);
    }

    /**
     * @throws InvalidPendency
     */
    public function ensureCanBeEditedBy(User $user): void
    {
        if ((int) $this->created_by !== (int) $user->getKey()) {
            throw new InvalidPendency('Somente o criador pode editar a pendência.');
        }

        if ($this->is_completed) {
            throw new InvalidPendency('Não é possível editar uma pendência já concluída.');
        }
    }

    /**
     * @throws InvalidPendency
     */
    public function ensureCanBeCompletedBy(User $user): void
    {
        $professionalId = $user->professional_id;

        if ($professionalId === null || (int) $this->assigned_to !== (int) $professionalId) {
            throw new InvalidPendency('Somente o responsável pode concluir a pendência.');
        }

        if ($this->is_completed) {
            throw new InvalidPendency('Esta pendência já foi concluída.');
        }
    }

    public function canBeCompletedByCurrentUser(): bool
    {
        $user = Auth::user();

        if (! $user instanceof User) {
            return false;
        }

        return $user->professional_id !== null
            && (int) $this->assigned_to === (int) $user->professional_id
            && ! $this->is_completed;
    }

    public function markAsCompleted(): void
    {
        $this->forceFill([
            'is_completed' => true,
            'completed_at' => now(),
        ]);
    }

    public function getCreatedAtFormattedAttribute(): string
    {
        return $this->created_at
            ? $this->created_at->format('d/m/Y H:i')
            : 'Não informado';
    }

    public function getUpdatedAtFormattedAttribute(): string
    {
        return $this->updated_at
            ? $this->updated_at->format('d/m/Y H:i')
            : 'Não informado';
    }

    public function getDueDateFormattedAttribute(): string
    {
        return $this->due_date
            ? $this->due_date->format('d/m/Y')
            : 'Não informado';
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignedProfessional(): BelongsTo
    {
        return $this->belongsTo(Professional::class, 'assigned_to');
    }

    private static function normalizeDescription(?string $description): ?string
    {
        $normalized = $description !== null ? trim($description) : null;

        return $normalized !== '' ? $normalized : null;
    }

    private static function normalizeDueDate(?string $dueDate): ?string
    {
        return $dueDate !== null
            ? CarbonImmutable::parse($dueDate)->toDateString()
            : null;
    }
}
