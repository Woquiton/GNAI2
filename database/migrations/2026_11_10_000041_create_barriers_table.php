<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('barriers', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('registered_by_user_id')->nullable();
            $table->unsignedBigInteger('institution_id');
            $table->unsignedBigInteger('barrier_category_id');
            $table->unsignedBigInteger('location_id')->nullable();
            $table->unsignedBigInteger('affected_student_id')->nullable();
            $table->unsignedBigInteger('affected_professional_id')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('location_specific_details')->nullable();
            $table->boolean('not_applicable')->default(0);
            $table->string('affected_person_name')->nullable();
            $table->string('affected_person_role')->nullable();
            $table->boolean('is_anonymous')->default(0);
            $table->string('priority')->default('medium');
            $table->date('identified_at');
            $table->date('resolved_at')->nullable();
            $table->boolean('is_active')->default(1);
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('semester_id')->nullable();

            $table->index(['affected_professional_id'], 'barriers_affected_professional_id_foreign');
            $table->index(['affected_student_id'], 'barriers_affected_student_id_foreign');
            $table->index(['barrier_category_id'], 'barriers_barrier_category_id_foreign');
            $table->index(['institution_id'], 'barriers_institution_id_foreign');
            $table->index(['location_id'], 'barriers_location_id_foreign');
            $table->index(['registered_by_user_id'], 'barriers_registered_by_user_id_foreign');
            $table->index(['semester_id'], 'barriers_semester_id_foreign');

            $table->foreign(['affected_professional_id'], 'barriers_affected_professional_id_foreign')
                ->references(['id'])->on('professionals')
                ->onUpdate('no action')->onDelete('set null');
            $table->foreign(['affected_student_id'], 'barriers_affected_student_id_foreign')
                ->references(['id'])->on('students')
                ->onUpdate('no action')->onDelete('set null');
            $table->foreign(['barrier_category_id'], 'barriers_barrier_category_id_foreign')
                ->references(['id'])->on('barrier_categories')
                ->onUpdate('no action')->onDelete('restrict');
            $table->foreign(['institution_id'], 'barriers_institution_id_foreign')
                ->references(['id'])->on('institutions')
                ->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['location_id'], 'barriers_location_id_foreign')
                ->references(['id'])->on('locations')
                ->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['registered_by_user_id'], 'barriers_registered_by_user_id_foreign')
                ->references(['id'])->on('users')
                ->onUpdate('no action')->onDelete('set null');
            $table->foreign(['semester_id'], 'barriers_semester_id_foreign')
                ->references(['id'])->on('semesters')
                ->onUpdate('no action')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('barriers');
    }
};
