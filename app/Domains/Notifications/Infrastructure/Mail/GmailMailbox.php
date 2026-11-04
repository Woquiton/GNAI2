<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Infrastructure\Mail;

use App\Domains\Notifications\Domain\DTOs\EmailBounceDTO;
use App\Domains\Notifications\Domain\Exceptions\EmailMailboxUnavailable;
use App\Domains\Settings\Domain\ValueObjects\MailSettings;
use IMAP\Connection;

final readonly class GmailMailbox
{
    public function __construct(
        private DeliveryStatusReportParser $parser,
        private EmailHeaderParser $headers,
    ) {}

    public function open(MailSettings $settings, ?string $folder = null): Connection
    {
        if (! extension_loaded('imap')) {
            throw new EmailMailboxUnavailable('A leitura de e-mails do Gmail requer a extensão PHP IMAP.');
        }
        $username = $settings->username;
        $password = $settings->password;
        $folder ??= $settings->gmailBouncesFolder;
        if (! is_string($username) || ! filter_var($username, FILTER_VALIDATE_EMAIL)
            || ! is_string($password) || $password === '' || $folder === ''
            || preg_match('/[{}\r\n]/', $folder)) {
            throw new EmailMailboxUnavailable('Configure a conta Gmail, a senha de app e uma pasta IMAP válida para ler os e-mails.');
        }

        imap_timeout(IMAP_OPENTIMEOUT, 15);
        imap_timeout(IMAP_READTIMEOUT, 20);
        // Host fixo e certificado verificado. Nunca alterar flags ou apagar mensagens da caixa.
        $connection = @imap_open($this->mailboxName($folder), $username, $password, OP_READONLY, 1, [
            'DISABLE_AUTHENTICATOR' => 'GSSAPI',
        ]);
        if ($connection === false) {
            imap_errors();
            imap_alerts();
            throw new EmailMailboxUnavailable('Não foi possível acessar o Gmail por IMAP. Confira a senha de app e as permissões da conta.');
        }

        return $connection;
    }

    public function uidValidity(Connection $connection, string $folder): int
    {
        $status = imap_status($connection, $this->mailboxName($folder), SA_UIDVALIDITY);
        if ($status === false) {
            throw new EmailMailboxUnavailable('Não foi possível identificar a pasta IMAP do Gmail.');
        }

        return $status->uidvalidity;
    }

    /** @return list<int> */
    public function messageUids(Connection $connection, int $afterUid, int $lookbackDays): array
    {
        $since = now()->subDays($lookbackDays)->format('d-M-Y');
        // A extensão PHP IMAP aceita o subconjunto IMAP2 de pesquisa; cabeçalhos são conferidos na leitura.
        $criteria = 'SINCE "'.$since.'"';
        $uids = imap_search($connection, $criteria, SE_UID) ?: [];
        if (imap_errors() !== false) {
            throw new EmailMailboxUnavailable('Não foi possível pesquisar as mensagens recebidas no Gmail.');
        }
        $uids = array_values(array_filter($uids, static fn (int $uid): bool => $uid > $afterUid));
        sort($uids, SORT_NUMERIC);

        return $uids;
    }

    public function messageHeaders(Connection $connection, int $uid): array
    {
        $headers = imap_fetchheader($connection, $uid, FT_UID);
        if ($headers === false) {
            throw new EmailMailboxUnavailable('Não foi possível ler os cabeçalhos de uma resposta do Gmail.');
        }

        return $this->headers->fields($headers);
    }

    public function close(Connection $connection): void
    {
        imap_close($connection);
        imap_errors();
        imap_alerts();
    }

    /** @return list<EmailBounceDTO> */
    public function readReport(Connection $connection, int $uid): array
    {
        $headers = imap_fetchheader($connection, $uid, FT_UID);
        $structure = imap_fetchstructure($connection, $uid, FT_UID);
        if ($headers === false || $structure === false) {
            throw new EmailMailboxUnavailable('Não foi possível ler um aviso de entrega do Gmail.');
        }
        $fields = $this->headers->fields($headers);
        $senders = imap_rfc822_parse_adrlist($fields['from'] ?? '', 'invalid');
        $sender = is_array($senders) && count($senders) === 1
            ? strtolower(($senders[0]->mailbox ?? '').'@'.($senders[0]->host ?? '')) : '';
        if (! in_array($sender, ['mailer-daemon@googlemail.com', 'mailer-daemon@gmail.com'], true)
            || $structure->type !== 1 || strcasecmp($structure->subtype ?? '', 'REPORT') !== 0) {
            return [];
        }
        $parameters = [];
        foreach ($structure->parameters ?? [] as $parameter) {
            $parameters[strtolower($parameter->attribute)] = strtolower($parameter->value);
        }
        if (($parameters['report-type'] ?? '') !== 'delivery-status') {
            return [];
        }
        $report = '';
        $originalHeaders = '';
        foreach ($structure->parts ?? [] as $index => $part) {
            $section = (string) ($index + 1);
            $subtype = strtolower($part->subtype ?? '');
            if ($part->type === 2 && $subtype === 'delivery-status') {
                $report = $this->readPart($connection, $uid, $section, $part);
            } elseif ($part->type === 2 && $subtype === 'rfc822') {
                // Apenas os cabeçalhos anexados; o corpo original pode conter dados sensíveis.
                $originalHeaders = $this->fetchPart($connection, $uid, $section.'.0');
            } elseif ($part->type === 0 && $subtype === 'rfc822-headers') {
                $originalHeaders = $this->readPart($connection, $uid, $section, $part);
            }
        }

        return $this->parser->parse($report, $originalHeaders);
    }

    private function readPart(Connection $connection, int $uid, string $section, object $part): string
    {
        if (($part->bytes ?? 0) > 262144) {
            return '';
        }
        $body = $this->fetchPart($connection, $uid, $section);

        return match ($part->encoding ?? 0) {
            3 => base64_decode($body, true) ?: '',
            4 => quoted_printable_decode($body),
            default => $body,
        };
    }

    private function fetchPart(Connection $connection, int $uid, string $section): string
    {
        $body = imap_fetchbody($connection, $uid, $section, FT_UID | FT_PEEK);
        if ($body === false) {
            throw new EmailMailboxUnavailable('Não foi possível ler os campos técnicos de um aviso de entrega.');
        }

        return $body;
    }

    private function mailboxName(string $folder): string
    {
        $encoded = imap_utf8_to_mutf7($folder);
        if ($encoded === false) {
            throw new EmailMailboxUnavailable('O nome da pasta do Gmail é inválido.');
        }

        return '{imap.gmail.com:993/imap/ssl}'.$encoded;
    }
}
