<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paees', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('case_study_id');
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('creator_id');
            $table->unsignedBigInteger('semester_id');
            $table->unsignedInteger('version')->default(1);
            $table->boolean('is_current')->default(0);
            $table->string('status')->default('draft');
            $table->unsignedTinyInteger('attendance_frequency_per_week');
            $table->unsignedInteger('attendance_duration_minutes');
            $table->string('attendance_format');
            $table->string('attendance_location');
            $table->boolean('assistive_technology_needed')->default(0);
            $table->longText('assistive_technology_notes')->nullable();
            $table->longText('assistive_technology_availability_capacity')->nullable();
            $table->boolean('caa_needed')->default(0);
            $table->longText('caa_notes')->nullable();
            $table->boolean('is_assistive_technology_portable_digital_device')->default(0);
            $table->longText('assistive_technology_pedagogical_opinion')->nullable();
            $table->boolean('support_professional_needed')->default(0);
            $table->longText('support_professional_justification')->nullable();
            $table->boolean('libras_interpreter_needed')->default(0);
            $table->longText('libras_interpreter_justification')->nullable();
            $table->boolean('guide_interpreter_needed')->default(0);
            $table->longText('guide_interpreter_justification')->nullable();
            $table->longText('school_professionals_orientation')->nullable();
            $table->longText('common_teachers_articulation')->nullable();
            $table->longText('family_articulation')->nullable();
            $table->longText('intersectoral_articulation')->nullable();
            $table->longText('training_demands')->nullable();
            $table->date('next_review_date');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->index(['case_study_id'], 'paees_case_study_id_foreign');
            $table->index(['creator_id'], 'paees_creator_id_foreign');
            $table->index(['semester_id'], 'paees_semester_id_foreign');
            $table->index(['student_id'], 'paees_student_id_foreign');

            $table->foreign(['case_study_id'], 'paees_case_study_id_foreign')
                ->references(['id'])->on('case_studies')
                ->onUpdate('no action')->onDelete('restrict');
            $table->foreign(['creator_id'], 'paees_creator_id_foreign')
                ->references(['id'])->on('users')
                ->onUpdate('no action')->onDelete('restrict');
            $table->foreign(['semester_id'], 'paees_semester_id_foreign')
                ->references(['id'])->on('semesters')
                ->onUpdate('no action')->onDelete('restrict');
            $table->foreign(['student_id'], 'paees_student_id_foreign')
                ->references(['id'])->on('students')
                ->onUpdate('no action')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paees');
    }
};
