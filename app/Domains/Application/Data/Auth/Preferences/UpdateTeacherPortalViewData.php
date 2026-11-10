<?php

declare(strict_types=1);

namespace App\Domains\Application\Data\Auth\Preferences;

use Illuminate\Validation\Rule;
use Spatie\LaravelData\Data;

final class UpdateTeacherPortalViewData extends Data
{
    public function __construct(public string $mode) {}

    public static function rules(): array
    {
        return ['mode' => ['required', 'string', Rule::in(['centered', 'full'])]];
    }

    public static function messages(): array
    {
        return [
            'mode.required' => 'Escolha o modo de visualização.',
            'mode.string' => 'Escolha um modo de visualização válido.',
            'mode.in' => 'Escolha Conteúdo centralizado ou Largura total.',
        ];
    }
}
