<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_course_disciplines', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('student_course_id');
            $table->unsignedBigInteger('discipline_id');
            $table->unsignedBigInteger('semester_id');
            $table->string('category');
            $table->unsignedBigInteger('resolved_semester_id')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->unique(['student_course_id', 'semester_id', 'discipline_id', 'category'], 'student_course_discipline_semester_unique');
            $table->index(['discipline_id'], 'student_course_disciplines_discipline_id_foreign');
            $table->index(['resolved_semester_id'], 'student_course_disciplines_resolved_semester_id_foreign');
            $table->index(['semester_id'], 'student_course_disciplines_semester_id_foreign');

            $table->foreign(['discipline_id'], 'student_course_disciplines_discipline_id_foreign')
                ->references(['id'])->on('disciplines')
                ->onUpdate('no action')->onDelete('restrict');
            $table->foreign(['resolved_semester_id'], 'student_course_disciplines_resolved_semester_id_foreign')
                ->references(['id'])->on('semesters')
                ->onUpdate('no action')->onDelete('restrict');
            $table->foreign(['semester_id'], 'student_course_disciplines_semester_id_foreign')
                ->references(['id'])->on('semesters')
                ->onUpdate('no action')->onDelete('restrict');
            $table->foreign(['student_course_id'], 'student_course_disciplines_student_course_id_foreign')
                ->references(['id'])->on('student_courses')
                ->onUpdate('no action')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_course_disciplines');
    }
};
