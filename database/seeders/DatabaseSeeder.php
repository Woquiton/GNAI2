<?php

namespace Database\Seeders;

use Database\Seeders\DemoLoanWaitlistSeeder;
use Database\Seeders\PublicationSeeder;
use Database\Seeders\InstitutionSeeder;
use Database\Seeders\LocationSeeder;
use Database\Seeders\BarrierSeeder;
use Illuminate\Database\Seeder;
use Database\Seeders\SemesterSeeder;
use Database\Seeders\StudentDeficiencySeeder;
use Database\Seeders\DeficiencySeeder;
use Database\Seeders\PositionSeeder;
use Database\Seeders\PSPUSeeder;
use Database\Seeders\StudentSeeder;
use Database\Seeders\CoursesSeeder;
use Database\Seeders\DisciplinesSeeder;
use Database\Seeders\CourseDisciplineSeeder;
use Database\Seeders\StudentCourseSeeder;
use Database\Seeders\AeeRecordSeeder;
use Database\Seeders\PedagogicalRecordSeeder;
use Database\Seeders\PendencySeeder;
use Database\Seeders\GuardianSeeder;
use Database\Seeders\DisciplineSeeder;
use Database\Seeders\PeiSeeder;
use Database\Seeders\ProfessionalSeeder;
use Database\Seeders\AttendanceSessionSeeder;
use Database\Seeders\TeacherSeeder;
use Database\Seeders\BarrierCategorySeeder;
use Database\Seeders\AccessibilityFeatureSeeder;
use Database\Seeders\TagSeeder;
use Database\Seeders\AssistiveTechnologySeeder;
use Database\Seeders\AccessibleEducationalMaterialSeeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            SemesterSeeder::class,
            DeficiencySeeder::class,
            PositionSeeder::class,
            BarrierCategorySeeder::class,
            AccessibilityFeatureSeeder::class,
            TagSeeder::class,
            AccessibleEducationalMaterialSeeder::class,
            PSPUSeeder::class,
            // StudentSeeder::class,
            StudentDeficiencySeeder::class,
            CoursesSeeder::class,
            DisciplinesSeeder::class,
            CourseDisciplineSeeder::class,
            StudentCourseSeeder::class,
            // ProfessionalSeeder::class,
            PendencySeeder::class,
            GuardianSeeder::class,
            DisciplineSeeder::class,
            AttendanceSessionSeeder::class,
            TeacherSeeder::class,
            PeiSeeder::class,
            InstitutionSeeder::class,
            LocationSeeder::class,
            AssistiveTechnologySeeder::class,
            BarrierSeeder::class,
            PublicationSeeder::class,
            DemoLoanWaitlistSeeder::class,
            AeeRecordSeeder::class,
            PedagogicalRecordSeeder::class,
        ]);
    }
}
