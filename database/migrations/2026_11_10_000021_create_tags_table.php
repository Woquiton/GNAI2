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
        Schema::create('tags', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->string('name', 100);
            $table->boolean('is_active')->default(1);
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->string('module', 30)->default('publications');
            $table->string('color', 7)->default('#322b75');
            $table->string('system_key', 30)->nullable();

            $table->index(['module'], 'tags_module_index');
            $table->unique(['module', 'name'], 'tags_module_name_unique');
            $table->unique(['system_key'], 'tags_system_key_unique');
        });

        $now = now();
        DB::table('tags')->insert([
            [
                'name' => 'Aluno', 'module' => 'people',
                'system_key' => 'student', 'color' => '#b8860b',
                'is_active' => true, 'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'name' => 'Professor', 'module' => 'people',
                'system_key' => 'teacher', 'color' => '#b8860b',
                'is_active' => true, 'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'name' => 'Equipe', 'module' => 'people',
                'system_key' => 'professional', 'color' => '#b8860b',
                'is_active' => true, 'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'name' => 'Responsáveis', 'module' => 'people',
                'system_key' => 'guardian', 'color' => '#b8860b',
                'is_active' => true, 'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'name' => 'Importante', 'module' => 'inbox',
                'system_key' => null, 'color' => '#f59e0b',
                'is_active' => true, 'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'name' => 'Trabalho', 'module' => 'inbox',
                'system_key' => null, 'color' => '#322b75',
                'is_active' => true, 'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'name' => 'Pessoal', 'module' => 'inbox',
                'system_key' => null, 'color' => '#16a34a',
                'is_active' => true, 'created_at' => $now, 'updated_at' => $now,
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('tags');
    }
};
