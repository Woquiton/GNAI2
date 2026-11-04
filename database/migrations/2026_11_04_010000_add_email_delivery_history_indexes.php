<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('email_deliveries', function (Blueprint $table): void {
            $table->index(['created_at', 'id']);
            $table->index(['status', 'created_at', 'id']);
            $table->index(['context_type', 'created_at', 'id']);
        });
    }

    public function down(): void
    {
        Schema::table('email_deliveries', function (Blueprint $table): void {
            $table->dropIndex(['created_at', 'id']);
            $table->dropIndex(['status', 'created_at', 'id']);
            $table->dropIndex(['context_type', 'created_at', 'id']);
        });
    }
};
