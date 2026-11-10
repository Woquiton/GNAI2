<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Auth\Preferences;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\Auth\UserTablePreference;

final class TeacherPortalViewQuery
{
    public const PREFERENCE_KEY = 'teacher_portal';

    public function execute(?User $user): string
    {
        $preference = $user === null ? null : UserTablePreference::query()
            ->where('user_id', $user->getKey())
            ->where('table_key', self::PREFERENCE_KEY)
            ->first();
        $mode = $preference?->settings['content_width'] ?? null;

        return in_array($mode, ['centered', 'full'], true) ? $mode : 'centered';
    }
}
