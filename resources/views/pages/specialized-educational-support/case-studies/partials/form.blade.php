@php
    $neededSupportsOptions = [
        'locomotion' => 'Locomoção',
        'hygiene' => 'Higiene',
        'feeding' => 'Alimentação',
        'communication' => 'Comunicação',
        'interaction' => 'Interação',
        'assistive_technology' => 'Tecnologia assistiva',
        'libras' => 'Libras',
        'guide_interpreter' => 'Guia-intérprete',
        'orientation_mobility' => 'Orientação e mobilidade',
        'none' => 'Nenhum',
    ];
    $caseStudy = $caseStudy ?? null;
    $selectedSupports = array_map('strval', old('needed_supports', $caseStudy->needed_supports ?? []));
    $barrierItems = old('barriers', $caseStudy?->barriers?->map(fn ($b) => [
        'type' => $b->type, 'observed_situation' => $b->observed_situation, 'participation_implication' => $b->participation_implication,
    ])->all() ?? []);
    $strategyItems = old('strategies', $caseStudy?->strategies?->map(fn ($s) => [
        'description' => $s->description,
    ])->all() ?? []);
@endphp

<x-forms.section title="Identificação da Demanda" />

<div class="col-md-6">
    <x-forms.select
        name="demand_origin"
        label="Origem da demanda"
        required
        :options="['teacher' => 'Professor', 'family' => 'Família', 'student' => 'Estudante', 'medical_report' => 'Laudo médico', 'other' => 'Outro']"
        :selected="old('demand_origin', $caseStudy->demand_origin ?? null)"
    />
</div>

<div class="col-md-8">
    <x-forms.textarea
        name="participants_summary"
        label="Participantes (resumo)"
        rows="2"
        :value="old('participants_summary', $caseStudy->participants_summary ?? null)"
    />
</div>

<div class="col-md-4">
    <x-forms.input
        name="study_date"
        label="Data do Estudo de Caso"
        type="date"
        :value="old('study_date', optional($caseStudy->study_date ?? null)->format('Y-m-d'))"
    />
    <small class="text-muted d-block mb-2">Data em que o Estudo de Caso foi realizado com os participantes acima.</small>
</div>

<x-forms.section title="Escuta e Observação" />

<div class="col-md-12">
    <x-forms.textarea
        name="student_observation"
        label="Observação do estudante"
        rows="3"
        required
        :value="old('student_observation', $caseStudy->student_observation ?? null)"
    />
</div>

<div class="col-md-12">
    <x-forms.textarea
        name="student_family_listening"
        label="Escuta do estudante/família"
        rows="3"
        required
        :value="old('student_family_listening', $caseStudy->student_family_listening ?? null)"
    />
</div>

<div class="col-md-12">
    <x-forms.textarea
        name="teachers_listening"
        label="Escuta dos professores"
        rows="3"
        required
        :value="old('teachers_listening', $caseStudy->teachers_listening ?? null)"
    />
</div>

<div class="col-md-6">
    <x-forms.textarea
        name="other_info"
        label="Outras informações"
        rows="2"
        :value="old('other_info', $caseStudy->other_info ?? null)"
    />
</div>

<div class="col-md-6">
    <x-forms.textarea
        name="care_network_notes"
        label="Observações da rede de cuidado"
        rows="2"
        :value="old('care_network_notes', $caseStudy->care_network_notes ?? null)"
    />
</div>

<x-forms.section title="Potencialidades e Barreiras" />

<div class="col-md-6">
    <x-forms.textarea
        name="favorable_aspects"
        label="Aspectos favoráveis"
        rows="3"
        required
        :value="old('favorable_aspects', $caseStudy->favorable_aspects ?? null)"
    />
</div>

<div class="col-md-6">
    <x-forms.textarea
        name="potentials_interests"
        label="Potenciais e interesses"
        rows="3"
        required
        :value="old('potentials_interests', $caseStudy->potentials_interests ?? null)"
    />
</div>

