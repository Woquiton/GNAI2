<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('email_mailbox_states', function (Blueprint $table): void {
            $table->id();
            $table->foreignUuid('email_delivery_id')->constrained('email_deliveries')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('folder', 20)->nullable();
            $table->string('label', 20)->nullable();
            $table->boolean('starred')->default(false);
            $table->boolean('is_read')->default(true);
            $table->timestamps();
            $table->unique(['email_delivery_id', 'user_id']);
            $table->index(['user_id', 'folder']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('email_mailbox_states');
    }
};
