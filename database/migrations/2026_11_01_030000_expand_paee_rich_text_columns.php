<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const PAEE_COLUMNS = [
        'assistive_technology_notes',
        'caa_notes',
        'assistive_technology_availability_capacity',
        'assistive_technology_pedagogical_opinion',
        'support_professional_justification',
        'libras_interpreter_justification',
        'guide_interpreter_justification',
        'school_professionals_orientation',
        'common_teachers_articulation',
        'family_articulation',
        'intersectoral_articulation',
        'training_demands',
    ];

    public function up(): void
    {
        Schema::table('paees', function (Blueprint $table): void {
            foreach (self::PAEE_COLUMNS as $column) {
                $table->longText($column)->nullable()->change();
            }
        });

        Schema::table('paee_reviews', function (Blueprint $table): void {
            $table->longText('what_changed')->change();
            $table->longText('why')->change();
        });
    }

    public function down(): void
    {
        foreach (['paees' => self::PAEE_COLUMNS, 'paee_reviews' => ['what_changed', 'why']] as $table => $columns) {
            foreach ($columns as $column) {
                if (DB::table($table)->whereRaw("OCTET_LENGTH({$column}) > 65535")->exists()) {
                    throw new RuntimeException('Há conteúdo que excede o limite de TEXT. A reversão foi interrompida para preservar os dados.');
                }
            }
        }

        Schema::table('paees', function (Blueprint $table): void {
            foreach (self::PAEE_COLUMNS as $column) {
                $table->text($column)->nullable()->change();
            }
        });

        Schema::table('paee_reviews', function (Blueprint $table): void {
            $table->text('what_changed')->change();
            $table->text('why')->change();
        });
    }
};
