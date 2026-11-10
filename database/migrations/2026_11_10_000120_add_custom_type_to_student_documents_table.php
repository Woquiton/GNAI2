<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('student_documents', function (Blueprint $table): void {
            $table->string('custom_type', 100)->nullable()->index();
        });
    }

    public function down(): void
    {
        Schema::table('student_documents', function (Blueprint $table): void {
            $table->dropIndex(['custom_type']);
            $table->dropColumn('custom_type');
        });
    }
};
