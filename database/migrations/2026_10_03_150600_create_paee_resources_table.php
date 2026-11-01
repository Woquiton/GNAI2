<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Em bancos que já unificaram tecnologias e materiais em `items`
        // (2026_10_31_140000), a tabela assistive_technologies não existe mais.
        $technologies = Schema::hasTable('assistive_technologies') ? 'assistive_technologies' : 'items';

        Schema::create('paee_resources', function (Blueprint $table) use ($technologies) {
            $table->id();
            $table->foreignId('paee_id')->constrained('paees')->cascadeOnDelete();
            $table->text('description');
            $table->string('acquisition_type');
            $table->foreignId('assistive_technology_id')->nullable()->constrained($technologies)->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paee_resources');
    }
};
