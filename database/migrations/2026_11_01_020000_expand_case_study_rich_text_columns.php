<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const NULLABLE_COLUMNS = [
        'participants_summary',
        'other_info',
        'care_network_notes',
        'needed_supports_justification',
    ];

    private const REQUIRED_COLUMNS = [
        'favorable_aspects',
        'potentials_interests',
    ];

    public function up(): void
    {
        Schema::table('case_studies', function (Blueprint $table): void {
            foreach (self::NULLABLE_COLUMNS as $column) {
                $table->longText($column)->nullable()->change();
            }

            foreach (self::REQUIRED_COLUMNS as $column) {
                $table->longText($column)->change();
            }
        });
    }

    public function down(): void
    {
        foreach ([...self::NULLABLE_COLUMNS, ...self::REQUIRED_COLUMNS] as $column) {
            if (DB::table('case_studies')->whereRaw("OCTET_LENGTH({$column}) > 65535")->exists()) {
                throw new RuntimeException('Há conteúdo que excede o limite de TEXT. A reversão foi interrompida para preservar os dados.');
            }
        }

        Schema::table('case_studies', function (Blueprint $table): void {
            foreach (self::NULLABLE_COLUMNS as $column) {
                $table->text($column)->nullable()->change();
            }

            foreach (self::REQUIRED_COLUMNS as $column) {
                $table->text($column)->change();
            }
        });
    }
};
