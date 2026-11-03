<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Período do curso (semestre ou série) em que a disciplina é cursada. Nulo: sem período definido.
        Schema::table('course_disciplines', function (Blueprint $table): void {
            $table->unsignedTinyInteger('course_period')->nullable()->after('discipline_id');
        });

        // Situação do aluno em cada semestre letivo da matrícula: em qual período do curso ele está.
        Schema::create('student_course_semesters', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('student_course_id')->constrained('student_courses')->cascadeOnDelete();
            $table->foreignId('semester_id')->constrained('semesters')->restrictOnDelete();
            $table->unsignedTinyInteger('course_period');
            $table->timestamps();

            $table->unique(['student_course_id', 'semester_id'], 'student_course_semester_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_course_semesters');

        Schema::table('course_disciplines', function (Blueprint $table): void {
            $table->dropColumn('course_period');
        });
    }
};
