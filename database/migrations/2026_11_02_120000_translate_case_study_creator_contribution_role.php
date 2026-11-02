<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/** A contribuição automática da criação do Estudo de Caso passa a ter o papel em português. */
return new class extends Migration
{
    public function up(): void
    {
        DB::table('case_study_contributions')
            ->where('role', 'creator')
            ->update(['role' => 'Criador']);
    }

    public function down(): void
    {
        DB::table('case_study_contributions')
            ->where('role', 'Criador')
            ->update(['role' => 'creator']);
    }
};
