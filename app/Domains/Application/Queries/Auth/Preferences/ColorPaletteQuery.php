<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Auth\Preferences;

use App\Domains\Domain\Enums\Auth\PrimaryColorPalette;
use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\Auth\UserTablePreference;

final class ColorPaletteQuery
{
    public function execute(User $user): PrimaryColorPalette
    {
        $preference = UserTablePreference::query()
            ->where('user_id', $user->getKey())
            ->where('table_key', PrimaryColorPalette::PREFERENCE_KEY)
            ->first();
        $palette = $preference?->settings['primary_palette'] ?? null;

        return is_string($palette)
            ? (PrimaryColorPalette::tryFrom($palette) ?? PrimaryColorPalette::Lilac)
            : PrimaryColorPalette::Lilac;
    }
}
