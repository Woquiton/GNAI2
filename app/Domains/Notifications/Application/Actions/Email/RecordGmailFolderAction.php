<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Application\Actions\Email;

use App\Domains\Notifications\Domain\DTOs\GmailMessageLocationDTO;
use App\Domains\Notifications\Domain\Models\EmailDelivery;

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
