<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('email_deliveries', function (Blueprint $table): void {
            $table->foreignUuid('in_reply_to_id')->nullable()->constrained('email_deliveries')->nullOnDelete();
            $table->timestamp('received_at')->nullable();
            $table->index('message_id');
        });
    }

    public function down(): void
    {
        Schema::table('email_deliveries', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('in_reply_to_id');
            $table->dropColumn('received_at');
            $table->dropIndex(['message_id']);
        });
    }
};
