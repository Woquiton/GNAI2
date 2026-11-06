<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Settings;

use App\Domains\Domain\Enums\Settings\SettingCategory;
use App\Domains\Domain\Models\Settings\Setting;
use App\Domains\Domain\ValueObjects\Settings\AutomaticEmailSettings;

final class GetAutomaticEmailSettingsQuery
{
    public function execute(): AutomaticEmailSettings
    {
        $payload = Setting::payloadFor(SettingCategory::AUTOMATIC_EMAILS);

        return AutomaticEmailSettings::fromPayload($payload ?? []);
    }
}
