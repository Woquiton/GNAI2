<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('item_accessibility_feature', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('item_id');
            $table->unsignedBigInteger('accessibility_feature_id');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->index(['accessibility_feature_id'], 'item_accessibility_feature_accessibility_feature_id_foreign');
            $table->unique(['item_id', 'accessibility_feature_id'], 'item_feature_unique');

            $table->foreign(['accessibility_feature_id'], 'item_accessibility_feature_accessibility_feature_id_foreign')
                ->references(['id'])->on('accessibility_features')
                ->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['item_id'], 'item_accessibility_feature_item_id_foreign')
                ->references(['id'])->on('items')
                ->onUpdate('no action')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('item_accessibility_feature');
    }
};
