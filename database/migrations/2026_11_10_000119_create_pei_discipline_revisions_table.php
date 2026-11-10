<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pei_discipline_revisions', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('pei_discipline_id');
            $table->date('reviewed_at');
            $table->text('what_changed');
            $table->text('why');
            $table->unsignedBigInteger('reviewer_id');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->index(['pei_discipline_id'], 'pei_discipline_revisions_pei_discipline_id_foreign');
            $table->index(['reviewer_id'], 'pei_discipline_revisions_reviewer_id_foreign');

            $table->foreign(['pei_discipline_id'], 'pei_discipline_revisions_pei_discipline_id_foreign')
                ->references(['id'])->on('pei_disciplines')
                ->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['reviewer_id'], 'pei_discipline_revisions_reviewer_id_foreign')
                ->references(['id'])->on('users')
                ->onUpdate('no action')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pei_discipline_revisions');
    }
};
