@extends('layouts.master')

@section('title', 'Editar Estudo de Caso')

@section('content')
    <div class="mb-5">
        <x-breadcrumb :items="[
            'Home' => route('dashboard'),
            'Alunos' => route('specialized-educational-support.students.index'),
            $caseStudy->student->person->name => route('specialized-educational-support.students.show', $caseStudy->student),
            'Estudos de Caso' => route('specialized-educational-support.case-study.index', $caseStudy->student),
            'Editar' => null
        ]" />
    </div>

    <div class="mb-3 gnai-new">
        <span class="badge gnai-new-badge">Novo módulo</span>
        <h2 class="text-title">Editar Estudo de Caso (v{{ $caseStudy->version }})</h2>
    </div>

    <x-forms.form-card action="{{ route('specialized-educational-support.case-study.update', $caseStudy) }}" method="PUT">
        @csrf
        @method('PUT')

        <x-forms.section title="1. Origem da Demanda e Participantes" />

        <div class="col-md-6 gnai-new">
            <x-forms.select
                name="demand_origin"
                label="Origem da Demanda"
                :required="true"
                :selected="$caseStudy->demand_origin->value"
                :options="\App\Enums\SpecializedEducationalSupport\DemandOrigin::options()"
            />
        </div>

        <div class="col-md-6 gnai-new">
            <x-forms.textarea name="participants_summary" label="Resumo dos Participantes Envolvidos" :value="$caseStudy->participants_summary" :rich="false" />
        </div>

        <x-forms.section title="2. Escuta e Observação" />

        <div class="col-md-12 gnai-new">
            <x-forms.textarea name="student_observation" label="Observação do(a) Estudante" :value="$caseStudy->student_observation" :required="true" :rich="false" />
        </div>

        <div class="col-md-12 gnai-new">
            <x-forms.textarea name="student_family_listening" label="Escuta do(a) Estudante/Família" :value="$caseStudy->student_family_listening" :required="true" :rich="false" />
        </div>

        <div class="col-md-12 gnai-new">
            <x-forms.textarea name="teachers_listening" label="Escuta dos(as) Professores(as)" :value="$caseStudy->teachers_listening" :required="true" :rich="false" />
        </div>

        <div class="col-md-6 gnai-new">
            <x-forms.textarea name="other_info" label="Outras Informações" :value="$caseStudy->other_info" :rich="false" />
        </div>

        <div class="col-md-6 gnai-new">
            <x-forms.textarea name="care_network_notes" label="Notas da Rede de Cuidado" :value="$caseStudy->care_network_notes" :rich="false" />
        </div>

        <x-forms.section title="3. Aspectos Favoráveis e Potencialidades" />

        <div class="col-md-6 gnai-new">
            <x-forms.textarea name="favorable_aspects" label="Aspectos Favoráveis" :value="$caseStudy->favorable_aspects" :required="true" :rich="false" />
        </div>

        <div class="col-md-6 gnai-new">
            <x-forms.textarea name="potentials_interests" label="Potencialidades e Interesses" :value="$caseStudy->potentials_interests" :required="true" :rich="false" />
        </div>

        <x-forms.section title="4. Barreiras Identificadas" />

        <div class="col-12">
            <x-forms.repeater name="barriers" title="Barreiras" add-label="Adicionar barreira" next-index="{{ $caseStudy->barriers->count() }}">
                <x-slot:rows>
                    @foreach($caseStudy->barriers as $index => $barrier)
                        <div class="repeater-row gnai-new" data-repeater-row>
                            <div class="row g-2">
                                <div class="col-md-3">
                                    <x-forms.select
                                        name="barriers[{{ $index }}][type]"
                                        label="Tipo de Barreira"
                                        :selected="$barrier->type->value"
                                        :options="\App\Enums\SpecializedEducationalSupport\BarrierType::options()"
                                    />
                                </div>
                                <div class="col-md-4">
                                    <x-forms.textarea name="barriers[{{ $index }}][observed_situation]" label="Situação Observada" :value="$barrier->observed_situation" :rows="2" :rich="false" />
                                </div>
                                <div class="col-md-4">
                                    <x-forms.textarea name="barriers[{{ $index }}][participation_implication]" label="Implicação na Participação" :value="$barrier->participation_implication" :rows="2" :rich="false" />
                                </div>
                                <div class="col-md-1 d-flex align-items-center">
                                    <button type="button" class="btn btn-sm btn-outline-danger" data-repeater-remove>
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </x-slot:rows>
                <x-slot:template>
                    <div class="repeater-row gnai-new" data-repeater-row>
                        <div class="row g-2">
                            <div class="col-md-3">
                                <x-forms.select
                                    name="barriers[__INDEX__][type]"
                                    label="Tipo de Barreira"
                                    :options="\App\Enums\SpecializedEducationalSupport\BarrierType::options()"
                                />
                            </div>
                            <div class="col-md-4">
                                <x-forms.textarea name="barriers[__INDEX__][observed_situation]" label="Situação Observada" :rows="2" :rich="false" />
                            </div>
                            <div class="col-md-4">
                                <x-forms.textarea name="barriers[__INDEX__][participation_implication]" label="Implicação na Participação" :rows="2" :rich="false" />
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

        <x-forms.section title="5. Estratégias e Recursos" />

        <div class="col-12">
            <x-forms.repeater name="strategies" title="Estratégias / Recursos" add-label="Adicionar estratégia" next-index="{{ $caseStudy->strategies->count() }}">
                <x-slot:rows>
                    @foreach($caseStudy->strategies as $index => $strategy)
                        <div class="repeater-row gnai-new" data-repeater-row>
                            <div class="row g-2">
                                <div class="col-md-3">
                                    <x-forms.input name="strategies[{{ $index }}][linked_barrier_index]" label="Índice da Barreira Vinculada (opcional)" />
                                </div>
                                <div class="col-md-8">
                                    <x-forms.textarea name="strategies[{{ $index }}][description]" label="Descrição da Estratégia/Recurso" :value="$strategy->description" :rows="2" :rich="false" />
                                </div>
                                <div class="col-md-1 d-flex align-items-center">
                                    <button type="button" class="btn btn-sm btn-outline-danger" data-repeater-remove>
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </x-slot:rows>
                <x-slot:template>
                    <div class="repeater-row gnai-new" data-repeater-row>
                        <div class="row g-2">
                            <div class="col-md-3">
                                <x-forms.input name="strategies[__INDEX__][linked_barrier_index]" label="Índice da Barreira Vinculada (opcional)" />
                            </div>
                            <div class="col-md-8">
                                <x-forms.textarea name="strategies[__INDEX__][description]" label="Descrição da Estratégia/Recurso" :rows="2" :rich="false" />
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

        <x-forms.section title="6. Apoios Necessários" />

        <div class="col-md-8 gnai-new">
            <label class="form-label fw-bold text-purple-dark">Tipos de Apoio Necessários <span class="text-danger">*</span></label>
            <div class="row">
                @foreach(['locomotion' => 'Locomoção', 'hygiene' => 'Higiene', 'feeding' => 'Alimentação', 'communication' => 'Comunicação', 'interaction' => 'Interação', 'assistive_technology' => 'Tecnologia Assistiva', 'libras' => 'Libras', 'guide_interpreter' => 'Guia-Interprete', 'orientation_mobility' => 'Orientação e Mobilidade', 'none' => 'Nenhum'] as $value => $label)
                    <div class="col-md-4">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="needed_supports[]" value="{{ $value }}" id="support-{{ $value }}"
                                @checked(in_array($value, $caseStudy->needed_supports ?? []))>
                            <label class="form-check-label" for="support-{{ $value }}">{{ $label }}</label>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>

        <div class="col-md-4 gnai-new">
            <x-forms.textarea name="needed_supports_justification" label="Justificativa dos Apoios" :value="$caseStudy->needed_supports_justification" :rich="false" />
        </div>

        <x-forms.section title="7. Aceite" />

        <div class="col-md-6 gnai-new">
            <x-forms.select
                name="acceptance_status"
                label="Situação do Aceite"
                :required="true"
                :selected="$caseStudy->acceptance_status->value"
                :options="\App\Enums\SpecializedEducationalSupport\AcceptanceStatus::options()"
            />
        </div>

        <div class="col-md-6 gnai-new">
            <x-forms.input type="date" name="acceptance_date" label="Data do Aceite" :value="optional($caseStudy->acceptance_date)->toDateString()" />
        </div>

        <div class="col-12 d-flex flex-wrap justify-content-end gap-2 border-t pt-4 px-4 pb-4 mt-4">
            <x-buttons.link-button href="{{ route('specialized-educational-support.case-study.show', $caseStudy) }}" variant="secondary">
                <i class="fas fa-times"></i> Cancelar
            </x-buttons.link-button>

            <x-buttons.submit-button type="submit" class="btn-action new submit">
                <i class="fas fa-check"></i> Salvar Alterações
            </x-buttons.submit-button>
        </div>
    </x-forms.form-card>
@endsection
