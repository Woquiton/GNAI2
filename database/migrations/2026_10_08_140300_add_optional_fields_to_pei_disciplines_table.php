<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Cadernos orientadores, Apêndice 4: campos adicionais por disciplina,
     * todos opcionais para não travar o formulário (nem a finalização do PEI).
     */
    public function up(): void
    {
        Schema::table('pei_disciplines', function (Blueprint $table): void {
            $table->text('curricular_reference')->nullable()->after('content_programmatic');
            $table->text('materials_and_assistive_technology')->nullable()->after('methodologies');
            $table->string('objectives_deadline')->nullable()->after('specific_objectives');
        });
    }

    public function down(): void
    {
        Schema::table('pei_disciplines', function (Blueprint $table): void {
            $table->dropColumn(['curricular_reference', 'materials_and_assistive_technology', 'objectives_deadline']);
        });
    }
};
