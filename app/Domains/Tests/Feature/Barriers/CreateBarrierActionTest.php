<?php

declare(strict_types=1);

namespace App\Domains\Tests\Feature\Barriers;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\BarrierCategories\BarrierCategory;
use App\Domains\Application\Actions\Barriers\CreateBarrierAction;
use App\Domains\Application\Data\Barriers\CreateBarrierData;
use App\Domains\Domain\Enums\Barriers\BarrierStatus;
use App\Domains\Domain\Models\Deficiencies\Deficiency;
use App\Domains\Application\Data\Inspections\CreateInspectionData;
use App\Domains\Domain\Enums\Inspections\InspectionType;
use App\Domains\Domain\Models\Institutions\Institution;
use App\Shared\Domain\Enums\Priority;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class CreateBarrierActionTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_a_barrier_with_initial_inspection(): void
    {
        $user = User::factory()->create();
        $institution = Institution::factory()->create();
        $category = BarrierCategory::factory()->create();
        $deficiency = Deficiency::factory()->create();

        $barrier = app(CreateBarrierAction::class)->execute(
            new CreateBarrierData(
                name: 'Escada sem corrimão',
                institutionId: $institution->id,
                barrierCategoryId: $category->id,
                priority: Priority::HIGH,
                identifiedAt: now()->toDateString(),
                deficiencies: [$deficiency->id],
                inspection: new CreateInspectionData(
                    date: now()->toDateString(),
                    type: InspectionType::INITIAL,
                ),
                isAnonymous: true,
                status: BarrierStatus::IDENTIFIED,
            ),
            registeredBy: $user->id,
        );

        $this->assertDatabaseHas('barriers', [
            'id' => $barrier->id,
            'name' => 'Escada sem corrimão',
            'registered_by_user_id' => $user->id,
            'is_anonymous' => true,
        ]);
        $this->assertDatabaseHas('barrier_deficiency', [
            'barrier_id' => $barrier->id,
            'deficiency_id' => $deficiency->id,
        ]);
        $this->assertDatabaseHas('inspections', [
            'inspectable_id' => $barrier->id,
            'inspectable_type' => 'barrier',
            'status' => BarrierStatus::IDENTIFIED->value,
            'type' => InspectionType::INITIAL->value,
        ]);
    }
}
