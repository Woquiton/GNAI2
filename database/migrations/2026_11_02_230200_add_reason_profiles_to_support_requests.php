<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('support_requests', function (Blueprint $table): void {
            $table->string('reason_type', 20)->default('other');
            $table->text('reason')->nullable()->change();
        });

        Schema::create('support_request_profiles', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('support_request_id')->constrained('support_requests')->cascadeOnDelete();
            $table->foreignId('deficiency_id')->constrained('deficiencies')->restrictOnDelete();
            $table->timestamps();
            $table->unique(['support_request_id', 'deficiency_id'], 'support_request_profile_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('support_request_profiles');
        DB::table('support_requests')->whereNull('reason')->update(['reason' => '']);
        Schema::table('support_requests', function (Blueprint $table): void {
            $table->dropColumn('reason_type');
            $table->text('reason')->nullable(false)->change();
        });
    }
};
