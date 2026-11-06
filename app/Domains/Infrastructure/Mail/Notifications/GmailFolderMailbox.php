<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Mail\Notifications;

use App\Domains\Domain\DTOs\Notifications\GmailMessageLocationDTO;
use App\Domains\Domain\Enums\Notifications\EmailMailboxOperation;
use App\Domains\Domain\Enums\Notifications\EmailPurpose;
use App\Domains\Domain\Exceptions\Notifications\EmailMailboxUnavailable;
use App\Domains\Domain\Models\Notifications\EmailDelivery;

final readonly class GmailFolderMailbox
{
    /** Pastas identificadas pelas flags oficiais, sem depender do idioma da conta. */
    public function folders(GmailImapClient $client): array
    {
        $response = $client->request(null, 'LIST "" "*"');
        $folders = ['inbox' => 'INBOX'];
        preg_match_all('/^\* LIST \(([^)]*)\) (?:"(?:[^"\\\\]|\\\\.)*"|NIL) ("(?:[^"\\\\]|\\\\.)*"|[^\r\n ]+)\r?$/mi', $response, $matches, PREG_SET_ORDER);
        foreach ($matches as $match) {
            $name = $this->unquote($match[2]);
            $flags = preg_split('/\s+/', strtolower($match[1]));
            foreach (['all' => '\\all', 'spam' => '\\junk', 'trash' => '\\trash', 'sent' => '\\sent'] as $key => $flag) {
                if (in_array($flag, $flags, true)) {
                    $folders[$key] = $name;
                }
            }
        }
        if (! isset($folders['all'], $folders['spam'], $folders['trash'])) {
            throw new EmailMailboxUnavailable('Não foi possível identificar Todas as mensagens, Spam e Lixeira do Gmail. Confira se essas pastas estão disponíveis por IMAP.');
        }

        return $folders;
    }

    public function find(GmailImapClient $client, EmailDelivery $email, array $folders): ?GmailMessageLocationDTO
    {
        $messageId = trim((string) $email->message_id, "<> \t\r\n");
        if ($email->gmail_message_id !== null) {
            if (! preg_match('/^[0-9]{1,20}$/D', $email->gmail_message_id)) {
                throw new EmailMailboxUnavailable('O vínculo da mensagem com o Gmail é inválido.');
            }
            $criteria = 'X-GM-MSGID '.$email->gmail_message_id;
        } elseif ($messageId !== '') {
            $criteria = 'HEADER Message-ID '.$client->quote('<'.$messageId.'>');
        } else {
            return null;
        }
        $preferred = match ($email->gmail_folder) {
            'spam' => $folders['spam'], 'trash' => $folders['trash'], default => $folders['all'],
        };
        foreach (array_unique([$preferred, $folders['all'], $folders['spam'], $folders['trash'], $folders['inbox']]) as $mailbox) {
            $response = $client->request($mailbox, 'UID SEARCH '.$criteria);
            if (! preg_match('/^\* SEARCH(?: ([0-9 ]+))?\r?$/m', $response, $match)) {
                throw new EmailMailboxUnavailable('O Gmail não retornou uma pesquisa de mensagens válida.');
            }
            $uids = array_values(array_filter(explode(' ', trim($match[1] ?? ''))));
            if (count($uids) > 1) {
                throw new EmailMailboxUnavailable('Mais de uma mensagem corresponde a este registro no Gmail. A pasta não foi alterada.');
            }
            if ($uids === []) {
                continue;
            }
            $uid = (int) $uids[0];
            $metadata = $client->request($mailbox, 'UID FETCH '.$uid.' (X-GM-MSGID X-GM-LABELS)');
            if (! preg_match('/\bX-GM-MSGID ([0-9]{1,20})\b/', $metadata, $id)
                || ! preg_match('/\bX-GM-LABELS \(((?:"(?:[^"\\\\]|\\\\.)*"|[^()"])*?)\)/s', $metadata, $labels)) {
                throw new EmailMailboxUnavailable('Não foi possível conferir os marcadores da mensagem no Gmail.');
            }
            preg_match_all('/"(?:[^"\\\\]|\\\\.)*"|[^\s()"]+/', $labels[1], $tokens);
            $values = array_map($this->unquote(...), $tokens[0]);
            // O Gmail pode omitir de X-GM-LABELS a própria pasta selecionada.
            // A pesquisa por UID nessa pasta já confirma que a mensagem pertence a ela.
            $mailboxLabel = match ($mailbox) {
                $folders['inbox'] => '\\Inbox',
                $folders['spam'] => '\\Spam',
                $folders['trash'] => '\\Trash',
                default => null,
            };
            if ($mailboxLabel !== null && ! in_array(strtolower($mailboxLabel), array_map('strtolower', $values), true)) {
                $values[] = $mailboxLabel;
            }
            $normalized = array_map('strtolower', $values);
            $folder = match (true) {
                $mailbox === $folders['trash'], in_array('\\trash', $normalized, true) => 'trash',
                $mailbox === $folders['spam'], in_array('\\spam', $normalized, true) => 'spam',
                in_array('\\inbox', $normalized, true) => null,
                $email->purpose === EmailPurpose::INCOMING->value, $email->gmail_folder === 'archive' => 'archive',
                default => null,
            };

            return new GmailMessageLocationDTO($id[1], $mailbox, $uid, $values, $folder);
        }

        return null;
    }

    public function move(
        GmailImapClient $client,
        EmailDelivery $email,
        array $folders,
        EmailMailboxOperation $operation,
    ): GmailMessageLocationDTO {
        $message = $this->find($client, $email, $folders);
        if ($message === null) {
            throw new EmailMailboxUnavailable('A mensagem não foi encontrada nesta conta Gmail. A pasta local foi preservada.');
        }
        // O identificador do Gmail permanece estável quando o UID muda entre as pastas.
        $email->gmail_message_id = $message->messageId;
        $target = match ($operation) {
            EmailMailboxOperation::SPAM => '\\Spam', EmailMailboxOperation::TRASH => '\\Trash',
            EmailMailboxOperation::RESTORE => $email->purpose === EmailPurpose::INCOMING->value ? '\\Inbox' : null,
            default => null,
        };
        if ($target !== null && ! in_array(strtolower($target), array_map('strtolower', $message->labels), true)) {
            $client->request($message->mailbox, 'UID STORE '.$message->uid.' +X-GM-LABELS ('.$target.')');
            $message = $this->find($client, $email, $folders)
                ?? throw new EmailMailboxUnavailable('O Gmail ainda não confirmou o destino da mensagem. Use Sincronizar pastas antes de tentar novamente.');
        }
        $remove = array_values(array_filter(['\\Inbox', '\\Spam', '\\Trash'],
            fn (string $label): bool => $label !== $target && in_array(strtolower($label), array_map('strtolower', $message->labels), true)));
        if ($remove !== []) {
            $client->request($message->mailbox, 'UID STORE '.$message->uid.' -X-GM-LABELS ('.implode(' ', $remove).')');
        }
        $confirmed = $this->find($client, $email, $folders)
            ?? throw new EmailMailboxUnavailable('A mudança ainda não foi confirmada pelo Gmail. Use Sincronizar pastas para conferir a pasta atual.');
        $normalized = array_map('strtolower', $confirmed->labels);
        if (($target !== null && ! in_array(strtolower($target), $normalized, true))
            || array_intersect(array_map('strtolower', $remove), $normalized) !== []) {
            throw new EmailMailboxUnavailable('O Gmail não confirmou todos os marcadores da operação. Use Sincronizar pastas para conferir o resultado.');
        }

        return new GmailMessageLocationDTO($confirmed->messageId, $confirmed->mailbox, $confirmed->uid,
            $confirmed->labels, $operation === EmailMailboxOperation::RESTORE ? null : $operation->value);
    }

    private function unquote(string $value): string
    {
        return str_starts_with($value, '"') ? preg_replace('/\\\\(["\\\\])/', '$1', substr($value, 1, -1)) : $value;
    }
}
