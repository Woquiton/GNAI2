<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * As barreiras do Estudo de Caso guardam o nome da categoria. As que ainda tinham as chaves fixas
 * anteriores ao cadastro de categorias passam a guardar o nome correspondente.
 */
return new class extends Migration
{
    private const NAMES = [
        'architectural' => 'Arquitetônica',
        'urbanistic' => 'Urbanística',
        'transport' => 'Transporte',
        'communicational' => 'Comunicacional',
        'methodological' => 'Metodológica',
        'technological' => 'Tecnológica',
        'attitudinal' => 'Atitudinal',
        'social' => 'Social',
    ];

    public function up(): void
    {
        foreach (self::NAMES as $key => $name) {
            DB::table('case_study_barriers')->where('type', $key)->update(['type' => $name]);
        }
    }

    public function down(): void
    {
        foreach (self::NAMES as $key => $name) {
            DB::table('case_study_barriers')->where('type', $name)->update(['type' => $key]);
        }
    }
};
