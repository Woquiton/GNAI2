<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Cadernos orientadores, Apêndice 4, item 16: campo livre opcional pra
     * informações do PEI que não se encaixam nos blocos por disciplina.
     */
    public function up(): void
    {
        Schema::table('peis', function (Blueprint $table): void {
            $table->text('other_relevant_info')->nullable()->after('is_finished');
        });
    }

    public function down(): void
    {
        Schema::table('peis', function (Blueprint $table): void {
            $table->dropColumn('other_relevant_info');
        });
    }
};
