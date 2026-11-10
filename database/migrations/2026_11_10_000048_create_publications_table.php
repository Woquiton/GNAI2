<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('publications', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->string('title');
            $table->string('slug', 180)->nullable();
            $table->string('summary', 500)->nullable();
            $table->string('type', 30)->default('event');
            $table->boolean('has_schedule')->default(1);
            $table->text('description')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->string('location')->nullable();
            $table->string('organizer')->nullable();
            $table->string('audience')->nullable();
            $table->unsignedBigInteger('author_id')->nullable();
            $table->string('link_url', 500)->nullable();
            $table->string('link_label', 80)->nullable();
            $table->string('cover_path')->nullable();
            $table->string('cover_alt')->nullable();
            $table->boolean('is_active')->default(1);
            $table->timestamp('published_at')->nullable();
            $table->boolean('is_featured')->default(0);
            $table->string('seo_title')->nullable();
            $table->string('seo_description', 300)->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('semester_id')->nullable();

            $table->index(['author_id'], 'institutional_events_author_id_foreign');
            $table->unique(['slug'], 'institutional_events_slug_unique');
            $table->index(['semester_id'], 'publications_semester_id_foreign');

            $table->foreign(['author_id'], 'institutional_events_author_id_foreign')
                ->references(['id'])->on('users')
                ->onUpdate('no action')->onDelete('set null');
            $table->foreign(['semester_id'], 'publications_semester_id_foreign')
                ->references(['id'])->on('semesters')
                ->onUpdate('no action')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('publications');
    }
};
