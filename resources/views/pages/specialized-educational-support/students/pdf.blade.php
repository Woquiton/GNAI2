<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <title>Ficha do Aluno - {{ $student->person->name }}</title>
    <x-pdf.styles />
</head>
<body>
@php

$map = [
    'eval' => [
        'initial' => 'Inicial',
        'periodic_review' => 'Periódica',
        'pei_review' => 'Revisão PEI',
        'specific_demand' => 'Demanda Específica',
    ],

    'levels' => [
        'very_low' => 'Muito Baixo',
        'low' => 'Baixo',
        'adequate' => 'Adequado',
        'good' => 'Bom',
        'excellent' => 'Excelente',
        'moderate' => 'Moderado',
        'high' => 'Alto',
    ],

    'reason' => [
        'concrete' => 'Concreto',
        'mixed' => 'Misto',
        'abstract' => 'Abstrato',
    ],

    'comm' => [
        'verbal' => 'Verbal',
        'non_verbal' => 'Não Verbal',
        'mixed' => 'Mista',
    ],

    'social' => [
        'isolated' => 'Isolado',
        'selective' => 'Seletivo',
        'participative' => 'Participativo',
    ],

    'auto' => [
        'dependent' => 'Dependente',
        'partial' => 'Parcial',
        'independent' => 'Independente',
    ],
];

$boolLabel = fn ($value) =>
    filled($value)
        ? ($value ? 'SIM' : 'Não')
        : '<span class="text-muted">---</span>';

$boolStrong = fn ($value) =>
    filled($value)
        ? ($value ? '<strong>SIM</strong>' : 'Não')
        : '<span class="text-muted">---</span>';

$renderHtml = fn ($value) =>
    filled($value)
        ? \App\Shared\Infrastructure\Security\RichTextSanitizer::sanitize((string) $value)
        : '<span class="text-muted">---</span>';

$renderText = fn ($value) =>
    filled($value)
        ? e($value)
        : '<span class="text-muted">---</span>';

$formatDate = fn ($date) =>
    filled($date)
        ? \Carbon\Carbon::parse($date)->format('d/m/Y')
        : '<span class="text-muted">---</span>';

$severityMap = [
    'mild' => 'Leve',
    'moderate' => 'Moderada',
    'severe' => 'Severa'
];

$relationshipMap = [
    'father' => 'Pai',
    'mother' => 'Mãe',
    'grandfather' => 'Avô',
    'grandmother' => 'Avó',
    'guardian' => 'Responsável Legal',
    'other' => 'Outro',
];

