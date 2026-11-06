<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Notifications\Email;

use App\Domains\Domain\DTOs\Notifications\GmailMessageLocationDTO;
use App\Domains\Domain\Models\Notifications\EmailDelivery;

final readonly class RecordGmailFolderAction
{
    public function execute(EmailDelivery $email, GmailMessageLocationDTO $location, string $accountHash): void
    {
        $email->update([
            'gmail_account_hash' => $accountHash,
            'gmail_message_id' => $location->messageId,
            'gmail_folder' => $location->folder,
            'gmail_synced_at' => now(),
        ]);
    }
}
