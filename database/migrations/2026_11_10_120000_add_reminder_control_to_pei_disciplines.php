<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pei_disciplines', function (Blueprint $table): void {
            $table->timestamp('reminder_cycle_started_at')->nullable();
            $table->timestamp('reminders_stopped_at')->nullable();
            $table->foreignId('reminders_stopped_by')->nullable()->constrained('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('pei_disciplines', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('reminders_stopped_by');
            $table->dropColumn(['reminder_cycle_started_at', 'reminders_stopped_at']);
        });
    }
};
