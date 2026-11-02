<?php

declare(strict_types=1);

namespace App\Domains\Auth\Application\Data\TeacherAccess;

use App\Domains\Settings\Application\Queries\GetTeacherAccessSettingsQuery;
use Closure;
use Spatie\LaravelData\Data;

final class RequestTeacherAccessLinkData extends Data
{
    public function __construct(
        public string $email,
    ) {}

    public static function rules(): array
    {
        $domains = app(GetTeacherAccessSettingsQuery::class)->execute();

        return [
            'email' => [
                'required',
                'email',
                'max:255',
                static function (string $attribute, mixed $value, Closure $fail) use ($domains): void {
                    if (! is_string($value) || $domains === []) {
                        return;
                    }

                    $domain = strtolower(substr(strrchr($value, '@') ?: '', 1));
                    if (! in_array($domain, $domains, true)) {
                        $fail('Use um dos domínios de e-mail aceitos: '.implode(', ', $domains).'.');
                    }
                },
            ],
        ];
    }

    public static function messages(): array
    {
        return [
            'email.required' => 'Informe seu e-mail cadastrado.',
            'email.email' => 'Informe um e-mail válido.',
        ];
    }
}
