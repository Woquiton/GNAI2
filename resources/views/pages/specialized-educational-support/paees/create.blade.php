@extends('layouts.master')

@section('title', 'Novo PAEE')

@section('content')
    <div class="mb-5">
        <x-breadcrumb :items="[
            'Home' => route('dashboard'),
            'Alunos' => route('specialized-educational-support.students.index'),
            $student->person->name => route('specialized-educational-support.students.show', $student),
            'PAEE' => route('specialized-educational-support.paee.index', $student),
            'Novo PAEE' => null
        ]" />
    </div>

    <div class="mb-3 gnai-new">
        <span class="badge gnai-new-badge">Novo módulo</span>
        <h2 class="text-title">Novo PAEE</h2>
        <p class="text-muted">Baseado no Estudo de Caso v{{ $caseStudy->version }} (concluído).</p>
    </div>

    <x-forms.form-card action="{{ route('specialized-educational-support.paee.store', $student) }}" method="POST">
        @csrf

        <x-forms.section title="1. Atendimento" />

        <div class="col-md-3 gnai-new">
            <x-forms.input type="number" name="attendance_frequency_per_week" label="Frequência Semanal" :required="true" min="1" />
        </div>

        <div class="col-md-3 gnai-new">
            <x-forms.input type="number" name="attendance_duration_minutes" label="Duração (minutos)" :required="true" min="1" />
        </div>

        <div class="col-md-3 gnai-new">
            <x-forms.select name="attendance_format" label="Formato" :required="true" :options="\App\Enums\SpecializedEducationalSupport\AttendanceFormat::options()" />
        </div>

        <div class="col-md-3 gnai-new">
            <x-forms.select name="attendance_location" label="Local" :required="true" :options="\App\Enums\SpecializedEducationalSupport\AttendanceLocation::options()" />
        </div>

        <x-forms.section title="2. Tecnologia Assistiva e Profissional de Apoio" />

        <div class="col-md-6 gnai-new">
            <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" name="assistive_technology_needed" value="1" id="at-needed">
                <label class="form-check-label" for="at-needed">Necessita Tecnologia Assistiva</label>
            </div>
            <x-forms.textarea name="assistive_technology_notes" label="Notas sobre Tecnologia Assistiva" :rows="2" :rich="false" />
        </div>

        <div class="col-md-6 gnai-new">
            <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" name="support_professional_needed" value="1" id="sp-needed">
                <label class="form-check-label" for="sp-needed">Necessita Profissional de Apoio</label>
            </div>
            <x-forms.textarea name="support_professional_justification" label="Justificativa do Profissional de Apoio" :rows="2" :rich="false" />
        </div>

        <x-forms.section title="3. Objetivos" />

        <div class="col-12">
            <x-forms.repeater name="objectives" title="Objetivos" add-label="Adicionar objetivo">
                <x-slot:rows></x-slot:rows>
                <x-slot:template>
                    <div class="repeater-row gnai-new" data-repeater-row>
                        <div class="row g-2">
                            <div class="col-md-3">
                                <x-forms.select name="objectives[__INDEX__][term]" label="Prazo" :options="\App\Enums\SpecializedEducationalSupport\ObjectiveTerm::options()" />
                            </div>
                            <div class="col-md-3">
                                <x-forms.select
                                    name="objectives[__INDEX__][linked_barrier_id]"
                                    label="Barreira Vinculada (opcional)"
                                    :options="$caseStudy->barriers->pluck('type', 'id')->map(fn($t) => $t->label())->toArray()"
                                />
                            </div>
                            <div class="col-md-5">
                                <x-forms.textarea name="objectives[__INDEX__][description]" label="Descrição do Objetivo" :rows="2" :rich="false" />
                            </div>
                            <div class="col-md-1 d-flex align-items-center">
                                <button type="button" class="btn btn-sm btn-outline-danger" data-repeater-remove>
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </x-slot:template>
            </x-forms.repeater>
        </div>

        <x-forms.section title="4. Materiais e Recursos" />

        <div class="col-12">
            <x-forms.repeater name="resources" title="Materiais/Recursos" add-label="Adicionar recurso">
                <x-slot:rows></x-slot:rows>
                <x-slot:template>
                    <div class="repeater-row gnai-new" data-repeater-row>
                        <div class="row g-2">
                            <div class="col-md-3">
                                <x-forms.select name="resources[__INDEX__][acquisition_type]" label="Tipo" :options="\App\Enums\SpecializedEducationalSupport\ResourceAcquisitionType::options()" />
                            </div>
                            <div class="col-md-3">
                                <x-forms.select
                                    name="resources[__INDEX__][assistive_technology_id]"
                                    label="Tecnologia Assistiva (catálogo, opcional)"
                                    :options="$assistiveTechnologies->pluck('name', 'id')->toArray()"
                                />
                            </div>
                            <div class="col-md-5">
                                <x-forms.textarea name="resources[__INDEX__][description]" label="Descrição" :rows="2" :rich="false" />
                            </div>
                            <div class="col-md-1 d-flex align-items-center">
                                <button type="button" class="btn btn-sm btn-outline-danger" data-repeater-remove>
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </x-slot:template>
            </x-forms.repeater>
        </div>

        <x-forms.section title="5. Articulações e Formação" />

        <div class="col-md-6 gnai-new">
            <x-forms.textarea name="school_professionals_orientation" label="Orientação aos Profissionais da Escola" :rich="false" />
        </div>

        <div class="col-md-6 gnai-new">
            <x-forms.textarea name="common_teachers_articulation" label="Articulação com Professores do Ensino Comum" :rich="false" />
        </div>

        <div class="col-md-6 gnai-new">
            <x-forms.textarea name="family_articulation" label="Articulação com a Família" :rich="false" />
        </div>

        <div class="col-md-6 gnai-new">
            <x-forms.textarea name="intersectoral_articulation" label="Articulação Intersetorial" :rich="false" />
        </div>

        <div class="col-md-12 gnai-new">
            <x-forms.textarea name="training_demands" label="Demandas de Formação" :rich="false" />
        </div>

        <div class="col-12 d-flex flex-wrap justify-content-end gap-2 border-t pt-4 px-4 pb-4 mt-4">
            <x-buttons.link-button href="{{ route('specialized-educational-support.paee.index', $student) }}" variant="secondary">
                <i class="fas fa-times"></i> Cancelar
            </x-buttons.link-button>

            <x-buttons.submit-button type="submit" class="btn-action new submit">
                <i class="fas fa-check"></i> Salvar PAEE
            </x-buttons.submit-button>
        </div>
    </x-forms.form-card>
@endsection
