<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Domains\Domain\Enums\Students\StudentFollowUpType;
use App\Domains\Domain\Enums\Students\StudentStatus;
use App\Domains\Domain\Models\People\Person;
use App\Domains\Domain\Models\Students\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

final class StudentFactory extends Factory
{
    protected $model = Student::class;

    public function definition(): array
    {
        return [
            'person_id' => Person::factory(),
            'registration' => $this->faker->unique()->bothify('MAT######'),
            'entry_date' => $this->faker->optional()->dateTimeBetween('-5 years', 'now')?->format('Y-m-d'),
            'status' => $this->faker->randomElement(StudentStatus::cases()),
            'follow_up_type' => StudentFollowUpType::BOTH,
        ];
    }

    public function active(): self
    {
        return $this->state(fn (): array => [
            'status' => StudentStatus::ACTIVE,
        ]);
    }
}
