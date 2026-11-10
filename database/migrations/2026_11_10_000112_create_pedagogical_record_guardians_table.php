<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pedagogical_record_guardians', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('pedagogical_record_id');
            $table->unsignedBigInteger('guardian_id');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->unique(['pedagogical_record_id', 'guardian_id'], 'ped_record_guardians_record_guardian_unique');
            $table->index(['guardian_id'], 'pedagogical_record_guardians_guardian_id_foreign');

            $table->foreign(['guardian_id'], 'pedagogical_record_guardians_guardian_id_foreign')
                ->references(['id'])->on('student_guardians')
                ->onUpdate('no action')->onDelete('restrict');
            $table->foreign(['pedagogical_record_id'], 'pedagogical_record_guardians_pedagogical_record_id_foreign')
                ->references(['id'])->on('pedagogical_records')
                ->onUpdate('no action')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pedagogical_record_guardians');
    }
};