<div class="col-md-12 mb-4">
    <label class="form-label fw-bold text-purple-dark">Apoios necessários <span class="text-danger">*</span></label>
    <div class="row g-2 border rounded p-3">
        @foreach($neededSupportsOptions as $value => $label)
            <div class="col-md-4">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="needed_supports[]" value="{{ $value }}" id="support_{{ $value }}"
                        {{ in_array($value, $selectedSupports, true) ? 'checked' : '' }}>
                    <label class="form-check-label" for="support_{{ $value }}">{{ $label }}</label>
                </div>
            </div>
        @endforeach
    </div>
    @error('needed_supports')
        <div class="text-danger small mt-2">{{ $message }}</div>
    @enderror
</div>

<div class="col-md-12">
    <x-forms.textarea
        name="needed_supports_justification"
        label="Justificativa dos apoios necessários"
        rows="2"
        :value="old('needed_supports_justification', $caseStudy->needed_supports_justification ?? null)"
    />
</div>

<x-forms.section title="Barreiras Identificadas" />

<div class="col-md-12">
    <x-forms.repeater
        name="barriers"
        add-label="Adicionar barreira"
        :items="$barrierItems"
        template='<div class="row g-2">
            <div class="col-md-4">
                <label class="form-label fw-bold text-purple-dark">Tipo</label>
                <select name="barriers[__INDEX__][type]" class="form-select custom-input">
                    <option value="architectural">Arquitetônica</option>
                    <option value="urbanistic">Urbanística</option>
                    <option value="transport">Transporte</option>
                    <option value="communicational">Comunicacional</option>
                    <option value="methodological">Metodológica</option>
                    <option value="technological">Tecnológica</option>
                    <option value="attitudinal">Atitudinal</option>
                    <option value="social">Social</option>
                </select>
            </div>
            <div class="col-md-4">
                <label class="form-label fw-bold text-purple-dark">Situação observada</label>
                <textarea name="barriers[__INDEX__][observed_situation]" class="form-control custom-input" rows="2"></textarea>
            </div>
            <div class="col-md-4">
                <label class="form-label fw-bold text-purple-dark">Implicação na participação</label>
                <textarea name="barriers[__INDEX__][participation_implication]" class="form-control custom-input" rows="2"></textarea>
            </div>
        </div>'
    />
</div>

<x-forms.section title="Estratégias Propostas" />

<div class="col-md-12">
    <x-forms.repeater
        name="strategies"
        add-label="Adicionar estratégia"
        :items="$strategyItems"
        template='<div class="row g-2">
            <div class="col-md-12">
                <label class="form-label fw-bold text-purple-dark">Descrição da estratégia</label>
                <textarea name="strategies[__INDEX__][description]" class="form-control custom-input" rows="2"></textarea>
            </div>
        </div>'
    />
</div>

<x-forms.section title="Aceite da Família/Estudante" />

<div class="col-md-6">
    <x-forms.select
        name="acceptance_status"
        label="Status de aceite"
        required
        :options="['accepted' => 'Aceito', 'declined' => 'Recusado', 'not_applicable' => 'Não aplicável']"
        :selected="old('acceptance_status', $caseStudy->acceptance_status ?? null)"
    />
</div>

<div class="col-md-6">
    <x-forms.input
        type="date"
        name="acceptance_date"
        label="Data do aceite"
        :value="old('acceptance_date', optional($caseStudy->acceptance_date ?? null)->format('Y-m-d'))"
    />
</div>

<div class="col-12 d-flex flex-wrap justify-content-end gap-2 border-t pt-4 px-4 pb-4">
    <x-buttons.link-button
        :href="$caseStudy ? route('specialized-educational-support.case-study.show', $caseStudy) : route('specialized-educational-support.students.show', $student)"
        variant="secondary"
    >
        <i class="fas fa-times"></i> Cancelar
    </x-buttons.link-button>

    <x-buttons.submit-button type="submit" class="btn-action new submit">
        <i class="fas fa-save"></i> {{ $submitLabel }}
    </x-buttons.submit-button>
</div>
