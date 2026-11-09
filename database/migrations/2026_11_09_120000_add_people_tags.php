<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tags', fn (Blueprint $table) => $table->string('system_key', 30)->nullable()->unique());
        Schema::create('person_tag', function (Blueprint $table): void {
            $table->foreignId('person_id')->constrained('people')->cascadeOnDelete();
            $table->foreignId('tag_id')->constrained('tags')->restrictOnDelete();
            $table->primary(['person_id', 'tag_id']);
        });
        foreach (['student' => 'Aluno', 'teacher' => 'Professor', 'professional' => 'Equipe', 'guardian' => 'Responsáveis'] as $key => $name) {
            DB::table('tags')->insert([
                'name' => $name, 'module' => 'people', 'system_key' => $key,
                'is_active' => true, 'color' => '#b8860b',
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        if (DB::table('person_tag')->exists() || DB::table('tags')->where('module', 'people')->whereNull('system_key')->exists()) {
            throw new RuntimeException('Preserve os vínculos e etiquetas de pessoas antes de reverter esta migration.');
        }
        Schema::dropIfExists('person_tag');
        DB::table('tags')->whereNotNull('system_key')->delete();
        Schema::table('tags', fn (Blueprint $table) => $table->dropColumn('system_key'));
    }
};
