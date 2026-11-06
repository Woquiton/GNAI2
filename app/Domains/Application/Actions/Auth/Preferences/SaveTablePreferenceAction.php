<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Auth\Preferences;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\Auth\UserTablePreference;
use Illuminate\Support\Facades\DB;

/** Grava uma escolha de tela do usuário, mesclando-a às já salvas na mesma chave. */
final readonly class SaveTablePreferenceAction
{
    /** @param  array<string, mixed>  $settings */
    public function execute(User $user, string $tableKey, array $settings): void
    {
        $preference = UserTablePreference::query()->firstOrCreate([
            'user_id' => $user->getKey(),
            'table_key' => $tableKey,
        ], ['settings' => []]);

        DB::transaction(function () use ($preference, $settings): void {
            // Serializa a mesclagem para uma troca de modo não apagar a paginação salva em paralelo.
            $locked = UserTablePreference::query()
                ->whereKey($preference->getKey())
                ->lockForUpdate()
                ->firstOrFail();
            $merged = array_replace($locked->settings ?? [], $settings);
            if ($merged === $locked->settings) {
                return;
            }

            $locked->settings = $merged;
            $locked->save();
        });
    }
}
