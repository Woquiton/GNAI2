<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Settings;

use App\Domains\Application\Data\Settings\UpdateTeacherAccessSettingsData;
use App\Domains\Domain\Enums\Settings\SettingCategory;
use App\Domains\Domain\Models\Settings\Setting;

final class UpdateTeacherAccessSettingsAction
{
    public function execute(UpdateTeacherAccessSettingsData $data): void
    {
        Setting::store(SettingCategory::TEACHER_ACCESS, ['domains' => $data->domains]);
    }
}
