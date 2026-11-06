<?php

declare(strict_types=1);

namespace App\Application\Queries\Semesters;

use App\Domain\Models\Semester;
use Illuminate\Support\Facades\DB;

final class SemesterHasLinkedRecordsQuery
{
    public function execute(Semester $semester): bool
    {
        $semesterId = $semester->getKey();

        foreach (['loans', 'waitlists', 'attendance_sessions', 'support_requests', 'pendencies', 'barriers', 'inspections', 'publications', 'operation_status_changes'] as $table) {
            if (DB::table($table)->where('semester_id', $semesterId)->exists()) {
                return true;
            }
        }

        return $semester->studentDocuments()->exists()
            || $semester->peis()->exists()
            || DB::table('paees')->where('semester_id', $semesterId)->exists()
            || DB::table('case_studies')->where('semester_id', $semesterId)->exists()
            || DB::table('student_courses')->where('semester_id', $semesterId)->exists()
            || DB::table('student_course_semesters')->where('semester_id', $semesterId)->exists()
            || DB::table('teacher_course_disciplines')->where('semester_id', $semesterId)->exists()
            || DB::table('student_course_disciplines')
                ->where('semester_id', $semesterId)
                ->orWhere('resolved_semester_id', $semesterId)
                ->exists();
    }
}
