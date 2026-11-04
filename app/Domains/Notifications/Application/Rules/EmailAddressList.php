<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Application\Rules;

use App\Domains\Notifications\Domain\ValueObjects\EmailRecipients;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

final class EmailAddressList implements ValidationRule
{
    public function __construct(private readonly bool $required = false) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value)) {
            return;
        }
        $recipients = EmailRecipients::parse($value);
        if ($this->required && $recipients === []) {
            $fail('Informe pelo menos um destinatário.');

            return;
        }
        if (count($recipients) > 50) {
            $fail('Informe no máximo 50 endereços por campo.');

            return;
        }
        foreach ($recipients as $recipient) {
            if (! filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
                $fail('Informe endereços de e-mail válidos, separados por vírgula.');

                return;
            }
        }
    }
}
