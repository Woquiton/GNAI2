<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->string('name');
            $table->string('email');
            $table->string('photo')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->boolean('is_admin')->default(0);
            $table->boolean('is_super_admin')->default(0);
            $table->string('remember_token', 100)->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->string('role')->default('professional');
            $table->unsignedBigInteger('professional_id')->nullable();
            $table->unsignedBigInteger('teacher_id')->nullable();
            $table->boolean('password_configured')->default(0);

            $table->unique(['email'], 'users_email_unique');
            $table->index(['professional_id'], 'users_professional_id_foreign');
            $table->index(['teacher_id'], 'users_teacher_id_foreign');

            $table->foreign(['professional_id'], 'users_professional_id_foreign')
                ->references(['id'])->on('professionals')
                ->onUpdate('no action')->onDelete('set null');
            $table->foreign(['teacher_id'], 'users_teacher_id_foreign')
                ->references(['id'])->on('teachers')
                ->onUpdate('no action')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
