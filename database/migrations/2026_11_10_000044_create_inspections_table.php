<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inspections', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->string('inspectable_type');
            $table->unsignedBigInteger('inspectable_id');
            $table->string('state')->nullable();
            $table->string('status')->nullable();
            $table->string('type');
            $table->date('inspection_date');
            $table->longText('description')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('semester_id')->nullable();

            $table->index(['inspectable_type', 'inspectable_id'], 'inspections_inspectable_type_inspectable_id_index');
            $table->index(['semester_id'], 'inspections_semester_id_foreign');
            $table->index(['user_id'], 'inspections_user_id_foreign');

            $table->foreign(['semester_id'], 'inspections_semester_id_foreign')
                ->references(['id'])->on('semesters')
                ->onUpdate('no action')->onDelete('restrict');
            $table->foreign(['user_id'], 'inspections_user_id_foreign')
                ->references(['id'])->on('users')
                ->onUpdate('no action')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inspections');
    }
};
