<?php

declare(strict_types=1);

namespace App\Domains\Settings\Application\Actions;

use App\Domains\Settings\Application\Data\UpdateAutomaticEmailSettingsData;
use App\Domains\Settings\Domain\Enums\SettingCategory;
use App\Domains\Settings\Domain\Models\Setting;
use App\Domains\Settings\Domain\ValueObjects\AutomaticEmailSettings;

final class UpdateAutomaticEmailSettingsAction
{
    public function execute(UpdateAutomaticEmailSettingsData $data): void
    {
        $settings = AutomaticEmailSettings::fromPayload(['events' => $data->events]);
        Setting::store(SettingCategory::AUTOMATIC_EMAILS, ['events' => $settings->events]);
    }
}
