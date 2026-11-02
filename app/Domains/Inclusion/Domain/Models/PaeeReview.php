<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Domain\Models;

use App\Domains\Audit\Domain\Contracts\Auditable;
use App\Domains\Audit\Domain\ValueObjects\AuditedField;
use App\Domains\Audit\Infrastructure\Eloquent\AuditsChanges;
use App\Domains\Auth\Domain\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class PaeeReview extends Model implements Auditable
{
    use AuditsChanges;

    protected $table = 'paee_reviews';

    protected $fillable = [
        'paee_id',
        'reviewed_at',
        'what_changed',
        'why',
        'reviewer_id',
    ];

    protected $casts = [
        'reviewed_at' => 'date',
    ];

    public static function auditType(): string
    {
        return 'paee_review';
    }

    public static function auditLabel(): string
    {
        return 'Revisão do PAEE';
    }

    public static function auditedFields(): array
    {
        return [
            'paee_id' => AuditedField::number('ID do PAEE'),
            'reviewed_at' => AuditedField::date('Data da revisão'),
            'what_changed' => AuditedField::richText('O que mudou'),
            'why' => AuditedField::richText('Por quê'),
            'reviewer_id' => AuditedField::reference('Revisado por', User::class),
        ];
    }

    public function auditDescription(): string
    {
        return "a revisão #{$this->getKey()} do PAEE #{$this->paee_id}";
    }

    public function paee(): BelongsTo
    {
        return $this->belongsTo(Paee::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
