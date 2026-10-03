<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('case_studies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('creator_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('semester_id')->constrained('semesters')->cascadeOnDelete();

            $table->unsignedInteger('version')->default(1);
            $table->boolean('is_current')->default(true);

            $table->string('status')->default('draft');
            $table->string('demand_origin');

            $table->text('participants_summary')->nullable();
            $table->longText('student_observation');
            $table->longText('student_family_listening');
            $table->longText('teachers_listening');
            $table->text('other_info')->nullable();
            $table->text('care_network_notes')->nullable();

            $table->text('favorable_aspects');
            $table->text('potentials_interests');

            $table->json('needed_supports');
            $table->text('needed_supports_justification')->nullable();

            $table->string('acceptance_status');
            $table->date('acceptance_date')->nullable();

            $table->timestamp('completed_at')->nullable();

            $table->timestamps();

            $table->unique(['student_id', 'version']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('case_studies');
    }
};
