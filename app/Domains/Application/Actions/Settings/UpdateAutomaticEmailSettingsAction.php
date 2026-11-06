<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Settings;

use App\Domains\Application\Data\Settings\UpdateAutomaticEmailSettingsData;
use App\Domains\Domain\Enums\Settings\SettingCategory;
use App\Domains\Domain\Models\Settings\Setting;
use App\Domains\Domain\ValueObjects\Settings\AutomaticEmailSettings;

final class UpdateAutomaticEmailSettingsAction
{
    public function execute(UpdateAutomaticEmailSettingsData $data): void
    {
        $settings = AutomaticEmailSettings::fromPayload(['events' => $data->events]);
        Setting::store(SettingCategory::AUTOMATIC_EMAILS, ['events' => $settings->events]);
    }
}
