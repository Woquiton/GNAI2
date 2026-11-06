<?php

declare(strict_types=1);

namespace App\Domains\Application\Data\Auth\Preferences;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/** Colunas visíveis escolhidas pelo usuário em uma tabela (`rota#tabela`). */
#[MapInputName(SnakeCaseMapper::class)]
final class UpdateTableColumnsData extends Data
{
    /** @param  array<string, bool>  $columns */
    public function __construct(
        public string $key,
        public array $columns,
    ) {}

    public static function rules(): array
    {
        return [
            'key' => ['required', 'string', 'max:191', 'regex:/^[A-Za-z0-9._-]+#[A-Za-z0-9]+$/'],
            'columns' => ['present', 'array', 'max:50'],
            'columns.*' => ['boolean'],
        ];
    }
}
