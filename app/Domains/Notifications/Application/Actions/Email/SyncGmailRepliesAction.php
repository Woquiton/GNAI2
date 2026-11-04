<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Application\Actions\Email;

use App\Domains\Notifications\Infrastructure\Mail\GmailMailbox;
use App\Domains\Settings\Application\Queries\GetMailSettingsQuery;
use Illuminate\Support\Facades\Cache;

final readonly class SyncGmailRepliesAction
{
    public function __construct(
        private GetMailSettingsQuery $settings,
        private GmailMailbox $mailbox,
        private ImportGmailReplyAction $import,
    ) {}

    public function execute(): ?int
    {
        $count = Cache::lock('gmail-replies:sync', 180)->get(function (): int {
            $settings = $this->settings->execute();
            if ($settings === null || ! $settings->receivesGmailReplies()) {
                return 0;
            }
            $connection = $this->mailbox->open($settings, $settings->gmailInboxFolder);
            try {
                $validity = $this->mailbox->uidValidity($connection, $settings->gmailInboxFolder);
                $accountHash = hash('sha256', strtolower((string) $settings->username));
                $cursorKey = 'gmail-replies:cursor:'.hash('sha256', $accountHash.'|'.$settings->gmailInboxFolder.'|'.$validity);
                $after = (int) Cache::get($cursorKey, 0);
                $uids = $this->mailbox->messageUids($connection, $after, max(1, (int) config('email_inbox.lookback_days')));
                $count = 0;
                $deadline = microtime(true) + 45;
                foreach (array_slice($uids, 0, max(1, (int) config('email_inbox.batch_size'))) as $uid) {
                    if (microtime(true) >= $deadline) {
                        break;
                    }
                    $headers = $this->mailbox->messageHeaders($connection, $uid);
                    if ($this->import->execute($connection, $uid, $headers, $accountHash, $validity.':'.$uid, $deadline)) {
                        $count++;
                    }
                    Cache::forever($cursorKey, $uid);
                }

                return $count;
            } finally {
                $this->mailbox->close($connection);
            }
        });

        return $count === false ? null : $count;
    }
}
