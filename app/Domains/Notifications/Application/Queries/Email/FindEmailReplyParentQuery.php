<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Application\Queries\Email;

use App\Domains\Notifications\Domain\Enums\EmailDeliveryStatus;
use App\Domains\Notifications\Domain\Enums\EmailPurpose;
use App\Domains\Notifications\Domain\Models\EmailDelivery;

final readonly class FindEmailReplyParentQuery
{
    /** @param list<string> $messageIds Ordem de preferência: In-Reply-To e References do mais recente ao mais antigo. */
    public function execute(array $messageIds): ?EmailDelivery
    {
        if ($messageIds === []) {
            return null;
        }
        $parents = EmailDelivery::query()
            ->whereIn('message_id', [...$messageIds, ...array_map(fn (string $id): string => '<'.$id.'>', $messageIds)])
            ->whereIn('status', [
                EmailDeliveryStatus::SENT->value, EmailDeliveryStatus::BOUNCED->value,
                EmailDeliveryStatus::RECEIVED->value, EmailDeliveryStatus::PROCESSING->value,
                EmailDeliveryStatus::UNCONFIRMED->value,
            ])->get(['id', 'message_id', 'purpose']);
        foreach ($messageIds as $id) {
            $parent = $parents->first(fn (EmailDelivery $candidate): bool => trim($candidate->message_id, '<>') === $id);
            if ($parent === null) {
                continue;
            }
            // Respostas diretas a avisos de autenticação podem citar links pessoais omitidos no histórico.
            return in_array($parent->purpose, [EmailPurpose::PASSWORD_RESET->value, EmailPurpose::TEACHER_ACCESS->value], true)
                ? null : $parent;
        }

        return null;
    }
}
