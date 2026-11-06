<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Settings;

use App\Domains\Domain\Enums\Settings\SettingCategory;
use App\Domains\Domain\Models\Settings\Setting;
use App\Domains\Domain\ValueObjects\Settings\SessionSecuritySettings;

final class GetSessionSecuritySettingsQuery
{
    public function execute(): SessionSecuritySettings
    {
        $payload = Setting::payloadFor(SettingCategory::SESSION_SECURITY);

        return $payload === null
            ? SessionSecuritySettings::defaults()
            : SessionSecuritySettings::fromPayload($payload);
    }
}
