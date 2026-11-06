<?php

declare(strict_types=1);

namespace App\Domains\Application\Actions\Settings;

use App\Domains\Application\Data\Settings\UpdateBackupSettingsData;
use App\Domains\Domain\Enums\Settings\SettingCategory;
use App\Domains\Domain\Models\Settings\Setting;
use App\Domains\Domain\ValueObjects\Settings\BackupSettings;

final readonly class UpdateBackupSettingsAction
{
    public function execute(UpdateBackupSettingsData $data): BackupSettings
    {
        $settings = new BackupSettings(
            retentionMode: $data->retentionMode,
            retentionValue: $data->retentionValue,
            times: $data->times,
        );

        Setting::store(SettingCategory::BACKUP, $settings->toPayload());

        return $settings;
    }
}
