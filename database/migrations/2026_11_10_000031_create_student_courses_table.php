<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_courses', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('course_id');
            $table->year('academic_year');
            $table->unsignedBigInteger('semester_id')->nullable();
            $table->boolean('is_current')->default(1);
            $table->longText('school_attendance_status')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->index(['course_id'], 'student_courses_course_id_foreign');
            $table->index(['semester_id'], 'student_courses_semester_id_foreign');
            $table->unique(['student_id', 'course_id'], 'student_courses_student_id_course_id_unique');

            $table->foreign(['course_id'], 'student_courses_course_id_foreign')
                ->references(['id'])->on('courses')
                ->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['semester_id'], 'student_courses_semester_id_foreign')
                ->references(['id'])->on('semesters')
                ->onUpdate('no action')->onDelete('set null');
            $table->foreign(['student_id'], 'student_courses_student_id_foreign')
                ->references(['id'])->on('students')
                ->onUpdate('no action')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_courses');
    }
};
