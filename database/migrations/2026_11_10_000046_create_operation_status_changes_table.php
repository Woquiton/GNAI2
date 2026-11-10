<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('operation_status_changes', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->string('record_type', 64);
            $table->unsignedBigInteger('record_id');
            $table->string('field', 64);
            $table->text('from_value')->nullable();
            $table->text('to_value')->nullable();
            $table->dateTime('occurred_at');
            $table->dateTime('recorded_at');
            $table->unsignedBigInteger('semester_id')->nullable();
            $table->unsignedBigInteger('actor_id')->nullable();

            $table->index(['actor_id'], 'operation_status_changes_actor_id_foreign');
            $table->index(['occurred_at'], 'operation_status_changes_occurred_at_index');
            $table->index(['semester_id'], 'operation_status_changes_semester_id_foreign');
            $table->index(['record_type', 'record_id', 'occurred_at'], 'operation_status_record_date');

            $table->foreign(['actor_id'], 'operation_status_changes_actor_id_foreign')
                ->references(['id'])->on('users')
                ->onUpdate('no action')->onDelete('set null');
            $table->foreign(['semester_id'], 'operation_status_changes_semester_id_foreign')
                ->references(['id'])->on('semesters')
                ->onUpdate('no action')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('operation_status_changes');
    }
};
