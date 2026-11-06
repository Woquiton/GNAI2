<?php

declare(strict_types=1);

namespace App\Domains\Application\Data\Auth\Preferences;

use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
final class UpdateTableViewData extends Data
{
    public function __construct(
        public string $key,
        public string $viewMode,
    ) {}

    public static function rules(): array
    {
        return [
            'key' => ['required', 'string', 'max:191', 'regex:/^[A-Za-z0-9._-]+$/'],
            'view_mode' => ['required', 'string', Rule::in(['list', 'catalog'])],
        ];
    }

    public static function messages(): array
    {
        return [
            'key.required' => 'Informe a tela da preferência.',
            'key.string' => 'Informe uma tela válida.',
            'key.regex' => 'Informe uma tela válida.',
            'key.max' => 'O identificador da tela deve ter até 191 caracteres.',
            'view_mode.required' => 'Selecione um modo de visualização.',
            'view_mode.string' => 'Selecione Listagem ou Catálogo.',
            'view_mode.in' => 'Selecione Listagem ou Catálogo.',
        ];
    }
}
