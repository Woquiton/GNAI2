<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->string('item_type');
            $table->string('name');
            $table->boolean('is_digital')->default(0);
            $table->longText('notes')->nullable();
            $table->string('asset_code', 50)->nullable();
            $table->integer('quantity')->nullable();
            $table->integer('quantity_available')->nullable();
            $table->string('conservation_state')->default('novo');
            $table->string('status')->default('available');
            $table->boolean('is_loanable')->default(1);
            $table->boolean('is_active')->default(1);
            $table->timestamp('deleted_at')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('cover_evidence_id')->nullable();

            $table->unique(['asset_code'], 'items_asset_code_unique');
            $table->index(['cover_evidence_id'], 'items_cover_evidence_id_foreign');
            $table->index(['item_type'], 'items_item_type_index');

            $table->foreign(['cover_evidence_id'], 'items_cover_evidence_id_foreign')
                ->references(['id'])->on('inspection_evidences')
                ->onUpdate('no action')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
