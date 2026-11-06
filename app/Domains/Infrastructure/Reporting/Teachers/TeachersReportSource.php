<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Reporting\Teachers;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\People\Person;
use App\Domains\Infrastructure\Sources\Reporting\EloquentReportSource;
use App\Domains\Domain\Models\Teachers\Teacher;

final class TeachersReportSource extends EloquentReportSource
{
    public function key(): string
    {
        return 'specialized-support.teachers';
    }

    public function label(): string
    {
        return 'Professores';
    }

    protected function model(): string
    {
        return Teacher::class;
    }

    protected function with(): array
    {
        return ['person'];
    }

    protected function definitions(): array
    {
        return [
            'name' => ['label' => 'Nome', 'path' => 'person.name'],
            'registration' => ['label' => 'Matrícula'],
            'email' => ['label' => 'E-mail', 'path' => 'person.email'],
            'phone' => ['label' => 'Telefone', 'path' => 'person.phone'],
        ];
    }

    protected function filterable(): array
    {
        return ['name', 'registration', 'email'];
    }

    protected function relationPolicy(string $parentModel, string $relationName): array
    {
        $excluded = match ($parentModel) {
            User::class => ['name', 'email'],
            Person::class => ['name', 'email', 'phone'],
            default => [],
        };

        return ['exclude' => $excluded];
    }
}
