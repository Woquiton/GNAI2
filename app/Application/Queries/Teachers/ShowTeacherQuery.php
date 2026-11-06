<?php

declare(strict_types=1);

namespace App\Application\Queries\Teachers;

use App\Domain\Models\Teacher;

final class ShowTeacherQuery
{
    public function execute(Teacher $teacher): Teacher
    {
        return $teacher->load([
            'person',
            // Do semestre mais recente para o mais antigo.
            'courseDisciplines' => static fn ($query) => $query
                ->join('semesters', 'semesters.id', '=', 'teacher_course_disciplines.semester_id')
                ->orderByDesc('semesters.year')
                ->orderByDesc('semesters.term')
                ->select('teacher_course_disciplines.*'),
            'courseDisciplines.discipline',
            'courseDisciplines.course',
            'courseDisciplines.semester',
        ]);
    }
}
