<?php

declare(strict_types=1);

namespace App\Domains\UI\Controllers\Auth;

use App\Domains\Application\Actions\Auth\Preferences\SaveTablePreferenceAction;
use App\Domains\Application\Data\Auth\Preferences\UpdateColorPaletteData;
use App\Domains\Domain\Enums\Auth\PrimaryColorPalette;
use App\Domains\Domain\Models\Auth\User;
use App\Domains\Infrastructure\Session\Auth\ImpersonationSession;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

final class ColorPaletteController
{
    public function update(
        UpdateColorPaletteData $data,
        SaveTablePreferenceAction $action,
        ImpersonationSession $impersonation,
        Request $request,
    ): RedirectResponse {
        $user = $request->user();
        abort_unless($user instanceof User && ! $impersonation->active(), 403);

        $action->execute($user, PrimaryColorPalette::PREFERENCE_KEY, [
            'primary_palette' => $data->palette,
        ]);

        return back()->with('success', 'Sua paleta de cor foi atualizada.');
    }
}
