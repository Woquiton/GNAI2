<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Domain\Models;

use App\Domains\Audit\Domain\Contracts\Auditable;
use App\Domains\Audit\Domain\ValueObjects\AuditedField;
use App\Domains\Audit\Infrastructure\Eloquent\AuditsChanges;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class SupportRequestAttachment extends Model implements Auditable
{
    use AuditsChanges;

    protected $guarded = ['id'];

    public static function auditType(): string
    {
        return 'support_request_attachment';
    }

    public static function auditLabel(): string
    {
        return 'Anexo de solicitação de atendimento';
    }

    public function auditDescription(): string
    {
        return 'o anexo '.$this->original_name;
    }

    public static function auditedFields(): array
    {
        return [
            'support_request_id' => AuditedField::reference('Solicitação', SupportRequest::class, 'id'),
            'original_name' => AuditedField::text('Nome do arquivo'),
        ];
    }

    public function supportRequest(): BelongsTo
    {
        return $this->belongsTo(SupportRequest::class);
    }
}
