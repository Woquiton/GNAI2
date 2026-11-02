<?php

declare(strict_types=1);

namespace App\Domains\Settings\Application\Queries;

use App\Domains\Settings\Domain\Enums\SettingCategory;
use App\Domains\Settings\Domain\Models\Setting;
use App\Domains\Settings\Domain\ValueObjects\PdfHeaderSettings;

final class GetPdfHeaderSettingsQuery
{
    public function execute(): PdfHeaderSettings
    {
        $payload = Setting::payloadFor(SettingCategory::PDF);

        return $payload === null ? new PdfHeaderSettings : PdfHeaderSettings::fromPayload($payload);
    }
}
