@extends('layouts.teacher-portal')

@section('title', $student->person->name)

@php
    $hasLaudo = $student->documents->contains(fn ($d) => $d->type === \App\Domains\SpecializedEducationalSupport\Domain\Enums\StudentDocumentType::TECHNICAL_REPORT);
    $caseStudy = $student->currentCaseStudy;
    $paee = $student->currentPaee;
    $pei = $student->peis->first();
    $labels = \App\Shared\Domain\Support\AeeLabels::class;
@endphp

@section('content')

    <a href="{{ route('teacher-portal.index') }}" class="small text-muted d-inline-block mb-3">
        <i class="fas fa-arrow-left"></i> Voltar
    </a>

    <div class="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
            <h2 class="fw-bold mb-1" style="color:#272264;">{{ $student->person->name }}</h2>
            <p class="text-muted mb-0">Matrícula: {{ $student->registration }}</p>
        </div>
        <span class="badge bg-secondary align-self-center">Modo leitura</span>
    </div>

    <div class="alert alert-light border d-flex align-items-start gap-2 mb-4">
        <i class="fas fa-circle-info mt-1"></i>
        <div>
            Esta página mostra a situação atual do aluno. Se o Estudo de Caso, o PAEE ou o PEI mudarem,
            é só <a href="{{ route('teacher-access.request') }}">gerar um novo link de acesso</a> a
            qualquer momento para consultar as atualizações ou editar sua adaptação no PEI.
        </div>
    </div>

    <div class="row g-3 mb-4">
        <div class="col-6 col-md-3">
            <div class="card border-0 shadow-sm text-center p-3">
                <div class="small text-muted">Laudo</div>
                <div class="fw-bold {{ $hasLaudo ? 'text-success' : 'text-danger' }}">{{ $hasLaudo ? 'Sim' : 'Não' }}</div>
            </div>
        </div>
        <div class="col-6 col-md-3">
            <div class="card border-0 shadow-sm text-center p-3">
                <div class="small text-muted">Estudo de Caso</div>
                <div class="fw-bold {{ $caseStudy ? 'text-success' : 'text-danger' }}">{{ $caseStudy ? 'Sim' : 'Não' }}</div>
            </div>
        </div>
        <div class="col-6 col-md-3">
            <div class="card border-0 shadow-sm text-center p-3">
                <div class="small text-muted">PAEE</div>
                <div class="fw-bold {{ $paee ? 'text-success' : 'text-danger' }}">{{ $paee ? 'Sim' : 'Não' }}</div>
            </div>
        </div>
        <div class="col-6 col-md-3">
            <div class="card border-0 shadow-sm text-center p-3">
                <div class="small text-muted">PEI</div>
                <div class="fw-bold {{ $pei ? 'text-success' : 'text-danger' }}">{{ $pei ? 'Sim' : 'Não' }}</div>
            </div>
        </div>
    </div>

    {{-- ================= LAUDO / DOCUMENTOS ================= --}}
    <div class="card border-0 shadow-sm mb-3">
        <div class="card-body">
            <h5 class="fw-bold mb-3" style="color:#272264;"><i class="fas fa-file-medical me-2"></i>Laudo e Documentos</h5>

            @if($student->documents->isEmpty())
                <p class="text-muted mb-0">Nenhum documento anexado para este aluno.</p>
            @else
                <table class="table table-sm mb-0">
                    <thead>
                        <tr><th>Tipo</th><th>Título</th><th>Enviado em</th><th></th></tr>
                    </thead>
                    <tbody>
                        @foreach($student->documents as $document)
                            <tr>
                                <td>{{ $document->type->label() }}</td>
                                <td>{{ $document->title }}</td>
                                <td>{{ optional($document->created_at)->format('d/m/Y') }}</td>
                                <td>
                                    <a href="{{ route('teacher-portal.documents.view', $document) }}" target="_blank" class="btn btn-sm btn-outline-primary">
                                        <i class="fas fa-eye"></i> Ver PDF
                                    </a>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @endif
        </div>
    </div>

    {{-- ================= ESTUDO DE CASO ================= --}}
    <div class="card border-0 shadow-sm mb-3">
        <div class="card-body">
            <h5 class="fw-bold mb-3" style="color:#272264;"><i class="fas fa-notes-medical me-2"></i>Estudo de Caso</h5>

            @if($caseStudy)
                <div class="row g-3 mb-3">
                    <div class="col-md-3"><strong>Versão:</strong> v{{ $caseStudy->version }}</div>
                    <div class="col-md-3"><strong>Status:</strong> {{ $labels::caseStudyStatus($caseStudy->status) }}</div>
                    <div class="col-md-3"><strong>Semestre:</strong> {{ $caseStudy->semester->label ?? '—' }}</div>
                    <div class="col-md-3"><strong>Origem da demanda:</strong> {{ $labels::demandOrigin($caseStudy->demand_origin) }}</div>
                </div>

                <p><strong>Observação do estudante:</strong><br>{{ $caseStudy->student_observation }}</p>
                <p><strong>Escuta do estudante/família:</strong><br>{{ $caseStudy->student_family_listening }}</p>
                <p><strong>Escuta dos professores:</strong><br>{{ $caseStudy->teachers_listening }}</p>
                <div class="row g-3">
                    <div class="col-md-6">
                        <p class="mb-0"><strong>Aspectos favoráveis:</strong><br>{{ $caseStudy->favorable_aspects }}</p>
                    </div>
                    <div class="col-md-6">
                        <p class="mb-0"><strong>Potenciais e interesses:</strong><br>{{ $caseStudy->potentials_interests }}</p>
                    </div>
                </div>

                @if($caseStudy->other_info)
                    <p class="mt-3 mb-0"><strong>Outras informações:</strong><br>{{ $caseStudy->other_info }}</p>
                @endif

                @if($caseStudy->barriers->count())
                    <hr>
                    <strong>Barreiras identificadas</strong>
                    <ul class="mb-0">
                        @foreach($caseStudy->barriers as $barrier)
                            <li>
                                <strong>{{ $labels::barrierType($barrier->type) }}:</strong>
                                {{ $barrier->observed_situation }}
                                <br><span class="text-muted small">Implicação: {{ $barrier->participation_implication }}</span>
                            </li>
                        @endforeach
                    </ul>
                @endif

                @if($caseStudy->strategies->count())
                    <hr>
                    <strong>Estratégias</strong>
                    <ul class="mb-0">
                        @foreach($caseStudy->strategies as $strategy)
                            <li>
                                {{ $strategy->description }}
                                @if($strategy->linkedBarrier)
                                    <span class="text-muted small">(relacionada a: {{ $labels::barrierType($strategy->linkedBarrier->type) }})</span>
                                @endif
                            </li>
                        @endforeach
                    </ul>
                @endif

                @if($caseStudy->contributions->count())
                    <hr>
                    <strong>Contribuições</strong>
                    @foreach($caseStudy->contributions as $contribution)
                        <div class="border-bottom pb-2 mb-2 mt-2">
                            <strong>{{ $contribution->author->name ?? '—' }}</strong>
                            <span class="text-muted small">({{ $contribution->role }}) — {{ optional($contribution->created_at)->format('d/m/Y') }}</span>
                            <p class="mb-0">{{ $contribution->content }}</p>
                        </div>
                    @endforeach
                @endif
            @else
                <p class="text-muted mb-0">Nenhum Estudo de Caso registrado para este aluno.</p>
            @endif
        </div>
    </div>

    {{-- ================= PAEE ================= --}}
    <div class="card border-0 shadow-sm mb-3">
        <div class="card-body">
            <h5 class="fw-bold mb-3" style="color:#272264;"><i class="fas fa-clipboard-list me-2"></i>PAEE</h5>

            @if($paee)
                <div class="row g-3 mb-3">
                    <div class="col-md-3"><strong>Versão:</strong> v{{ $paee->version }}</div>
                    <div class="col-md-3"><strong>Status:</strong> {{ $labels::paeeStatus($paee->status) }}</div>
                    <div class="col-md-3"><strong>Frequência:</strong> {{ $paee->attendance_frequency_per_week }}x/semana</div>
                    <div class="col-md-3"><strong>Duração:</strong> {{ $paee->attendance_duration_minutes }} min</div>
                    <div class="col-md-3"><strong>Formato:</strong> {{ $labels::attendanceFormat($paee->attendance_format) }}</div>
                    <div class="col-md-3"><strong>Local:</strong> {{ $labels::attendanceLocation($paee->attendance_location) }}</div>
                    <div class="col-md-3"><strong>Tecnologia assistiva:</strong> {{ $paee->assistive_technology_needed ? 'Sim' : 'Não' }}</div>
                    <div class="col-md-3"><strong>Profissional de apoio:</strong> {{ $paee->support_professional_needed ? 'Sim' : 'Não' }}</div>
                </div>

                @if($paee->assistive_technology_notes)
                    <p><strong>Notas sobre tecnologia assistiva:</strong><br>{{ $paee->assistive_technology_notes }}</p>
                @endif
                @if($paee->school_professionals_orientation)
                    <p><strong>Orientações aos profissionais da escola:</strong><br>{{ $paee->school_professionals_orientation }}</p>
                @endif
                @if($paee->common_teachers_articulation)
                    <p><strong>Articulação com professores comuns:</strong><br>{{ $paee->common_teachers_articulation }}</p>
                @endif
                @if($paee->family_articulation)
                    <p class="mb-0"><strong>Articulação com a família:</strong><br>{{ $paee->family_articulation }}</p>
                @endif

                @if($paee->objectives->count())
                    <hr>
                    <strong>Objetivos</strong>
                    <ul class="mb-0">
                        @foreach($paee->objectives as $objective)
                            <li>{{ $objective->description }} <span class="text-muted small">({{ $labels::objectiveTerm($objective->term) }})</span></li>
                        @endforeach
                    </ul>
                @endif

                @if($paee->resources->count())
                    <hr>
                    <strong>Recursos</strong>
                    <ul class="mb-0">
                        @foreach($paee->resources as $resource)
                            <li>{{ $resource->description }} <span class="text-muted small">({{ $labels::acquisitionType($resource->acquisition_type) }})</span></li>
                        @endforeach
                    </ul>
                @endif

                @if($paee->reviews->count())
                    <hr>
                    <strong>Revisões</strong>
                    @foreach($paee->reviews as $review)
                        <div class="border-bottom pb-2 mb-2 mt-2">
                            <strong>{{ optional($review->reviewed_at)->format('d/m/Y') }}</strong>
                            <span class="text-muted small">— {{ $review->reviewer->name ?? '—' }}</span>
                            <p class="mb-0">{{ $review->what_changed }}</p>
                            <p class="text-muted small mb-0">{{ $review->why }}</p>
                        </div>
                    @endforeach
                @endif
            @else
                <p class="text-muted mb-0">Nenhum PAEE registrado para este aluno.</p>
            @endif
        </div>
    </div>

    {{-- ================= PEI ================= --}}
    <div class="card border-0 shadow-sm mb-3">
        <div class="card-body">
            <h5 class="fw-bold mb-3" style="color:#272264;"><i class="fas fa-chalkboard-user me-2"></i>PEI</h5>

            @if($pei)
                <p class="text-muted mb-3">Versão v{{ $pei->version }} — {{ $pei->is_finished ? 'Finalizado' : 'Em preenchimento' }}</p>

                @forelse($pei->peiDisciplines as $discipline)
                    <div class="border rounded p-3 mb-2">
                        <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
                            <strong>{{ $discipline->discipline->name }}</strong>
                            <span class="small text-muted">Professor(a): {{ $discipline->teacher->person->name ?? '—' }}</span>
                        </div>
                        <p class="small mb-1 mt-2"><strong>Objetivos específicos:</strong> {{ $discipline->specific_objectives }}</p>
                        <p class="small mb-1"><strong>Conteúdo programático:</strong> {{ $discipline->content_programmatic }}</p>
                        <p class="small mb-1"><strong>Metodologias:</strong> {{ $discipline->methodologies }}</p>
                        <p class="small mb-1"><strong>Avaliação:</strong> {{ $discipline->evaluations }}</p>
                        @if($discipline->opinion)
                            <p class="small mb-0"><strong>Parecer:</strong> {{ $discipline->opinion }}</p>
                        @endif

                        @if((int) $discipline->teacher_id === (int) auth()->user()->teacher_id)
                            <a href="{{ route('teacher-portal.discipline.edit', $discipline) }}" class="btn btn-sm btn-warning mt-2">
                                <i class="fas fa-edit"></i> Editar minha adaptação
                            </a>
                        @endif
                    </div>
                @empty
                    <p class="text-muted mb-0">Nenhuma adaptação cadastrada ainda neste PEI.</p>
                @endforelse
            @else
                <p class="text-muted mb-0">Nenhum PEI registrado para este aluno.</p>
            @endif
        </div>
    </div>

@endsection
