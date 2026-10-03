<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('student_contexts', function (Blueprint $table) {
            if (!Schema::hasColumn('student_contexts', 'strengths')) {
                $table->text('strengths')->nullable()->after('behavior_notes');
            }

            if (!Schema::hasColumn('student_contexts', 'recommendations')) {
                $table->text('recommendations')->nullable()->after('difficulties');
            }

            if (!Schema::hasColumn('student_contexts', 'general_observation')) {
                $table->text('general_observation')->nullable()->after('recommendations');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('student_contexts', function (Blueprint $table) {
            if (Schema::hasColumn('student_contexts', 'strengths')) {
                $table->dropColumn('strengths');
            }

            if (Schema::hasColumn('student_contexts', 'recommendations')) {
                $table->dropColumn('recommendations');
            }

            if (Schema::hasColumn('student_contexts', 'general_observation')) {
                $table->dropColumn('general_observation');
            }
        });
    }
};
