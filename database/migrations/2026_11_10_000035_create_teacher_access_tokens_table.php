<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teacher_access_tokens', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('teacher_id');
            $table->string('token_hash', 64);
            $table->timestamp('expires_at');
            $table->timestamp('used_at')->nullable();
            $table->string('requester_ip', 45)->nullable();
            $table->timestamp('created_at')->nullable();

            $table->index(['teacher_id'], 'teacher_access_tokens_teacher_id_foreign');
            $table->unique(['token_hash'], 'teacher_access_tokens_token_hash_unique');

            $table->foreign(['teacher_id'], 'teacher_access_tokens_teacher_id_foreign')
                ->references(['id'])->on('teachers')
                ->onUpdate('no action')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teacher_access_tokens');
    }
};
