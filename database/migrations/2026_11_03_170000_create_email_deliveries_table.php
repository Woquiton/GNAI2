<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('email_deliveries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('deduplication_key', 64)->unique();
            $table->string('context_type', 80);
            $table->unsignedBigInteger('context_id');
            $table->string('purpose', 80);
            $table->text('recipient_email')->nullable();
            $table->text('recipient_name')->nullable();
            $table->string('subject');
            $table->string('view');
            $table->string('text_view')->nullable();
            $table->longText('payload');
            $table->string('status', 30);
            $table->unsignedInteger('attempts')->default(0);
            $table->timestamp('last_attempt_at')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->string('message_id')->nullable();
            $table->string('error_type')->nullable();
            $table->timestamps();
            $table->index(['context_type', 'context_id', 'purpose']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('email_deliveries');
    }
};
