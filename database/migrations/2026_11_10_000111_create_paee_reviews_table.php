<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paee_reviews', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('paee_id');
            $table->date('reviewed_at');
            $table->longText('what_changed');
            $table->longText('why');
            $table->unsignedBigInteger('reviewer_id');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->index(['paee_id'], 'paee_reviews_paee_id_foreign');
            $table->index(['reviewer_id'], 'paee_reviews_reviewer_id_foreign');

            $table->foreign(['paee_id'], 'paee_reviews_paee_id_foreign')
                ->references(['id'])->on('paees')
                ->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['reviewer_id'], 'paee_reviews_reviewer_id_foreign')
                ->references(['id'])->on('users')
                ->onUpdate('no action')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paee_reviews');
    }
};
