<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Infrastructure\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

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
}
