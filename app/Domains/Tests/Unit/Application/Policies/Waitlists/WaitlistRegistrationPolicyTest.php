<?php

declare(strict_types=1);

namespace App\Domains\Tests\Unit\Application\Policies\Waitlists;

use App\Domains\Domain\Enums\Items\ItemType;
use App\Domains\Domain\Models\Items\Item;
use App\Domains\Application\Data\Waitlists\CreateWaitlistData;
use App\Domains\Application\Policies\Waitlists\WaitlistRegistrationPolicy;
use App\Domains\Domain\Exceptions\Waitlists\InvalidWaitlist;
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
