<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('publication_speakers', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('publication_id');
            $table->unsignedBigInteger('professional_id')->nullable();
            $table->string('name', 150)->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->string('participation', 100)->nullable();

            $table->unique(['publication_id', 'professional_id'], 'event_speaker_unique');
            $table->index(['professional_id'], 'institutional_event_speakers_professional_id_foreign');

            $table->foreign(['publication_id'], 'institutional_event_speakers_institutional_event_id_foreign')
                ->references(['id'])->on('publications')
                ->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['professional_id'], 'institutional_event_speakers_professional_id_foreign')
                ->references(['id'])->on('professionals')
                ->onUpdate('no action')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('publication_speakers');
    }
};
