<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <title>Registro de Atendimento AEE - ID #{{ $aeeRecord->id }}</title>

    <x-pdf.styles />
</head>
<body>
    <x-pdf.header title="Registro de Atendimento Educacional Especializado" />

    @include('pages.aee-records.partials.pdf-session', ['session' => $session, 'aeeRecord' => $aeeRecord])

    {{-- Resumo dos alunos do registro; na exportação pelo prontuário há apenas o aluno consultado. --}}
    <x-pdf.section-title title="Alunos do Atendimento" />
    @if($aeeRecord->studentEvaluations->isNotEmpty())
        <table class="pdf-table pdf-data-table">
            <tr>
                <th>Aluno(a)</th>
                <th class="pdf-w-18">Matrícula</th>
                <th class="pdf-w-16">Presença</th>
                <th class="pdf-w-24">Com responsável</th>
            </tr>
            @foreach($aeeRecord->studentEvaluations as $evaluation)
                <tr>
                    <td>{{ $evaluation->student?->person?->name ?? 'Não informado' }}</td>
                    <td>{{ $evaluation->student?->registration ?? '---' }}</td>
                    <td>{{ $evaluation->is_present ? 'Presente' : 'Ausente' }}</td>
                    <td>{{ $evaluation->is_present ? ($evaluation->with_guardians ? 'Sim' : 'Não') : 'Não se aplica' }}</td>
                </tr>
            @endforeach
        </table>
    @else
        <p class="pdf-empty">Nenhuma avaliação individual registrada.</p>
    @endif

    @include('pages.aee-records.partials.pdf-execution', ['aeeRecord' => $aeeRecord])

    @if($aeeRecord->studentEvaluations->isNotEmpty())
        <x-pdf.section-title title="Desempenho Individual" />
        @foreach($aeeRecord->studentEvaluations as $evaluation)
            @include('pages.aee-records.partials.pdf-evaluation', ['evaluation' => $evaluation])
        @endforeach
    @endif

    <div class="signature-wrapper">
        <x-pdf.table-signatures>
            <x-pdf.table-signature-label label="Profissional Responsável" />
            <x-pdf.table-signature-label label="Coordenação / Direção" />
        </x-pdf.table-signatures>
    </div>
</body>
</html>
