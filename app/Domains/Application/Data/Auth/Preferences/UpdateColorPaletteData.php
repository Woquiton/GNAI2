<?php

declare(strict_types=1);

namespace App\Domains\Application\Data\Auth\Preferences;

use App\Domains\Domain\Enums\Auth\PrimaryColorPalette;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Data;

final class UpdateColorPaletteData extends Data
{
    public function __construct(
        public string $palette,
    ) {}

    public static function rules(): array
    {
        return [
            'palette' => ['required', 'string', Rule::enum(PrimaryColorPalette::class)],
        ];
    }

    public static function messages(): array
    {
        return [
            'palette.required' => 'Selecione uma paleta de cor.',
            'palette.string' => 'Selecione uma paleta de cor válida.',
            'palette.enum' => 'Selecione Lilás ou Roxo escuro.',
        ];
    }
}
