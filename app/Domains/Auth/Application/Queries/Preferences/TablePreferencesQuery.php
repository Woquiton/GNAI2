<?php

declare(strict_types=1);

namespace App\Domains\Auth\Application\Queries\Preferences;

use App\Domains\Auth\Domain\Models\User;
use App\Domains\Auth\Domain\Models\UserTablePreference;

final class TablePreferencesQuery
{
    /** Modo escolhido pelo operador para a tela, independente dos filtros da visita. */
    public function viewMode(User $user, string $routeName): string
    {
        $settings = UserTablePreference::query()
            ->where('user_id', $user->getKey())
            ->where('table_key', $routeName)
            ->value('settings');
        $settings = is_string($settings) ? json_decode($settings, true) : $settings;
        $mode = is_array($settings) ? ($settings['view_mode'] ?? null) : null;

        return in_array($mode, ['list', 'catalog'], true) ? $mode : 'list';
    }

    /** Quantidade por página salva para a tela (rota), ou `null` quando não houver. */
    public function pageSize(User $user, string $routeName): ?int
    {
        $settings = UserTablePreference::query()
            ->where('user_id', $user->getKey())
            ->where('table_key', $routeName)
            ->value('settings');
        $settings = is_string($settings) ? json_decode($settings, true) : $settings;
        $size = is_array($settings) ? ($settings['per_page'] ?? null) : null;

        return UserTablePreference::isPageSize($size) ? $size : null;
    }

    /**
     * Colunas visíveis salvas para as tabelas da tela, por chave `rota#tabela`.
     *
     * @return array<string, array<string, bool>>
     */
    public function columns(User $user, string $routeName): array
    {
        return UserTablePreference::query()
            ->where('user_id', $user->getKey())
            ->where('table_key', 'like', addcslashes($routeName, '%_\\').'#%')
            ->get(['table_key', 'settings'])
            ->mapWithKeys(static fn (UserTablePreference $preference): array => [
                $preference->table_key => array_map(
                    static fn (mixed $visible): bool => (bool) $visible,
                    (array) ($preference->settings['columns'] ?? []),
                ),
            ])
            ->all();
    }
}
