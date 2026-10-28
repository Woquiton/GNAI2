@extends('layouts.app')

@section('content')

<div class="mb-5">
    <x-breadcrumb :items="[
        'Home' => route('dashboard'),
        'Alunos' => route('specialized-educational-support.students.index'),
        $pei->student->person->name => route('specialized-educational-support.students.show', $pei->student),
        'PEIs' => route('specialized-educational-support.pei.index', $pei->student),
        'PEI #' . $pei->id => null
    ]" />
</div>


{{-- ================= HEADER DA PÁGINA ================= --}}
<div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
    <div>
        <h2 class="text-title mb-1">Plano Educacional Individualizado</h2>
        <div class="small text-muted">
            Versão {{ $pei->version }} • {{ $pei->semester->label }} • 
            @if($pei->is_finished)
                <span class="text-success fw-semibold">FINALIZADO</span>
            @else
                <span class="text-warning fw-semibold">EM PREENCHIMENTO</span>
            @endif
        </div>
    </div>

    <div class="d-flex gap-2 flex-wrap justify-content-end ms-md-auto">
        

        @if(!$pei->is_finished)
        @can('pei.update')
            <form method="POST"
                action="{{ route('specialized-educational-support.pei.finish', $pei) }}"
                onsubmit="return confirm('Após finalizar, o plano não poderá ser editado. Confirmar?')">
                @csrf
                @method('PATCH')
                <x-buttons.submit-button variant="success">
                    <i class="fas fa-check"></i> Finalizar
                </x-buttons.submit-button>
            </form>
        @endcan
        @endif
        <x-buttons.pdf-button
            :href="route('specialized-educational-support.pei.pdf', $pei)"
            target="_blank"
        />
        <x-buttons.link-button
            :href="route('specialized-educational-support.pei.pdf-family', $pei)"
            variant="outline-secondary"
            target="_blank"
        >
            <i class="fas fa-file-pdf"></i> PDF para a Família
        </x-buttons.link-button>
        @can('pei.delete')
        <x-buttons.submit-button
            type="button"
            variant="danger"
            data-bs-toggle="modal"
            data-bs-target="#globalConfirmActionModal"
            data-confirm-title="Excluir PEI"
            data-confirm-message="Excluir permanentemente este PEI?"
            data-confirm-action="{{ route('specialized-educational-support.pei.destroy', $pei) }}"
            data-confirm-method="DELETE"
            data-confirm-submit-text="Confirmar Exclusao"
            data-confirm-variant="danger"
        >
                <i class="fas fa-trash-alt"></i> Excluir
            </x-buttons.submit-button>
        @endcan
        <x-buttons.link-button 
            :href="route('specialized-educational-support.pei.index', $pei->student)" 
            variant="secondary">
            <i class="fas fa-arrow-left"></i> Voltar
        </x-buttons.link-button>

    </div>
</div>


