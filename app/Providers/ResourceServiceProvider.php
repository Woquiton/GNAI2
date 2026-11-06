<?php

declare(strict_types=1);

namespace App\Providers;

use App\Domains\Infrastructure\Audit\AuditableEntities;
use App\Domains\Domain\Models\AccessibilityFeatures\AccessibilityFeature;
use App\Domains\Domain\Models\AeeRecords\AeeRecord;
use App\Domains\Domain\Models\AeeRecords\AeeStudentEvaluation;
use App\Domains\Domain\Models\Barriers\Barrier;
use App\Domains\Domain\Models\BarrierCategories\BarrierCategory;
use App\Domains\Domain\Models\CaseStudies\CaseStudy;
use App\Domains\Domain\Models\CaseStudies\CaseStudyBarrier;
use App\Domains\Domain\Models\CaseStudies\CaseStudyContribution;
use App\Domains\Domain\Models\CaseStudies\CaseStudyStrategy;
use App\Domains\Domain\Models\Courses\Course;
use App\Domains\Domain\Models\Deficiencies\Deficiency;
use App\Domains\Domain\Models\Disciplines\Discipline;
use App\Domains\Domain\Models\Guardians\Guardian;
use App\Domains\Domain\Models\Inspections\Inspection;
use App\Domains\Domain\Models\Inspections\InspectionEvidence;
use App\Domains\Domain\Models\Institutions\Institution;
use App\Domains\Domain\Models\Items\Item;
use App\Domains\Domain\Models\Loans\Loan;
use App\Domains\Domain\Models\Locations\Location;
use App\Domains\Domain\Models\Paees\Paee;
use App\Domains\Domain\Models\Paees\PaeeObjective;
use App\Domains\Domain\Models\Paees\PaeeResource;
use App\Domains\Domain\Models\Paees\PaeeReview;
use App\Domains\Domain\Models\PedagogicalRecords\PedagogicalRecord;
use App\Domains\Domain\Models\Peis\Pei;
use App\Domains\Domain\Models\PeiDisciplines\PeiDiscipline;
use App\Domains\Domain\Models\Pendencies\Pendency;
use App\Domains\Domain\Models\People\Person;
use App\Domains\Domain\Models\Positions\Position;
use App\Domains\Domain\Models\Professionals\Professional;
use App\Domains\Domain\Models\Publications\Publication;
use App\Domains\Domain\Models\Semesters\Semester;
use App\Domains\Domain\Models\Sessions\Session;
use App\Domains\Domain\Models\Students\Student;
use App\Domains\Domain\Models\StudentCourses\StudentCourse;
use App\Domains\Domain\Models\StudentCourses\StudentCourseSemester;
use App\Domains\Domain\Models\StudentDeficiencies\StudentDeficiency;
use App\Domains\Domain\Models\StudentDocuments\StudentDocument;
use App\Domains\Domain\Models\SupportRequests\SupportRequest;
use App\Domains\Domain\Models\SupportRequests\SupportRequestAttachment;
use App\Domains\Domain\Models\Tags\Tag;
use App\Domains\Domain\Models\Teachers\Teacher;
use App\Domains\Domain\Models\Teachers\TeacherCourseDiscipline;
use App\Domains\Domain\Models\Teachers\TeacherGlobalPermission;
use App\Domains\Domain\Models\Waitlists\Waitlist;
use App\Domains\UI\Console\Commands\Loans\CheckOverdueLoans;
use Illuminate\Support\ServiceProvider;

/**
 * Registra os recursos de negócio do Gnai: comando de empréstimos em atraso
 * e models auditáveis.
 */
final class ResourceServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->commands([
            CheckOverdueLoans::class,
        ]);

        $this->app->make(AuditableEntities::class)->register(
            AccessibilityFeature::class,
            AeeRecord::class,
            AeeStudentEvaluation::class,
            Barrier::class,
            BarrierCategory::class,
            CaseStudy::class,
            CaseStudyBarrier::class,
            CaseStudyContribution::class,
            CaseStudyStrategy::class,
            Course::class,
            Deficiency::class,
            Discipline::class,
            Guardian::class,
            Inspection::class,
            InspectionEvidence::class,
            Institution::class,
            Item::class,
            Loan::class,
            Location::class,
            Paee::class,
            PaeeObjective::class,
            PaeeResource::class,
            PaeeReview::class,
            PedagogicalRecord::class,
            Pei::class,
            PeiDiscipline::class,
            Pendency::class,
            Person::class,
            Position::class,
            Professional::class,
            Publication::class,
            Semester::class,
            Session::class,
            Student::class,
            StudentCourse::class,
            StudentCourseSemester::class,
            StudentDeficiency::class,
            StudentDocument::class,
            SupportRequest::class,
            SupportRequestAttachment::class,
            Tag::class,
            Teacher::class,
            TeacherCourseDiscipline::class,
            TeacherGlobalPermission::class,
            Waitlist::class,
        );
    }
}
