<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('person_id');
            $table->string('registration');
            $table->date('entry_date')->nullable();
            $table->string('status', 50)->default('active');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->string('follow_up_type', 50)->nullable();

            $table->index(['person_id'], 'students_person_id_foreign');
            $table->unique(['registration'], 'students_registration_unique');

            $table->foreign(['person_id'], 'students_person_id_foreign')
                ->references(['id'])->on('people')
                ->onUpdate('no action')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
