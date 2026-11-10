<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('support_requests', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->date('request_date');
            $table->string('academic_context')->nullable();
            $table->string('requester_name');
            $table->string('requester_role', 40);
            $table->string('requester_other', 150)->nullable();
            $table->string('requester_contact')->nullable();
            $table->text('reason')->nullable();
            $table->text('school_difficulties')->nullable();
            $table->string('diagnosis_status', 30)->default('not_informed');
            $table->text('diagnosis_notes')->nullable();
            $table->json('requested_supports');
            $table->text('other_support')->nullable();
            $table->string('status', 30)->default('received');
            $table->text('analysis_notes')->nullable();
            $table->text('referrals')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('course_id')->nullable();
            $table->string('reason_type', 20)->default('other');
            $table->unsignedBigInteger('semester_id')->nullable();

            $table->index(['course_id'], 'support_requests_course_id_foreign');
            $table->index(['created_by'], 'support_requests_created_by_foreign');
            $table->index(['semester_id'], 'support_requests_semester_id_foreign');
            $table->index(['status'], 'support_requests_status_index');
            $table->index(['student_id', 'request_date'], 'support_requests_student_id_request_date_index');

            $table->foreign(['course_id'], 'support_requests_course_id_foreign')
                ->references(['id'])->on('courses')
                ->onUpdate('no action')->onDelete('set null');
            $table->foreign(['created_by'], 'support_requests_created_by_foreign')
                ->references(['id'])->on('users')
                ->onUpdate('no action')->onDelete('set null');
            $table->foreign(['semester_id'], 'support_requests_semester_id_foreign')
                ->references(['id'])->on('semesters')
                ->onUpdate('no action')->onDelete('restrict');
            $table->foreign(['student_id'], 'support_requests_student_id_foreign')
                ->references(['id'])->on('students')
                ->onUpdate('no action')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('support_requests');
    }
};
