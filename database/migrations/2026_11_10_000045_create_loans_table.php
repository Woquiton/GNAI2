<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loans', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->string('loanable_type');
            $table->unsignedBigInteger('loanable_id');
            $table->unsignedBigInteger('student_id')->nullable();
            $table->unsignedBigInteger('professional_id')->nullable();
            $table->unsignedBigInteger('user_id');
            $table->dateTime('loan_date');
            $table->dateTime('due_date');
            $table->dateTime('return_date')->nullable();
            $table->string('status')->default('active');
            $table->text('observation')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('semester_id')->nullable();

            $table->index(['loanable_type', 'loanable_id'], 'loans_loanable_type_loanable_id_index');
            $table->index(['professional_id'], 'loans_professional_id_foreign');
            $table->index(['semester_id'], 'loans_semester_id_foreign');
            $table->index(['student_id'], 'loans_student_id_foreign');
            $table->index(['user_id'], 'loans_user_id_foreign');

            $table->foreign(['professional_id'], 'loans_professional_id_foreign')
                ->references(['id'])->on('professionals')
                ->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['semester_id'], 'loans_semester_id_foreign')
                ->references(['id'])->on('semesters')
                ->onUpdate('no action')->onDelete('restrict');
            $table->foreign(['student_id'], 'loans_student_id_foreign')
                ->references(['id'])->on('students')
                ->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['user_id'], 'loans_user_id_foreign')
                ->references(['id'])->on('users')
                ->onUpdate('no action')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loans');
    }
};
