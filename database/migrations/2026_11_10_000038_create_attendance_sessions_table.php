<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_sessions', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('professional_id');
            $table->unsignedBigInteger('creator_id')->nullable();
            $table->date('session_date');
            $table->time('start_time');
            $table->time('end_time')->nullable();
            $table->string('type');
            $table->string('attendance_type')->default('aee');
            $table->string('location');
            $table->text('session_objective');
            $table->string('status');
            $table->string('origin', 30)->default('scheduling');
            $table->text('cancellation_reason')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('semester_id')->nullable();

            $table->index(['attendance_type'], 'attendance_sessions_attendance_type_index');
            $table->index(['creator_id'], 'attendance_sessions_creator_id_foreign');
            $table->index(['professional_id'], 'attendance_sessions_professional_id_foreign');
            $table->index(['semester_id'], 'attendance_sessions_semester_id_foreign');

            $table->foreign(['creator_id'], 'attendance_sessions_creator_id_foreign')
                ->references(['id'])->on('users')
                ->onUpdate('no action')->onDelete('set null');
            $table->foreign(['professional_id'], 'attendance_sessions_professional_id_foreign')
                ->references(['id'])->on('professionals')
                ->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['semester_id'], 'attendance_sessions_semester_id_foreign')
                ->references(['id'])->on('semesters')
                ->onUpdate('no action')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_sessions');
    }
};
