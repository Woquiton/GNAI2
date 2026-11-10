<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_guardians', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('person_id');
            $table->string('relationship');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->index(['person_id'], 'student_guardians_person_id_foreign');
            $table->unique(['student_id', 'person_id'], 'student_guardians_student_id_person_id_unique');

            $table->foreign(['person_id'], 'student_guardians_person_id_foreign')
                ->references(['id'])->on('people')
                ->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['student_id'], 'student_guardians_student_id_foreign')
                ->references(['id'])->on('students')
                ->onUpdate('no action')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_guardians');
    }
};
