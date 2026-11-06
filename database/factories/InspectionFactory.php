<?php

namespace Database\Factories;

use App\Domain\Enums\BarrierStatus;
use App\Domain\Enums\ConservationState;
use App\Domain\Enums\InspectionType;
use App\Domain\Models\Item;
use App\Domain\Models\Barrier;
use App\Domain\Models\Inspection;
use App\Domains\Auth\Domain\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class InspectionFactory extends Factory
{
    protected $model = Inspection::class;

    public function configure(): static
    {
        return $this->forAssistiveTechnology();
    }

    public function definition(): array
    {
        return [
            'state' => ConservationState::GOOD,
            'status' => null,
            'inspection_date' => now(),
            'description' => $this->faker->optional()->sentence(),
            'type' => $this->faker->randomElement([
                InspectionType::INITIAL,
                InspectionType::PERIODIC,
            ]),
            'user_id' => User::factory(),
        ];
    }

    public function forBarrier(?Barrier $barrier = null): static
    {
        return $this->state(function () {
            return [
                'state' => null,
                'status' => $this->faker->randomElement(BarrierStatus::cases())->value,
                'type' => $this->faker->randomElement([
                    InspectionType::INITIAL,
                    InspectionType::PERIODIC,
                ]),
            ];
        })->for($barrier ?? Barrier::factory(), 'inspectable');
    }

    public function forAccessibleEducationalMaterial(?Item $material = null): static
    {
        return $this->state(function () {
            return [
                'state' => $this->faker->randomElement(ConservationState::cases()),
                'status' => null,
            ];
        })->for($material ?? Item::factory()->accessibleEducationalMaterial(), 'inspectable');
    }

    public function forAssistiveTechnology(?Item $assistiveTechnology = null): static
    {
        return $this->state(function () {
            return [
                'state' => $this->faker->randomElement(ConservationState::cases()),
                'status' => null,
            ];
        })->for($assistiveTechnology ?? Item::factory()->assistiveTechnology(), 'inspectable');
    }
}
