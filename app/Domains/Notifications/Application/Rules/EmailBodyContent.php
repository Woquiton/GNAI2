<?php

declare(strict_types=1);

namespace App\Domains\Notifications\Application\Rules;

use App\Shared\Infrastructure\Security\RichTextSanitizer;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

final readonly class EmailBodyContent implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value)) {
            return;
        }
        $body = RichTextSanitizer::sanitize($value);
        if (trim(html_entity_decode(strip_tags($body), ENT_QUOTES, 'UTF-8'), " \t\n\r\0\x0B\xc2\xa0") === '') {
            $fail('Escreva a mensagem.');
        }
    }
}
