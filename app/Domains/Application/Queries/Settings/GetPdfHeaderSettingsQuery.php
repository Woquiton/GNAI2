<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Settings;

use App\Domains\Domain\Enums\Settings\SettingCategory;
use App\Domains\Domain\Models\Settings\Setting;
use App\Domains\Domain\ValueObjects\Settings\PdfHeaderSettings;

final class GetPdfHeaderSettingsQuery
{
    public function execute(): PdfHeaderSettings
    {
        $payload = Setting::payloadFor(SettingCategory::PDF);

        return $payload === null ? new PdfHeaderSettings : PdfHeaderSettings::fromPayload($payload);
    }
}
