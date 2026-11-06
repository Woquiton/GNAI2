<?php

declare(strict_types=1);

namespace App\Domains\Infrastructure\Reporting\Students;

use App\Domains\Domain\Models\Guardians\Guardian;
use App\Domains\Domain\Enums\People\Gender;
use App\Domains\Domain\Models\People\Person;
use App\Domains\Domain\Enums\Reporting\ReportColumnType;
use App\Domains\Infrastructure\Sources\Reporting\EloquentReportSource;
use App\Domains\Domain\Enums\Students\StudentFollowUpType;
use App\Domains\Domain\Enums\Students\StudentStatus;
use App\Domains\Domain\Models\Students\Student;

final class StudentsReportSource extends EloquentReportSource
{
    public function key(): string
    {
        return 'specialized-support.students';
    }

    public function label(): string
    {
        return 'Alunos';
    }

    protected function model(): string
    {
        return Student::class;
    }

    protected function with(): array
    {
        return ['person', 'currentCourse.course'];
    }

    public function relationLabels(): array
    {
        return [
            'studentCourses' => 'Matrículas em cursos',
        ];
    }

    public function excludedRelations(): array
    {
        return ['person', 'currentCourse', 'currentCaseStudy', 'currentPaee'];
    }

    protected function definitions(): array
    {
        return [
            'name' => ['label' => 'Nome do aluno', 'path' => 'person.name'],
            'registration' => ['label' => 'Matrícula'],
            'status' => [
                'label' => 'Situação',
                'type' => ReportColumnType::SELECT,
                'options' => $this->enumOptions(StudentStatus::class),
            ],
            'follow_up_type' => [
                'label' => 'Tipo de acompanhamento',
                'type' => ReportColumnType::SELECT,
                'options' => $this->enumOptions(StudentFollowUpType::class),
            ],
            'entry_date' => ['label' => 'Data de ingresso', 'type' => ReportColumnType::DATE],
            'email' => ['label' => 'E-mail', 'path' => 'person.email'],
            'document' => ['label' => 'CPF', 'path' => 'person.document'],
            'birth_date' => [
                'label' => 'Data de nascimento',
                'path' => 'person.birth_date',
                'type' => ReportColumnType::DATE,
            ],
            'gender' => [
                'label' => 'Gênero',
                'path' => 'person.gender',
                'type' => ReportColumnType::SELECT,
                'options' => $this->enumOptions(Gender::class),
            ],
            'phone' => ['label' => 'Telefone', 'path' => 'person.phone'],
            'address' => ['label' => 'Endereço', 'path' => 'person.address'],
            'current_course' => ['label' => 'Curso atual', 'path' => 'currentCourse.course.name'],
        ];
    }

    protected function filterable(): array
    {
        return ['name', 'registration', 'status', 'follow_up_type', 'entry_date', 'current_course'];
    }

    protected function relationPolicy(string $parentModel, string $relationName): array
    {
        $excluded = match ($parentModel) {
            Guardian::class => ['name'],
            Person::class => ['name', 'email', 'document', 'birth_date', 'gender', 'phone', 'address'],
            default => [],
        };

        return ['exclude' => $excluded];
    }
}
