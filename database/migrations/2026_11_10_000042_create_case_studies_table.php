<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('case_studies', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('creator_id');
            $table->unsignedBigInteger('semester_id');
            $table->unsignedInteger('version')->default(1);
            $table->boolean('is_current')->default(0);
            $table->string('status')->default('draft');
            $table->string('demand_origin');
            $table->longText('participants_summary')->nullable();
            $table->date('study_date')->nullable();
            $table->longText('student_observation');
            $table->longText('student_family_listening');
            $table->longText('teachers_listening');
            $table->longText('other_info')->nullable();
            $table->longText('care_network_notes')->nullable();
            $table->longText('favorable_aspects');
            $table->longText('potentials_interests');
            $table->json('needed_supports');
            $table->longText('needed_supports_justification')->nullable();
            $table->string('acceptance_status');
            $table->date('acceptance_date')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->index(['creator_id'], 'case_studies_creator_id_foreign');
            $table->index(['semester_id'], 'case_studies_semester_id_foreign');
            $table->index(['student_id'], 'case_studies_student_id_foreign');

            $table->foreign(['creator_id'], 'case_studies_creator_id_foreign')
                ->references(['id'])->on('users')
                ->onUpdate('no action')->onDelete('restrict');
            $table->foreign(['semester_id'], 'case_studies_semester_id_foreign')
                ->references(['id'])->on('semesters')
                ->onUpdate('no action')->onDelete('restrict');
            $table->foreign(['student_id'], 'case_studies_student_id_foreign')
                ->references(['id'])->on('students')
                ->onUpdate('no action')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('case_studies');
    }
};
