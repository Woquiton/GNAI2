<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teacher_course_disciplines', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('teacher_id');
            $table->unsignedBigInteger('course_id');
            $table->unsignedBigInteger('discipline_id');
            $table->unsignedBigInteger('semester_id');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->unique(['teacher_id', 'course_id', 'discipline_id', 'semester_id'], 'teacher_course_discipline_semester_unique');
            $table->index(['course_id'], 'teacher_course_disciplines_course_id_foreign');
            $table->index(['discipline_id'], 'teacher_course_disciplines_discipline_id_foreign');
            $table->index(['semester_id'], 'teacher_course_disciplines_semester_id_foreign');

            $table->foreign(['course_id'], 'teacher_course_disciplines_course_id_foreign')
                ->references(['id'])->on('courses')
                ->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['discipline_id'], 'teacher_course_disciplines_discipline_id_foreign')
                ->references(['id'])->on('disciplines')
                ->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['semester_id'], 'teacher_course_disciplines_semester_id_foreign')
                ->references(['id'])->on('semesters')
                ->onUpdate('no action')->onDelete('restrict');
            $table->foreign(['teacher_id'], 'teacher_course_disciplines_teacher_id_foreign')
                ->references(['id'])->on('teachers')
                ->onUpdate('no action')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teacher_course_disciplines');
    }
};
