<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('email_deliveries', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->char('id', 36);
            $table->string('deduplication_key', 64);
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
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->char('in_reply_to_id', 36)->nullable();
            $table->timestamp('received_at')->nullable();
            $table->string('gmail_account_hash', 64)->nullable();
            $table->string('gmail_message_id', 32)->nullable();
            $table->string('gmail_folder', 20)->nullable();
            $table->timestamp('gmail_synced_at')->nullable();

            $table->index(['context_type', 'context_id', 'purpose'], 'email_deliveries_context_type_context_id_purpose_index');
            $table->index(['context_type', 'created_at', 'id'], 'email_deliveries_context_type_created_at_id_index');
            $table->index(['created_at', 'id'], 'email_deliveries_created_at_id_index');
            $table->unique(['deduplication_key'], 'email_deliveries_deduplication_key_unique');
            $table->index(['gmail_account_hash'], 'email_deliveries_gmail_account_hash_index');
            $table->index(['gmail_synced_at'], 'email_deliveries_gmail_synced_at_index');
            $table->index(['in_reply_to_id'], 'email_deliveries_in_reply_to_id_foreign');
            $table->index(['message_id'], 'email_deliveries_message_id_index');
            $table->index(['status', 'created_at', 'id'], 'email_deliveries_status_created_at_id_index');
            $table->primary(['id']);

            $table->foreign(['in_reply_to_id'], 'email_deliveries_in_reply_to_id_foreign')
                ->references(['id'])->on('email_deliveries')
                ->onUpdate('no action')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('email_deliveries');
    }
};
