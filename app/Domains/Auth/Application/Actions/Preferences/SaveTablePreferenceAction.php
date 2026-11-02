<?php

declare(strict_types=1);

namespace App\Domains\Auth\Application\Actions\Preferences;

use App\Domains\Auth\Domain\Models\User;
use App\Domains\Auth\Domain\Models\UserTablePreference;

/** Grava uma escolha de tela do usuário, mesclando-a às já salvas na mesma chave. */
final readonly class SaveTablePreferenceAction
{
    /** @param  array<string, mixed>  $settings */
    public function execute(User $user, string $tableKey, array $settings): void
    {
        $preference = UserTablePreference::query()->firstOrNew([
            'user_id' => $user->getKey(),
            'table_key' => $tableKey,
        ]);
        $merged = array_replace($preference->settings ?? [], $settings);

        // Sem escrita quando nada mudou, para recargas da listagem não gerarem transações.
        if ($preference->exists && $merged === $preference->settings) {
            return;
        }

        $preference->settings = $merged;
        $preference->save();
    }
}
