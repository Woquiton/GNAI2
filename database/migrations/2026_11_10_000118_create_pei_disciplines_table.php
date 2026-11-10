<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pei_disciplines', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('pei_id');
            $table->unsignedBigInteger('teacher_id');
            $table->unsignedBigInteger('creator_id');
            $table->unsignedBigInteger('discipline_id');
            $table->longText('specific_objectives');
            $table->string('objectives_deadline')->nullable();
            $table->longText('content_programmatic');
            $table->text('curricular_reference')->nullable();
            $table->longText('methodologies');
            $table->text('materials_and_assistive_technology')->nullable();
            $table->longText('evaluations');
            $table->text('opinion')->nullable();
            $table->longText('complementary_records')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->index(['creator_id'], 'pei_disciplines_creator_id_foreign');
            $table->index(['discipline_id'], 'pei_disciplines_discipline_id_foreign');
            $table->unique(['pei_id', 'discipline_id'], 'pei_disciplines_pei_id_discipline_id_unique');
            $table->index(['teacher_id'], 'pei_disciplines_teacher_id_foreign');

            $table->foreign(['creator_id'], 'pei_disciplines_creator_id_foreign')
                ->references(['id'])->on('users')
                ->onUpdate('no action')->onDelete('restrict');
            $table->foreign(['discipline_id'], 'pei_disciplines_discipline_id_foreign')
                ->references(['id'])->on('disciplines')
                ->onUpdate('no action')->onDelete('restrict');
            $table->foreign(['pei_id'], 'pei_disciplines_pei_id_foreign')
                ->references(['id'])->on('peis')
                ->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['teacher_id'], 'pei_disciplines_teacher_id_foreign')
                ->references(['id'])->on('teachers')
                ->onUpdate('no action')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pei_disciplines');
    }
};
