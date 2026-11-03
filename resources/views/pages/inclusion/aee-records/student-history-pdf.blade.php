<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <title>Histórico de Atendimentos AEE - {{ $student->person->name }}</title>

    <x-pdf.styles />
</head>
<body>
    <x-pdf.header title="Histórico de Atendimentos Educacionais Especializados" />

    <x-pdf.section-title title="Identificação do Aluno" />
    <x-pdf.table>
        <x-pdf.row>
            <x-pdf.info-item label="Estudante" :value="$student->person->name" colspan="2" />
            <x-pdf.info-item label="Matrícula" :value="$student->registration" colspan="2" />
        </x-pdf.row>
        <x-pdf.row>
            <x-pdf.info-item label="Curso" :value="$student->currentCourse?->course?->name ?? 'Não informado'" colspan="2" />
            <x-pdf.info-item label="Total de Atendimentos" :value="$aeeEvaluations->count()" />
            <x-pdf.info-item label="Faltas" :value="$aeeEvaluations->where('is_present', false)->count()" />
        </x-pdf.row>
        <x-pdf.row>
            <x-pdf.info-item label="Gerado em" :value="now()->format('d/m/Y H:i')" colspan="4" />
        </x-pdf.row>
    </x-pdf.table>

    @forelse($aeeEvaluations as $evaluation)
        @php
            $aeeRecord = $evaluation->aeeRecord;
            $session = $aeeRecord->attendanceSession;
        @endphp

        @if(! $loop->first)
            <div class="pdf-page-break"></div>
        @endif

        <div class="category-header">Atendimento AEE de {{ $session?->session_date?->format('d/m/Y') ?? 'data não informada' }}</div>

        @include('pages.inclusion.aee-records.partials.pdf-session', ['session' => $session, 'aeeRecord' => $aeeRecord, 'showGeneratedAt' => false])
        @include('pages.inclusion.aee-records.partials.pdf-execution', ['aeeRecord' => $aeeRecord])

        <x-pdf.section-title title="Desempenho Individual" />
        @include('pages.inclusion.aee-records.partials.pdf-evaluation', ['evaluation' => $evaluation])

        <div class="signature-wrapper">
            <x-pdf.table-signatures>
                <x-pdf.table-signature-label label="Profissional Responsável" />
                <x-pdf.table-signature-label label="Coordenação / Direção" />
            </x-pdf.table-signatures>
        </div>
    @empty
        <p class="pdf-empty">Nenhum atendimento AEE encontrado para este aluno.</p>
    @endforelse
</body>
</html>
