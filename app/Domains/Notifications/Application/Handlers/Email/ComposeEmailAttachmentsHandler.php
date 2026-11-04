<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Application\Handlers\Email;

use App\Domains\Notifications\Application\Data\Email\ComposeEmailData;
use App\Domains\Notifications\Domain\DTOs\EmailAttachmentChangesDTO;
use App\Domains\Notifications\Domain\Models\EmailDelivery;
use App\Domains\Notifications\Infrastructure\Mail\EmailAttachmentStorage;
use Illuminate\Validation\ValidationException;
use Throwable;

final readonly class ComposeEmailAttachmentsHandler
{
    public function __construct(private EmailAttachmentStorage $storage) {}

    public function prepare(
        ComposeEmailData $data,
        EmailDelivery $email,
        bool $initializing,
        array $forwardAttachments,
    ): EmailAttachmentChangesDTO {
        $created = [];
        try {
            $existing = $email->payload['attachments'] ?? [];
            $removedIndexes = array_map('intval', $data->removedAttachments);
            if ($initializing && $forwardAttachments !== []) {
                $forward = array_filter(
                    $forwardAttachments,
                    fn (array $file, int $index): bool => ! in_array($index, $removedIndexes, true),
                    ARRAY_FILTER_USE_BOTH,
                );
                $existing = $this->storage->copy($forward, $email->id);
                $created = $existing;
                $removedIndexes = [];
            }
            $removed = array_values(array_filter(
                $existing,
                fn (array $file, int $index): bool => in_array($index, $removedIndexes, true),
                ARRAY_FILTER_USE_BOTH,
            ));
            $retained = array_values(array_filter(
                $existing,
                fn (array $file, int $index): bool => ! in_array($index, $removedIndexes, true),
                ARRAY_FILTER_USE_BOTH,
            ));
            if (count($retained) + count($data->attachments) > 5) {
                throw ValidationException::withMessages(['attachments' => 'Mantenha no máximo cinco anexos.']);
            }
            $uploaded = $this->storage->store($data->attachments, $email->id);

            return new EmailAttachmentChangesDTO(
                attachments: [...$retained, ...$uploaded],
                created: [...$created, ...$uploaded],
                removed: $removed,
            );
        } catch (Throwable $exception) {
            $this->storage->delete($created);

            throw $exception;
        }
    }
}
