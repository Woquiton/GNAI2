@extends('layouts.master')

@section('title', 'PAEE')

@section('content')
    <div class="mb-5">
        <x-breadcrumb :items="[
            'Home' => route('dashboard'),
            'Alunos' => route('specialized-educational-support.students.index'),
            $paee->student->person->name => route('specialized-educational-support.students.show', $paee->student),
            'PAEE' => route('specialized-educational-support.paee.index', $paee->student),
            'V' . $paee->version => null
        ]" />
    </div>

    <div class="d-flex justify-content-between mb-4 gnai-new">
        <span class="badge gnai-new-badge">Novo módulo</span>
        <div>
            <h2 class="text-title">PAEE v{{ $paee->version }}</h2>
            <span class="badge bg-{{ $paee->status->color() }}">{{ $paee->status->label() }}</span>
        </div>

        <div class="d-flex gap-2">
            <x-buttons.link-button :href="route('specialized-educational-support.paee.index', $paee->student)" variant="secondary">
                <i class="fas fa-arrow-left"></i> Voltar
            </x-buttons.link-button>

            @can('paee.view')
            <x-buttons.link-button :href="route('specialized-educational-support.paee.pdf', $paee)" variant="info" target="_blank">
                <i class="fas fa-file-pdf"></i> PDF
            </x-buttons.link-button>
            @endcan

            @can('paee.update')
            <x-buttons.link-button :href="route('specialized-educational-support.paee.edit', $paee)" variant="warning">
                <i class="fas fa-edit"></i> Editar
            </x-buttons.link-button>
            @endcan
        </div>
    </div>

    <div class="custom-table-card p-4 mb-4 gnai-new">
        <h5 class="fw-bold text-purple-dark">Atendimento</h5>
        <p><strong>Frequência:</strong> {{ $paee->attendance_frequency_per_week }}x por semana, {{ $paee->attendance_duration_minutes }} minutos</p>
        <p><strong>Formato:</strong> {{ $paee->attendance_format->label() }}</p>
        <p><strong>Local:</strong> {{ $paee->attendance_location->label() }}</p>
        <p><strong>Próxima Revisão:</strong> {{ optional($paee->next_review_date)->format('d/m/Y') }}</p>
    </div>

    <div class="custom-table-card p-4 mb-4 gnai-new">
        <h5 class="fw-bold text-purple-dark">Tecnologia Assistiva e Apoio</h5>
        <p><strong>Necessita Tecnologia Assistiva:</strong> {{ $paee->assistive_technology_needed ? 'Sim' : 'Não' }}</p>
        <p>{{ $paee->assistive_technology_notes }}</p>
        <p><strong>Necessita Profissional de Apoio:</strong> {{ $paee->support_professional_needed ? 'Sim' : 'Não' }}</p>
        <p>{{ $paee->support_professional_justification }}</p>
    </div>

    <div class="custom-table-card p-4 mb-4 gnai-new">
        <h5 class="fw-bold text-purple-dark">Objetivos</h5>
        @forelse($paee->objectives as $objective)
            <div class="mb-2 border-bottom pb-2">
                <strong>{{ $objective->term->label() }}:</strong> {{ $objective->description }}
                @if($objective->linkedBarrier)
                    <small class="text-muted"> (Barreira: {{ $objective->linkedBarrier->type->label() }})</small>
                @endif
            </div>
        @empty
            <p class="text-muted">Nenhum objetivo cadastrado.</p>
        @endforelse
    </div>

    <div class="custom-table-card p-4 mb-4 gnai-new">
        <h5 class="fw-bold text-purple-dark">Materiais e Recursos</h5>
        @forelse($paee->resources as $resource)
            <div class="mb-2 border-bottom pb-2">
                <strong>{{ $resource->acquisition_type->label() }}:</strong> {{ $resource->description }}
                @if($resource->assistiveTechnology)
                    <small class="text-muted"> (Catálogo: {{ $resource->assistiveTechnology->name }})</small>
                @endif
            </div>
        @empty
            <p class="text-muted">Nenhum recurso cadastrado.</p>
        @endforelse
    </div>

    <div class="custom-table-card p-4 mb-4 gnai-new">
        <h5 class="fw-bold text-purple-dark">Articulações e Formação</h5>
        <p><strong>Orientação aos Profissionais da Escola:</strong> {{ $paee->school_professionals_orientation ?? '-' }}</p>
        <p><strong>Articulação com Professores do Ensino Comum:</strong> {{ $paee->common_teachers_articulation ?? '-' }}</p>
        <p><strong>Articulação com a Família:</strong> {{ $paee->family_articulation ?? '-' }}</p>
        <p><strong>Articulação Intersetorial:</strong> {{ $paee->intersectoral_articulation ?? '-' }}</p>
        <p><strong>Demandas de Formação:</strong> {{ $paee->training_demands ?? '-' }}</p>
    </div>

    <div class="custom-table-card p-4 mb-4 gnai-new">
        <h5 class="fw-bold text-purple-dark">Revisões</h5>
        @forelse($paee->reviews as $review)
            <div class="mb-2 border-bottom pb-2">
                <strong>{{ $review->reviewed_at->format('d/m/Y') }}</strong> - {{ $review->reviewer->name ?? 'Usuário' }}
                <p class="mb-0"><strong>O que mudou:</strong> {{ $review->what_changed }}</p>
                <p class="mb-0"><strong>Por quê:</strong> {{ $review->why }}</p>
            </div>
        @empty
            <p class="text-muted">Nenhuma revisão registrada.</p>
        @endforelse

        @can('paee-review.create')
        <form action="{{ route('specialized-educational-support.paee-review.create', $paee) }}" method="POST" class="mt-3">
            @csrf
            <div class="row g-2">
                <div class="col-md-2">
                    <x-forms.input type="date" name="reviewed_at" label="Data" />
                </div>
                <div class="col-md-4">
                    <x-forms.textarea name="what_changed" label="O que mudou" :rows="2" :rich="false" />
                </div>
                <div class="col-md-4">
                    <x-forms.textarea name="why" label="Por quê" :rows="2" :rich="false" />
                </div>
                <div class="col-md-2 d-flex align-items-end">
                    <x-buttons.submit-button type="submit" variant="new">
                        <i class="fas fa-paper-plane"></i> Registrar
                    </x-buttons.submit-button>
                </div>
            </div>
        </form>
        @endcan
    </div>
@endsection
