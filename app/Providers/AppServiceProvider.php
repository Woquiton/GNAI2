<?php

declare(strict_types=1);

namespace App\Providers;

use App\Domains\Domain\Models\Auth\User;
use App\Domains\Domain\Models\Barriers\Barrier;
use App\Domains\Domain\Models\Inspections\Inspection;
use App\Domains\Domain\Models\Items\Item;
use App\Domains\Domain\Models\People\Person;
use App\Domains\Domain\Models\Students\Student;
use App\Domains\Domain\Models\StudentCourses\StudentCourse;
use App\Domains\Domain\Models\StudentDeficiencies\StudentDeficiency;
use App\Domains\Domain\Models\StudentDocuments\StudentDocument;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

final class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Inertia::setRootView('inertia');
        Relation::enforceMorphMap([
            'student' => Student::class,
            'person' => Person::class,
            'student_deficiency' => StudentDeficiency::class,
            'student_document' => StudentDocument::class,
            'student_course' => StudentCourse::class,
            'item' => Item::class,
            'barrier' => Barrier::class,
            'inspection' => Inspection::class,
            'user' => User::class,
        ]);
    }
}
