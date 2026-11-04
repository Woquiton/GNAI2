<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Data\Tags;

use App\Domains\Inclusion\Domain\Enums\TagModule;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\MergeValidationRules;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\LaravelData\Support\Validation\ValidationContext;

#[MapInputName(SnakeCaseMapper::class)]
#[MergeValidationRules]
final class CreateTagData extends Data
{
    public function __construct(
        public string $name,
        public bool $isActive = false,
        public TagModule $module = TagModule::PUBLICATIONS,
        public string $color = '#322b75',
    ) {}

    public static function prepareForPipeline(array $properties): array
    {
        foreach (['name', 'color'] as $field) {
            if (isset($properties[$field]) && is_string($properties[$field])) {
                $properties[$field] = trim($properties[$field]);
            }
        }

        return $properties;
    }

    public static function rules(ValidationContext $context): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('tags', 'name')->where('module', $context->payload['module'] ?? TagModule::PUBLICATIONS->value),
            ],
            'is_active' => ['sometimes', 'boolean'],
            'module' => ['required', Rule::enum(TagModule::class)],
            'color' => ['required', 'string', 'regex:/^#[0-9a-fA-F]{6}$/D'],
        ];
    }

    public static function messages(): array
    {
        return [
            'name.required' => 'O nome da etiqueta é obrigatório.',
            'name.max' => 'O nome da etiqueta deve possuir no máximo 100 caracteres.',
            'name.unique' => 'Essa etiqueta já existe neste módulo.',
            'module.required' => 'Selecione o módulo da etiqueta.',
            'module.enum' => 'Selecione um módulo válido.',
            'color.required' => 'Selecione a cor da etiqueta.',
            'color.regex' => 'Informe uma cor hexadecimal no formato #RRGGBB.',
            'is_active.boolean' => 'O status deve ser verdadeiro ou falso.',
        ];
    }
}
