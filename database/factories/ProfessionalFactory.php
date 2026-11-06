<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Domains\Domain\Enums\Professionals\ProfessionalStatus;
use App\Domains\Domain\Models\People\Person;
use App\Domains\Domain\Models\Positions\Position;
use App\Domains\Domain\Models\Professionals\Professional;
use Illuminate\Database\Eloquent\Factories\Factory;

final class ProfessionalFactory extends Factory
{
    protected $model = Professional::class;

    public function definition(): array
    {
        return [
            'person_id' => Person::factory(),
            'position_id' => Position::factory(),
            'registration' => $this->faker->unique()->bothify('PROF######'),
            'entry_date' => $this->faker->dateTimeBetween('-10 years', 'now')->format('Y-m-d'),
            'status' => $this->faker->randomElement(ProfessionalStatus::cases()),
        ];
    }

    public function active(): self
    {
        return $this->state(fn (): array => [
            'status' => ProfessionalStatus::ACTIVE,
        ]);
    }
}
