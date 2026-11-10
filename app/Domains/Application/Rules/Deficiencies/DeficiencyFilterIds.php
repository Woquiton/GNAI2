<?php

declare(strict_types=1);

namespace App\Domains\Application\Rules\Deficiencies;

use App\Domains\Domain\Models\Deficiencies\Deficiency;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

final readonly class DeficiencyFilterIds implements ValidationRule
{
    public function __construct(private bool $allowWithoutProfile = false) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || strlen($value) > 2000 || ! preg_match('/^\d+(,\d+)*$/D', $value)) {
            $fail('Selecione perfis de atendimento válidos.');

            return;
        }

        $ids = array_unique(array_map('intval', explode(',', $value)));
        if ($this->allowWithoutProfile) {
            $ids = array_values(array_filter($ids, fn (int $id): bool => $id !== 0));
        }

        if (Deficiency::query()->whereIn('id', $ids)->count() !== count($ids)) {
            $fail('Um dos perfis de atendimento selecionados não está disponível.');
        }
    }
}
