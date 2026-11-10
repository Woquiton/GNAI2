<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('support_request_profiles', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->bigIncrements('id');
            $table->unsignedBigInteger('support_request_id');
            $table->unsignedBigInteger('deficiency_id');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->unique(['support_request_id', 'deficiency_id'], 'support_request_profile_unique');
            $table->index(['deficiency_id'], 'support_request_profiles_deficiency_id_foreign');

            $table->foreign(['deficiency_id'], 'support_request_profiles_deficiency_id_foreign')
                ->references(['id'])->on('deficiencies')
                ->onUpdate('no action')->onDelete('restrict');
            $table->foreign(['support_request_id'], 'support_request_profiles_support_request_id_foreign')
                ->references(['id'])->on('support_requests')
                ->onUpdate('no action')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('support_request_profiles');
    }
};
