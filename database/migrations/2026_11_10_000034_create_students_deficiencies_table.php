<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students_deficiencies', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('deficiency_id');
            $table->string('severity', 50)->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->index(['deficiency_id'], 'students_deficiencies_deficiency_id_foreign');
            $table->unique(['student_id', 'deficiency_id'], 'students_deficiencies_student_id_deficiency_id_unique');

            $table->foreign(['deficiency_id'], 'students_deficiencies_deficiency_id_foreign')
                ->references(['id'])->on('deficiencies')
                ->onUpdate('no action')->onDelete('restrict');
            $table->foreign(['student_id'], 'students_deficiencies_student_id_foreign')
                ->references(['id'])->on('students')
                ->onUpdate('no action')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students_deficiencies');
    }
};
