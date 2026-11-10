<?php

declare(strict_types=1);

namespace App\Domains\UI\Controllers\Auth;

use App\Domains\Application\Actions\Auth\Preferences\SaveTablePreferenceAction;
use App\Domains\Application\Data\Auth\Preferences\UpdateTableColumnsData;
use App\Domains\Application\Data\Auth\Preferences\UpdateTableViewData;
use App\Domains\Domain\Models\Auth\User;
use App\Domains\Application\Queries\Auth\Preferences\PreferenceOwnerQuery;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

final class TablePreferenceController
{
    public function updateView(
        UpdateTableViewData $data,
        SaveTablePreferenceAction $action,
        PreferenceOwnerQuery $owners,
        Request $request,
    ): Response {
        $user = $owners->execute($request->user());
        if ($user instanceof User) {
            $action->execute($user, $data->key, ['view_mode' => $data->viewMode]);
        }

        return response()->noContent();
    }

    /** Salva as colunas visíveis de uma tabela; durante a personificação, grava na conta de origem. */
    public function updateColumns(
        UpdateTableColumnsData $data,
        SaveTablePreferenceAction $action,
        PreferenceOwnerQuery $owners,
        Request $request,
    ): Response {
        $user = $owners->execute($request->user());

        if ($user instanceof User) {
            $columns = array_map(static fn (mixed $visible): bool => (bool) $visible, $data->columns);
            $action->execute($user, $data->key, ['columns' => $columns]);
        }

        return response()->noContent();
    }
}
