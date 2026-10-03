<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('case_study_id')->constrained('case_studies')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('creator_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('semester_id')->constrained('semesters')->cascadeOnDelete();

            $table->unsignedInteger('version')->default(1);
            $table->boolean('is_current')->default(true);
            $table->string('status')->default('draft');

            $table->unsignedTinyInteger('attendance_frequency_per_week');
            $table->unsignedInteger('attendance_duration_minutes');
            $table->string('attendance_format');
            $table->string('attendance_location');

            $table->boolean('assistive_technology_needed')->default(false);
            $table->text('assistive_technology_notes')->nullable();

            $table->boolean('support_professional_needed')->default(false);
            $table->text('support_professional_justification')->nullable();

            $table->text('school_professionals_orientation')->nullable();
            $table->text('common_teachers_articulation')->nullable();
            $table->text('family_articulation')->nullable();
            $table->text('intersectoral_articulation')->nullable();
            $table->text('training_demands')->nullable();

            $table->date('next_review_date');

            $table->timestamps();

            $table->unique(['student_id', 'version']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paees');
    }
};
