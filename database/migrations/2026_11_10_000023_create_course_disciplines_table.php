<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_disciplines', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('course_id');
            $table->unsignedBigInteger('discipline_id');
            $table->unsignedTinyInteger('course_period')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->unique(['course_id', 'discipline_id'], 'course_disciplines_course_id_discipline_id_unique');
            $table->index(['discipline_id'], 'course_disciplines_discipline_id_foreign');

            $table->foreign(['course_id'], 'course_disciplines_course_id_foreign')
                ->references(['id'])->on('courses')
                ->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['discipline_id'], 'course_disciplines_discipline_id_foreign')
                ->references(['id'])->on('disciplines')
                ->onUpdate('no action')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_disciplines');
    }
};
