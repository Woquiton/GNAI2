<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('aee_records', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('attendance_session_id');
            $table->string('duration');
            $table->longText('activities_performed');
            $table->longText('strategies_used')->nullable();
            $table->longText('resources_used')->nullable();
            $table->text('general_observations')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('deleted_at')->nullable();

            $table->unique(['attendance_session_id'], 'aee_records_attendance_session_id_unique');

            $table->foreign(['attendance_session_id'], 'aee_records_attendance_session_id_foreign')
                ->references(['id'])->on('attendance_sessions')
                ->onUpdate('no action')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('aee_records');
    }
};
