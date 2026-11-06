<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Mail\Notifications;

use App\Domains\Domain\Exceptions\Notifications\EmailMailboxUnavailable;
use App\Domains\Domain\ValueObjects\Settings\MailSettings;
use CurlHandle;

/** Comandos de metadados do Gmail que a extensão PHP IMAP não disponibiliza. */
final readonly class GmailImapClient
{
    private CurlHandle $connection;

    private float $deadline;

    public function __construct(MailSettings $settings)
    {
        if (! self::available()) {
            throw new EmailMailboxUnavailable('A sincronização de pastas exige PHP cURL com suporte a IMAPS.');
        }
        if (! filter_var($settings->username, FILTER_VALIDATE_EMAIL) || ! filled($settings->password)) {
            throw new EmailMailboxUnavailable('Configure a conta Gmail e sua chave de aplicativo antes de sincronizar as pastas.');
        }
        $connection = curl_init();
        if ($connection === false) {
            throw new EmailMailboxUnavailable('Não foi possível iniciar a conexão de pastas com o Gmail.');
        }
        $this->connection = $connection;
        $this->deadline = microtime(true) + 40;
        curl_setopt_array($connection, [
            CURLOPT_USERNAME => $settings->username,
            CURLOPT_PASSWORD => $settings->password,
            CURLOPT_PROTOCOLS => CURLPROTO_IMAPS,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
            CURLOPT_CONNECTTIMEOUT => 8,
            CURLOPT_PROXY => '',
        ]);
    }

    public static function available(): bool
    {
        return extension_loaded('curl') && in_array('imaps', curl_version()['protocols'] ?? [], true);
    }

    public function request(?string $mailbox, string $command): string
    {
        $remaining = (int) ceil($this->deadline - microtime(true));
        if ($remaining <= 0 || preg_match('/[\r\n\x00]/', $command)) {
            throw new EmailMailboxUnavailable('A consulta ao Gmail atingiu o limite de tempo. Tente novamente para continuar.');
        }
        $response = '';
        curl_setopt_array($this->connection, [
            CURLOPT_URL => 'imaps://imap.gmail.com:993/'.($mailbox === null ? '' : rawurlencode($mailbox)),
            CURLOPT_CUSTOMREQUEST => $command,
            CURLOPT_TIMEOUT => min(15, $remaining),
            CURLOPT_WRITEFUNCTION => static function (CurlHandle $handle, string $chunk) use (&$response): int {
                if (strlen($response) + strlen($chunk) > 262144) {
                    return 0;
                }
                $response .= $chunk;

                return strlen($chunk);
            },
        ]);
        if (curl_exec($this->connection) === false) {
            // Não expor respostas do servidor, cabeçalhos ou credenciais em logs e mensagens.
            throw new EmailMailboxUnavailable('O Gmail não confirmou a operação. Confira a conexão, a chave de aplicativo e o acesso IMAP; depois tente novamente.');
        }

        return $response;
    }

    public function quote(string $value): string
    {
        if (preg_match('/[\r\n\x00]/', $value)) {
            throw new EmailMailboxUnavailable('O identificador da mensagem ou da pasta é inválido.');
        }

        return '"'.str_replace(['\\', '"'], ['\\\\', '\\"'], $value).'"';
    }

    public function close(): void
    {
        curl_close($this->connection);
    }
}
