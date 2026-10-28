<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Portaria MEC 421/2026, art. 10: avaliação de TA e CAA (não só "sim/não"
     * genérico), parecer pedagógico obrigatório quando a TA for dispositivo
     * digital portátil (Decreto 12.686/2025, art. 12 §4), e avaliação de
     * apoio, Libras e guia-intérprete como itens distintos (Decreto, art. 14 §2).
     */
    public function up(): void
    {
        Schema::table('paees', function (Blueprint $table): void {
            $table->text('assistive_technology_availability_capacity')->nullable()->after('assistive_technology_notes');
            $table->boolean('caa_needed')->default(false)->after('assistive_technology_availability_capacity');
            $table->text('caa_notes')->nullable()->after('caa_needed');
            $table->boolean('is_assistive_technology_portable_digital_device')->default(false)->after('caa_notes');
            $table->text('assistive_technology_pedagogical_opinion')->nullable()->after('is_assistive_technology_portable_digital_device');

            $table->boolean('libras_interpreter_needed')->default(false)->after('support_professional_justification');
            $table->text('libras_interpreter_justification')->nullable()->after('libras_interpreter_needed');
            $table->boolean('guide_interpreter_needed')->default(false)->after('libras_interpreter_justification');
            $table->text('guide_interpreter_justification')->nullable()->after('guide_interpreter_needed');
        });
    }

    public function down(): void
    {
        Schema::table('paees', function (Blueprint $table): void {
            $table->dropColumn([
                'assistive_technology_availability_capacity',
                'caa_needed',
                'caa_notes',
                'is_assistive_technology_portable_digital_device',
                'assistive_technology_pedagogical_opinion',
                'libras_interpreter_needed',
                'libras_interpreter_justification',
                'guide_interpreter_needed',
                'guide_interpreter_justification',
            ]);
        });
    }
};
