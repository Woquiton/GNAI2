<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('aee_student_evaluation_guardians', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('aee_student_evaluation_id');
            $table->unsignedBigInteger('guardian_id');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->unique(['aee_student_evaluation_id', 'guardian_id'], 'aee_eval_guardians_eval_guardian_unique');
            $table->index(['guardian_id'], 'aee_eval_guardians_guardian_fk');

            $table->foreign(['aee_student_evaluation_id'], 'aee_eval_guardians_evaluation_fk')
                ->references(['id'])->on('aee_student_evaluations')
                ->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['guardian_id'], 'aee_eval_guardians_guardian_fk')
                ->references(['id'])->on('student_guardians')
                ->onUpdate('no action')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('aee_student_evaluation_guardians');
    }
};
