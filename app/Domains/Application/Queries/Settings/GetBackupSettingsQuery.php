<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Settings;

use App\Domains\Domain\Enums\Settings\SettingCategory;
use App\Domains\Domain\Models\Settings\Setting;
use App\Domains\Domain\ValueObjects\Settings\BackupSettings;

final readonly class GetBackupSettingsQuery
{
    public function execute(): BackupSettings
    {
        $payload = Setting::payloadFor(SettingCategory::BACKUP);

        return $payload === null
            ? BackupSettings::defaults()
            : BackupSettings::fromPayload($payload);
    }
}
