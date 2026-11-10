<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pendencies', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('created_by');
            $table->unsignedBigInteger('assigned_to');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('priority');
            $table->date('due_date')->nullable();
            $table->boolean('is_completed')->default(0);
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('semester_id')->nullable();
            $table->dateTime('completed_at')->nullable();

            $table->index(['assigned_to'], 'pendencies_assigned_to_foreign');
            $table->index(['completed_at'], 'pendencies_completed_at_index');
            $table->index(['created_by'], 'pendencies_created_by_foreign');
            $table->index(['semester_id'], 'pendencies_semester_id_foreign');

            $table->foreign(['assigned_to'], 'pendencies_assigned_to_foreign')
                ->references(['id'])->on('professionals')
                ->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['created_by'], 'pendencies_created_by_foreign')
                ->references(['id'])->on('users')
                ->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['semester_id'], 'pendencies_semester_id_foreign')
                ->references(['id'])->on('semesters')
                ->onUpdate('no action')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pendencies');
    }
};
