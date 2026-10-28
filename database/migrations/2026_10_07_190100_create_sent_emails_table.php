<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sent_emails', function (Blueprint $table) {
            $table->id();
            $table->string('recipient');
            $table->string('type');
            $table->string('status');
            $table->text('error')->nullable();
            $table->timestamp('created_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sent_emails');
    }
};
