<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('professionals', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('person_id');
            $table->unsignedBigInteger('position_id');
            $table->string('registration');
            $table->date('entry_date');
            $table->string('status', 50)->default('active');
            $table->boolean('show_on_website')->default(0);
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->index(['person_id'], 'professionals_person_id_foreign');
            $table->index(['position_id'], 'professionals_position_id_foreign');
            $table->unique(['registration'], 'professionals_registration_unique');

            $table->foreign(['person_id'], 'professionals_person_id_foreign')
                ->references(['id'])->on('people')
                ->onUpdate('no action')->onDelete('restrict');
            $table->foreign(['position_id'], 'professionals_position_id_foreign')
                ->references(['id'])->on('positions')
                ->onUpdate('no action')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('professionals');
    }
};
