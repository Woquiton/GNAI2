<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class TagSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $tags = [
            'Acessibilidade',
            'Inclusão',
            'Eventos',
            'Avisos',
            'Formação',
            'Libras',
            'Editais',
            'Notícias',
        ];

        foreach ($tags as $name) {
            DB::table('tags')->updateOrInsert(
                ['module' => 'publications', 'name' => $name],
                [
                    'is_active' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }

        foreach (['Importante' => '#f59e0b', 'Trabalho' => '#322b75', 'Pessoal' => '#16a34a'] as $name => $color) {
            DB::table('tags')->insertOrIgnore([
                'module' => 'inbox', 'name' => $name, 'color' => $color,
                'is_active' => true, 'created_at' => $now, 'updated_at' => $now,
            ]);
        }

        $this->command->info('Etiquetas padrão de Publicações e Inbox preparadas.');
    }
}
