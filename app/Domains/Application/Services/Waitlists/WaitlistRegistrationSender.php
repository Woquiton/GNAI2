<?php

declare(strict_types=1);

namespace App\Domains\Application\Services\Waitlists;

use App\Domains\Domain\Models\Institutions\Institution;
use App\Domains\Application\Actions\Notifications\Email\QueueEmailAction;
use App\Domains\Domain\DTOs\Notifications\EmailMessageDTO;
use App\Domains\Domain\Models\Waitlists\Waitlist;
use Illuminate\Support\Facades\Log;
use Throwable;

/** Confirma a inscrição usando o mesmo motor e o mesmo modelo visual dos empréstimos. */
final readonly class WaitlistRegistrationSender
{
    public function __construct(private QueueEmailAction $queueEmail) {}

    public function send(Waitlist $waitlist): void
    {
        try {
            $waitlist->loadMissing(['waitlistable', 'student.person', 'professional.person', 'user']);
            $person = $waitlist->student?->person ?? $waitlist->professional?->person;
            $rows = [
                ['label' => 'Beneficiário', 'value' => $person?->name ?? 'Beneficiário'],
                ['label' => 'Item solicitado', 'value' => $waitlist->waitlistable?->name ?? 'Recurso'],
                [
                    'label' => 'Tipo do item',
                    'value' => $waitlist->waitlistable?->item_type?->label() ?? 'Não informado',
                ],
            ];
            if ($waitlist->waitlistable?->asset_code) {
                $rows[] = ['label' => 'Patrimônio', 'value' => $waitlist->waitlistable->asset_code];
            }
            $rows[] = [
                'label' => 'Data da solicitação',
                'value' => $waitlist->requested_at?->format('d/m/Y H:i') ?? 'Não informada',
            ];
            $rows[] = ['label' => 'Registrado por', 'value' => $waitlist->user?->name ?? 'Equipe do núcleo'];
            $rows[] = [
                'label' => 'Situação no registro',
                'value' => $waitlist->status?->label() ?? 'Em Espera',
                'highlight' => true,
            ];

            $this->queueEmail->execute(new EmailMessageDTO(
                contextType: 'waitlist',
                contextId: (int) $waitlist->getKey(),
                purpose: 'waitlist_registered',
                deduplicationKey: 'waitlist-registered:'.$waitlist->getKey(),
                recipientEmail: $person?->email,
                recipientName: $person?->name,
                subject: 'Inscrição na fila de espera #'.$waitlist->getKey().' confirmada - Gnai',
                view: 'emails.notifications.summary',
                textView: 'emails.notifications.summary-text',
                payload: [
                    'heading' => 'Inscrição na fila de espera confirmada',
                    'beneficiaryName' => $person?->name ?? 'Beneficiário',
                    'intro' => 'Você foi registrado na fila de espera do item abaixo.',
                    'institutionName' => Institution::query()->first()?->name ?? 'Gnai',
                    'reference' => 'Fila de espera #'.$waitlist->getKey(),
                    'rows' => $rows,
                    'outro' => 'Esta confirmação registra sua entrada na fila de espera. Ela não representa um empréstimo nem garante uma data de retirada. A equipe avisará quando o item estiver disponível. Se não reconhecer esta solicitação, entre em contato com o núcleo.',
                ],
            ));
        } catch (Throwable $exception) {
            Log::warning('Não foi possível preparar a confirmação de inscrição na fila de espera.', [
                'waitlist_id' => $waitlist->getKey(),
                'exception' => $exception,
            ]);
        }
    }
}
