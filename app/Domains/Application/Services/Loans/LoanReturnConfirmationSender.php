<?php

declare(strict_types=1);

namespace App\Domains\Application\Services\Loans;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\Institutions\Institution;
use App\Domains\Domain\Models\Loans\Loan;
use App\Domains\Application\Actions\Notifications\Email\QueueEmailAction;
use App\Domains\Domain\DTOs\Notifications\EmailMessageDTO;
use Illuminate\Support\Facades\Log;
use Throwable;

final readonly class LoanReturnConfirmationSender
{
    public function __construct(private QueueEmailAction $queueEmail) {}

    public function send(Loan $loan, User $returnedBy): void
    {
        if ($loan->student_id === null || ! $loan->isReturned()) {
            return;
        }

        try {
            $loan->loadMissing(['loanable', 'student.person']);
            $person = $loan->student?->person;
            $rows = [
                ['label' => 'Aluno', 'value' => $person?->name ?? 'Aluno'],
                ['label' => 'Item devolvido', 'value' => $loan->loanable?->name ?? 'Item não informado'],
                ['label' => 'Tipo do item', 'value' => $loan->loanableType()->label()],
            ];
            if ($loan->loanable?->asset_code) {
                $rows[] = ['label' => 'Patrimônio', 'value' => $loan->loanable->asset_code];
            }
            $rows[] = ['label' => 'Data de saída', 'value' => $loan->loan_date->format('d/m/Y H:i')];
            $rows[] = ['label' => 'Previsão de devolução', 'value' => $loan->due_date->format('d/m/Y')];
            $rows[] = [
                'label' => 'Devolução registrada em',
                'value' => $loan->return_date?->format('d/m/Y H:i') ?? 'Não informada',
                'highlight' => true,
            ];
            $rows[] = ['label' => 'Situação da devolução', 'value' => $loan->status->label()];
            $rows[] = ['label' => 'Devolução registrada por', 'value' => $returnedBy->name];

            $this->queueEmail->execute(new EmailMessageDTO(
                contextType: 'loan',
                contextId: (int) $loan->getKey(),
                purpose: 'loan_returned',
                deduplicationKey: 'loan-returned:'.$loan->getKey(),
                recipientEmail: $person?->email,
                recipientName: $person?->name,
                subject: 'Devolução do empréstimo #'.$loan->getKey().' confirmada - Gnai',
                view: 'emails.notifications.summary',
                textView: 'emails.notifications.summary-text',
                payload: [
                    'heading' => 'Devolução confirmada',
                    'beneficiaryName' => $person?->name ?? 'Aluno',
                    'intro' => 'A devolução do item emprestado em seu nome foi registrada.',
                    'institutionName' => Institution::query()->first()?->name ?? 'Gnai',
                    'reference' => 'Empréstimo #'.$loan->getKey(),
                    'rows' => $rows,
                    'outro' => 'Guarde esta mensagem como confirmação do registro da devolução. Se não reconhecer os dados ou precisar de orientação, entre em contato com a equipe do núcleo.',
                ],
            ));
        } catch (Throwable $exception) {
            Log::warning('Não foi possível preparar a confirmação de devolução do empréstimo.', [
                'loan_id' => $loan->getKey(),
                'exception' => $exception,
            ]);
        }
    }
}
