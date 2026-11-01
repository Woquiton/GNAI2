<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Religa os recursos do PAEE às tecnologias assistivas, agora guardadas em
     * `items` com os mesmos ids (ver 2026_10_31_135900).
     */
    public function up(): void
    {
        if (! Schema::hasTable('paee_resources') || $this->hasForeignKey()) {
            return;
        }

        Schema::table('paee_resources', function (Blueprint $table): void {
            $table->foreign('assistive_technology_id')->references('id')->on('items')->nullOnDelete();
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('paee_resources')) {
            return;
        }

        foreach (Schema::getForeignKeys('paee_resources') as $foreignKey) {
            if ($foreignKey['columns'] === ['assistive_technology_id'] && $foreignKey['foreign_table'] === 'items') {
                Schema::table('paee_resources', function (Blueprint $table) use ($foreignKey): void {
                    $table->dropForeign($foreignKey['name']);
                });
            }
        }
    }

    private function hasForeignKey(): bool
    {
        foreach (Schema::getForeignKeys('paee_resources') as $foreignKey) {
            if ($foreignKey['columns'] === ['assistive_technology_id']) {
                return true;
            }
        }

        return false;
    }
};
