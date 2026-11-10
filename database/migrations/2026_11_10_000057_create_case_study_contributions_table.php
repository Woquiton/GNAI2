<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('case_study_contributions', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('case_study_id');
            $table->unsignedBigInteger('author_id');
            $table->string('role');
            $table->text('content');
            $table->timestamp('created_at')->useCurrent();

            $table->index(['author_id'], 'case_study_contributions_author_id_foreign');
            $table->index(['case_study_id'], 'case_study_contributions_case_study_id_foreign');

            $table->foreign(['author_id'], 'case_study_contributions_author_id_foreign')
                ->references(['id'])->on('users')
                ->onUpdate('no action')->onDelete('restrict');
            $table->foreign(['case_study_id'], 'case_study_contributions_case_study_id_foreign')
                ->references(['id'])->on('case_studies')
                ->onUpdate('no action')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('case_study_contributions');
    }
};
