<?php

declare(strict_types=1);

namespace App\Domains\Auth\Application\Data\Sessions;

use Spatie\LaravelData\Data;

final class UnlockSessionData extends Data
{
    public function __construct(public string $password) {}

    public static function rules(): array
    {
        return ['password' => ['required', 'string']];
    }

    public static function messages(): array
    {
        return ['password.required' => 'Informe sua senha para desbloquear.'];
    }
}
