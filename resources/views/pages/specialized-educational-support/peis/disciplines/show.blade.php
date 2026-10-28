@extends('layouts.app')

@section('content')

<div class="mb-5">
    <x-breadcrumb :items="[
        'Home' => route('dashboard'),
        'Alunos' => route('specialized-educational-support.students.index'),
        $student->person->name => route('specialized-educational-support.students.show', $student),
        'PEI' => null
    ]" />
</div>

<div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3 no-print">
    <div>
        <h2 class="text-title">Planejamento da Disciplina {{ $peiDiscipline->discipline->name }}</h2>
        <p class="text-muted">
            Edite a adaptação para a disciplina {{ $peiDiscipline->discipline->name }}
        </p>
    </div>

    <div class="d-flex gap-2 flex-wrap justify-content-end ms-md-auto">

        <x-buttons.pdf-button 
                :href="route('specialized-educational-support.pei.discipline.pdf', [$pei, $peiDiscipline])" 
                target="_blank" 
            />

        @can('pei-discipline.update')
        <x-buttons.link-button 
            href="{{ route('specialized-educational-support.pei-discipline.edit', [$pei, $peiDiscipline]) }}"
            variant="warning">
            <i class="fas fa-edit"></i> Editar
        </x-buttons.link-button>
        @endcan
        <x-buttons.link-button 
            href="{{ route('specialized-educational-support.pei.show', $pei) }}" 
            variant="secondary">
            <i class="fas fa-arrow-left"></i> Voltar
        </x-buttons.link-button>
    </div>
</div>

<div class="custom-table-card bg-white shadow-sm rounded">

        {{-- ================= DETALHES DA ADAPTAÇÃO ================= --}}
    <x-forms.section title="Adaptações Razoáveis e/ou Acessibilidades Curriculares" />

    <div class="row g-3 px-4 pb-3">
        <x-show.info-textarea label="Objetivos Específicos" column="col-md-9" isBox="true">
            {!! $peiDiscipline->specific_objectives !!}
        </x-show.info-textarea>

        <x-show.info-textarea label="Prazo das metas/objetivos" column="col-md-3" isBox="true">
            {!! $peiDiscipline->objectives_deadline ?? '—' !!}
        </x-show.info-textarea>

        <x-show.info-textarea label="Conteúdo Programático" column="col-md-6" isBox="true">
            {!! $peiDiscipline->content_programmatic !!}
        </x-show.info-textarea>

        <x-show.info-textarea label="Referência curricular" column="col-md-6" isBox="true">
            {!! $peiDiscipline->curricular_reference ?? '—' !!}
        </x-show.info-textarea>

        <x-show.info-textarea label="Metodologias e Estratégias" column="col-md-6" isBox="true">
            {!! $peiDiscipline->methodologies !!}
        </x-show.info-textarea>

        <x-show.info-textarea label="Recursos didáticos e tecnologia assistiva" column="col-md-6" isBox="true">
            {!! $peiDiscipline->materials_and_assistive_technology ?? '—' !!}
        </x-show.info-textarea>

        <x-show.info-textarea label="Processo de Avaliação" column="col-md-12" isBox="true">
            {!! $peiDiscipline->evaluations !!}
        </x-show.info-textarea>

        <x-show.info-textarea label="Registros Complementares" column="col-md-12" isBox="true">
            {!! $peiDiscipline->complementary_records ?? 'Nenhum registro complementar informado.' !!}
        </x-show.info-textarea>

        <x-show.info-textarea label="Parecer" column="col-md-12" isBox="true">
            {!! $peiDiscipline->opinion !!}
        </x-show.info-textarea>

        
    </div>


    {{-- ================= REVISÕES DA ADAPTAÇÃO ================= --}}
    <x-forms.section title="Revisões desta Adaptação" />

    <div class="row g-3 px-4 pb-3">
        <div class="col-12">
            @forelse($peiDiscipline->revisions as $revision)
                <div class="border-bottom pb-2 mb-2">
                    <strong>{{ $revision->reviewed_at?->format('d/m/Y') }}</strong> — {{ $revision->reviewer?->name }}
                    <p class="mb-0">{{ $revision->what_changed }}</p>
                    <small class="text-muted">{{ $revision->why }}</small>
                </div>
            @empty
                <p class="text-muted mb-0">Nenhuma revisão registrada para esta disciplina.</p>
            @endforelse

            @can('pei-discipline.update')
                <form action="{{ route('specialized-educational-support.pei-discipline.revisions.store', [$pei, $peiDiscipline]) }}" method="POST" class="mt-3 no-print">
                    @csrf
                    <div class="row g-2">
                        <div class="col-md-5">
                            <x-forms.textarea name="what_changed" label="O que mudou" rows="2" placeholder="Ex.: Metodologia alterada para incluir apoio visual nas atividades." required />
                        </div>
                        <div class="col-md-5">
                            <x-forms.textarea name="why" label="Por quê" rows="2" placeholder="Ex.: Professor observou melhor engajamento do aluno com recursos visuais." required />
                        </div>
                        <div class="col-md-2 d-flex align-items-end">
                            <x-buttons.submit-button type="submit" class="btn-action new submit w-100">
                                <i class="fas fa-plus"></i> Registrar
                            </x-buttons.submit-button>
                        </div>
                    </div>
                </form>
            @endcan
        </div>
    </div>

    {{-- ================= RODAPÉ ================= --}}
    <div class="col-12 border-top p-4 d-flex flex-wrap justify-content-end gap-2 bg-light rounded-bottom no-print">
        <div class="d-flex flex-wrap gap-2">
            @if(!$pei->is_finished)
            @can('pei-discipline.delete')
                <x-buttons.submit-button
                    type="button"
                    variant="danger"
                    data-bs-toggle="modal"
                    data-bs-target="#globalConfirmActionModal"
                    data-confirm-title="Excluir Adaptacao"
                    data-confirm-message="Deseja realmente excluir esta adaptacao?"
                    data-confirm-action="{{ route('specialized-educational-support.pei-discipline.destroy', [$pei, $peiDiscipline]) }}"
                    data-confirm-method="DELETE"
                    data-confirm-submit-text="Confirmar Exclusao"
                    data-confirm-variant="danger"
                >
                        <i class="fas fa-trash-alt"></i> Excluir Adaptação
                    </x-buttons.submit-button>
            @endcan
            @endif
        </div>
    </div>
</div>

@endsection
