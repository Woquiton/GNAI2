<?php

declare(strict_types=1);

namespace App\Domains\Domain\Models\Inspections;

use App\Domains\Domain\Contracts\Audit\Auditable;
use App\Domains\Domain\ValueObjects\Audit\AuditedField;
use App\Domains\Infrastructure\Eloquent\Audit\AuditsChanges;
use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Enums\Barriers\BarrierStatus;
use App\Domains\Domain\DTOs\Inspections\CreateInspectionDTO;
use App\Domains\Domain\Enums\Inspections\InspectionType;
use App\Domains\Domain\Enums\Items\ConservationState;
use App\Domains\Domain\Concerns\Semesters\BelongsToOriginSemester;
use App\Domains\Domain\Models\Semesters\Semester;
use Database\Factories\InspectionFactory;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

#[UseFactory(InspectionFactory::class)]
final class Inspection extends Model implements Auditable
{
    use AuditsChanges;
    use BelongsToOriginSemester;

    public const SEMESTER_DATE = 'inspection_date';

    use HasFactory;

    protected $fillable = [
        'inspectable_id',
        'inspectable_type',
        'state',
        'status',
        'inspection_date',
        'description',
        'type',
        'user_id',
    ];

    protected $casts = [
        'inspection_date' => 'date',
        'state' => ConservationState::class,
        'status' => BarrierStatus::class,
        'type' => InspectionType::class,
    ];

    public static function auditType(): string
    {
        return 'inspection';
    }

    public static function auditLabel(): string
    {
        return 'Inspeção';
    }

    public static function auditedFields(): array
    {
        return [
            'semester_id' => AuditedField::reference('Semestre de origem', Semester::class, 'label'),
            'inspectable_type' => AuditedField::enum('Tipo do Item Inspecionado', valueLabels: [
                'item' => 'Item',
                'assistive_technology' => 'Tecnologia Assistiva',
                'accessible_educational_material' => 'Material Pedagógico Acessível',
                'barrier' => 'Barreira',
            ]),
            // Polimórfico: sem uma coluna de nome comum, fica o código do item.
            'inspectable_id' => AuditedField::number('Código do Item Inspecionado'),
            'type' => AuditedField::enum('Tipo de Inspeção', InspectionType::class),
            'inspection_date' => AuditedField::date('Data da Inspeção'),
            'state' => AuditedField::enum('Estado de Conservação', ConservationState::class),
            'status' => AuditedField::enum('Status', BarrierStatus::class),
            'description' => AuditedField::richText('Parecer Técnico'),
            'user_id' => AuditedField::reference('Usuário Responsável', User::class),
        ];
    }

    public function auditDescription(): string
    {
        $date = $this->inspection_date?->format('d/m/Y');

        return $date === null ? "a inspeção #{$this->id}" : "a inspeção #{$this->id} de {$date}";
    }

    public static function register(CreateInspectionDTO $data): self
    {
        return new self([
            'state' => $data->state,
            'status' => $data->status,
            'inspection_date' => $data->date,
            'description' => $data->description,
            'type' => $data->type,
            'user_id' => $data->registeredBy,
        ]);
    }

    public function inspectable(): MorphTo
    {
        return $this->morphTo();
    }

    public function evidences(): HasMany
    {
        return $this->hasMany(InspectionEvidence::class, 'inspection_id');
    }

    public function registeredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
