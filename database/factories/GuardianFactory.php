<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Domains\Domain\Enums\Guardians\GuardianRelationship;
use App\Domains\Domain\Models\Guardians\Guardian;
use App\Domains\Domain\Models\People\Person;
use App\Domains\Domain\Models\Students\Student;
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
