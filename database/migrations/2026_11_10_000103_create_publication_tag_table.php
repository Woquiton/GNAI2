<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('publication_tag', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->unsignedBigInteger('publication_id');
            $table->unsignedBigInteger('tag_id');

            $table->primary(['publication_id', 'tag_id']);
            $table->index(['tag_id'], 'publication_tag_tag_id_foreign');

            $table->foreign(['publication_id'], 'publication_tag_publication_id_foreign')
                ->references(['id'])->on('publications')
                ->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['tag_id'], 'publication_tag_tag_id_foreign')
                ->references(['id'])->on('tags')
                ->onUpdate('no action')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('publication_tag');
    }
};
