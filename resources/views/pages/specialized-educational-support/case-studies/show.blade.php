@extends('layouts.master')

@section('content')
    <div class="mb-5">
        <x-breadcrumb :items="[
            'Home' => route('dashboard'),
            'Alunos' => route('specialized-educational-support.students.index'),
            $caseStudy->student->person->name => route('specialized-educational-support.students.show', $caseStudy->student),
            'Estudo de Caso v' . $caseStudy->version => null,
        ]" />
    </div>

    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <div>
            <h2 class="text-title">
                Estudo de Caso v{{ $caseStudy->version }}
                <span class="tag-new">Novo módulo</span>
            </h2>
            <p class="text-muted">Aluno: {{ $caseStudy->student->person->name }}</p>
        </div>

        <div class="d-flex flex-wrap gap-2">
            <x-buttons.link-button :href="route('specialized-educational-support.case-study.pdf', $caseStudy)" variant="secondary" target="_blank">
                <i class="fas fa-file-pdf"></i> PDF
            </x-buttons.link-button>

            @can('case-study.update')
                @if($caseStudy->status !== 'completed')
                    <x-buttons.link-button :href="route('specialized-educational-support.case-study.edit', $caseStudy)" variant="warning">
                        <i class="fas fa-edit"></i> Editar
                    </x-buttons.link-button>

                    <form action="{{ route('specialized-educational-support.case-study.complete', $caseStudy) }}" method="POST" onsubmit="return confirm('Concluir este Estudo de Caso? Essa ação libera a criação do PAEE.');">
                        @csrf
                        @method('PATCH')
                        <x-buttons.submit-button type="submit" class="btn-action new submit">
                            <i class="fas fa-check-circle"></i> Concluir
                        </x-buttons.submit-button>
                    </form>
                @endif
            @endcan

            @if($caseStudy->status === 'completed')
                @can('paee.create')
                    <x-buttons.link-button :href="route('specialized-educational-support.paee.create', $caseStudy)" variant="success">
                        <i class="fas fa-plus"></i> Criar PAEE
                    </x-buttons.link-button>
                @endcan
            @endif
        </div>
    </div>

    <div class="card shadow-sm gnai-new-section mb-4">
        <div class="card-body">
            <div class="row">
                <x-show.info-item label="Status" column="col-md-3" isBox="true">
                    {{ match($caseStudy->status) { 'completed' => 'Concluído', 'in_progress' => 'Em andamento', default => 'Rascunho' } }}
                </x-show.info-item>
                <x-show.info-item label="Semestre" column="col-md-3" isBox="true">{{ $caseStudy->semester?->label }}</x-show.info-item>
                <x-show.info-item label="Criador" column="col-md-3" isBox="true">{{ $caseStudy->creator?->name }}</x-show.info-item>
                <x-show.info-item label="Origem da demanda" column="col-md-3" isBox="true">
                    {{ \App\Shared\Domain\Support\AeeLabels::demandOrigin($caseStudy->demand_origin) }}
                </x-show.info-item>
                <x-show.info-item label="Data do Estudo de Caso" column="col-md-3" isBox="true">
                    {{ $caseStudy->study_date?->format('d/m/Y') ?? '—' }}
                </x-show.info-item>

                <x-show.info-item label="Observação do estudante" column="col-md-12" isBox="true">{{ $caseStudy->student_observation }}</x-show.info-item>
                <x-show.info-item label="Escuta do estudante/família" column="col-md-12" isBox="true">{{ $caseStudy->student_family_listening }}</x-show.info-item>
                <x-show.info-item label="Escuta dos professores" column="col-md-12" isBox="true">{{ $caseStudy->teachers_listening }}</x-show.info-item>
                <x-show.info-item label="Aspectos favoráveis" column="col-md-6" isBox="true">{{ $caseStudy->favorable_aspects }}</x-show.info-item>
                <x-show.info-item label="Potenciais e interesses" column="col-md-6" isBox="true">{{ $caseStudy->potentials_interests }}</x-show.info-item>
                <x-show.info-item label="Apoios necessários" column="col-md-12" isBox="true">
                    {{ \App\Shared\Domain\Support\AeeLabels::neededSupportsList($caseStudy->needed_supports) }}
                </x-show.info-item>
                <x-show.info-item label="Status de aceite" column="col-md-6" isBox="true">
                    {{ \App\Shared\Domain\Support\AeeLabels::acceptanceStatus($caseStudy->acceptance_status) }}
                </x-show.info-item>
                <x-show.info-item label="Data do aceite" column="col-md-6" isBox="true">
                    {{ $caseStudy->acceptance_date?->format('d/m/Y') ?? '—' }}
                </x-show.info-item>
            </div>
        </div>
    </div>

    <div class="card shadow-sm mb-4">
        <div class="card-body">
            <h5 class="text-purple-dark fw-bold mb-3">Barreiras</h5>
            @forelse($caseStudy->barriers as $barrier)
                <div class="border rounded p-3 mb-2">
                    <strong>{{ \App\Shared\Domain\Support\AeeLabels::barrierType($barrier->type) }}</strong>
                    <p class="mb-1">{{ $barrier->observed_situation }}</p>
                    <small class="text-muted">Implicação: {{ $barrier->participation_implication }}</small>
                </div>
            @empty
                <p class="text-muted">Nenhuma barreira registrada.</p>
            @endforelse

            <h5 class="text-purple-dark fw-bold mt-4 mb-3">Estratégias</h5>
            @forelse($caseStudy->strategies as $strategy)
                <div class="border rounded p-3 mb-2">
                    <p class="mb-0">{{ $strategy->description }}</p>
                    @if($strategy->linkedBarrier)
                        <small class="text-muted">Relacionada à barreira: {{ \App\Shared\Domain\Support\AeeLabels::barrierType($strategy->linkedBarrier->type) }}</small>
                    @endif
                </div>
            @empty
                <p class="text-muted">Nenhuma estratégia registrada.</p>
            @endforelse
        </div>
    </div>

    <div class="card shadow-sm mb-4">
        <div class="card-body">
            <h5 class="text-purple-dark fw-bold mb-3">Contribuições</h5>
            @forelse($caseStudy->contributions as $contribution)
                <div class="border-bottom pb-2 mb-2">
                    <strong>{{ $contribution->author?->name }}</strong> <span class="text-muted">({{ $contribution->role }})</span>
                    <p class="mb-0">{{ $contribution->content }}</p>
                    <small class="text-muted">{{ $contribution->created_at?->format('d/m/Y H:i') }}</small>
                </div>
            @empty
                <p class="text-muted">Nenhuma contribuição registrada.</p>
            @endforelse

            @can('case-study.update')
                <form action="{{ route('specialized-educational-support.case-study.contributions.store', $caseStudy) }}" method="POST" class="mt-3">
                    @csrf
                    <div class="row g-2">
                        <div class="col-md-3">
                            <x-forms.input name="role" label="Papel" placeholder="Ex: professor, família" required />
                        </div>
                        <div class="col-md-7">
                            <x-forms.textarea name="content" label="Contribuição" rows="2" required />
                        </div>
                        <div class="col-md-2 d-flex align-items-end">
                            <x-buttons.submit-button type="submit" class="btn-action new submit w-100">
                                <i class="fas fa-plus"></i> Adicionar
                            </x-buttons.submit-button>
                        </div>
                    </div>
                </form>
            @endcan
        </div>
    </div>
@endsection
