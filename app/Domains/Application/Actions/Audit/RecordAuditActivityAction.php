<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Audit;

use App\Domains\Domain\Enums\Audit\AuditEvent;
use App\Domains\Domain\Models\Audit\AuditRecord;
use App\Domains\Domain\Models\Auth\User;
use App\Domains\Infrastructure\Audit\AuditContext;

/** Eventos sem mudanças de campos. Nunca recebe o payload da requisição. */
final readonly class RecordAuditActivityAction
{
    public function __construct(private AuditContext $context) {}

    /** @param  array<string, mixed>  $details */
    public function execute(
        AuditEvent $event,
        string $type,
        string $id,
        string $description,
        ?User $actor,
        ?User $impersonator = null,
        array $details = [],
    ): void {
        $record = AuditRecord::query()->create([
            'operation' => $this->context->operation(),
            'actor_id' => $actor?->getKey(),
            'actor_name' => $actor?->name,
            'impersonator_id' => $impersonator?->getKey(),
            'impersonator_name' => $impersonator?->name,
            'event' => $event,
            'entity_type' => $type,
            'entity_id' => $id,
            'entity_description' => $description,
            'changes' => [],
            'context' => [...$this->context->requestData(), ...$details],
        ]);

        $this->context->rememberRecord('activity:'.$record->getKey(), $record);
    }
}
