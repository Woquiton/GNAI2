<?php

declare(strict_types=1);

namespace Tests\Unit\Application\Policies\Waitlists;

use App\Application\Data\Waitlists\CreateWaitlistData;
use App\Application\Policies\Waitlists\WaitlistRegistrationPolicy;
use App\Domain\Enums\ItemType;
use App\Domain\Exceptions\InvalidWaitlist;
use App\Domain\Models\Item;
use Tests\TestCase;

final class WaitlistRegistrationPolicyTest extends TestCase
{
    public function test_it_rejects_missing_beneficiary(): void
    {
        $this->expectException(InvalidWaitlist::class);
        $this->expectExceptionMessage('É necessário informar um aluno ou um profissional.');

        app(WaitlistRegistrationPolicy::class)->ensureCanRegister(
            item: new Item,
            data: $this->data(),
        );
    }

    public function test_it_rejects_two_beneficiaries(): void
    {
        $this->expectException(InvalidWaitlist::class);
        $this->expectExceptionMessage('Não é permitido informar aluno e profissional ao mesmo tempo.');

        app(WaitlistRegistrationPolicy::class)->ensureCanRegister(
            item: new Item,
            data: $this->data(studentId: 20, professionalId: 30),
        );
    }

    private function data(?int $studentId = null, ?int $professionalId = null): CreateWaitlistData
    {
        return new CreateWaitlistData(
            waitlistableId: 10,
            itemType: ItemType::AssistiveTechnology,
            studentId: $studentId,
            professionalId: $professionalId,
        );
    }
}
