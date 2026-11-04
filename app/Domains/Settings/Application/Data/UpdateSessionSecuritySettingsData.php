<?php

declare(strict_types=1);

namespace App\Domains\Settings\Application\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
final class UpdateSessionSecuritySettingsData extends Data
{
    public function __construct(
        public int $lockAfter,
        public int $logoutAfter,
    ) {}

    public static function rules(): array
    {
        return [
            'lock_after' => ['required', 'integer', 'min:1'],
            'logout_after' => ['required', 'integer', 'min:2', 'gt:lock_after'],
        ];
    }

    public static function messages(): array
    {
        return [
            'lock_after.required' => 'Informe o prazo para bloquear a tela.',
            'lock_after.integer' => 'Informe o prazo em minutos inteiros.',
            'lock_after.min' => 'O prazo de bloqueio deve ser de pelo menos 1 minuto.',
            'logout_after.required' => 'Informe o prazo para encerrar a sessão.',
            'logout_after.integer' => 'Informe o prazo em minutos inteiros.',
            'logout_after.min' => 'O prazo de encerramento deve ser de pelo menos 2 minutos.',
            'logout_after.gt' => 'O prazo de encerramento deve ser maior que o de bloqueio.',
        ];
    }
}
