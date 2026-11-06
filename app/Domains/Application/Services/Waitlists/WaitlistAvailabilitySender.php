<?php

declare(strict_types=1);

namespace App\Domains\Application\Services\Waitlists;

use App\Domains\Domain\Models\Institutions\Institution;
use App\Domains\Application\Actions\Notifications\Email\QueueEmailAction;
use App\Domains\Domain\DTOs\Notifications\EmailMessageDTO;
use App\Domains\Domain\Models\Waitlists\Waitlist;
use Illuminate\Support\Facades\Log;
use Throwable;

final readonly class WaitlistAvailabilitySender
{
    public function __construct(private QueueEmailAction $queueEmail) {}

    public function send(Waitlist $waitlist): void
    {
        try {
            $waitlist->loadMissing(['waitlistable', 'student.person', 'professional.person']);
            $person = $waitlist->student?->person ?? $waitlist->professional?->person;
            $rows = [
                ['label' => 'Item', 'value' => $waitlist->waitlistable?->name ?? 'Recurso'],
                ['label' => 'Disponibilidade informada em', 'value' => now()->format('d/m/Y H:i'), 'highlight' => true],
            ];
            $this->queueEmail->execute(new EmailMessageDTO(
                contextType: 'waitlist',
                contextId: (int) $waitlist->getKey(),
                purpose: 'waitlist_available',
                deduplicationKey: 'waitlist-available:'.$waitlist->getKey(),
                recipientEmail: $person?->email,
                recipientName: $person?->name,
                subject: 'Item disponível na fila de espera - Gnai',
                view: 'emails.notifications.summary',
                textView: 'emails.notifications.summary-text',
                payload: [
                    'heading' => 'Item disponível',
                    'beneficiaryName' => $person?->name ?? 'Beneficiário',
                    'intro' => 'O item que você aguarda na fila de espera está disponível.',
                    'institutionName' => Institution::query()->first()?->name ?? 'Gnai',
                    'reference' => 'Fila de espera #'.$waitlist->getKey(),
                    'rows' => $rows,
                    'outro' => 'Entre em contato com a equipe do núcleo para verificar a retirada. Este aviso não registra nem garante um empréstimo; a equipe precisa confirmar a disponibilidade e efetivar a saída.',
                ],
            ));
        } catch (Throwable $exception) {
            Log::warning('Não foi possível preparar o e-mail de disponibilidade da fila de espera.', [
                'waitlist_id' => $waitlist->getKey(), 'exception' => $exception,
            ]);
        }
    }
}
