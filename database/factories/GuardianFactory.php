<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Domain\Enums\GuardianRelationship;
use App\Domain\Models\Guardian;
use App\Domain\Models\Person;
use App\Domain\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

final class GuardianFactory extends Factory
{
    protected $model = Guardian::class;

    public function definition(): array
    {
        return [
            'student_id' => Student::factory(),
            'person_id' => Person::factory(),
            'relationship' => $this->faker->randomElement(GuardianRelationship::cases()),
        ];
    }
}
