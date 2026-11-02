<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $knownStatuses = ['active', 'locked', 'completed', 'dropped', 'full_attendance', 'aee_only', 'pedagogical_only'];

        if (DB::table('students')->whereNotIn('status', $knownStatuses)->exists()) {
            throw new RuntimeException('Existem situações de alunos desconhecidas. Revise os dados legados antes de migrar.');
        }

        Schema::table('students', function (Blueprint $table): void {
            $table->string('follow_up_type', 50)->nullable();
        });

        // "Ativo" liberava ambos: mantém a compatibilidade, sem inferir atendimentos realizados.
        foreach ([
            'active' => 'both',
            'full_attendance' => 'both',
            'aee_only' => 'aee',
            'pedagogical_only' => 'pedagogical',
        ] as $legacyStatus => $followUpType) {
            DB::table('students')->where('status', $legacyStatus)->update([
                'status' => 'active',
                'follow_up_type' => $followUpType,
            ]);
        }
        // Inativos mantêm a situação e ficam sem modalidade, pois o status não a informa.
    }

    public function down(): void
    {
        foreach ([
            'aee' => 'aee_only',
            'pedagogical' => 'pedagogical_only',
            'both' => 'full_attendance',
        ] as $followUpType => $legacyStatus) {
            DB::table('students')
                ->where('status', 'active')
                ->where('follow_up_type', $followUpType)
                ->update(['status' => $legacyStatus]);
        }

        Schema::table('students', function (Blueprint $table): void {
            $table->dropColumn('follow_up_type');
        });
    }
};
