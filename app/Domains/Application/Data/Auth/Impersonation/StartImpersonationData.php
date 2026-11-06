<?php

declare(strict_types=1);

namespace App\Domains\Application\Data\Auth\Impersonation;

use App\Domains\Domain\Enums\Auth\ImpersonationMode;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Data;

final class StartImpersonationData extends Data
{
    public function __construct(
        public ImpersonationMode $mode,
    ) {}

    public static function rules(): array
    {
        return [
            'mode' => ['required', Rule::enum(ImpersonationMode::class)],
        ];
    }

    public static function messages(): array
    {
        return [
            'mode.required' => 'Escolha o modo de acesso.',
            'mode.enum' => 'Modo de acesso inválido.',
        ];
    }
}
