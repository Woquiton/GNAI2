<?php

declare(strict_types=1);

namespace App\Infrastructure\Providers;

use App\Domains\Audit\Infrastructure\AuditableEntities;
use App\Domain\Models\AccessibilityFeature;
use App\Domain\Models\AeeRecord;
use App\Domain\Models\AeeStudentEvaluation;
use App\Domain\Models\Barrier;
use App\Domain\Models\BarrierCategory;
use App\Domain\Models\CaseStudy;
use App\Domain\Models\CaseStudyBarrier;
use App\Domain\Models\CaseStudyContribution;
use App\Domain\Models\CaseStudyStrategy;
use App\Domain\Models\Course;
use App\Domain\Models\Deficiency;
use App\Domain\Models\Discipline;
use App\Domain\Models\Guardian;
use App\Domain\Models\Inspection;
use App\Domain\Models\InspectionEvidence;
use App\Domain\Models\Institution;
use App\Domain\Models\Item;
use App\Domain\Models\Loan;
use App\Domain\Models\Location;
use App\Domain\Models\Paee;
use App\Domain\Models\PaeeObjective;
use App\Domain\Models\PaeeResource;
use App\Domain\Models\PaeeReview;
use App\Domain\Models\PedagogicalRecord;
use App\Domain\Models\Pei;
use App\Domain\Models\PeiDiscipline;
use App\Domain\Models\Pendency;
use App\Domain\Models\Person;
use App\Domain\Models\Position;
use App\Domain\Models\Professional;
use App\Domain\Models\Publication;
use App\Domain\Models\Semester;
use App\Domain\Models\Session;
use App\Domain\Models\Student;
use App\Domain\Models\StudentCourse;
use App\Domain\Models\StudentCourseSemester;
use App\Domain\Models\StudentDeficiency;
use App\Domain\Models\StudentDocument;
use App\Domain\Models\SupportRequest;
use App\Domain\Models\SupportRequestAttachment;
use App\Domain\Models\Tag;
use App\Domain\Models\Teacher;
use App\Domain\Models\TeacherCourseDiscipline;
use App\Domain\Models\TeacherGlobalPermission;
use App\Domain\Models\Waitlist;
use App\UI\Console\Commands\CheckOverdueLoans;
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
