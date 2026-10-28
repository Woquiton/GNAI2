@php
    $paee = $paee ?? null;
    $objectiveItems = old('objectives', $paee?->objectives?->map(fn ($o) => [
        'description' => $o->description, 'term' => $o->term,
    ])->all() ?? []);
    $resourceItems = old('resources', $paee?->resources?->map(fn ($r) => [
        'description' => $r->description, 'acquisition_type' => $r->acquisition_type,
    ])->all() ?? []);
@endphp

<x-forms.section title="Caracterização do Atendimento" />

<div class="col-md-3">
    <x-forms.input
        type="number"
        name="attendance_frequency_per_week"
        label="Frequência semanal"
        min="1"
        max="7"
        required
        :value="old('attendance_frequency_per_week', $paee->attendance_frequency_per_week ?? null)"
    />
</div>

<div class="col-md-3">
    <x-forms.input
        type="number"
        name="attendance_duration_minutes"
        label="Duração (minutos)"
        min="1"
        required
        :value="old('attendance_duration_minutes', $paee->attendance_duration_minutes ?? null)"
    />
</div>

<div class="col-md-3">
    <x-forms.select
        name="attendance_format"
        label="Formato do atendimento"
        required
        :options="['individual' => 'Individual', 'collective' => 'Coletivo', 'mixed' => 'Misto']"
        :selected="old('attendance_format', $paee->attendance_format ?? null)"
    />
</div>

<div class="col-md-3">
    <x-forms.select
        name="attendance_location"
        label="Local do atendimento"
        required
        :options="['srm' => 'Sala de Recursos Multifuncionais', 'common_classroom' => 'Sala comum', 'accessibility_center' => 'Núcleo de acessibilidade', 'other' => 'Outro']"
        :selected="old('attendance_location', $paee->attendance_location ?? null)"
    />
</div>

{{-- ====== TECNOLOGIA ASSISTIVA E CAA (Portaria, art. 10) ====== --}}
<x-forms.section title="Tecnologia Assistiva e Comunicação Aumentativa e Alternativa (CAA)" />

<div class="col-md-6">
    <input type="hidden" name="assistive_technology_needed" value="0">
    <x-forms.checkbox
        name="assistive_technology_needed"
        label="Necessita de tecnologia assistiva"
        :checked="old('assistive_technology_needed', $paee->assistive_technology_needed ?? false)"
    />
</div>

<div class="col-md-6">
    <input type="hidden" name="caa_needed" value="0">
    <x-forms.checkbox
        name="caa_needed"
        label="Necessita de Comunicação Aumentativa e Alternativa (CAA)"
        :checked="old('caa_needed', $paee->caa_needed ?? false)"
    />
</div>

<div class="col-md-6">
    <x-forms.textarea
        name="assistive_technology_notes"
        label="Observações sobre tecnologia assistiva"
        rows="2"
        :value="old('assistive_technology_notes', $paee->assistive_technology_notes ?? null)"
    />
</div>

<div class="col-md-6">
    <x-forms.textarea
        name="caa_notes"
        label="Observações sobre CAA"
        rows="2"
        :value="old('caa_notes', $paee->caa_notes ?? null)"
    />
</div>

<div class="col-md-12">
    <x-forms.textarea
        name="assistive_technology_availability_capacity"
        label="Capacidade de disponibilização da TA"
        rows="2"
        :value="old('assistive_technology_availability_capacity', $paee->assistive_technology_availability_capacity ?? null)"
    />
    <small class="text-muted d-block mb-2">Avalie se a escola tem condições de disponibilizar a tecnologia assistiva indicada (equipamento próprio, empréstimo, aquisição etc.).</small>
</div>

<div class="col-md-6">
    <input type="hidden" name="is_assistive_technology_portable_digital_device" value="0">
    <x-forms.checkbox
        name="is_assistive_technology_portable_digital_device"
        label="A tecnologia assistiva é um dispositivo digital portátil"
        :checked="old('is_assistive_technology_portable_digital_device', $paee->is_assistive_technology_portable_digital_device ?? false)"
    />
    <small class="text-muted d-block mb-2">Marque se a TA indicada for um dispositivo digital portátil (tablet, notebook, etc.) — exige parecer pedagógico ao lado.</small>
</div>

<div class="col-md-6">
    <x-forms.textarea
        name="assistive_technology_pedagogical_opinion"
        label="Parecer pedagógico sobre a TA portátil"
        rows="2"
        :value="old('assistive_technology_pedagogical_opinion', $paee->assistive_technology_pedagogical_opinion ?? null)"
    />
</div>

{{-- ====== APOIOS: PROFISSIONAL, LIBRAS, GUIA-INTÉRPRETE (Decreto, art. 14 §2) ====== --}}
<x-forms.section title="Apoios de Profissionais" />

<div class="col-md-4">
    <input type="hidden" name="support_professional_needed" value="0">
    <x-forms.checkbox
        name="support_professional_needed"
        label="Necessita de profissional de apoio"
        :checked="old('support_professional_needed', $paee->support_professional_needed ?? false)"
    />
</div>

