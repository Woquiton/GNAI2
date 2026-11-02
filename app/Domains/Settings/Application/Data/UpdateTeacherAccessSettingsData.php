<?php

declare(strict_types=1);

namespace App\Domains\Settings\Application\Data;

use Spatie\LaravelData\Data;

final class UpdateTeacherAccessSettingsData extends Data
{
    /**
     * @param  list<string>  $domains
     */
    public function __construct(public array $domains = []) {}

    public static function prepareForPipeline(array $properties): array
    {
        if (isset($properties['domains']) && is_array($properties['domains'])) {
            $properties['domains'] = array_values(array_map(
                static fn (mixed $domain): mixed => is_string($domain)
                    ? strtolower(ltrim(trim($domain), '@'))
                    : $domain,
                $properties['domains'],
            ));
        }

        return $properties;
    }

    public static function rules(): array
    {
        return [
            'domains' => ['present', 'array', 'max:50'],
            'domains.*' => [
                'required',
                'string',
                'max:253',
                'distinct',
                'regex:/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/',
            ],
        ];
    }

    public static function messages(): array
    {
        return [
            'domains.array' => 'Informe os domínios em uma lista.',
            'domains.max' => 'Cadastre no máximo 50 domínios.',
            'domains.*.required' => 'Informe o domínio ou remova a linha.',
            'domains.*.string' => 'Informe um domínio válido.',
            'domains.*.max' => 'O domínio deve ter no máximo 253 caracteres.',
            'domains.*.distinct' => 'Este domínio já foi informado.',
            'domains.*.regex' => 'Informe somente o domínio, por exemplo escola.edu.br, sem endereço de e-mail ou curingas.',
        ];
    }
}
