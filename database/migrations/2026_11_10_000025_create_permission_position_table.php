<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('permission_position', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('position_id');
            $table->unsignedBigInteger('permission_id');

            $table->index(['permission_id'], 'permission_position_permission_id_foreign');
            $table->index(['position_id'], 'permission_position_position_id_foreign');

            $table->foreign(['permission_id'], 'permission_position_permission_id_foreign')
                ->references(['id'])->on('permissions')
                ->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['position_id'], 'permission_position_position_id_foreign')
                ->references(['id'])->on('positions')
                ->onUpdate('no action')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('permission_position');
    }
};
