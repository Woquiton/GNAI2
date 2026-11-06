<?php

declare(strict_types=1);

namespace App\Providers;

use App\Domains\Auth\Domain\Models\User;
use App\Domain\Models\Barrier;
use App\Domain\Models\Inspection;
use App\Domain\Models\Item;
use App\Domain\Models\Person;
use App\Domain\Models\Student;
use App\Domain\Models\StudentCourse;
use App\Domain\Models\StudentDeficiency;
use App\Domain\Models\StudentDocument;
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
