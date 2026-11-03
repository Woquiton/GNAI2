<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const DATES = [
        'loans' => 'loan_date',
        'waitlists' => 'requested_at',
        'attendance_sessions' => 'session_date',
        'support_requests' => 'request_date',
        'pendencies' => 'created_at',
        'barriers' => 'identified_at',
        'inspections' => 'inspection_date',
        'publications' => 'published_at',
    ];

    public function up(): void
    {
        foreach (self::DATES as $tableName => $dateField) {
            Schema::table($tableName, function (Blueprint $table): void {
                $table->foreignId('semester_id')->nullable()->constrained('semesters')->restrictOnDelete();
            });

            // Somente correspondências demonstráveis; não usa semestre atual nem updated_at.
            DB::table($tableName)->select(['id', $dateField])->orderBy('id')->chunkById(500, function ($rows) use ($tableName, $dateField): void {
                foreach ($rows as $row) {
                    if ($row->{$dateField} === null) {
                        continue;
                    }
                    $day = substr((string) $row->{$dateField}, 0, 10);
                    $ids = DB::table('semesters')->where('start_date', '<=', $day)->where('end_date', '>=', $day)->limit(2)->pluck('id');
                    if ($ids->count() === 1) {
                        DB::table($tableName)->where('id', $row->id)->update(['semester_id' => $ids->first()]);
                    }
                }
            });
        }

        Schema::table('waitlists', function (Blueprint $table): void {
            $table->dateTime('notified_at')->nullable()->index();
            $table->dateTime('fulfilled_at')->nullable()->index();
            $table->dateTime('cancelled_at')->nullable()->index();
            $table->foreignId('fulfilled_loan_id')->nullable()->constrained('loans')->restrictOnDelete();
        });
        Schema::table('pendencies', function (Blueprint $table): void {
            $table->dateTime('completed_at')->nullable()->index();
        });

        Schema::create('operation_status_changes', function (Blueprint $table): void {
            $table->id();
            $table->string('record_type', 64);
            $table->unsignedBigInteger('record_id');
            $table->string('field', 64);
            $table->text('from_value')->nullable();
            $table->text('to_value')->nullable();
            $table->dateTime('occurred_at')->index();
            $table->dateTime('recorded_at');
            $table->foreignId('semester_id')->nullable()->constrained('semesters')->restrictOnDelete();
            $table->foreignId('actor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->index(['record_type', 'record_id', 'occurred_at'], 'operation_status_record_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('operation_status_changes');
        Schema::table('waitlists', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('fulfilled_loan_id');
            $table->dropColumn(['notified_at', 'fulfilled_at', 'cancelled_at']);
        });
        Schema::table('pendencies', fn (Blueprint $table) => $table->dropColumn('completed_at'));
        foreach (array_keys(self::DATES) as $tableName) {
            Schema::table($tableName, fn (Blueprint $table) => $table->dropConstrainedForeignId('semester_id'));
        }
    }
};
