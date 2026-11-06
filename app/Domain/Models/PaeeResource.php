<?php

declare(strict_types=1);

namespace App\Domain\Models;

use App\Domains\Audit\Domain\Contracts\Auditable;
use App\Domains\Audit\Domain\ValueObjects\AuditedField;
use App\Domains\Audit\Infrastructure\Eloquent\AuditsChanges;
use App\Shared\Domain\Support\AeeLabels;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class PaeeResource extends Model implements Auditable
{
    use AuditsChanges;

    protected $table = 'paee_resources';

    protected $fillable = [
        'paee_id',
        'description',
        'acquisition_type',
        'assistive_technology_id',
    ];

    public static function auditType(): string
    {
        return 'paee_resource';
    }

    public static function auditLabel(): string
    {
        return 'Recurso do PAEE';
    }

    public static function auditedFields(): array
    {
        return [
            'paee_id' => AuditedField::number('ID do PAEE'),
            'description' => AuditedField::text('Descrição'),
            'acquisition_type' => AuditedField::enum('Tipo de aquisição', valueLabels: AeeLabels::ACQUISITION_TYPES),
            'assistive_technology_id' => AuditedField::reference('Tecnologia Assistiva', Item::class),
        ];
    }

    public function auditDescription(): string
    {
        return "o recurso #{$this->getKey()} do PAEE #{$this->paee_id}";
    }

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
