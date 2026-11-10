<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paee_resources', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('paee_id');
            $table->text('description');
            $table->string('acquisition_type');
            $table->unsignedBigInteger('assistive_technology_id')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->index(['assistive_technology_id'], 'paee_resources_assistive_technology_id_foreign');
            $table->index(['paee_id'], 'paee_resources_paee_id_foreign');

            $table->foreign(['assistive_technology_id'], 'paee_resources_assistive_technology_id_foreign')
                ->references(['id'])->on('items')
                ->onUpdate('no action')->onDelete('set null');
            $table->foreign(['paee_id'], 'paee_resources_paee_id_foreign')
                ->references(['id'])->on('paees')
                ->onUpdate('no action')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paee_resources');
    }
};
