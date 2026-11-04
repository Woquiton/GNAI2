<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Infrastructure\Mail;

use App\Domains\Notifications\Domain\DTOs\EmailBounceDTO;
use App\Domains\Notifications\Domain\Exceptions\EmailMailboxUnavailable;
use App\Domains\Settings\Domain\ValueObjects\MailSettings;
use IMAP\Connection;

final readonly class GmailBounceMailbox
{
    public function __construct(private DeliveryStatusReportParser $parser) {}

    public function open(MailSettings $settings): Connection
    {
        if (! extension_loaded('imap')) {
            throw new EmailMailboxUnavailable('A leitura de rejeições do Gmail requer a extensão PHP IMAP.');
        }
        $username = $settings->username;
        $password = $settings->password;
        $folder = $settings->gmailBouncesFolder;
        if (! is_string($username) || ! filter_var($username, FILTER_VALIDATE_EMAIL)
            || ! is_string($password) || $password === '' || $folder === ''
            || preg_match('/[{}\r\n]/', $folder)) {
            throw new EmailMailboxUnavailable('Configure a conta Gmail, a senha de app e uma pasta IMAP válida para ler as rejeições.');
        }

        imap_timeout(IMAP_OPENTIMEOUT, 15);
        imap_timeout(IMAP_READTIMEOUT, 20);
        // Host fixo e certificado verificado. Nunca alterar flags ou apagar mensagens da caixa.
        $connection = @imap_open('{imap.gmail.com:993/imap/ssl}'.$folder, $username, $password, OP_READONLY, 1, [
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
        $status = imap_status($connection, '{imap.gmail.com:993/imap/ssl}'.$folder, SA_UIDVALIDITY);
        if ($status === false) {
            throw new EmailMailboxUnavailable('Não foi possível identificar a pasta IMAP do Gmail.');
        }

        return $status->uidvalidity;
    }

    /** @return list<int> */
    public function reportUids(Connection $connection, int $afterUid, int $lookbackDays): array
    {
        $since = now()->subDays($lookbackDays)->format('d-M-Y');
        $criteria = 'SINCE "'.$since.'" HEADER Content-Type "multipart/report"';
        $uids = imap_search($connection, $criteria, SE_UID) ?: [];
        if (imap_errors() !== false) {
            throw new EmailMailboxUnavailable('Não foi possível pesquisar os avisos de entrega do Gmail.');
        }
        $uids = array_values(array_filter($uids, static fn (int $uid): bool => $uid > $afterUid));
        sort($uids, SORT_NUMERIC);

        return $uids;
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
        $fields = $this->parser->fields($headers);
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
}
