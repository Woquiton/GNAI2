<?php

declare(strict_types=1);

namespace App\Domains\Settings\Application\Data;

use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapInputName(SnakeCaseMapper::class)]
final class UpdatePdfHeaderSettingsData extends Data
{
    public function __construct(
        public string $institutionName,
        public ?string $issuingUnit = null,
        public ?string $details = null,
        public ?UploadedFile $logo = null,
        public bool $removeLogo = false,
    ) {}

    public static function rules(): array
    {
        return [
            'institution_name' => ['required', 'string', 'max:180'],
            'issuing_unit' => ['nullable', 'string', 'max:180'],
            'details' => ['nullable', 'string', 'max:1000'],
            'logo' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png',
                'max:4096',
                'dimensions:max_width=4000,max_height=4000',
            ],
            'remove_logo' => ['sometimes', 'boolean'],
        ];
    }

    public static function messages(): array
    {
        return [
            'institution_name.required' => 'Informe o nome da instituição.',
            'institution_name.max' => 'O nome da instituição deve ter no máximo 180 caracteres.',
            'issuing_unit.max' => 'O nome do núcleo deve ter no máximo 180 caracteres.',
            'details.max' => 'O texto complementar deve ter no máximo 1000 caracteres.',
            'logo.image' => 'Selecione uma imagem para o logotipo.',
            'logo.mimes' => 'O logotipo deve estar em JPG ou PNG.',
            'logo.max' => 'O logotipo pode ter no máximo 4 MB.',
            'logo.dimensions' => 'O logotipo pode ter no máximo 4000 pixels de largura e altura.',
            'remove_logo.boolean' => 'A opção de remoção do logotipo é inválida.',
        ];
    }
}
