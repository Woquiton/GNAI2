<?php

declare(strict_types=1);

namespace Tests\Feature\Waitlists;

use App\Application\Actions\Waitlists\CancelWaitlistAction;
use App\Domain\Enums\WaitlistStatus;
use App\Domain\Models\Item;
use App\Domain\Models\Waitlist;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class CancelWaitlistActionTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_cancels_a_waiting_waitlist(): void
    {
        $item = Item::factory()->physical()->loanable()->unavailable()->create();
        $waitlist = Waitlist::factory()->forAssistiveTechnology($item)->create([
            'status' => WaitlistStatus::WAITING,
        ]);

        $cancelled = app(CancelWaitlistAction::class)->execute($waitlist);

        self::assertSame(WaitlistStatus::CANCELLED, $cancelled->status);
        $this->assertDatabaseHas('waitlists', [
            'id' => $waitlist->id,
            'status' => WaitlistStatus::CANCELLED->value,
        ]);
    }
}
