<?php

declare(strict_types=1);

namespace App\Domains\Settings\Application\Queries;

use App\Domains\Settings\Domain\Enums\SettingCategory;
use App\Domains\Settings\Domain\Models\Setting;
use App\Domains\Settings\Domain\ValueObjects\SessionSecuritySettings;

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
