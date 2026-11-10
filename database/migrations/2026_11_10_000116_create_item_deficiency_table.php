<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('item_deficiency', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('item_id');
            $table->unsignedBigInteger('deficiency_id');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->index(['deficiency_id'], 'item_deficiency_deficiency_id_foreign');
            $table->unique(['item_id', 'deficiency_id'], 'item_deficiency_item_id_deficiency_id_unique');

            $table->foreign(['deficiency_id'], 'item_deficiency_deficiency_id_foreign')
                ->references(['id'])->on('deficiencies')
                ->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['item_id'], 'item_deficiency_item_id_foreign')
                ->references(['id'])->on('items')
                ->onUpdate('no action')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('item_deficiency');
    }
};
