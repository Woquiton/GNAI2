<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Application\Actions\Email;

use App\Domains\Notifications\Infrastructure\Mail\GmailBounceMailbox;
use App\Domains\Settings\Application\Queries\GetMailSettingsQuery;
use Illuminate\Support\Facades\Cache;

final readonly class ProcessGmailBouncesAction
{
    public function __construct(
        private GetMailSettingsQuery $mailSettings,
        private GmailBounceMailbox $mailbox,
        private RecordEmailBounceAction $recordBounce,
    ) {}

    /** Retorna null quando outra execução já está lendo a caixa. */
    public function execute(): ?int
    {
        $count = Cache::lock('gmail-bounces:process', 600)->get(function (): int {
            $settings = $this->mailSettings->execute();
            if ($settings === null || ! $settings->monitorsGmailBounces()) {
                return 0;
            }

            $connection = $this->mailbox->open($settings);
            try {
                $validity = $this->mailbox->uidValidity($connection, $settings->gmailBouncesFolder);
                $cursorKey = 'gmail-bounces:cursor:'.hash(
                    'sha256',
                    strtolower((string) $settings->username).'|'.$settings->gmailBouncesFolder.'|'.$validity,
                );
                $lastUid = (int) Cache::get($cursorKey, 0);
                $days = max(1, (int) config('email_bounces.lookback_days', 30));
                $batchSize = max(1, (int) config('email_bounces.batch_size', 100));
                $uids = $this->mailbox->reportUids($connection, $lastUid, $days);
                $deadline = microtime(true) + 45;
                $count = 0;

                foreach (array_slice($uids, 0, $batchSize) as $uid) {
                    if (microtime(true) >= $deadline) {
                        break;
                    }
                    foreach ($this->mailbox->readReport($connection, $uid) as $bounce) {
                        if ($this->recordBounce->execute($bounce)) {
                            $count++;
                        }
                    }
                    // Só avançar depois da gravação; falhas retomam o mesmo aviso.
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
