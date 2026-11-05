<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Services\Sessions;

use App\Domains\Inclusion\Domain\Enums\SessionType;
use App\Domains\Inclusion\Domain\Models\Session;
use App\Domains\Notifications\Application\Actions\Email\QueueEmailAction;
use App\Domains\Notifications\Domain\DTOs\EmailMessageDTO;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

final class SessionNotificationSender
{
    public function __construct(private readonly QueueEmailAction $queueEmail) {}

    public function send(Session $session, string $purpose, string $subject, string $text): void
    {
        try {
            $session->loadMissing(['students.person', 'professional.person']);
            $people = $session->students->map(fn ($student) => $student->person);
            $people->push($session->professional?->person);
            $recipients = $people->filter(fn ($person) => $person !== null)
                ->unique(fn ($person) => filled($person->email)
                    ? Str::lower(trim($person->email)) : 'person:'.$person->getKey());
            $eventId = (string) Str::uuid();
            $objective = html_entity_decode(
                trim(strip_tags($session->session_objective ?? '')),
                ENT_QUOTES | ENT_HTML5,
                'UTF-8',
            );

            foreach ($recipients as $person) {
                $email = trim((string) $person->email);
                $recipientKey = $email !== '' ? Str::lower($email) : 'person:'.$person->getKey();
                $this->queueEmail->execute(new EmailMessageDTO(
                    contextType: 'session',
                    contextId: (int) $session->getKey(),
                    purpose: $purpose,
                    deduplicationKey: 'session:'.$eventId.':'.hash('sha256', $recipientKey),
                    recipientEmail: $email,
                    recipientName: $person->name,
                    subject: $subject,
                    view: 'emails.notifications.alert',
                    textView: 'emails.notifications.alert-text',
                    payload: [
                        'heading' => $subject,
                        'greeting' => 'Olá.',
                        'paragraphs' => [$text],
                        'detailsHeading' => 'Detalhes do agendamento',
                        'details' => [
                            ['label' => 'Data', 'value' => $session->session_date->format('d/m/Y')],
                            ['label' => 'Horário', 'value' => $session->start_time.' até '.($session->end_time ?? 'Não definido')],
                            ['label' => 'Local', 'value' => $session->location],
                            ['label' => 'Tipo', 'value' => SessionType::labelFor($session->type)],
                            ['label' => 'Objetivo', 'value' => $objective ?: 'Não informado'],
                        ],
                        'outro' => 'Em caso de dúvidas, entre em contato com a equipe responsável pelo agendamento.',
                    ],
                ));
            }
        } catch (Throwable $exception) {
            Log::warning('Não foi possível preparar os avisos do agendamento. A operação foi preservada.', [
                'session_id' => $session->getKey(),
                'purpose' => $purpose,
                'exception' => $exception,
            ]);
        }
    }
}
