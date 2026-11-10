<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_records', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->char('operation', 36);
            $table->unsignedBigInteger('actor_id')->nullable();
            $table->string('actor_name')->nullable();
            $table->unsignedBigInteger('impersonator_id')->nullable();
            $table->string('impersonator_name')->nullable();
            $table->string('event', 20);
            $table->string('entity_type', 60);
            $table->string('entity_id', 64);
            $table->string('entity_description');
            $table->json('changes');
            $table->json('referenced_names')->nullable();
            $table->json('context')->nullable();
            $table->timestamp('created_at')->nullable();

            $table->index(['actor_id'], 'audit_records_actor_id_index');
            $table->index(['created_at'], 'audit_records_created_at_index');
            $table->index(['entity_type', 'entity_id'], 'audit_records_entity_type_entity_id_index');
            $table->index(['impersonator_id'], 'audit_records_impersonator_id_foreign');
            $table->index(['operation'], 'audit_records_operation_index');

            $table->foreign(['actor_id'], 'audit_records_actor_id_foreign')
                ->references(['id'])->on('users')
                ->onUpdate('no action')->onDelete('set null');
            $table->foreign(['impersonator_id'], 'audit_records_impersonator_id_foreign')
                ->references(['id'])->on('users')
                ->onUpdate('no action')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_records');
    }
};
