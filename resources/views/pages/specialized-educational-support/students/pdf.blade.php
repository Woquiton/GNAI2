<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <title>Ficha do Aluno - {{ $student->person->name }}</title>
    <style>
        {!! file_get_contents(resource_path('css/components/pdf.css')) !!}

        .category-header {
            background-color: #2d3748;
            color: #ffffff;
            padding: 8px 12px;
            margin-top: 25px;
            margin-bottom: 10px;
            border-radius: 3px;
            font-size: 13pt;
            font-weight: bold;
            text-transform: uppercase;
        }
    </style>
</head>
<body>
@php

$map = [
    'gender' => \App\Models\SpecializedEducationalSupport\Person::genderOptions(),

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
        ? $value
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

    <div class="header">
        <h2>Ficha do Aluno</h2>
        <p>
            <strong>Gerado em:</strong> {{ now()->format('d/m/Y H:i') }}
        </p>
    </div>

    <div class="category-header">1. Informações do Aluno</div>

    {{-- ================= DADOS BÁSICOS ================= --}}
    <div class="section-title">Dados Básicos</div>
    <table class="pdf-table">
        <tr>
            <td class="pdf-cell" colspan="2">
                <strong>Nome:</strong> {{ $student->person->name ?? '---' }}
            </td>
            <td class="pdf-cell" colspan="2">
                <strong>Matrícula:</strong> {{ $student->registration ?? '---' }}
            </td>
        </tr>
        <tr>
            <td class="pdf-cell" colspan="2">
                <strong>Documento:</strong> {{ $student->person->document ?? '---' }}
            </td>
            <td class="pdf-cell" colspan="2">
                <strong>Data de Nascimento:</strong> {{ $formatDate($student->person->birth_date ?? null) }}
            </td>
        </tr>
        <tr>
            <td class="pdf-cell" colspan="2">
                <strong>Gênero:</strong> {{ ['male' => 'Masculino', 'female' => 'Feminino', 'other' => 'Outro'][$student->person->gender] ?? 'Não informado' }}
            </td>
            <td class="pdf-cell" colspan="2">
                <strong>Status:</strong>
                {{ \App\Models\SpecializedEducationalSupport\Student::statusOptions()[$student->status->value ?? $student->status] ?? '---' }}
            </td>
        </tr>
        <tr>
            <td class="pdf-cell" colspan="2">
                <strong>E-mail:</strong> {{ $student->person->email ?? '---' }}
            </td>
            <td class="pdf-cell" colspan="2">
                <strong>Telefone:</strong> {{ $student->person->phone ?? '---' }}
            </td>
        </tr>
        <tr>
            <td class="pdf-cell" colspan="4">
                <strong>Endereço:</strong> {{ $student->person->address ?? '---' }}
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
                <th class="pdf-cell" style="width: 24%;">Perfil de Atendimento</th>
                <th class="pdf-cell" style="width: 16%;">Severidade</th>
                <th class="pdf-cell">Observações</th>
            </tr>
            @foreach($student->deficiencies as $deficiency)
                <tr>
                    <td class="pdf-cell">
                        {{ $deficiency->name ?? '---' }}
                    </td>
                    <td class="pdf-cell">
                        {{ $severityMap[$deficiency->pivot->severity ?? null] ?? '---' }}
                    </td>
                    <td class="pdf-cell">
                        {{ $deficiency->pivot->notes ?? '---' }}
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
                    <strong>Curso:</strong> {{ $student->currentCourse->course->name ?? '---' }}
                </td>
                <td class="pdf-cell" colspan="2">
                    <strong>Ano Acadêmico:</strong> {{ $student->currentCourse->academic_year ?? '---' }}
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
            <table class="pdf-table" style="margin-bottom: 12px;">
                <tr>
                    <td class="pdf-cell" colspan="4">
                        <strong>Relação com o aluno:</strong> {{ $guardian->relationship ?? '---' }}
                    </td>
                </tr>
                <tr>
                    <td class="pdf-cell" colspan="2">
                        <strong>Nome:</strong> {{ $guardian->person->name ?? '---' }}
                    </td>
                    <td class="pdf-cell" colspan="2">
                        <strong>Documento:</strong> {{ $guardian->person->document ?? '---' }}
                    </td>
                </tr>
                <tr>
                    <td class="pdf-cell" colspan="2">
                        <strong>Data de Nascimento:</strong> {{ $formatDate($guardian->person->birth_date ?? null) }}
                    </td>
                    <td class="pdf-cell" colspan="2">
                        <strong>Gênero:</strong> {{
                            \App\Models\SpecializedEducationalSupport\Guardian::genderOptions()[$guardian->person->gender ?? null] ?? '---'
                        }}
                    </td>
                </tr>
                <tr>
                    <td class="pdf-cell" colspan="2">
                        <strong>E-mail:</strong> {{ $guardian->person->email ?? '---' }}
                    </td>
                    <td class="pdf-cell" colspan="2">
                        <strong>Telefone:</strong> {{ $guardian->person->phone ?? '---' }}
                    </td>
                </tr>
                <tr>
                    <td class="pdf-cell" colspan="4">
                        <strong>Endereço:</strong> {{ $guardian->person->address ?? '---' }}
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

    <div class="category-header">2. Estudo de Caso e PAEE</div>

    <div class="section-title">Estudo de Caso Atual</div>
    @if($student->currentCaseStudy)
        @php $caseStudy = $student->currentCaseStudy; @endphp
        <table class="pdf-table">
            <tr>
                <td class="pdf-cell" colspan="2">
                    <strong>Versão:</strong> {{ $caseStudy->version }}
                </td>
                <td class="pdf-cell" colspan="2">
                    <strong>Status:</strong> {{ $caseStudy->status->label() }}
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="4">
                    <strong>Origem da Demanda:</strong> {{ $caseStudy->demand_origin?->label() ?? '---' }}
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="4">
                    <strong>Potencialidades e Interesses</strong>
                    <div class="long-text">{!! $renderHtml($caseStudy->potentials_interests) !!}</div>
                </td>
            </tr>
        </table>
    @else
        <table class="pdf-table">
            <tr>
                <td class="pdf-cell">Nenhum Estudo de Caso encontrado para este aluno.</td>
            </tr>
        </table>
    @endif

    <div class="section-title">PAEE Atual</div>
    @if($student->currentPaee)
        @php $paee = $student->currentPaee; @endphp
        <table class="pdf-table">
            <tr>
                <td class="pdf-cell" colspan="2">
                    <strong>Versão:</strong> {{ $paee->version }}
                </td>
                <td class="pdf-cell" colspan="2">
                    <strong>Status:</strong> {{ $paee->status->label() }}
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="2">
                    <strong>Frequência Semanal:</strong> {{ $paee->attendance_frequency_per_week }}x
                </td>
                <td class="pdf-cell" colspan="2">
                    <strong>Formato do Atendimento:</strong> {{ $paee->attendance_format?->label() ?? '---' }}
                </td>
            </tr>
        </table>
    @else
        <table class="pdf-table">
            <tr>
                <td class="pdf-cell">Nenhum PAEE encontrado para este aluno.</td>
            </tr>
        </table>
    @endif

    {{-- ========================= --}}
    {{-- PEIs e Adaptações por Disciplina --}}
    {{-- ========================= --}}
    <div class="category-header">3. Peis do aluno</div>

    <div class="divider"></div>

    @forelse ($student->peis as $pei)

        {{-- Separação entre PEIs --}}
        @if (!$loop->first)

            <div class="page-break"></div>

            <div style="
                width: 100%;
                height: 4px;
                background-color: #000;
                margin-top: 25px;
                margin-bottom: 25px;
            "></div>

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
                    <strong>Estudante:</strong> {{ $student->person->name }}
                </td>
                <td class="pdf-cell" colspan="2">
                    <strong>Curso:</strong> {{ $pei->course->name }}
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="2">
                    <strong>Semestre/Ano:</strong> {{ $pei->semester->label }}
                </td>
                <td class="pdf-cell" colspan="2">
                    <strong>Gerado em:</strong> {{ now()->format('d/m/Y H:i') }}
                </td>
            </tr>
        </table>

        {{-- ========================= --}}
        {{-- INFORMAÇÕES DO PAEE VINCULADO --}}
        {{-- ========================= --}}
        <div class="section-title">Informações de Apoio Pedagógico (PAEE)</div>

        <table class="pdf-table">
            <tr>
                <td class="pdf-cell">
                    <strong>Frequência de Atendimento:</strong>
                    {{ $pei->paee->attendance_frequency_per_week ?? '---' }}x/semana
                </td>
            </tr>

            <tr>
                <td class="pdf-cell">
                    <strong>Formato do Atendimento:</strong>
                    {{ $pei->paee->attendance_format?->label() ?? '---' }}
                </td>
            </tr>

            <tr>
                <td class="pdf-cell">
                    <strong>Tecnologia Assistiva:</strong>
                    <div class="long-text">
                        {!! $renderHtml($pei->paee->assistive_technology_notes) !!}
                    </div>
                </td>
            </tr>

            <tr>
                <td class="pdf-cell">
                    <strong>Demandas de Formação:</strong>
                    <div class="long-text">
                        {!! $renderHtml($pei->paee->training_demands) !!}
                    </div>
                </td>
            </tr>
        </table>

        {{-- ========================= --}}
        {{-- DISCIPLINAS DO PEI --}}
        {{-- ========================= --}}
        @foreach ($pei->peiDisciplines as $item)

            <div class="section-title">
                Adaptações Razoáveis e/ou Acessibilidades Curriculares —
                {{ mb_strtoupper($item->discipline->name, 'UTF-8') }}
            </div>

            <table class="pdf-table">

                <tr>
                    <td class="pdf-cell" colspan="2">
                        <strong>Componente Curricular:</strong>
                        {{ mb_strtoupper($item->discipline->name, 'UTF-8') }}
                    </td>

                    <td class="pdf-cell" colspan="2">
                        <strong>Docente:</strong>
                        {{ $item->teacher->person->name ?? '---' }}
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

            {{-- quebra entre disciplinas --}}
            <div class="page-break"></div>

        @endforeach

    @empty
        <table class="pdf-table">
            <tr>
                <td class="pdf-cell">Nenhum PEI atual encontrado para este aluno.</td>
            </tr>
        </table>
    @endforelse

    <x-pdf.pages />
</body>
</html>
