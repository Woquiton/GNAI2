<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Infrastructure\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Headers;

final class TransactionalEmail extends Mailable
{
    public function __construct(
        private readonly string $messageSubject,
        private readonly string $htmlView,
        private readonly ?string $plainView,
        private readonly array $payload,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: $this->messageSubject);
    }

    public function content(): Content
    {
        return new Content(view: $this->htmlView, text: $this->plainView, with: $this->payload);
    }

    public function attachments(): array
    {
        if ($this->htmlView !== 'emails.notifications.composed') {
            return [];
        }

        return array_map(
            static fn (array $file): Attachment => Attachment::fromStorageDisk('local', $file['path'])
                ->as($file['name'])->withMime($file['mime']),
            $this->payload['attachments'] ?? [],
        );
    }

    public function headers(): Headers
    {
        $parent = $this->htmlView === 'emails.notifications.composed'
            ? trim((string) ($this->payload['in_reply_to'] ?? ''), "<> \t\r\n") : '';
        if (! preg_match('/^[^<>\s]+@[^<>\s]+$/D', $parent)) {
            return new Headers;
        }

        return new Headers(references: [$parent], text: ['In-Reply-To' => '<'.$parent.'>']);
    }
}
