<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('email_mailbox_states', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->char('email_delivery_id', 36);
            $table->unsignedBigInteger('user_id');
            $table->string('folder', 20)->nullable();
            $table->boolean('starred')->default(0);
            $table->boolean('is_read')->default(1);
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('tag_id')->nullable();

            $table->unique(['email_delivery_id', 'user_id'], 'email_mailbox_states_email_delivery_id_user_id_unique');
            $table->index(['tag_id'], 'email_mailbox_states_tag_id_foreign');
            $table->index(['user_id', 'folder'], 'email_mailbox_states_user_id_folder_index');

            $table->foreign(['email_delivery_id'], 'email_mailbox_states_email_delivery_id_foreign')
                ->references(['id'])->on('email_deliveries')
                ->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['tag_id'], 'email_mailbox_states_tag_id_foreign')
                ->references(['id'])->on('tags')
                ->onUpdate('no action')->onDelete('set null');
            $table->foreign(['user_id'], 'email_mailbox_states_user_id_foreign')
                ->references(['id'])->on('users')
                ->onUpdate('no action')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('email_mailbox_states');
    }
};
