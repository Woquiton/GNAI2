<?php

declare(strict_types=1);

namespace App\Domains\Settings\Application\Actions;

use App\Domains\Settings\Application\Data\UpdateTeacherAccessSettingsData;
use App\Domains\Settings\Domain\Enums\SettingCategory;
use App\Domains\Settings\Domain\Models\Setting;

final class UpdateTeacherAccessSettingsAction
{
    public function execute(UpdateTeacherAccessSettingsData $data): void
    {
        Setting::store(SettingCategory::TEACHER_ACCESS, ['domains' => $data->domains]);
    }
}
