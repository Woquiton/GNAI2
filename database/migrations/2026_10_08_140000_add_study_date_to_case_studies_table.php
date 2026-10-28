<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Decreto 12.686/2025, art. 11: o Estudo de Caso precisa registrar quando
     * (e com quem) foi realizado, além do resumo já existente dos participantes.
     */
    public function up(): void
    {
        Schema::table('case_studies', function (Blueprint $table): void {
            $table->date('study_date')->nullable()->after('participants_summary');
        });
    }

    public function down(): void
    {
        Schema::table('case_studies', function (Blueprint $table): void {
            $table->dropColumn('study_date');
        });
    }
};
