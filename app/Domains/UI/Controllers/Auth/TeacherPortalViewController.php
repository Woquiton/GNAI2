<?php

declare(strict_types=1);

namespace App\Domains\UI\Controllers\Auth;

use App\Domains\Application\Actions\Auth\Preferences\SaveTablePreferenceAction;
use App\Domains\Application\Data\Auth\Preferences\UpdateTeacherPortalViewData;
use App\Domains\Application\Queries\Auth\Preferences\PreferenceOwnerQuery;
use App\Domains\Application\Queries\Auth\Preferences\TeacherPortalViewQuery;
use App\Domains\Domain\Models\Auth\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

final class TeacherPortalViewController
{
    public function update(
        UpdateTeacherPortalViewData $data,
        SaveTablePreferenceAction $action,
        PreferenceOwnerQuery $owners,
        Request $request,
    ): RedirectResponse {
        $owner = $owners->execute($request->user());
        abort_unless($owner instanceof User, 403);
        $action->execute($owner, TeacherPortalViewQuery::PREFERENCE_KEY, ['content_width' => $data->mode]);

        return back();
    }
}
