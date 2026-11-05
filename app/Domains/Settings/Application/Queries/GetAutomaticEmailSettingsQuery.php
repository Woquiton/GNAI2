<?php

declare(strict_types=1);

namespace App\Domains\Settings\Application\Queries;

use App\Domains\Settings\Domain\Enums\SettingCategory;
use App\Domains\Settings\Domain\Models\Setting;
use App\Domains\Settings\Domain\ValueObjects\AutomaticEmailSettings;

final class GetAutomaticEmailSettingsQuery
{
    public function execute(): AutomaticEmailSettings
    {
        $payload = Setting::payloadFor(SettingCategory::AUTOMATIC_EMAILS);

        return AutomaticEmailSettings::fromPayload($payload ?? []);
    }
}