<div class="col-md-4">
    <input type="hidden" name="libras_interpreter_needed" value="0">
    <x-forms.checkbox
        name="libras_interpreter_needed"
        label="Necessita de tradutor/intérprete de Libras"
        :checked="old('libras_interpreter_needed', $paee->libras_interpreter_needed ?? false)"
    />
</div>

<div class="col-md-4">
    <input type="hidden" name="guide_interpreter_needed" value="0">
    <x-forms.checkbox
        name="guide_interpreter_needed"
        label="Necessita de guia-intérprete"
        :checked="old('guide_interpreter_needed', $paee->guide_interpreter_needed ?? false)"
    />
</div>

<div class="col-md-4">
    <x-forms.textarea
        name="support_professional_justification"
        label="Justificativa do profissional de apoio"
        rows="2"
        :value="old('support_professional_justification', $paee->support_professional_justification ?? null)"
    />
</div>

<div class="col-md-4">
    <x-forms.textarea
        name="libras_interpreter_justification"
        label="Justificativa do intérprete de Libras"
        rows="2"
        :value="old('libras_interpreter_justification', $paee->libras_interpreter_justification ?? null)"
    />
</div>

<div class="col-md-4">
    <x-forms.textarea
        name="guide_interpreter_justification"
        label="Justificativa do guia-intérprete"
        rows="2"
        :value="old('guide_interpreter_justification', $paee->guide_interpreter_justification ?? null)"
    />
</div>
<small class="text-muted d-block mb-2 col-12">A necessidade de cada apoio é avaliada a partir do Estudo de Caso, sem exigir laudo médico.</small>

<x-forms.section title="Objetivos" />

<div class="col-md-12">
    <x-forms.repeater
        name="objectives"
        add-label="Adicionar objetivo"
        :items="$objectiveItems"
        template='<div class="row g-2">
            <div class="col-md-9">
                <label class="form-label fw-bold text-purple-dark">Descrição</label>
                <textarea name="objectives[__INDEX__][description]" class="form-control custom-input" rows="2"></textarea>
            </div>
            <div class="col-md-3">
                <label class="form-label fw-bold text-purple-dark">Prazo</label>
                <select name="objectives[__INDEX__][term]" class="form-select custom-input">
                    <option value="short">Curto</option>
                    <option value="medium">Médio</option>
                    <option value="long">Longo</option>
                </select>
            </div>
        </div>'
    />
</div>

<x-forms.section title="Recursos" />
<small class="text-muted d-block mb-2 col-12">Se não houver necessidade de nenhum recurso ou material, deixe a lista vazia.</small>

<div class="col-md-12">
    <x-forms.repeater
        name="resources"
        add-label="Adicionar recurso"
        :items="$resourceItems"
        template='<div class="row g-2">
            <div class="col-md-8">
                <label class="form-label fw-bold text-purple-dark">Descrição</label>
                <textarea name="resources[__INDEX__][description]" class="form-control custom-input" rows="2"></textarea>
            </div>
            <div class="col-md-4">
                <label class="form-label fw-bold text-purple-dark">Tipo de aquisição</label>
                <select name="resources[__INDEX__][acquisition_type]" class="form-select custom-input">
                    <option value="to_produce">A produzir</option>
                    <option value="to_accessibilize">A acessibilizar</option>
                    <option value="to_acquire">A adquirir</option>
                </select>
            </div>
        </div>'
    />
</div>

<x-forms.section title="Articulações e Orientações" />

<div class="col-md-6">
    <x-forms.textarea name="school_professionals_orientation" label="Orientação aos profissionais da escola" rows="2" :value="old('school_professionals_orientation', $paee->school_professionals_orientation ?? null)" />
</div>
<div class="col-md-6">
    <x-forms.textarea name="common_teachers_articulation" label="Articulação com professores do ensino comum" rows="2" :value="old('common_teachers_articulation', $paee->common_teachers_articulation ?? null)" />
</div>
<div class="col-md-6">
    <x-forms.textarea name="family_articulation" label="Como a família será envolvida" rows="2" :value="old('family_articulation', $paee->family_articulation ?? null)" />
    <small class="text-muted d-block mb-2">Planeje a forma de contato e o que será combinado com a família.</small>
</div>
<div class="col-md-6">
    <x-forms.textarea name="intersectoral_articulation" label="Articulação intersetorial" rows="2" :value="old('intersectoral_articulation', $paee->intersectoral_articulation ?? null)" />
</div>
<div class="col-md-12">
    <x-forms.textarea name="training_demands" label="Demandas de formação" rows="2" :value="old('training_demands', $paee->training_demands ?? null)" />
</div>

<div class="col-12 d-flex flex-wrap justify-content-end gap-2 border-t pt-4 px-4 pb-4">
    <x-buttons.link-button
        :href="$paee ? route('specialized-educational-support.paee.show', $paee) : route('specialized-educational-support.case-study.show', $caseStudy)"
        variant="secondary"
    >
        <i class="fas fa-times"></i> Cancelar
    </x-buttons.link-button>

    <x-buttons.submit-button type="submit" class="btn-action new submit">
        <i class="fas fa-save"></i> {{ $submitLabel }}
    </x-buttons.submit-button>
</div>
