<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paee_resources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paee_id')->constrained('paees')->cascadeOnDelete();
            $table->text('description');
            $table->string('acquisition_type');

            // Vincula ao catálogo de Tecnologia Assistiva do módulo Radar Inclusivo,
            // quando o recurso já existir cadastrado lá. Nullable pois o recurso pode
            // ainda não existir no catálogo (ex: "a produzir"/"a adquirir").
            $table->foreignId('assistive_technology_id')
                ->nullable()
                ->constrained('assistive_technologies')
                ->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paee_resources');
    }
};
