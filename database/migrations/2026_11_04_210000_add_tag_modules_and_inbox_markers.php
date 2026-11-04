<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tags', function (Blueprint $table): void {
            $table->string('module', 30)->default('publications')->index();
            $table->string('color', 7)->default('#322b75');
            $table->dropUnique(['name']);
            $table->unique(['module', 'name']);
        });
        Schema::table('email_mailbox_states', function (Blueprint $table): void {
            $table->foreignId('tag_id')->nullable()->constrained('tags')->nullOnDelete();
        });

        $now = now();
        foreach ([
            'important' => ['Importante', '#f59e0b'],
            'work' => ['Trabalho', '#322b75'],
            'personal' => ['Pessoal', '#16a34a'],
        ] as $legacy => [$name, $color]) {
            DB::table('tags')->insertOrIgnore([
                'module' => 'inbox', 'name' => $name, 'color' => $color,
                'is_active' => true, 'created_at' => $now, 'updated_at' => $now,
            ]);
            $id = DB::table('tags')->where('module', 'inbox')->where('name', $name)->value('id');
            DB::table('email_mailbox_states')->where('label', $legacy)->update(['tag_id' => $id]);
        }
        Schema::table('email_mailbox_states', fn (Blueprint $table) => $table->dropColumn('label'));
    }

    public function down(): void
    {
        // Não descartar etiquetas de módulos diferentes que passaram a compartilhar o mesmo nome.
        if (DB::table('tags')->select('name')->groupBy('name')->havingRaw('COUNT(*) > 1')->exists()) {
            throw new RuntimeException('Existem etiquetas com o mesmo nome em módulos diferentes. Renomeie-as antes de reverter esta migration.');
        }
        $legacyIds = DB::table('tags')->where('module', 'inbox')
            ->whereIn('name', ['Importante', 'Trabalho', 'Pessoal'])->pluck('id');
        if (DB::table('email_mailbox_states')->whereNotNull('tag_id')->whereNotIn('tag_id', $legacyIds)->exists()) {
            throw new RuntimeException('Existem marcadores personalizados aplicados. Preserve ou remova esses vínculos antes de reverter esta migration.');
        }
        Schema::table('email_mailbox_states', fn (Blueprint $table) => $table->string('label', 20)->nullable());
        foreach (['important' => 'Importante', 'work' => 'Trabalho', 'personal' => 'Pessoal'] as $legacy => $name) {
            $id = DB::table('tags')->where('module', 'inbox')->where('name', $name)->value('id');
            if ($id !== null) {
                DB::table('email_mailbox_states')->where('tag_id', $id)->update(['label' => $legacy]);
            }
        }
        Schema::table('email_mailbox_states', fn (Blueprint $table) => $table->dropConstrainedForeignId('tag_id'));
        Schema::table('tags', function (Blueprint $table): void {
            $table->dropUnique(['module', 'name']);
            $table->unique('name');
            $table->dropIndex(['module']);
            $table->dropColumn(['module', 'color']);
        });
    }
};
