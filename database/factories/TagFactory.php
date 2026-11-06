<?php

namespace Database\Factories;

use App\Domain\Models\Tag;
use Illuminate\Database\Eloquent\Factories\Factory;

class TagFactory extends Factory
{
    protected $model = Tag::class;

    public function definition(): array
    {
        $baseName = $this->faker->randomElement([
            'Acessibilidade',
            'Inclusão',
            'Eventos',
            'Avisos',
            'Formação',
            'Libras',
            'Edital',
            'Notícias',
        ]);

        return [
            'name' => sprintf('%s %s', $baseName, $this->faker->unique()->numerify('###')),
            'is_active' => true,
        ];
    }

    public function active(): self
    {
        return $this->state(fn () => [
            'is_active' => true,
        ]);
    }

    public function inactive(): self
    {
        return $this->state(fn () => [
            'is_active' => false,
        ]);
    }

    public function named(string $name): self
    {
        return $this->state(fn () => [
            'name' => $name,
        ]);
    }
}
