<?php

declare(strict_types=1);

namespace App\Domains\Auth\Application\Data\TeacherAccess;

use Spatie\LaravelData\Data;

final class RequestTeacherAccessLinkData extends Data
{
    public function __construct(
        public string $email,
    ) {}

    public static function rules(): array
    {
        return [
            'email' => ['required', 'email', 'max:255', 'regex:/@ifbaiano\.edu\.br$/i'],
        ];
    }

    public static function messages(): array
    {
        return [
            'email.regex' => 'Informe seu e-mail institucional (@ifbaiano.edu.br).',
        ];
    }
}
