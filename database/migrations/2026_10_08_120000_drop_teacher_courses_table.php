<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * teacher_courses nunca teve nenhuma tela que a mantivesse — só era
     * populada manualmente. A fonte real de "professor dá aula em qual
     * curso" é teacher_course_disciplines (mantida em Professores >
     * Disciplinas), para onde todas as consultas já foram migradas.
     */
    public function up(): void
    {
        Schema::dropIfExists('teacher_courses');
    }

    public function down(): void
    {
        Schema::create('teacher_courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained('teachers')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->timestamps();
        });
    }
};
