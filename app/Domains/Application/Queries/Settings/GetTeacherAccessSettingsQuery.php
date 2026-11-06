<?php

declare(strict_types=1);

namespace App\Domains\Application\Queries\Settings;

use App\Domains\Domain\Enums\Settings\SettingCategory;
use App\Domains\Domain\Models\Settings\Setting;

final class GetTeacherAccessSettingsQuery
{
    /**
     * @return list<string>
     */
    public function execute(): array
    {
        $payload = Setting::payloadFor(SettingCategory::TEACHER_ACCESS);

        return array_values(array_filter(
            $payload['domains'] ?? [],
            static fn (mixed $domain): bool => is_string($domain) && $domain !== '',
        ));
    }
}
