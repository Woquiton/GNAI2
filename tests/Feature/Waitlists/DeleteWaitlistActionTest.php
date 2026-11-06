<?php

declare(strict_types=1);

namespace Tests\Feature\Waitlists;

use App\Application\Actions\Waitlists\DeleteWaitlistAction;
use App\Domain\Enums\WaitlistStatus;
use App\Domain\Exceptions\InvalidWaitlist;
use App\Domain\Models\Item;
use App\Domain\Models\Waitlist;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class DeleteWaitlistActionTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_deletes_a_non_fulfilled_waitlist(): void
    {
        $waitlist = $this->waitlist(WaitlistStatus::WAITING);

        app(DeleteWaitlistAction::class)->execute($waitlist);

        $this->assertDatabaseMissing('waitlists', [
            'id' => $waitlist->id,
        ]);
    }

    public function test_it_rejects_deleting_a_fulfilled_waitlist(): void
    {
        $waitlist = $this->waitlist(WaitlistStatus::FULFILLED);

        $this->expectException(InvalidWaitlist::class);
        $this->expectExceptionMessage('Solicitações já atendidas não podem ser removidas.');

        app(DeleteWaitlistAction::class)->execute($waitlist);
    }

    private function waitlist(WaitlistStatus $status): Waitlist
    {
        $item = Item::factory()->physical()->loanable()->unavailable()->create();

        return Waitlist::factory()->forAssistiveTechnology($item)->create([
            'status' => $status,
        ]);
    }
}
