<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Infrastructure\Mail;

use App\Domains\Notifications\Domain\DTOs\IncomingEmailContentDTO;
use App\Domains\Notifications\Domain\Exceptions\EmailMailboxUnavailable;
use App\Shared\Infrastructure\Security\RichTextSanitizer;
use IMAP\Connection;
use Throwable;

final readonly class GmailMessageReader
{
    public function __construct(private EmailHeaderParser $headers, private EmailAttachmentStorage $attachments) {}

    public function read(Connection $connection, int $uid, string $deliveryId, float $deadline): IncomingEmailContentDTO
    {
        $structure = imap_fetchstructure($connection, $uid, FT_UID);
        if ($structure === false) {
            throw new EmailMailboxUnavailable('Não foi possível ler a estrutura de uma resposta do Gmail.');
        }
        $content = ['html' => '', 'plain' => '', 'attachments' => [], 'notices' => [], 'parts' => 0];
        try {
            $this->readPart($connection, $uid, $structure, '', $deliveryId, $deadline, $content, 0);
            $html = $content['html'] !== '' ? $content['html'] : '<p>'.nl2br(e($content['plain'])).'</p>';
            // Não carregar imagens remotas ou executar conteúdo ativo de correspondência recebida.
            $html = preg_replace('/<img\b[^>]*>/i', '', $html) ?? '';
            $html = RichTextSanitizer::sanitize($html);

            return new IncomingEmailContentDTO($html, $content['attachments'], array_values(array_unique($content['notices'])));
        } catch (Throwable $exception) {
            $this->attachments->delete($content['attachments']);

            throw $exception;
        }
    }

    private function readPart(
        Connection $connection,
        int $uid,
        object $part,
        string $section,
        string $deliveryId,
        float $deadline,
        array &$content,
        int $depth,
    ): void {
        if (++$content['parts'] > 60 || $depth > 10 || microtime(true) >= $deadline) {
            $content['notices'][] = 'Parte do conteúdo excedeu o limite de importação. Consulte a mensagem completa no Gmail.';

            return;
        }
        if ($part->type === 1) {
            foreach ($part->parts ?? [] as $index => $child) {
                $childSection = $section === '' ? (string) ($index + 1) : $section.'.'.($index + 1);
                $this->readPart($connection, $uid, $child, $childSection, $deliveryId, $deadline, $content, $depth + 1);
            }

            return;
        }
        $parameters = [];
        foreach ([...($part->parameters ?? []), ...($part->dparameters ?? [])] as $parameter) {
            $parameters[strtolower($parameter->attribute)] = $parameter->value;
        }
        $name = $parameters['filename'] ?? $parameters['name'] ?? '';
        if ($name === '' && isset($parameters['filename*'])) {
            $encoded = explode("''", $parameters['filename*'], 2);
            $name = $this->headers->utf8(rawurldecode(end($encoded)), count($encoded) === 2 ? $encoded[0] : 'UTF-8');
        }
        $subtype = strtolower($part->subtype ?? 'octet-stream');
        $text = $part->type === 0 && in_array($subtype, ['html', 'plain'], true)
            && strcasecmp($part->disposition ?? '', 'attachment') !== 0 && $name === '';
        $limit = (int) config($text ? 'email_inbox.max_body_bytes' : 'email_inbox.max_attachment_bytes');
        if ((! $text && count($content['attachments']) >= (int) config('email_inbox.max_attachments'))
            || ($part->bytes ?? 0) > $limit * 1.5) {
            $content['notices'][] = 'Um conteúdo ou anexo excedeu o limite de importação e permanece disponível no Gmail.';

            return;
        }
        $raw = $section === '' ? imap_body($connection, $uid, FT_UID | FT_PEEK)
            : imap_fetchbody($connection, $uid, $section, FT_UID | FT_PEEK);
        if ($raw === false) {
            throw new EmailMailboxUnavailable('Não foi possível ler o conteúdo de uma resposta do Gmail.');
        }
        $decoded = match ($part->encoding ?? 0) {
            3 => base64_decode($raw, true),
            4 => quoted_printable_decode($raw),
            default => $raw,
        };
        if ($decoded === false || strlen($decoded) > $limit) {
            $content['notices'][] = 'Um conteúdo ou anexo não pôde ser importado integralmente. Consulte o Gmail.';

            return;
        }
        if ($text) {
            $decoded = $this->headers->utf8($decoded, $parameters['charset'] ?? 'UTF-8');
            if (strlen($content[$subtype].$decoded) > $limit) {
                $content['notices'][] = 'O texto foi limitado na importação. Consulte a mensagem completa no Gmail.';
            }
            $content[$subtype] = mb_strcut($content[$subtype].$decoded, 0, $limit, 'UTF-8');

            return;
        }
        $types = ['text', 'multipart', 'message', 'application', 'audio', 'image', 'video', 'application'];
        $mime = ($types[$part->type] ?? 'application').'/'.(preg_match('/^[a-z0-9.+-]+$/D', $subtype) ? $subtype : 'octet-stream');
        $content['attachments'][] = $this->attachments->storeContent(
            $decoded, $this->headers->decode($name) ?: 'anexo-'.(count($content['attachments']) + 1), $mime, $deliveryId,
        );
    }
}
