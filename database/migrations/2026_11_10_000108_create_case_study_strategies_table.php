<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('case_study_strategies', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('case_study_id');
            $table->unsignedBigInteger('linked_barrier_id')->nullable();
            $table->text('description');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->index(['case_study_id'], 'case_study_strategies_case_study_id_foreign');
            $table->index(['linked_barrier_id'], 'case_study_strategies_linked_barrier_id_foreign');

            $table->foreign(['case_study_id'], 'case_study_strategies_case_study_id_foreign')
                ->references(['id'])->on('case_studies')
                ->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['linked_barrier_id'], 'case_study_strategies_linked_barrier_id_foreign')
                ->references(['id'])->on('case_study_barriers')
                ->onUpdate('no action')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('case_study_strategies');
    }
};
