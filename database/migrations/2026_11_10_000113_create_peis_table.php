<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('peis', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('creator_id');
            $table->unsignedBigInteger('semester_id');
            $table->unsignedBigInteger('course_id');
            $table->unsignedBigInteger('paee_id');
            $table->boolean('is_finished')->default(0);
            $table->text('other_relevant_info')->nullable();
            $table->unsignedInteger('version')->default(1);
            $table->boolean('is_current')->default(0);
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->index(['course_id'], 'peis_course_id_foreign');
            $table->index(['creator_id'], 'peis_creator_id_foreign');
            $table->index(['paee_id'], 'peis_paee_id_foreign');
            $table->index(['semester_id'], 'peis_semester_id_foreign');
            $table->index(['student_id'], 'peis_student_id_foreign');

            $table->foreign(['course_id'], 'peis_course_id_foreign')
                ->references(['id'])->on('courses')
                ->onUpdate('no action')->onDelete('restrict');
            $table->foreign(['creator_id'], 'peis_creator_id_foreign')
                ->references(['id'])->on('users')
                ->onUpdate('no action')->onDelete('restrict');
            $table->foreign(['paee_id'], 'peis_paee_id_foreign')
                ->references(['id'])->on('paees')
                ->onUpdate('no action')->onDelete('restrict');
            $table->foreign(['semester_id'], 'peis_semester_id_foreign')
                ->references(['id'])->on('semesters')
                ->onUpdate('no action')->onDelete('restrict');
            $table->foreign(['student_id'], 'peis_student_id_foreign')
                ->references(['id'])->on('students')
                ->onUpdate('no action')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('peis');
    }
};
