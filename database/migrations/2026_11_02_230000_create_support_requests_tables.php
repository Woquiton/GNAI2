<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('support_requests', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->restrictOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->date('request_date');
            $table->string('academic_context')->nullable();
            $table->string('requester_name');
            $table->string('requester_role', 40);
            $table->string('requester_other', 150)->nullable();
            $table->string('requester_contact')->nullable();
            $table->text('reason');
            $table->text('school_difficulties')->nullable();
            $table->string('diagnosis_status', 30)->default('not_informed');
            $table->text('diagnosis_notes')->nullable();
            $table->json('requested_supports');
            $table->text('other_support')->nullable();
            $table->string('status', 30)->default('received')->index();
            $table->text('analysis_notes')->nullable();
            $table->text('referrals')->nullable();
            $table->timestamps();
            $table->index(['student_id', 'request_date']);
        });

        Schema::create('support_request_attachments', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('support_request_id')->constrained('support_requests')->cascadeOnDelete();
            $table->string('file_path');
            $table->string('original_name');
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('support_request_attachments');
        Schema::dropIfExists('support_requests');
    }
};
