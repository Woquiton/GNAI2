<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('person_tag', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->unsignedBigInteger('person_id');
            $table->unsignedBigInteger('tag_id');

            $table->index(['tag_id'], 'person_tag_tag_id_foreign');
            $table->primary(['person_id', 'tag_id']);

            $table->foreign(['person_id'], 'person_tag_person_id_foreign')
                ->references(['id'])->on('people')
                ->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['tag_id'], 'person_tag_tag_id_foreign')
                ->references(['id'])->on('tags')
                ->onUpdate('no action')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('person_tag');
    }
};
