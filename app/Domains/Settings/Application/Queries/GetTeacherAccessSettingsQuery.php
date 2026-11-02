<?php

declare(strict_types=1);

namespace App\Domains\Settings\Application\Queries;

use App\Domains\Settings\Domain\Enums\SettingCategory;
use App\Domains\Settings\Domain\Models\Setting;

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
