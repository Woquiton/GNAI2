<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('email_deliveries', function (Blueprint $table): void {
            $table->string('gmail_account_hash', 64)->nullable()->index();
            $table->string('gmail_message_id', 32)->nullable();
            $table->string('gmail_folder', 20)->nullable();
            $table->timestamp('gmail_synced_at')->nullable()->index();
        });
    }

    public function down(): void
    {
        Schema::table('email_deliveries', function (Blueprint $table): void {
            $table->dropIndex(['gmail_account_hash']);
            $table->dropIndex(['gmail_synced_at']);
            $table->dropColumn(['gmail_account_hash', 'gmail_message_id', 'gmail_folder', 'gmail_synced_at']);
        });
    }
};
