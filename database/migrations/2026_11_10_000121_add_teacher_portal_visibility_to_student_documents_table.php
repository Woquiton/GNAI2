<?php

declare(strict_types=1);

use App\Domains\Domain\Enums\StudentDocuments\StudentDocumentType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('student_documents', function (Blueprint $table): void {
            $table->boolean('show_in_teacher_portal')->default(false);
        });

        DB::table('student_documents')
            ->where('type', StudentDocumentType::TECHNICAL_REPORT->value)
            ->update(['show_in_teacher_portal' => true]);
    }

    public function down(): void
    {
        Schema::table('student_documents', function (Blueprint $table): void {
            $table->dropColumn('show_in_teacher_portal');
        });
    }
};
