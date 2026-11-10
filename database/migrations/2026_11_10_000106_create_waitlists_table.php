<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('waitlists', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->string('waitlistable_type');
            $table->unsignedBigInteger('waitlistable_id');
            $table->unsignedBigInteger('student_id')->nullable();
            $table->unsignedBigInteger('professional_id')->nullable();
            $table->unsignedBigInteger('user_id');
            $table->timestamp('requested_at')->useCurrent();
            $table->string('status')->default('waiting');
            $table->text('observation')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('semester_id')->nullable();
            $table->dateTime('notified_at')->nullable();
            $table->dateTime('fulfilled_at')->nullable();
            $table->dateTime('cancelled_at')->nullable();
            $table->unsignedBigInteger('fulfilled_loan_id')->nullable();

            $table->unique(['waitlistable_id', 'waitlistable_type', 'student_id', 'professional_id'], 'unique_waitlist_entry');
            $table->index(['cancelled_at'], 'waitlists_cancelled_at_index');
            $table->index(['fulfilled_at'], 'waitlists_fulfilled_at_index');
            $table->index(['fulfilled_loan_id'], 'waitlists_fulfilled_loan_id_foreign');
            $table->index(['notified_at'], 'waitlists_notified_at_index');
            $table->index(['professional_id'], 'waitlists_professional_id_foreign');
            $table->index(['semester_id'], 'waitlists_semester_id_foreign');
            $table->index(['student_id'], 'waitlists_student_id_foreign');
            $table->index(['user_id'], 'waitlists_user_id_foreign');
            $table->index(['waitlistable_type', 'waitlistable_id'], 'waitlists_waitlistable_type_waitlistable_id_index');

            $table->foreign(['fulfilled_loan_id'], 'waitlists_fulfilled_loan_id_foreign')
                ->references(['id'])->on('loans')
                ->onUpdate('no action')->onDelete('restrict');
            $table->foreign(['professional_id'], 'waitlists_professional_id_foreign')
                ->references(['id'])->on('professionals')
                ->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['semester_id'], 'waitlists_semester_id_foreign')
                ->references(['id'])->on('semesters')
                ->onUpdate('no action')->onDelete('restrict');
            $table->foreign(['student_id'], 'waitlists_student_id_foreign')
                ->references(['id'])->on('students')
                ->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['user_id'], 'waitlists_user_id_foreign')
                ->references(['id'])->on('users')
                ->onUpdate('no action')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('waitlists');
    }
};
