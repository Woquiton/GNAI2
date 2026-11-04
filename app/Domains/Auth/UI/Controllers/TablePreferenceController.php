<?php

declare(strict_types=1);

namespace App\Domains\Auth\UI\Controllers;

use App\Domains\Auth\Application\Actions\Preferences\SaveTablePreferenceAction;
use App\Domains\Auth\Application\Data\Preferences\UpdateTableColumnsData;
use App\Domains\Auth\Application\Data\Preferences\UpdateTableViewData;
use App\Domains\Auth\Domain\Models\User;
use App\Domains\Auth\Infrastructure\Session\ImpersonationSession;
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
