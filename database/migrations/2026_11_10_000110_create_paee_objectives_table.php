<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paee_objectives', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('paee_id');
            $table->unsignedBigInteger('linked_barrier_id')->nullable();
            $table->text('description');
            $table->string('term');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->index(['linked_barrier_id'], 'paee_objectives_linked_barrier_id_foreign');
            $table->index(['paee_id'], 'paee_objectives_paee_id_foreign');

            $table->foreign(['linked_barrier_id'], 'paee_objectives_linked_barrier_id_foreign')
                ->references(['id'])->on('case_study_barriers')
                ->onUpdate('no action')->onDelete('set null');
            $table->foreign(['paee_id'], 'paee_objectives_paee_id_foreign')
                ->references(['id'])->on('paees')
                ->onUpdate('no action')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paee_objectives');
    }
};
