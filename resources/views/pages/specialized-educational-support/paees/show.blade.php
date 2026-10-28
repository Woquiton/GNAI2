@extends('layouts.master')

@section('content')
    <div class="mb-5">
        <x-breadcrumb :items="[
            'Home' => route('dashboard'),
            'Alunos' => route('specialized-educational-support.students.index'),
            $paee->student->person->name => route('specialized-educational-support.students.show', $paee->student),
            'PAEE v' . $paee->version => null,
        ]" />
    </div>

    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <div>
            <h2 class="text-title">
                PAEE v{{ $paee->version }}
                <span class="tag-new">Novo módulo</span>
            </h2>
            <p class="text-muted">
                Aluno: {{ $paee->student->person->name }} —
                <a href="{{ route('specialized-educational-support.case-study.show', $paee->caseStudy) }}">Estudo de Caso de origem: v{{ $paee->caseStudy->version }}</a>
            </p>
        </div>

        <div class="d-flex flex-wrap gap-2">
            <x-buttons.link-button :href="route('specialized-educational-support.paee.pdf', $paee)" variant="secondary" target="_blank">
                <i class="fas fa-file-pdf"></i> PDF
            </x-buttons.link-button>

            @can('paee.update')
                <x-buttons.link-button :href="route('specialized-educational-support.paee.edit', $paee)" variant="warning">
                    <i class="fas fa-edit"></i> Editar
                </x-buttons.link-button>
            @endcan
        </div>
    </div>

    <div class="card shadow-sm gnai-new-section mb-4">
        <div class="card-body">
            <div class="row">
                <x-show.info-item label="Status" column="col-md-3" isBox="true">
                    {{ match($paee->status) { 'active' => 'Ativo', 'under_review' => 'Em revisão', default => 'Rascunho' } }}
                </x-show.info-item>
                <x-show.info-item label="Semestre" column="col-md-3" isBox="true">{{ $paee->semester?->label }}</x-show.info-item>
                <x-show.info-item label="Elaborado por" column="col-md-3" isBox="true">{{ $paee->creator->name ?? '—' }} em {{ $paee->created_at?->format('d/m/Y') }}</x-show.info-item>
                <x-show.info-item label="Frequência semanal" column="col-md-3" isBox="true">{{ $paee->attendance_frequency_per_week }}x</x-show.info-item>
                <x-show.info-item label="Duração" column="col-md-3" isBox="true">{{ $paee->attendance_duration_minutes }} min</x-show.info-item>
                <x-show.info-item label="Formato" column="col-md-3" isBox="true">{{ \App\Shared\Domain\Support\AeeLabels::attendanceFormat($paee->attendance_format) }}</x-show.info-item>
                <x-show.info-item label="Local" column="col-md-3" isBox="true">{{ \App\Shared\Domain\Support\AeeLabels::attendanceLocation($paee->attendance_location) }}</x-show.info-item>
                <x-show.info-item label="Próxima revisão" column="col-md-3" isBox="true">{{ $paee->next_review_date?->format('d/m/Y') }}</x-show.info-item>
            </div>
        </div>
    </div>

    <div class="card shadow-sm mb-4">
        <div class="card-body">
            <h5 class="text-purple-dark fw-bold mb-3">Tecnologia Assistiva e CAA</h5>
            <div class="row mb-3">
                <x-show.info-item label="Necessita TA" column="col-md-3" isBox="true">{{ $paee->assistive_technology_needed ? 'Sim' : 'Não' }}</x-show.info-item>
                <x-show.info-item label="Necessita CAA" column="col-md-3" isBox="true">{{ $paee->caa_needed ? 'Sim' : 'Não' }}</x-show.info-item>
                <x-show.info-item label="TA é dispositivo digital portátil" column="col-md-6" isBox="true">{{ $paee->is_assistive_technology_portable_digital_device ? 'Sim' : 'Não' }}</x-show.info-item>
                <x-show.info-item label="Observações TA" column="col-md-6" isBox="true">{{ $paee->assistive_technology_notes ?? '—' }}</x-show.info-item>
                <x-show.info-item label="Observações CAA" column="col-md-6" isBox="true">{{ $paee->caa_notes ?? '—' }}</x-show.info-item>
                <x-show.info-item label="Capacidade de disponibilização" column="col-md-12" isBox="true">{{ $paee->assistive_technology_availability_capacity ?? '—' }}</x-show.info-item>
                @if($paee->is_assistive_technology_portable_digital_device)
                    <x-show.info-item label="Parecer pedagógico (TA portátil)" column="col-md-12" isBox="true">{{ $paee->assistive_technology_pedagogical_opinion ?? '—' }}</x-show.info-item>
                @endif
            </div>

            <h5 class="text-purple-dark fw-bold mb-3">Apoios de Profissionais</h5>
            <div class="row mb-3">
                <x-show.info-item label="Profissional de apoio" column="col-md-4" isBox="true">{{ $paee->support_professional_needed ? 'Sim' : 'Não' }}</x-show.info-item>
                <x-show.info-item label="Intérprete de Libras" column="col-md-4" isBox="true">{{ $paee->libras_interpreter_needed ? 'Sim' : 'Não' }}</x-show.info-item>
                <x-show.info-item label="Guia-intérprete" column="col-md-4" isBox="true">{{ $paee->guide_interpreter_needed ? 'Sim' : 'Não' }}</x-show.info-item>
                @if($paee->support_professional_needed)
                    <x-show.info-item label="Justificativa (apoio)" column="col-md-12" isBox="true">{{ $paee->support_professional_justification ?? '—' }}</x-show.info-item>
                @endif
                @if($paee->libras_interpreter_needed)
                    <x-show.info-item label="Justificativa (Libras)" column="col-md-12" isBox="true">{{ $paee->libras_interpreter_justification ?? '—' }}</x-show.info-item>
                @endif
                @if($paee->guide_interpreter_needed)
                    <x-show.info-item label="Justificativa (guia-intérprete)" column="col-md-12" isBox="true">{{ $paee->guide_interpreter_justification ?? '—' }}</x-show.info-item>
                @endif
            </div>

            <h5 class="text-purple-dark fw-bold mb-3">Objetivos</h5>
            @forelse($paee->objectives as $objective)
                <div class="border rounded p-3 mb-2">
                    <p class="mb-1">{{ $objective->description }}</p>
                    <small class="text-muted">Prazo: {{ \App\Shared\Domain\Support\AeeLabels::objectiveTerm($objective->term) }}</small>
                </div>
            @empty
                <p class="text-muted">Nenhum objetivo registrado.</p>
            @endforelse

            <h5 class="text-purple-dark fw-bold mt-4 mb-3">Recursos</h5>
            @forelse($paee->resources as $resource)
                <div class="border rounded p-3 mb-2">
                    <p class="mb-1">{{ $resource->description }}</p>
                    <small class="text-muted">Tipo: {{ \App\Shared\Domain\Support\AeeLabels::acquisitionType($resource->acquisition_type) }}</small>
                </div>
            @empty
                <p class="text-muted">Nenhum recurso registrado.</p>
            @endforelse
        </div>
    </div>

    <div class="card shadow-sm mb-4">
        <div class="card-body">
            <h5 class="text-purple-dark fw-bold mb-3">Revisões</h5>
            @forelse($paee->reviews as $review)
                <div class="border-bottom pb-2 mb-2">
                    <strong>{{ $review->reviewed_at?->format('d/m/Y') }}</strong> — {{ $review->reviewer?->name }}
                    <p class="mb-0">{{ $review->what_changed }}</p>
                    <small class="text-muted">{{ $review->why }}</small>
                </div>
            @empty
                <p class="text-muted">Nenhuma revisão registrada.</p>
            @endforelse

            @can('paee.update')
                <form action="{{ route('specialized-educational-support.paee.reviews.store', $paee) }}" method="POST" class="mt-3">
                    @csrf
                    <div class="row g-2">
                        <div class="col-md-5">
                            <x-forms.textarea name="what_changed" label="O que mudou" rows="2" placeholder="Ex.: Frequência de atendimento aumentada para 2x por semana." required />
                        </div>
                        <div class="col-md-5">
                            <x-forms.textarea name="why" label="Por quê" rows="2" placeholder="Ex.: Avaliação da equipe indicou necessidade de mais suporte no período." required />
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
@endsection
