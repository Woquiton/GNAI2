<?php

declare(strict_types=1);

namespace App\Application\Services\Loans;

use App\Domain\Models\Institution;
use App\Domain\Models\Loan;
use App\Domains\Notifications\Application\Actions\Email\QueueEmailAction;
use App\Domains\Notifications\Domain\DTOs\EmailMessageDTO;
use Illuminate\Support\Facades\Log;
use Throwable;

/** O módulo fornece apenas o conteúdo; fila, envio e rastreamento são compartilhados. */
final readonly class LoanConfirmationSender
{
    public function __construct(private QueueEmailAction $queueEmail) {}

    public function send(Loan $loan): void
    {
        try {
            $loan->loadMissing(['loanable', 'student.person', 'professional.person', 'user']);
            $person = $loan->student?->person ?? $loan->professional?->person;
            $beneficiaryName = $person?->name ?? 'Beneficiário';
            $rows = [
                ['label' => 'Beneficiário', 'value' => $beneficiaryName],
                ['label' => 'Item', 'value' => $loan->loanable?->name ?? 'Item não informado'],
                ['label' => 'Tipo', 'value' => $loan->loanableType()->label()],
            ];
            if ($loan->loanable?->asset_code) {
                $rows[] = ['label' => 'Patrimônio', 'value' => $loan->loanable->asset_code];
            }
            $rows[] = ['label' => 'Data de saída', 'value' => $loan->loan_date->format('d/m/Y H:i')];
            $rows[] = ['label' => 'Registrado por', 'value' => $loan->user?->name ?? 'Equipe do núcleo'];
            $rows[] = [
                'label' => 'Previsão de devolução',
                'value' => $loan->due_date->format('d/m/Y'),
                'highlight' => true,
            ];

            $this->queueEmail->execute(new EmailMessageDTO(
                contextType: 'loan',
                contextId: (int) $loan->getKey(),
                purpose: 'loan_confirmation',
                deduplicationKey: 'loan-confirmation:'.$loan->getKey(),
                recipientEmail: $person?->email,
                recipientName: $person?->name,
                subject: 'Empréstimo #'.$loan->getKey().' confirmado - Gnai',
                view: 'emails.notifications.summary',
                textView: 'emails.notifications.summary-text',
                payload: [
                    'heading' => 'Empréstimo confirmado',
                    'beneficiaryName' => $beneficiaryName,
                    'intro' => 'Um empréstimo foi efetivado em seu nome.',
                    'institutionName' => Institution::query()->first()?->name ?? 'Gnai',
                    'reference' => 'Empréstimo #'.$loan->getKey(),
                    'rows' => $rows,
                    'outro' => 'Confira os dados e devolva o item até a data prevista. Se não reconhecer este empréstimo ou precisar de orientação, entre em contato com a equipe do núcleo.',
                ],
            ));
        } catch (Throwable $exception) {
            Log::warning('Não foi possível preparar a confirmação do empréstimo.', [
                'loan_id' => $loan->getKey(),
                'exception' => $exception,
            ]);
        }
    }
}
