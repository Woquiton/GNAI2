<?php

declare(strict_types=1);

namespace App\Domains\Domain\Models\Teachers;

use App\Domains\Domain\Contracts\Audit\Auditable;
use App\Domains\Domain\ValueObjects\Audit\AuditedField;
use App\Domains\Infrastructure\Eloquent\Audit\AuditsChanges;
use App\Domains\Domain\Models\Auth\Permission;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/** Modelo preservado para consultar registros históricos da matriz descontinuada. */
final class TeacherGlobalPermission extends Model implements Auditable
{
    use AuditsChanges;

    protected $table = 'teacher_global_permissions';

    protected $fillable = [
        'permission_id',
    ];

    public static function auditType(): string
    {
        return 'teacher_global_permission';
    }

    public static function auditLabel(): string
    {
        return 'Permissão Global de Professores';
    }

    public static function auditedFields(): array
    {
        return [
            'permission_id' => AuditedField::reference('Permissão', Permission::class),
        ];
    }

    public function auditDescription(): string
    {
        return 'a permissão global de professores '.($this->permission?->name ?? "#{$this->permission_id}");
    }

    public function permission(): BelongsTo
    {
        return $this->belongsTo(Permission::class);
    }
}
