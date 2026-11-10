<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pedagogical_records', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('attendance_session_id');
            $table->longText('follow_up_reason')->nullable();
            $table->string('duration', 50);
            $table->boolean('is_present')->default(1);
            $table->text('absence_reason')->nullable();
            $table->longText('systematic_pedagogical_follow_up_record')->nullable();
            $table->longText('strategies_and_resources_adopted')->nullable();
            $table->longText('referrals_made')->nullable();
            $table->longText('complementary_observations')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('deleted_at')->nullable();

            $table->unique(['attendance_session_id'], 'pedagogical_records_attendance_session_id_unique');

            $table->foreign(['attendance_session_id'], 'pedagogical_records_attendance_session_id_foreign')
                ->references(['id'])->on('attendance_sessions')
                ->onUpdate('no action')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pedagogical_records');
    }
};
