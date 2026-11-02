<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Domain\Models;

use App\Domains\Audit\Domain\Contracts\Auditable;
use App\Domains\Audit\Domain\ValueObjects\AuditedField;
use App\Domains\Audit\Infrastructure\Eloquent\AuditsChanges;
use App\Domains\Auth\Domain\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class CaseStudyContribution extends Model implements Auditable
{
    use AuditsChanges;

    /** Papel da contribuição automática registrada ao criar o Estudo de Caso. */
    public const CREATOR_ROLE = 'Criador';

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

    public static function auditType(): string
    {
        return 'case_study_contribution';
    }

    public static function auditLabel(): string
    {
        return 'Contribuição do Estudo de Caso';
    }

    public static function auditedFields(): array
    {
        return [
            'case_study_id' => AuditedField::number('ID do Estudo de Caso'),
            'author_id' => AuditedField::reference('Autor', User::class),
            'role' => AuditedField::text('Papel'),
            'content' => AuditedField::text('Contribuição'),
        ];
    }

    public function auditDescription(): string
    {
        return "a contribuição #{$this->getKey()} do Estudo de Caso #{$this->case_study_id}";
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
