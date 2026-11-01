<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * A unificação em `items` (2026_10_31_140000) apaga assistive_technologies.
     * Os recursos do PAEE apontam para essa tabela, então a chave estrangeira
     * precisa sair antes; 2026_10_31_140100 a recria apontando para `items`,
     * que preserva os ids das tecnologias assistivas.
     */
    public function up(): void
    {
        if (! Schema::hasTable('paee_resources')) {
            return;
        }

        foreach (Schema::getForeignKeys('paee_resources') as $foreignKey) {
            if ($foreignKey['columns'] === ['assistive_technology_id'] && $foreignKey['foreign_table'] === 'assistive_technologies') {
                Schema::table('paee_resources', function (Blueprint $table) use ($foreignKey): void {
                    $table->dropForeign($foreignKey['name']);
                });
            }
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('paee_resources') || ! Schema::hasTable('assistive_technologies')) {
            return;
        }

        Schema::table('paee_resources', function (Blueprint $table): void {
            $table->foreign('assistive_technology_id')->references('id')->on('assistive_technologies')->nullOnDelete();
        });
    }
};
