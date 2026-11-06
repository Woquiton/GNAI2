<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Settings;

use App\Domains\Application\Data\Settings\UpdateSessionSecuritySettingsData;
use App\Domains\Domain\Enums\Settings\SettingCategory;
use App\Domains\Domain\Models\Settings\Setting;
use App\Domains\Domain\ValueObjects\Settings\SessionSecuritySettings;

final class UpdateSessionSecuritySettingsAction
{
    public function execute(UpdateSessionSecuritySettingsData $data): void
    {
        $settings = new SessionSecuritySettings($data->lockAfter, $data->logoutAfter);
        Setting::store(SettingCategory::SESSION_SECURITY, $settings->toPayload());
    }
}
