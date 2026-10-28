<?php

declare(strict_types=1);

namespace App\Domains\SpecializedEducationalSupport\Application\Queries\Students;

use App\Domains\SpecializedEducationalSupport\Domain\Enums\StudentDocumentType;
use App\Domains\SpecializedEducationalSupport\Domain\Models\Student;

final class StudentPdfQuery
{
    public function execute(Student $student): Student
    {
        return $student->load([
            'person',
            'deficiencies',
            'currentCourse.course',
            'guardians.person',
            'documents' => function ($query): void {
                $query->with('semester')->orderByDesc('created_at');
            },
            'currentCaseStudy.semester',
            'currentCaseStudy.creator',
            'currentCaseStudy.barriers',
            'currentCaseStudy.strategies.linkedBarrier',
            'currentCaseStudy.contributions.author',
            'currentPaee.semester',
            'currentPaee.creator',
            'currentPaee.objectives.linkedBarrier',
            'currentPaee.resources.assistiveTechnology',
            'currentPaee.reviews' => function ($query): void {
                $query->with('reviewer')->orderByDesc('reviewed_at');
            },
            'peis' => function ($query): void {
                $query
                    ->where('is_current', true)
                    ->with([
                        'semester',
                        'course',
                        'paee',
                        'creator',
                        'peiDisciplines' => function ($disciplineQuery): void {
                            $disciplineQuery
                                ->with([
                                    'discipline',
                                    'teacher.person',
                                    'creator',
                                    'revisions' => function ($revisionQuery): void {
                                        $revisionQuery->with('reviewer')->orderByDesc('reviewed_at');
                                    },
                                ])
                                ->orderBy('id');
                        },
                    ])
                    ->orderBy('version');
            },
        ]);
    }

    public function hasLaudo(Student $student): bool
    {
        return $student->documents
            ->contains(fn ($document) => $document->type === StudentDocumentType::TECHNICAL_REPORT);
    }
}