<div class="custom-table-card bg-white">
    <div class="row g-0">

        {{-- ================= DADOS DO PEI (CABEÇALHO COMPLETO) ================= --}}
        <x-forms.section title="Dados do PEI" />

        <div class="row g-2 px-4 pb-4">

            {{-- ===== ALUNO ===== --}}
            <div class="col-md-12">
                <div class="card p-3 border-light bg-soft-info">
                    <div class="d-flex align-items-center gap-3">

                        <img src="{{ $student->person->photo_url }}"
                            class="rounded-circle shadow-sm"
                            style="width:64px;height:64px;object-fit:cover;">

                        <div>
                            <strong class="d-block fs-5">
                                {{ $student->person->name }}
                            </strong>

                            <span class="small text-muted d-block">
                                Matrícula: {{ $student->registration ?? '—' }}
                            </span>

                            <span class="small text-muted">
                                <span class="text-{{ $student->status->color() }} text-uppercase fw-bold">
                                    {{ $student->status->label() ?? '—' }}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>


            {{-- ===== PERFIS DE ATENDIMENTO ===== --}}
            <div class="col-md-12">
                <div class="row g-2">

                    @forelse($student->deficiencies as $def)
                        <x-ui.info-card
                            column="col-md-6"
                            :value="$def->name"
                        >
                            <!-- <span class="small text-muted">
                                Grau: {{ $def->pivot->severity ?? '—' }}
                            </span> -->
                        </x-ui.info-card>
                    @empty
                        <x-ui.info-card
                            column="col-md-6"
                            class="text-muted"
                        >
                            Nenhum perfil de atendimento registrado.
                        </x-ui.info-card>
                    @endforelse

                </div>
            </div>


            {{-- ===== DADOS DO PEI ===== --}}
            <div class="col-md-12 pt-3">
                <div class="row g-2">

                    <x-ui.info-card
                        label="Responsável"
                        :value="$pei->creator?->is_admin ? 'admin' : ($pei->creator?->name ?: 'Sistema/Desconhecido')"
                    />

                    <x-ui.info-card
                        label="Curso"
                        :value="$pei->course->name"
                    />

                    <x-ui.info-card
                        label="Semestre"
                        :value="$pei->semester->label"
                    />

                    <x-ui.info-card label="Versão">
                        <strong>v{{ $pei->version }}</strong>
                    </x-ui.info-card>

                    <x-ui.info-card
                        label="Criado em"
                        :value="$pei->created_at->format('d/m/Y')"
                    />

                    <x-ui.info-card label="Status">
                        @if($pei->is_finished)
                            <strong class="text-success">Finalizado</strong>
                        @else
                            <strong class="text-warning">Em preenchimento</strong>
                        @endif
                    </x-ui.info-card>

                </div>
            </div>

        </div>

        @can('paee.view')
        {{-- ================= PAEE VINCULADO ================= --}}
        <x-forms.section title="PAEE Vinculado" />

        <div class="px-4 pb-4">
            @if($paee)
                <div class="d-flex justify-content-end mb-3">
                    <a href="{{ route('specialized-educational-support.paee.show', $paee) }}" class="btn btn-sm btn-outline-primary">
                        <i class="bi bi-box-arrow-up-right"></i> Ver PAEE completo
                    </a>
                </div>
                @include('pages.specialized-educational-support.peis.partials.paee-summary', [
                    'paee' => $paee
                ])
            @else
                <p class="text-muted mb-0">Nenhum PAEE vinculado a este PEI.</p>
            @endif
        </div>
        @endcan


        <x-forms.section title="Adaptações Razoáveis e/ou Acessibilidades Curriculares" />

        <div class="px-4 pt-3 pb-2 d-flex justify-content-end align-items-center">         
            @can('pei-discipline.create')
                <x-buttons.link-button 
                    href="{{ route('specialized-educational-support.pei-discipline.create', $pei) }}" 
                    variant="primary">
                    <i class="fas fa-plus"></i> Adicionar Adaptação
                </x-buttons.link-button>
            @endcan
        </div>
        @can('pei-discipline.view')
        {{-- adaptações por disciplina (cards paginados) --}}
        <div class="px-4 pb-4">
            @include('pages.specialized-educational-support.peis.partials.disciplines-cards', [
                'peiDisciplines' => $peiDisciplines,
                'pei' => $pei
            ])
        </div>
        @endcan

        {{-- ========== Portaria 421/2026, art. 11, I/III/IV: reunido automaticamente ========== --}}
        <x-forms.section title="Atividades, Acompanhamento e Devolutivas do Semestre" />

        <div class="px-4 pb-2">
            <small class="text-muted d-block mb-3">
                Reunido automaticamente a partir dos atendimentos AEE e pedagógicos deste aluno dentro do semestre do PEI — não exige preenchimento aqui.
            </small>

            <h6 class="text-purple-dark fw-bold mt-3">Atividades na SRM e em outros espaços do AEE</h6>
            @forelse($attendanceSummary['aee'] as $evaluation)
                <div class="border rounded p-2 mb-2 small">
                    <strong>{{ optional($evaluation->aeeRecord->attendanceSession)->session_date?->format('d/m/Y') }}</strong>
                    — {{ $evaluation->aeeRecord->attendanceSession->professional->person->name ?? '—' }}
                    <p class="mb-0 text-muted">
                        {{ $evaluation->is_present ? $evaluation->adaptations_made : 'Aluno ausente — '.$evaluation->absence_reason }}
                    </p>
                </div>
            @empty
                <p class="text-muted small">Nenhum atendimento AEE registrado neste semestre.</p>
            @endforelse

            <h6 class="text-purple-dark fw-bold mt-4">Acompanhamento e Monitoramento</h6>
            @forelse($attendanceSummary['aee']->filter(fn($e) => $e->is_present) as $evaluation)
                <div class="border rounded p-2 mb-2 small">
                    <strong>{{ optional($evaluation->aeeRecord->attendanceSession)->session_date?->format('d/m/Y') }}</strong> (AEE)
                    <p class="mb-0 text-muted">
                        {{ $evaluation->development_evaluation }}
                        @if($evaluation->progress_indicators) — Indicadores: {{ $evaluation->progress_indicators }} @endif
                        @if($evaluation->next_session_adjustments) — Ajustes: {{ $evaluation->next_session_adjustments }} @endif
                    </p>
                </div>
            @empty
            @endforelse
            @forelse($attendanceSummary['pedagogical'] as $record)
                <div class="border rounded p-2 mb-2 small">
                    <strong>{{ optional($record->attendanceSession)->session_date?->format('d/m/Y') }}</strong> (Pedagógico)
                    <p class="mb-0 text-muted">{{ $record->systematic_pedagogical_follow_up_record }}</p>
                </div>
            @empty
                @if($attendanceSummary['aee']->where('is_present', true)->isEmpty())
                    <p class="text-muted small">Nenhum acompanhamento registrado neste semestre.</p>
                @endif
            @endforelse

            <h6 class="text-purple-dark fw-bold mt-4">Devolutivas às Famílias</h6>
            @forelse($attendanceSummary['returns'] as $return)
                <div class="border rounded p-2 mb-2 small">
                    <strong>{{ optional($return['date'])->format('d/m/Y') }}</strong>
                    — {{ $return['source'] }} — {{ $return['professional'] ?? '—' }}
                    <br><span class="text-muted">Responsáveis presentes: {{ $return['guardians'] ?: '—' }}</span>
                    <p class="mb-0 text-muted">{{ $return['summary'] }}</p>
                </div>
            @empty
                <p class="text-muted small">Nenhuma devolutiva à família registrada neste semestre.</p>
            @endforelse
        </div>

        {{-- ========== Outras informações relevantes (Apêndice 4, item 16) ========== --}}
        <x-forms.section title="Outras Informações Relevantes" />
        <div class="px-4 pb-4">
            @can('pei.update')
                <form action="{{ route('specialized-educational-support.pei.other-info.update', $pei) }}" method="POST">
                    @csrf
                    @method('PATCH')
                    <x-forms.textarea
                        name="other_relevant_info"
                        label=""
                        rows="3"
                        :value="old('other_relevant_info', $pei->other_relevant_info)"
                    />
                    <div class="d-flex justify-content-end mt-2">
                        <x-buttons.submit-button type="submit" class="btn-action new submit">
                            <i class="fas fa-save"></i> Salvar
                        </x-buttons.submit-button>
                    </div>
                </form>
            @else
                <p class="text-muted mb-0">{{ $pei->other_relevant_info ?? 'Nenhuma informação adicional registrada.' }}</p>
            @endcan
        </div>
    </div>
</div>

@endsection
