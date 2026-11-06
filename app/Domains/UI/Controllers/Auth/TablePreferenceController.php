<?php

declare(strict_types=1);

namespace App\Domains\UI\Controllers\Auth;

use App\Domains\Application\Actions\Auth\Preferences\SaveTablePreferenceAction;
use App\Domains\Application\Data\Auth\Preferences\UpdateTableColumnsData;
use App\Domains\Application\Data\Auth\Preferences\UpdateTableViewData;
use App\Domains\Domain\Models\Auth\User;
use App\Domains\Infrastructure\Session\Auth\ImpersonationSession;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

final class TablePreferenceController
{
    public function updateView(
        UpdateTableViewData $data,
        SaveTablePreferenceAction $action,
        ImpersonationSession $impersonation,
        Request $request,
    ): Response {
        $user = $request->user();
        if ($user instanceof User && ! $impersonation->active()) {
            $action->execute($user, $data->key, ['view_mode' => $data->viewMode]);
        }

        return response()->noContent();
    }

    /** Salva as colunas visíveis de uma tabela; durante a personificação a escolha não é gravada. */
    public function updateColumns(
        UpdateTableColumnsData $data,
        SaveTablePreferenceAction $action,
        ImpersonationSession $impersonation,
        Request $request,
    ): Response {
        $user = $request->user();

        if ($user instanceof User && ! $impersonation->active()) {
            $columns = array_map(static fn (mixed $visible): bool => (bool) $visible, $data->columns);
            $action->execute($user, $data->key, ['columns' => $columns]);
        }

        return response()->noContent();
    }
}
