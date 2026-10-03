<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('peis', function (Blueprint $table) {
            $table->dropForeign(['student_context_id']);
            $table->dropColumn('student_context_id');
            $table->foreignId('paee_id')->after('course_id')->constrained('paees')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('peis', function (Blueprint $table) {
            $table->dropForeign(['paee_id']);
            $table->dropColumn('paee_id');
            $table->foreignId('student_context_id')->after('course_id')->constrained('student_contexts')->cascadeOnDelete();
        });
    }
};
