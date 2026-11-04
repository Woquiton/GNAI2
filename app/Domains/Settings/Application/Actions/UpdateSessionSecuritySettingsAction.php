<?php

declare(strict_types=1);

namespace App\Domains\Settings\Application\Actions;

use App\Domains\Settings\Application\Data\UpdateSessionSecuritySettingsData;
use App\Domains\Settings\Domain\Enums\SettingCategory;
use App\Domains\Settings\Domain\Models\Setting;
use App\Domains\Settings\Domain\ValueObjects\SessionSecuritySettings;

final class UpdateSessionSecuritySettingsAction
{
    public function execute(UpdateSessionSecuritySettingsData $data): void
    {
        $settings = new SessionSecuritySettings($data->lockAfter, $data->logoutAfter);
        Setting::store(SettingCategory::SESSION_SECURITY, $settings->toPayload());
    }
}
