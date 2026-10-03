@extends('layouts.master')

@section('title', 'Estudo de Caso')

@section('content')
    <div class="mb-5">
        <x-breadcrumb :items="[
            'Home' => route('dashboard'),
            'Alunos' => route('specialized-educational-support.students.index'),
            $caseStudy->student->person->name => route('specialized-educational-support.students.show', $caseStudy->student),
            'Estudos de Caso' => route('specialized-educational-support.case-study.index', $caseStudy->student),
            'V' . $caseStudy->version => null
        ]" />
    </div>

    <div class="d-flex justify-content-between mb-4 gnai-new">
        <span class="badge gnai-new-badge">Novo módulo</span>
        <div>
            <h2 class="text-title">Estudo de Caso v{{ $caseStudy->version }}</h2>
            <span class="badge bg-{{ $caseStudy->status->color() }}">{{ $caseStudy->status->label() }}</span>
            <span class="badge bg-{{ $caseStudy->acceptance_status->color() }}">{{ $caseStudy->acceptance_status->label() }}</span>
        </div>

        <div class="d-flex gap-2">
            <x-buttons.link-button :href="route('specialized-educational-support.case-study.index', $caseStudy->student)" variant="secondary">
                <i class="fas fa-arrow-left"></i> Voltar
            </x-buttons.link-button>

            @can('case-study.view')
            <x-buttons.link-button :href="route('specialized-educational-support.case-study.pdf', $caseStudy)" variant="info" target="_blank">
                <i class="fas fa-file-pdf"></i> PDF
            </x-buttons.link-button>
            @endcan

            @can('case-study.update')
                @if($caseStudy->status->value !== 'completed')
                <x-buttons.link-button :href="route('specialized-educational-support.case-study.edit', $caseStudy)" variant="warning">
                    <i class="fas fa-edit"></i> Editar
                </x-buttons.link-button>

                <form action="{{ route('specialized-educational-support.case-study.complete', $caseStudy) }}" method="POST" class="d-inline">
                    @csrf
                    @method('PATCH')
                    <x-buttons.submit-button type="submit" variant="success">
                        <i class="fas fa-check-circle"></i> Concluir
                    </x-buttons.submit-button>
                </form>
                @endif
            @endcan
        </div>
    </div>

    <div class="custom-table-card p-4 mb-4 gnai-new">
        <h5 class="fw-bold text-purple-dark">Origem e Participantes</h5>
        <p><strong>Origem da Demanda:</strong> {{ $caseStudy->demand_origin->label() }}</p>
        <p><strong>Participantes:</strong> {{ $caseStudy->participants_summary ?? '-' }}</p>
    </div>

    <div class="custom-table-card p-4 mb-4 gnai-new">
        <h5 class="fw-bold text-purple-dark">Escuta e Observação</h5>
        <p><strong>Observação do(a) Estudante:</strong><br>{{ $caseStudy->student_observation }}</p>
        <p><strong>Escuta do(a) Estudante/Família:</strong><br>{{ $caseStudy->student_family_listening }}</p>
        <p><strong>Escuta dos(as) Professores(as):</strong><br>{{ $caseStudy->teachers_listening }}</p>
        <p><strong>Outras Informações:</strong><br>{{ $caseStudy->other_info ?? '-' }}</p>
        <p><strong>Notas da Rede de Cuidado:</strong><br>{{ $caseStudy->care_network_notes ?? '-' }}</p>
    </div>

    <div class="custom-table-card p-4 mb-4 gnai-new">
        <h5 class="fw-bold text-purple-dark">Aspectos Favoráveis e Potencialidades</h5>
        <p><strong>Aspectos Favoráveis:</strong><br>{{ $caseStudy->favorable_aspects }}</p>
        <p><strong>Potencialidades e Interesses:</strong><br>{{ $caseStudy->potentials_interests }}</p>
    </div>

    <div class="custom-table-card p-4 mb-4 gnai-new">
        <h5 class="fw-bold text-purple-dark">Barreiras</h5>
        @forelse($caseStudy->barriers as $barrier)
            <div class="mb-2 border-bottom pb-2">
                <strong>{{ $barrier->type->label() }}</strong>
                <p class="mb-0">Situação: {{ $barrier->observed_situation }}</p>
                <p class="mb-0">Implicação: {{ $barrier->participation_implication }}</p>
            </div>
        @empty
            <p class="text-muted">Nenhuma barreira cadastrada.</p>
        @endforelse
    </div>

    <div class="custom-table-card p-4 mb-4 gnai-new">
        <h5 class="fw-bold text-purple-dark">Estratégias e Recursos</h5>
        @forelse($caseStudy->strategies as $strategy)
            <div class="mb-2 border-bottom pb-2">
                <p class="mb-0">{{ $strategy->description }}</p>
                @if($strategy->linkedBarrier)
                    <small class="text-muted">Vinculada à barreira: {{ $strategy->linkedBarrier->type->label() }}</small>
                @endif
            </div>
        @empty
            <p class="text-muted">Nenhuma estratégia cadastrada.</p>
        @endforelse
    </div>

    <div class="custom-table-card p-4 mb-4 gnai-new">
        <h5 class="fw-bold text-purple-dark">Apoios Necessários</h5>
        <p>{{ implode(', ', $caseStudy->needed_supports ?? []) }}</p>
        <p><strong>Justificativa:</strong> {{ $caseStudy->needed_supports_justification ?? '-' }}</p>
    </div>

    <div class="custom-table-card p-4 mb-4 gnai-new">
        <h5 class="fw-bold text-purple-dark">Contribuições</h5>
        @forelse($caseStudy->contributions as $contribution)
            <div class="mb-2 border-bottom pb-2">
                <strong>{{ $contribution->role }}</strong> - {{ $contribution->author->name ?? 'Usuário' }}
                <small class="text-muted"> em {{ $contribution->created_at->format('d/m/Y H:i') }}</small>
                <p class="mb-0">{{ $contribution->content }}</p>
            </div>
        @empty
            <p class="text-muted">Nenhuma contribuição registrada.</p>
        @endforelse

        @can('case-study-contribution.create')
        <form action="{{ route('specialized-educational-support.case-study-contribution.create', $caseStudy) }}" method="POST" class="mt-3">
            @csrf
            <div class="row g-2">
                <div class="col-md-3">
                    <x-forms.input name="role" label="Papel/Função" placeholder="Ex: Psicólogo escolar" />
                </div>
                <div class="col-md-7">
                    <x-forms.textarea name="content" label="Contribuição" :rows="2" :rich="false" />
                </div>
                <div class="col-md-2 d-flex align-items-end">
                    <x-buttons.submit-button type="submit" variant="new">
                        <i class="fas fa-paper-plane"></i> Enviar
                    </x-buttons.submit-button>
                </div>
            </div>
        </form>
        @endcan
    </div>

    @if($caseStudy->status->value === 'completed')
        <div class="custom-table-card p-4 mb-4 gnai-new">
            <h5 class="fw-bold text-purple-dark">PAEE</h5>
            @if($caseStudy->paees->isEmpty())
                @can('paee.create')
                <x-buttons.link-button :href="route('specialized-educational-support.paee.create', $caseStudy->student)" variant="new">
                    <i class="fas fa-plus"></i> Gerar PAEE a partir deste Estudo de Caso
                </x-buttons.link-button>
                @endcan
            @else
                @foreach($caseStudy->paees as $paee)
                    <x-buttons.link-button :href="route('specialized-educational-support.paee.show', $paee)" variant="info">
                        <i class="fas fa-eye"></i> Ver PAEE v{{ $paee->version }}
                    </x-buttons.link-button>
                @endforeach
            @endif
        </div>
    @endif
@endsection
