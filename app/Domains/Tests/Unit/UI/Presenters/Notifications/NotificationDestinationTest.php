<?php

declare(strict_types=1);

namespace App\Domains\Tests\Unit\UI\Presenters\Notifications;

use App\Domains\UI\Presenters\Notifications\NotificationDestination;
use PHPUnit\Framework\TestCase;

final class NotificationDestinationTest extends TestCase
{
    public function test_it_preserves_a_relative_application_url(): void
    {
        self::assertSame(
            '/inclusive-radar/loans/10',
            NotificationDestination::toLocalUrl('/inclusive-radar/loans/10'),
        );
    }

    public function test_it_converts_an_old_absolute_url_to_the_current_host_path(): void
    {
        self::assertSame(
            '/inclusive-radar/loans/10?tab=details#loan',
            NotificationDestination::toLocalUrl(
                'http://localhost:8080/inclusive-radar/loans/10?tab=details#loan'
            ),
        );
    }

    public function test_it_rejects_an_empty_destination(): void
    {
        self::assertNull(NotificationDestination::toLocalUrl(null));
        self::assertNull(NotificationDestination::toLocalUrl(''));
    }
}
