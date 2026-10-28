@extends('layouts.app')

@section('content')

    <div class="mb-5">
        <x-breadcrumb :items="[
            'Home' => route('dashboard'),
            'Alunos' => route('specialized-educational-support.students.index'),
            'PEI' => route('specialized-educational-support.pei.show', $pei),
            'Editar Adaptação' => null
        ]" />
    </div>

    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
        <div>
            <h2 class="text-title">Editar Adaptação Curricular</h2>
            <p class="text-muted">Atualize o planejamento pedagógico para a disciplina de <strong>{{ $peiDiscipline->discipline->name }}</strong>.</p>
        </div>
        <div class="ms-md-auto flex-shrink-0">
            <x-buttons.link-button href="{{ route('specialized-educational-support.pei.show', $pei) }}" variant="secondary">
                <i class="fas fa-times"></i> Cancelar
            </x-buttons.link-button>
        </div>
    </div>

    <div class="mt-3">
        <x-forms.form-card action="{{ route('specialized-educational-support.pei-discipline.update', [$pei, $peiDiscipline]) }}" method="POST">
            @method('PUT')

            {{-- Inputs ocultos para manter a validação do Request, já que o usuário não pode editá-los --}}
            <input type="hidden" name="discipline_id" value="{{ $peiDiscipline->discipline_id }}">
            <input type="hidden" name="teacher_id" value="{{ $peiDiscipline->teacher_id }}">

            <x-forms.section title="Identificação (Somente Leitura)" />

            <div class="col-md-6">
                <x-forms.input
                    name="teacher_display"
                    label="Professor Responsável"
                    value="{{ $peiDiscipline->teacher->person->name }}"
                    disabled
                />
            </div>

            <div class="col-md-6">
                <x-forms.input
                    name="discipline_display"
                    label="Disciplina"
                    value="{{ $peiDiscipline->discipline->name }}"
                    disabled
                />
            </div>

            <x-forms.section title="Planejamento Adaptado" />

            <div class="col-md-8">
                <x-forms.textarea
                    name="specific_objectives"
                    label="Objetivos Específicos"
                    :required="true"
                    rows="4"
                    :value="old('specific_objectives', $peiDiscipline->specific_objectives)"
                />
            </div>

            <div class="col-md-4">
                <x-forms.input
                    name="objectives_deadline"
                    label="Prazo das metas/objetivos"
                    :value="old('objectives_deadline', $peiDiscipline->objectives_deadline)"
                />
                <small class="text-muted d-block mb-2">Opcional. Ex.: "até o fim do bimestre", "até dezembro/2026".</small>
            </div>

            <div class="col-md-6">
                <x-forms.textarea
                    name="content_programmatic"
                    label="Conteúdo Programático"
                    :required="true"
                    rows="4"
                    :value="old('content_programmatic', $peiDiscipline->content_programmatic)"
                />
            </div>

            <div class="col-md-6">
                <x-forms.textarea
                    name="curricular_reference"
                    label="Referência curricular (BNCC ou ementa/unidade)"
                    rows="4"
                    :value="old('curricular_reference', $peiDiscipline->curricular_reference)"
                />
                <small class="text-muted d-block mb-2">Opcional. No superior, use a ementa ou unidade curricular correspondente.</small>
            </div>

            <div class="col-md-6">
                <x-forms.textarea
                    name="methodologies"
                    label="Metodologias e Estratégias"
                    :required="true"
                    rows="4"
                    :value="old('methodologies', $peiDiscipline->methodologies)"
                />
            </div>

            <div class="col-md-6">
                <x-forms.textarea
                    name="materials_and_assistive_technology"
                    label="Recursos didáticos e tecnologia assistiva"
                    rows="4"
                    :value="old('materials_and_assistive_technology', $peiDiscipline->materials_and_assistive_technology)"
                />
                <small class="text-muted d-block mb-2">Opcional. Preencha quando a disciplina exigir recurso específico (quando indicado).</small>
            </div>

            <div class="col-md-12">
                <x-forms.textarea
                    name="evaluations"
                    label="Processo de Avaliação"
                    :required="true"
                    rows="4"
                    :value="old('evaluations', $peiDiscipline->evaluations)"
                />
            </div>


            <div class="col-md-12">
                <p class="small text-muted mb-2">
                    Espaço opcional destinado ao registro de informações relevantes que contribuam para o acompanhamento pedagógico do estudante e que não estejam contempladas nos campos anteriores.
                </p>
                <x-forms.textarea
                    name="complementary_records"
                    label="Registros Complementares"
                    rows="4"
                    :value="old('complementary_records', $peiDiscipline->complementary_records)"
                />
            </div>

            <div class="col-md-12">
                <x-forms.textarea
                    name="opinion"
                    label="Parecer"
                    rows="4"
                    :value="old('opinion', $peiDiscipline->opinion)"
                />
            </div>


            <div class="col-12 d-flex flex-wrap justify-content-end gap-2 border-t pt-4 px-4 pb-4">
                <x-buttons.link-button href="{{ route('specialized-educational-support.pei.show', $pei) }}" variant="secondary">
                    <i class="fas fa-times"></i>Cancelar
                </x-buttons.link-button>

                <x-buttons.submit-button type="submit" class="btn-action new submit">
                    <i class="fas fa-save"></i> Atualizar Adaptação
                </x-buttons.submit-button>
            </div>

        </x-forms.form-card>
    </div>
@endsection
