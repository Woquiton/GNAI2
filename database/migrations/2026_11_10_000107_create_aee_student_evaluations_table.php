<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('aee_student_evaluations', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('aee_record_id');
            $table->unsignedBigInteger('student_id');
            $table->boolean('is_present')->default(1);
            $table->boolean('with_guardians')->default(0);
            $table->text('absence_reason')->nullable();
            $table->longText('adaptations_made')->nullable();
            $table->longText('student_participation')->nullable();
            $table->longText('development_evaluation')->nullable();
            $table->longText('progress_indicators')->nullable();
            $table->longText('recommendations')->nullable();
            $table->longText('next_session_adjustments')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('deleted_at')->nullable();

            $table->index(['student_id'], 'aee_student_evaluations_student_id_foreign');
            $table->unique(['aee_record_id', 'student_id'], 'unique_aee_student_evaluation');

            $table->foreign(['aee_record_id'], 'aee_student_evaluations_aee_record_id_foreign')
                ->references(['id'])->on('aee_records')
                ->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['student_id'], 'aee_student_evaluations_student_id_foreign')
                ->references(['id'])->on('students')
                ->onUpdate('no action')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('aee_student_evaluations');
    }
};
