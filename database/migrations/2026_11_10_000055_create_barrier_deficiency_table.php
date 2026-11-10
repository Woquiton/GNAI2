<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('barrier_deficiency', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('barrier_id');
            $table->unsignedBigInteger('deficiency_id');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->unique(['barrier_id', 'deficiency_id'], 'barrier_deficiency_barrier_id_deficiency_id_unique');
            $table->index(['deficiency_id'], 'barrier_deficiency_deficiency_id_foreign');

            $table->foreign(['barrier_id'], 'barrier_deficiency_barrier_id_foreign')
                ->references(['id'])->on('barriers')
                ->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['deficiency_id'], 'barrier_deficiency_deficiency_id_foreign')
                ->references(['id'])->on('deficiencies')
                ->onUpdate('no action')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('barrier_deficiency');
    }
};
