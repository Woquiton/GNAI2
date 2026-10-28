<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('student_courses', function (Blueprint $table): void {
            $table->foreignId('semester_id')->nullable()->after('academic_year')->constrained('semesters')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('student_courses', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('semester_id');
        });
    }
};
