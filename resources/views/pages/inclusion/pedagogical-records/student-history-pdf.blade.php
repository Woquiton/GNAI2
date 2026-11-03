<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <title>Histórico de Atendimentos Pedagógicos - {{ $student->person->name }}</title>

    <x-pdf.styles />
</head>
<body>
    <x-pdf.header title="Histórico de Atendimentos Pedagógicos" />

    <x-pdf.section-title title="Identificação do Aluno" />
    <x-pdf.table>
        <x-pdf.row>
            <x-pdf.info-item label="Estudante" :value="$student->person->name" colspan="2" />
            <x-pdf.info-item label="Matrícula" :value="$student->registration" colspan="2" />
        </x-pdf.row>
        <x-pdf.row>
            <x-pdf.info-item label="Curso" :value="$student->currentCourse?->course?->name ?? 'Não informado'" colspan="2" />
            <x-pdf.info-item label="Total de Atendimentos" :value="$pedagogicalRecords->count()" />
            <x-pdf.info-item label="Faltas" :value="$pedagogicalRecords->where('is_present', false)->count()" />
        </x-pdf.row>
        <x-pdf.row>
            <x-pdf.info-item
                label="Somente com responsáveis"
                :value="$pedagogicalRecords->filter(fn ($record): bool => ! $record->is_present && $record->guardians->isNotEmpty())->count()"
                colspan="2"
            />
            <x-pdf.info-item label="Gerado em" :value="now()->format('d/m/Y H:i')" colspan="2" />
        </x-pdf.row>
    </x-pdf.table>

    @forelse($pedagogicalRecords as $pedagogicalRecord)
        @php
            $session = $pedagogicalRecord->attendanceSession;
        @endphp

        @if(! $loop->first)
            <div class="pdf-page-break"></div>
        @endif

        <div class="category-header">Atendimento Pedagógico de {{ $session?->session_date?->format('d/m/Y') ?? 'data não informada' }}</div>

        @include('pages.inclusion.pedagogical-records.partials.pdf-record', [
            'pedagogicalRecord' => $pedagogicalRecord,
            'session' => $session,
            'showStudent' => false,
            'showGeneratedAt' => false,
        ])

        <div class="signature-wrapper">
            <x-pdf.table-signatures>
                <x-pdf.table-signature-label label="Profissional Responsável" />
                <x-pdf.table-signature-label label="Coordenação / Direção" />
            </x-pdf.table-signatures>
        </div>
    @empty
        <p class="pdf-empty">Nenhum atendimento pedagógico encontrado para este aluno.</p>
    @endforelse
</body>
</html>
