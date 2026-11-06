<?php

declare(strict_types=1);

namespace App\Domains\Application\Rules\People;

use App\Domains\Domain\Exceptions\People\InvalidCpf;
use App\Domains\Domain\ValueObjects\People\Cpf;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

final class ValidCpf implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        try {
            Cpf::fromNullable((string) $value);
        } catch (InvalidCpf) {
            $fail('O CPF informado é inválido.');
        }
    }
}
