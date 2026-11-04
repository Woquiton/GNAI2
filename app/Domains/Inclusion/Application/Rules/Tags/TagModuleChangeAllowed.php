<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Rules\Tags;

use App\Domains\Inclusion\Domain\Models\Tag;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

final readonly class TagModuleChangeAllowed implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $tag = request()->route('tag');
        $value = $value instanceof \BackedEnum ? $value->value : $value;
        if ($tag instanceof Tag && $value !== $tag->module->value
            && ($tag->publications()->exists() || $tag->mailboxStates()->exists())) {
            $fail('Esta etiqueta está em uso. Crie outra etiqueta para o novo módulo para preservar os vínculos existentes.');
        }
    }
}
