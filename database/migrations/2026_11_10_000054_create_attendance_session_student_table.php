<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_session_student', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('attendance_session_id');
            $table->unsignedBigInteger('student_id');

            $table->unique(['attendance_session_id', 'student_id'], 'ass_session_student_unique');
            $table->index(['student_id'], 'attendance_session_student_student_id_foreign');

            $table->foreign(['attendance_session_id'], 'attendance_session_student_attendance_session_id_foreign')
                ->references(['id'])->on('attendance_sessions')
                ->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['student_id'], 'attendance_session_student_student_id_foreign')
                ->references(['id'])->on('students')
                ->onUpdate('no action')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_session_student');
    }
};
