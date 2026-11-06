<?php

declare(strict_types=1);

namespace App\Domains\UI\Presenters\Notifications;

use App\Domains\Application\Data\Notifications\Email\UpdateMailboxData;
use App\Domains\Domain\DTOs\Notifications\MailboxUpdateResultDTO;
use App\Domains\Domain\Enums\Notifications\EmailMailboxOperation;

final readonly class EmailMailboxUpdatePresenter
{
    /** @return array{tone: string, message: string} */
    public function present(UpdateMailboxData $data, MailboxUpdateResultDTO $result): array
    {
        $summary = $data->operation->movesFolder()
            ? $result->gmail.' mensagem(ns) sincronizada(s) com o Gmail; '.$result->local.' atualizada(s) somente no Gnai.'
            : $result->local.' mensagem(ns) atualizada(s).';
        if ($result->failed > 0) {
            return [
                'tone' => $result->completed() > 0 ? 'warning' : 'error',
                'message' => $summary.' '.$result->failed.' não concluída(s). '.$result->error,
            ];
        }
        $single = $result->local === 1;
        $message = match ($data->operation) {
            EmailMailboxOperation::STAR => $single ? 'Mensagem adicionada aos favoritos.' : 'Mensagens adicionadas aos favoritos.',
            EmailMailboxOperation::UNSTAR => $single ? 'Mensagem removida dos favoritos.' : 'Mensagens removidas dos favoritos.',
            EmailMailboxOperation::READ => $single ? 'Mensagem marcada como lida.' : 'Mensagens marcadas como lidas.',
            EmailMailboxOperation::UNREAD => $single ? 'Mensagem marcada como não lida.' : 'Mensagens marcadas como não lidas.',
            EmailMailboxOperation::LABEL => $data->label === null ? 'Marcador removido.' : 'Marcador aplicado.',
            default => $summary,
        };

        return [
            'tone' => 'success',
            'message' => $result->completed() > 0 ? $message : 'Nenhuma mensagem foi alterada.',
        ];
    }
}