@endphp

    <x-pdf.header
        title="Ficha do Aluno"
        :status="$student->status?->label()"
        :meta="[
            'Aluno(a)' => $student->person->name ?? '---',
            'Matrícula' => $student->registration ?? '---',
            'Gerado em' => now()->format('d/m/Y H:i'),
        ]"
    />

    <div class="category-header">Informações do Aluno</div>

    {{-- ================= DADOS BÁSICOS ================= --}}
    <div class="section-title">Dados Básicos</div>
    <table class="pdf-table">
        <tr>
            <td class="pdf-cell" colspan="2">
                <strong>Nome:</strong> {!! $renderHtml($student->person->name ?? null) !!}
            </td>
            <td class="pdf-cell" colspan="2">
                <strong>Matrícula:</strong> {!! $renderHtml($student->registration ?? null) !!}
            </td>
        </tr>
        <tr>
            <td class="pdf-cell" colspan="2">
                <strong>Documento:</strong> {!! $renderHtml($student->person->document ?? null) !!}
            </td>
            <td class="pdf-cell" colspan="2">
                <strong>Data de Nascimento:</strong> {{ $formatDate($student->person->birth_date ?? null) }}
            </td>
        </tr>
        <tr>
            <td class="pdf-cell" colspan="2">
                <strong>Gênero:</strong> {{ $student->person->gender_label }}
            </td>
            <td class="pdf-cell" colspan="2">
                <strong>Status:</strong>
                {{ $student->status?->label() ?? '---' }}
            </td>
        </tr>
        <tr>
            <td class="pdf-cell" colspan="2">
                <strong>E-mail:</strong> {!! $renderHtml($student->person->email ?? null) !!}
            </td>
            <td class="pdf-cell" colspan="2">
                <strong>Telefone:</strong> {!! $renderHtml($student->person->phone ?? null) !!}
            </td>
        </tr>
        <tr>
            <td class="pdf-cell" colspan="4">
                <strong>Endereço:</strong> {!! $renderHtml($student->person->address ?? null) !!}
            </td>
        </tr>
        <tr>
            <td class="pdf-cell" colspan="2">
                <strong>Data de Ingresso:</strong> {{ $formatDate($student->entry_date ?? null) }}
            </td>
            <td class="pdf-cell" colspan="2">
                <strong>Quantidade de Perfis de Atendimento:</strong> {{ $student->deficiencies?->count() ?? 0 }}
            </td>
        </tr>
    </table>

    {{-- ================= PERFIS DE ATENDIMENTO ================= --}}
    <div class="section-title">Perfis de Atendimento</div>

    @if($student->deficiencies && $student->deficiencies->count())
        <table class="pdf-table">
            <tr>
                <th class="pdf-cell pdf-w-24">Perfil de Atendimento</th>
                <th class="pdf-cell pdf-w-16">Severidade</th>
                <th class="pdf-cell">Observações</th>
            </tr>
            @foreach($student->deficiencies as $deficiency)
                <tr>
                    <td class="pdf-cell">
                        {!! $renderHtml($deficiency->name ?? null) !!}
                    </td>
                    <td class="pdf-cell">
                        {{ $severityMap[$deficiency->pivot->severity ?? null] ?? '---' }}
                    </td>
                    <td class="pdf-cell">
                        {!! $renderHtml($deficiency->pivot->notes ?? null) !!}
                    </td>
                </tr>
            @endforeach
        </table>
    @else
        <table class="pdf-table">
            <tr>
                <td class="pdf-cell">Nenhum perfil de atendimento vinculado a este aluno.</td>
            </tr>
        </table>
    @endif

        {{-- ================= CURSO ATUAL ================= --}}
    <div class="section-title">Curso Atual</div>

    @if($student->currentCourse && $student->currentCourse->course)
        <table class="pdf-table">
            <tr>
                <td class="pdf-cell" colspan="2">
                    <strong>Curso:</strong> {!! $renderHtml($student->currentCourse->course->name ?? null) !!}
                </td>
                <td class="pdf-cell" colspan="2">
                    <strong>Ano Acadêmico:</strong> {!! $renderHtml($student->currentCourse->academic_year ?? null) !!}
                </td>
            </tr>
        </table>
    @else
        <table class="pdf-table">
            <tr>
                <td class="pdf-cell">Nenhum curso atual vinculado a este aluno.</td>
            </tr>
        </table>
    @endif

        {{-- ================= RESPONSÁVEIS ================= --}}
    <div class="section-title">Responsáveis</div>

    @if($student->guardians && $student->guardians->count())
        @foreach($student->guardians as $guardian)
            <table class="pdf-table pdf-mb-12">
                <tr>
                    <td class="pdf-cell" colspan="4">
                        <strong>Relação com o aluno:</strong> {!! $renderHtml($guardian->relationshipLabel()) !!}
                    </td>
                </tr>
                <tr>
                    <td class="pdf-cell" colspan="2">
                        <strong>Nome:</strong> {!! $renderHtml($guardian->person->name ?? null) !!}
                    </td>
                    <td class="pdf-cell" colspan="2">
                        <strong>Documento:</strong> {!! $renderHtml($guardian->person->document ?? null) !!}
                    </td>
                </tr>
                <tr>
                    <td class="pdf-cell" colspan="2">
                        <strong>Data de Nascimento:</strong> {{ $formatDate($guardian->person->birth_date ?? null) }}
                    </td>
                    <td class="pdf-cell" colspan="2">
                        <strong>Gênero:</strong> {{ $guardian->person->gender_label }}
                    </td>
                </tr>
                <tr>
                    <td class="pdf-cell" colspan="2">
                        <strong>E-mail:</strong> {!! $renderHtml($guardian->person->email ?? null) !!}
                    </td>
                    <td class="pdf-cell" colspan="2">
                        <strong>Telefone:</strong> {!! $renderHtml($guardian->person->phone ?? null) !!}
                    </td>
                </tr>
                <tr>
                    <td class="pdf-cell" colspan="4">
                        <strong>Endereço:</strong> {!! $renderHtml($guardian->person->address ?? null) !!}
                    </td>
                </tr>
            </table>
        @endforeach
    @else
        <table class="pdf-table">
            <tr>
                <td class="pdf-cell">Nenhum responsável vinculado a este aluno.</td>
            </tr>
        </table>
    @endif

    {{-- ================= LAUDO E DOCUMENTOS ================= --}}
    <div class="category-header">Documentos do Aluno</div>

    <div class="section-title">Possui Laudo Técnico?</div>
    <table class="pdf-table">
        <tr>
            <td class="pdf-cell">
                {!! $boolStrong($student->documents->contains(fn ($d) => $d->type === \App\Domains\SpecializedEducationalSupport\Domain\Enums\StudentDocumentType::TECHNICAL_REPORT)) !!}
            </td>
        </tr>
    </table>

    <div class="section-title">Documentos Anexados</div>
    @if($student->documents && $student->documents->count())
        <table class="pdf-table">
            <tr>
                <th class="pdf-cell pdf-w-24">Tipo</th>
                <th class="pdf-cell">Título</th>
                <th class="pdf-cell pdf-w-16">Semestre</th>
                <th class="pdf-cell pdf-w-16">Enviado em</th>
            </tr>
            @foreach($student->documents as $document)
                <tr>
                    <td class="pdf-cell">{{ $document->type->label() }}</td>
                    <td class="pdf-cell">{!! $renderHtml($document->title) !!}</td>
                    <td class="pdf-cell">{!! $renderHtml($document->semester->label ?? null) !!}</td>
                    <td class="pdf-cell">{{ $formatDate($document->created_at) }}</td>
                </tr>
            @endforeach
        </table>
    @else
        <table class="pdf-table">
            <tr>
                <td class="pdf-cell">Nenhum documento anexado para este aluno.</td>
            </tr>
        </table>
    @endif

    <div class="category-header">Estudo de Caso e PAEE do Aluno</div>

    <div class="section-title">Estudo de Caso Atual</div>

    @if($student->currentCaseStudy)
        @php
            $caseStudy = $student->currentCaseStudy;
        @endphp
        <table class="pdf-table">
            <tr>
                <td class="pdf-cell" colspan="2">
                    <strong>Versão:</strong> {!! $renderHtml($caseStudy->version ?? null) !!}
                </td>
                <td class="pdf-cell" colspan="2">
                    <strong>Semestre:</strong> {!! $renderHtml($caseStudy->semester->label ?? $caseStudy->semester->name ?? null) !!}
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="2">
                    <strong>Status:</strong> {!! $renderHtml(\App\Shared\Domain\Support\AeeLabels::caseStudyStatus($caseStudy->status)) !!}
                </td>
                <td class="pdf-cell" colspan="2">
                    <strong>Criado por:</strong> {!! $renderHtml($caseStudy->creator->name ?? null) !!}
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="2">
                    <strong>Origem da Demanda:</strong> {!! $renderHtml(\App\Shared\Domain\Support\AeeLabels::demandOrigin($caseStudy->demand_origin)) !!}
                </td>
                <td class="pdf-cell" colspan="2">
                    <strong>Última Atualização:</strong> {{ optional($caseStudy->updated_at)->format('d/m/Y H:i') ?? '---' }}
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="4">
                    <strong>Resumo dos Participantes</strong>
                    <div class="long-text">{!! $renderHtml($caseStudy->participants_summary) !!}</div>
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="4">
                    <strong>Observação do Estudante</strong>
                    <div class="long-text">{!! $renderHtml($caseStudy->student_observation) !!}</div>
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="4">
                    <strong>Escuta do Estudante/Família</strong>
                    <div class="long-text">{!! $renderHtml($caseStudy->student_family_listening) !!}</div>
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="4">
                    <strong>Escuta dos Professores</strong>
                    <div class="long-text">{!! $renderHtml($caseStudy->teachers_listening) !!}</div>
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="4">
                    <strong>Outras Informações</strong>
                    <div class="long-text">{!! $renderHtml($caseStudy->other_info) !!}</div>
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="4">
                    <strong>Notas da Rede de Cuidado</strong>
                    <div class="long-text">{!! $renderHtml($caseStudy->care_network_notes) !!}</div>
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="2">
                    <strong>Aspectos Favoráveis</strong>
                    <div class="long-text">{!! $renderHtml($caseStudy->favorable_aspects) !!}</div>
                </td>
                <td class="pdf-cell" colspan="2">
                    <strong>Potenciais e Interesses</strong>
                    <div class="long-text">{!! $renderHtml($caseStudy->potentials_interests) !!}</div>
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="2">
                    <strong>Apoios Necessários</strong>
                    <div class="long-text">{!! $renderHtml(\App\Shared\Domain\Support\AeeLabels::neededSupportsList($caseStudy->needed_supports)) !!}</div>
                </td>
                <td class="pdf-cell" colspan="2">
                    <strong>Justificativa dos Apoios</strong>
                    <div class="long-text">{!! $renderHtml($caseStudy->needed_supports_justification) !!}</div>
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="2">
                    <strong>Status de Aceite:</strong> {!! $renderHtml(\App\Shared\Domain\Support\AeeLabels::acceptanceStatus($caseStudy->acceptance_status)) !!}
                </td>
                <td class="pdf-cell" colspan="2">
                    <strong>Data do Aceite:</strong> {{ $formatDate($caseStudy->acceptance_date) }}
                </td>
            </tr>
        </table>

        <div class="section-title">Barreiras Identificadas</div>
        @if($caseStudy->barriers->count())
            <table class="pdf-table">
                <tr>
                    <th class="pdf-cell pdf-w-16">Tipo</th>
                    <th class="pdf-cell">Situação Observada</th>
                    <th class="pdf-cell">Implicação na Participação</th>
                </tr>
                @foreach($caseStudy->barriers as $barrier)
                    <tr>
                        <td class="pdf-cell">{!! $renderHtml(\App\Shared\Domain\Support\AeeLabels::barrierType($barrier->type)) !!}</td>
                        <td class="pdf-cell">{!! $renderHtml($barrier->observed_situation) !!}</td>
                        <td class="pdf-cell">{!! $renderHtml($barrier->participation_implication) !!}</td>
                    </tr>
                @endforeach
            </table>
        @else
            <table class="pdf-table"><tr><td class="pdf-cell">Nenhuma barreira registrada.</td></tr></table>
        @endif

        <div class="section-title">Estratégias</div>
        @if($caseStudy->strategies->count())
            <table class="pdf-table">
                <tr>
                    <th class="pdf-cell">Descrição</th>
                    <th class="pdf-cell pdf-w-24">Barreira Relacionada</th>
                </tr>
                @foreach($caseStudy->strategies as $strategy)
                    <tr>
                        <td class="pdf-cell">{!! $renderHtml($strategy->description) !!}</td>
                        <td class="pdf-cell">{!! $renderHtml($strategy->linkedBarrier ? \App\Shared\Domain\Support\AeeLabels::barrierType($strategy->linkedBarrier->type) : null) !!}</td>
                    </tr>
                @endforeach
            </table>
        @else
            <table class="pdf-table"><tr><td class="pdf-cell">Nenhuma estratégia registrada.</td></tr></table>
        @endif

        <div class="section-title">Contribuições</div>
        @if($caseStudy->contributions->count())
            <table class="pdf-table">
                <tr>
                    <th class="pdf-cell pdf-w-16">Papel</th>
                    <th class="pdf-cell">Conteúdo</th>
                    <th class="pdf-cell pdf-w-16">Data</th>
                </tr>
                @foreach($caseStudy->contributions as $contribution)
                    <tr>
                        <td class="pdf-cell">{!! $renderHtml($contribution->role) !!}</td>
                        <td class="pdf-cell">{!! $renderHtml($contribution->content) !!}</td>
                        <td class="pdf-cell">{{ $formatDate($contribution->created_at) }}</td>
                    </tr>
                @endforeach
            </table>
        @else
            <table class="pdf-table"><tr><td class="pdf-cell">Nenhuma contribuição registrada.</td></tr></table>
        @endif
    @else
        <table class="pdf-table">
            <tr>
                <td class="pdf-cell">Nenhum Estudo de Caso atual encontrado para este aluno.</td>
            </tr>
        </table>
    @endif

    <div class="section-title">PAEE Atual</div>

    @if($student->currentPaee)
        @php
            $paee = $student->currentPaee;
        @endphp
        <table class="pdf-table">
            <tr>
                <td class="pdf-cell" colspan="2">
                    <strong>Versão:</strong> {!! $renderHtml($paee->version ?? null) !!}
                </td>
                <td class="pdf-cell" colspan="2">
                    <strong>Status:</strong> {!! $renderHtml(\App\Shared\Domain\Support\AeeLabels::paeeStatus($paee->status)) !!}
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="2">
                    <strong>Frequência Semanal:</strong> {!! $renderHtml($paee->attendance_frequency_per_week ?? null) !!}
                </td>
                <td class="pdf-cell" colspan="2">
                    <strong>Duração (min):</strong> {!! $renderHtml($paee->attendance_duration_minutes ?? null) !!}
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="2">
                    <strong>Formato de Atendimento:</strong> {!! $renderHtml(\App\Shared\Domain\Support\AeeLabels::attendanceFormat($paee->attendance_format)) !!}
                </td>
                <td class="pdf-cell" colspan="2">
                    <strong>Local de Atendimento:</strong> {!! $renderHtml(\App\Shared\Domain\Support\AeeLabels::attendanceLocation($paee->attendance_location)) !!}
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="2">
                    <strong>Necessita Tecnologia Assistiva:</strong> {!! $boolLabel($paee->assistive_technology_needed) !!}
                </td>
                <td class="pdf-cell" colspan="2">
                    <strong>Necessita Profissional de Apoio:</strong> {!! $boolLabel($paee->support_professional_needed) !!}
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="4">
                    <strong>Observações sobre Tecnologia Assistiva</strong>
                    <div class="long-text">{!! $renderHtml($paee->assistive_technology_notes) !!}</div>
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="4">
                    <strong>Justificativa do Profissional de Apoio</strong>
                    <div class="long-text">{!! $renderHtml($paee->support_professional_justification) !!}</div>
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="4">
                    <strong>Orientações aos Profissionais da Escola</strong>
                    <div class="long-text">{!! $renderHtml($paee->school_professionals_orientation) !!}</div>
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="4">
                    <strong>Articulação com Professores Comuns</strong>
                    <div class="long-text">{!! $renderHtml($paee->common_teachers_articulation) !!}</div>
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="4">
                    <strong>Articulação com a Família</strong>
                    <div class="long-text">{!! $renderHtml($paee->family_articulation) !!}</div>
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="4">
                    <strong>Articulação Intersetorial</strong>
                    <div class="long-text">{!! $renderHtml($paee->intersectoral_articulation) !!}</div>
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="4">
                    <strong>Demandas de Formação</strong>
                    <div class="long-text">{!! $renderHtml($paee->training_demands) !!}</div>
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="4">
                    <strong>Próxima Revisão:</strong> {{ $formatDate($paee->next_review_date) }}
                </td>
            </tr>
        </table>

        <div class="section-title">Objetivos do PAEE</div>
        @if($paee->objectives->count())
            <table class="pdf-table">
                <tr>
                    <th class="pdf-cell">Descrição</th>
                    <th class="pdf-cell pdf-w-16">Prazo</th>
                    <th class="pdf-cell pdf-w-24">Barreira Relacionada</th>
                </tr>
                @foreach($paee->objectives as $objective)
                    <tr>
                        <td class="pdf-cell">{!! $renderHtml($objective->description) !!}</td>
                        <td class="pdf-cell">{!! $renderHtml(\App\Shared\Domain\Support\AeeLabels::objectiveTerm($objective->term)) !!}</td>
                        <td class="pdf-cell">{!! $renderHtml($objective->linkedBarrier ? \App\Shared\Domain\Support\AeeLabels::barrierType($objective->linkedBarrier->type) : null) !!}</td>
                    </tr>
                @endforeach
            </table>
        @else
            <table class="pdf-table"><tr><td class="pdf-cell">Nenhum objetivo registrado.</td></tr></table>
        @endif

        <div class="section-title">Recursos do PAEE</div>
        @if($paee->resources->count())
            <table class="pdf-table">
                <tr>
                    <th class="pdf-cell">Descrição</th>
                    <th class="pdf-cell pdf-w-16">Tipo</th>
                    <th class="pdf-cell pdf-w-24">Tecnologia Assistiva</th>
                </tr>
                @foreach($paee->resources as $resource)
                    <tr>
                        <td class="pdf-cell">{!! $renderHtml($resource->description) !!}</td>
                        <td class="pdf-cell">{!! $renderHtml(\App\Shared\Domain\Support\AeeLabels::acquisitionType($resource->acquisition_type)) !!}</td>
                        <td class="pdf-cell">{!! $renderHtml($resource->assistiveTechnology->name ?? null) !!}</td>
                    </tr>
                @endforeach
            </table>
        @else
            <table class="pdf-table"><tr><td class="pdf-cell">Nenhum recurso registrado.</td></tr></table>
        @endif

        <div class="section-title">Revisões do PAEE</div>
        @if($paee->reviews->count())
            <table class="pdf-table">
                <tr>
                    <th class="pdf-cell pdf-w-16">Data</th>
                    <th class="pdf-cell pdf-w-16">Revisor</th>
                    <th class="pdf-cell">O que mudou</th>
                    <th class="pdf-cell">Por quê</th>
                </tr>
                @foreach($paee->reviews as $review)
                    <tr>
                        <td class="pdf-cell">{{ $formatDate($review->reviewed_at) }}</td>
                        <td class="pdf-cell">{!! $renderHtml($review->reviewer->name ?? null) !!}</td>
                        <td class="pdf-cell">{!! $renderHtml($review->what_changed) !!}</td>
                        <td class="pdf-cell">{!! $renderHtml($review->why) !!}</td>
                    </tr>
                @endforeach
            </table>
        @else
            <table class="pdf-table"><tr><td class="pdf-cell">Nenhuma revisão registrada.</td></tr></table>
        @endif
    @else
        <table class="pdf-table">
            <tr>
                <td class="pdf-cell">Nenhum PAEE atual encontrado para este aluno.</td>
            </tr>
        </table>
    @endif

    {{-- ========================= --}}
    {{-- PEIs e Adaptações por Disciplina --}}
    {{-- ========================= --}}
    <div class="category-header">PEIs do Aluno</div>

    <div class="divider"></div>

    @forelse ($student->peis as $pei)

        {{-- Separação entre PEIs --}}
        @if (!$loop->first)

            <div class="page-break"></div>

            <div class="pdf-divider-strong"></div>

        @endif

        {{-- ========================= --}}
        {{-- CABEÇALHO DO PEI (UMA VEZ) --}}
        {{-- ========================= --}}
        <div class="section-title">
            PLANO EDUCACIONAL INDIVIDUALIZADO (PEI) - VERSÃO {{ $pei->version }}
        </div>

        <table class="pdf-table">
            <tr>
                <td class="pdf-cell" colspan="2">
                    <strong>Estudante:</strong> {!! $renderHtml($student->person->name ?? null) !!}
                </td>
                <td class="pdf-cell" colspan="2">
                    <strong>Curso:</strong> {!! $renderHtml($pei->course->name ?? null) !!}
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="2">
                    <strong>Semestre/Ano:</strong> {!! $renderHtml($pei->semester->label ?? null) !!}
                </td>
                <td class="pdf-cell" colspan="2">
                    <strong>Gerado em:</strong> {{ now()->format('d/m/Y H:i') }}
                </td>
            </tr>
        </table>

        {{-- ========================= --}}
        {{-- INFORMAÇÕES DO NAPNE (UMA VEZ) --}}
        {{-- ========================= --}}
        <div class="section-title">Informações de Apoio Pedagógico (NAPNE)</div>

        <table class="pdf-table">
            <tr>
                <td class="pdf-cell">
                    <strong>PAEE Vinculado (versão):</strong>
                    <div class="long-text">
                        {!! $renderHtml($pei->paee->version ?? null) !!}
                    </div>
                </td>
            </tr>

            <tr>
                <td class="pdf-cell">
                    <strong>Frequência de Atendimento:</strong>
                    <div class="long-text">
                        {!! $renderHtml($pei->paee->attendance_frequency_per_week ?? null) !!}
                    </div>
                </td>
            </tr>

            <tr>
                <td class="pdf-cell">
                    <strong>Formato de Atendimento:</strong>
                    <div class="long-text">
                        {!! $renderHtml($pei->paee ? \App\Shared\Domain\Support\AeeLabels::attendanceFormat($pei->paee->attendance_format) : null) !!}
                    </div>
                </td>
            </tr>

            <tr>
                <td class="pdf-cell">
                    <strong>Status do PAEE:</strong>
                    <div class="long-text">
                        {!! $renderHtml($pei->paee ? \App\Shared\Domain\Support\AeeLabels::paeeStatus($pei->paee->status) : null) !!}
                    </div>
                </td>
            </tr>
        </table>

        {{-- ========================= --}}
        {{-- DISCIPLINAS DO PEI --}}
        {{-- ========================= --}}
        @foreach ($pei->peiDisciplines as $item)

            <div class="section-title">
                {!! $renderHtml(mb_strtoupper($item->discipline->name, 'UTF-8')) !!}
                — Adaptações Razoáveis e/ou Acessibilidades Curriculares
            </div>

            <table class="pdf-table">

                <tr>
                    <td class="pdf-cell" colspan="2">
                        <strong>Componente Curricular:</strong>
                        {!! $renderHtml(mb_strtoupper($item->discipline->name, 'UTF-8')) !!}
                    </td>

                    <td class="pdf-cell" colspan="2">
                        <strong>Docente:</strong>
                        {!! $renderHtml($item->teacher->person->name ?? null) !!}
                    </td>
                </tr>

                <tr>
                    <td class="pdf-cell" colspan="4">
                        <strong>Objetivos Específicos</strong>
                        <div class="long-text">
                            {!! $renderHtml($item->specific_objectives) !!}
                        </div>
                    </td>
                </tr>

                <tr>
                    <td class="pdf-cell" colspan="4">
                        <strong>Conteúdos Programáticos</strong>
                        <div class="long-text">
                            {!! $renderHtml($item->content_programmatic) !!}
                        </div>
                    </td>
                </tr>

                <tr>
                    <td class="pdf-cell" colspan="4">
                        <strong>Metodologia</strong>
                        <div class="long-text">
                            {!! $renderHtml($item->methodologies) !!}
                        </div>
                    </td>
                </tr>

                <tr>
                    <td class="pdf-cell" colspan="4">
                        <strong>Avaliação</strong>
                        <div class="long-text">
                            {!! $renderHtml($item->evaluations) !!}
                        </div>
                    </td>
                </tr>

                <tr>
                    <td class="pdf-cell" colspan="4">
                        <strong>Registros Complementares</strong>
                        <div class="long-text">
                            {!! $renderHtml($item->complementary_records) !!}
                        </div>
                    </td>
                </tr>

                <tr>
                    <td class="pdf-cell" colspan="4">
                        <strong>Parecer</strong>
                        <div class="long-text">
                            {!! $renderHtml($item->opinion) !!}
                        </div>
                    </td>
                </tr>

                

            </table>

            @if($item->revisions->count())
                <div class="section-title">
                    Revisões — {!! $renderHtml(mb_strtoupper($item->discipline->name, 'UTF-8')) !!}
                </div>
                <table class="pdf-table">
                    <tr>
                        <th class="pdf-cell pdf-w-16">Data</th>
                        <th class="pdf-cell pdf-w-16">Revisor</th>
                        <th class="pdf-cell">O que mudou</th>
                        <th class="pdf-cell">Por quê</th>
                    </tr>
                    @foreach($item->revisions as $revision)
                        <tr>
                            <td class="pdf-cell">{{ $formatDate($revision->reviewed_at) }}</td>
                            <td class="pdf-cell">{!! $renderHtml($revision->reviewer->name ?? null) !!}</td>
                            <td class="pdf-cell">{!! $renderHtml($revision->what_changed) !!}</td>
                            <td class="pdf-cell">{!! $renderHtml($revision->why) !!}</td>
                        </tr>
                    @endforeach
                </table>
            @endif

            {{-- quebra entre disciplinas --}}
            @if (! $loop->last)
                <div class="page-break"></div>
            @endif

        @endforeach

    @empty
        <table class="pdf-table">
            <tr>
                <td class="pdf-cell">Nenhum PEI atual encontrado para este aluno.</td>
            </tr>
        </table>
    @endforelse

    {{-- ========================= --}}
    {{-- ATENDIMENTOS DO ALUNO (ORDEM DESCRESCENTE) --}}
    {{-- ========================= --}}
    <div class="page-break"></div>
    <div class="category-header">Atendimentos do Aluno</div>

    <div class="section-title">Atendimentos Especializados (AEE)</div>
    @if(($aeeEvaluations ?? collect())->count())
        <table class="pdf-table">
            <tr>
                <th class="pdf-cell pdf-w-16">Data</th>
                <th class="pdf-cell pdf-w-24">Profissional</th>
                <th class="pdf-cell pdf-w-12">Presença</th>
                <th class="pdf-cell">Participação/Desenvolvimento</th>
            </tr>
            @foreach($aeeEvaluations as $evaluation)
                @php $session = $evaluation->aeeRecord->attendanceSession ?? null; @endphp
                <tr>
                    <td class="pdf-cell">{{ $formatDate($session->session_date ?? null) }}</td>
                    <td class="pdf-cell">{!! $renderHtml($session->professional->person->name ?? null) !!}</td>
                    <td class="pdf-cell">{!! $boolLabel($evaluation->is_present) !!}</td>
                    <td class="pdf-cell">
                        @if($evaluation->is_present)
                            {!! $renderHtml($evaluation->student_participation) !!}
                            @if($evaluation->development_evaluation)
                                <div class="long-text">{!! $renderHtml($evaluation->development_evaluation) !!}</div>
                            @endif
                        @else
                            Falta — {!! $renderHtml($evaluation->absence_reason) !!}
                        @endif
                    </td>
                </tr>
            @endforeach
        </table>
    @else
        <table class="pdf-table">
            <tr>
                <td class="pdf-cell">Nenhum atendimento especializado registrado para este aluno.</td>
            </tr>
        </table>
    @endif

    <div class="section-title">Atendimentos Pedagógicos</div>
    @if(($pedagogicalRecords ?? collect())->count())
        <table class="pdf-table">
            <tr>
                <th class="pdf-cell pdf-w-16">Data</th>
                <th class="pdf-cell pdf-w-24">Profissional</th>
                <th class="pdf-cell pdf-w-12">Presença</th>
                <th class="pdf-cell">Acompanhamento</th>
            </tr>
            @foreach($pedagogicalRecords as $record)
                @php $session = $record->attendanceSession; @endphp
                <tr>
                    <td class="pdf-cell">{{ $formatDate($session->session_date ?? null) }}</td>
                    <td class="pdf-cell">{!! $renderHtml($session->professional->person->name ?? null) !!}</td>
                    <td class="pdf-cell">{!! $boolLabel($record->is_present) !!}</td>
                    <td class="pdf-cell">
                        @if($record->is_present)
                            {!! $renderHtml($record->systematic_pedagogical_follow_up_record) !!}
                        @else
                            Falta — {!! $renderHtml($record->absence_reason) !!}
                        @endif
                    </td>
                </tr>
            @endforeach
        </table>
    @else
        <table class="pdf-table">
            <tr>
                <td class="pdf-cell">Nenhum atendimento pedagógico registrado para este aluno.</td>
            </tr>
        </table>
    @endif

</body>
</html>
