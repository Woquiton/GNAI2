<?php

declare(strict_types=1);

namespace App\Domains\Inclusion\Application\Queries\SupportRequests;

use App\Domains\Inclusion\Domain\Enums\RequestedSupport;
use App\Domains\Inclusion\Domain\Enums\SupportDiagnosisStatus;
use App\Domains\Inclusion\Domain\Enums\SupportRequesterRole;
use App\Domains\Inclusion\Domain\Enums\SupportRequestReasonType;
use App\Domains\Inclusion\Domain\Enums\SupportRequestStatus;
use App\Domains\Inclusion\Domain\Models\Course;
use App\Domains\Inclusion\Domain\Models\Deficiency;
use App\Domains\Inclusion\Domain\Models\Student;
use App\Domains\Inclusion\Domain\Models\SupportRequest;

final class SupportRequestFormQuery
{
    public function forCreation(?int $studentId = null): array
    {
        return [
            'options' => $this->options(),
            'selectedStudentId' => $studentId === null ? '' : (string) $studentId,
            'today' => now()->toDateString(),
            'defaults' => [
                'requester_role' => SupportRequesterRole::STUDENT->value,
                'diagnosis_status' => SupportDiagnosisStatus::NOT_INFORMED->value,
                'status' => SupportRequestStatus::RECEIVED->value,
            ],
        ];
    }

    public function forUpdate(SupportRequest $supportRequest): array
    {
        return ['options' => $this->options($supportRequest)];
    }

    private function options(?SupportRequest $record = null): array
    {
        return [
            'students' => $this->students($record),
            'reasonProfiles' => Deficiency::query()
                ->where(function ($query) use ($record): void {
                    $query->where('is_active', true);
                    if ($record !== null) {
                        $query->orWhereIn('id', $record->reasonProfiles()->pluck('deficiencies.id'));
                    }
                })
                ->orderBy('name')->get(['id', 'name'])
                ->map(fn (Deficiency $profile): array => [
                    'value' => (string) $profile->id,
                    'label' => $profile->name,
                ])->all(),
            'courses' => Course::query()
                ->where(function ($query) use ($record): void {
                    $query->where('is_active', true);
                    if ($record?->course_id !== null) {
                        $query->orWhere('id', $record->course_id);
                    }
                })
                ->orderBy('name')->get(['id', 'name'])
                ->map(fn (Course $course): array => [
                    'value' => (string) $course->id,
                    'label' => $course->name,
                ])->all(),
            ...$this->choices(),
        ];
    }

    public function students(?SupportRequest $record = null): array
    {
        return Student::query()->with('person')
            ->when($record !== null, fn ($query) => $query->whereKey($record->student_id))
            ->get()->sortBy(fn (Student $student): string => $student->person->name)
            ->map(fn (Student $student): array => [
                'value' => (string) $student->id,
                'label' => $student->person->name.' — '.$student->registration,
            ])->values()->all();
    }

    public function choices(): array
    {
        $options = fn (array $cases): array => array_map(
            static fn ($case): array => ['value' => $case->value, 'label' => $case->label()], $cases,
        );

        return [
            'reasonTypes' => $options(SupportRequestReasonType::cases()),
            'statuses' => $options(SupportRequestStatus::cases()),
            'requesterRoles' => $options(SupportRequesterRole::cases()),
            'diagnosisStatuses' => $options(SupportDiagnosisStatus::cases()),
            'supports' => $options(RequestedSupport::cases()),
        ];
    }
}
