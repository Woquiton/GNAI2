<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <title>Solicitação de Atendimento #{{ $record['id'] }}</title>
    <x-pdf.styles />
</head>
<body>

@php
    $notInformed = 'Não informado';
    // Textos simples: escapa e preserva as quebras de linha digitadas.
    $plain = static fn (?string $value, string $empty = ''): string => filled($value) ? nl2br(e($value)) : $empty;
@endphp

<x-pdf.header
    title="Solicitação de Atendimento"
    :status="$record['status_label']"
    :meta="['Protocolo' => '#' . $record['id'], 'Emissão' => now()->format('d/m/Y H:i')]"
/>

<x-pdf.section-title title="Identificação" />
<x-pdf.table>
    <x-pdf.row>
        <x-pdf.info-item label="Aluno" :value="e($record['student_name'])" colspan="2" />
        <x-pdf.info-item label="Matrícula" :value="e($record['registration'])" />
        <x-pdf.info-item label="Situação do aluno" :value="e($record['student_status_label'])" />
    </x-pdf.row>
    <x-pdf.row>
        <x-pdf.info-item label="Curso" :value="e($record['course_name'] ?: $notInformed)" colspan="2" />
        <x-pdf.info-item label="Cursos do cadastro" :value="e(implode(', ', $record['courses']) ?: $notInformed)" colspan="2" />
    </x-pdf.row>
    <x-pdf.row>
        <x-pdf.info-item label="Contato do aluno" :value="e($record['student_contact'] ?: $notInformed)" colspan="2" />
        <x-pdf.info-item label="Data da solicitação" :value="$record['request_date_label']" colspan="2" />
    </x-pdf.row>
    <x-pdf.row>
        <x-pdf.info-item label="Solicitante" :value="e($record['requester_name'])" colspan="2" />
        <x-pdf.info-item label="Vínculo com o aluno" :value="e($record['requester_other'] ?: $record['requester_role_label'])" colspan="2" />
    </x-pdf.row>
    <x-pdf.row>
        <x-pdf.info-item label="Contato do solicitante" :value="e($record['requester_contact'] ?: $notInformed)" colspan="4" />
    </x-pdf.row>
</x-pdf.table>

<x-pdf.section-title title="Solicitação" />
<x-pdf.table>
    <x-pdf.row>
        <x-pdf.info-item label="Motivo da solicitação" :value="e($record['reason_type_label'])" />
    </x-pdf.row>
    @if($record['reason_type'] === 'profile')
        <x-pdf.row>
            <x-pdf.info-item label="Perfis de atendimento" :value="e(implode('; ', array_column($record['reason_profiles'], 'name')) ?: $notInformed)" />
        </x-pdf.row>
    @endif
</x-pdf.table>
<x-pdf.text-area label="Descrição do motivo" :value="$plain($record['reason'])" :empty="$notInformed" />
<x-pdf.text-area label="Dificuldades escolares" :value="$plain($record['school_difficulties'])" :empty="$notInformed" />
<x-pdf.table class="pdf-mt-15">
    <x-pdf.row>
        <x-pdf.info-item label="Situação diagnóstica informada" :value="e($record['diagnosis_status_label'])" />
    </x-pdf.row>
    <x-pdf.row>
        <x-pdf.info-item label="Apoios solicitados" :value="e(implode('; ', $record['requested_support_labels']) ?: $notInformed)" />
    </x-pdf.row>
</x-pdf.table>
<x-pdf.text-area label="Observações sobre a situação diagnóstica" :value="$plain($record['diagnosis_notes'])" :empty="$notInformed" />
@if(filled($record['other_support']))
    <x-pdf.text-area label="Outro apoio" :value="$plain($record['other_support'])" />
@endif

<x-pdf.section-title title="Análise e Encaminhamentos" />
<x-pdf.table>
    <x-pdf.row>
        <x-pdf.info-item label="Situação da solicitação" :value="e($record['status_label'])" />
        <x-pdf.info-item label="Registrada por" :value="e($record['created_by_name'])" />
    </x-pdf.row>
    <x-pdf.row>
        <x-pdf.info-item label="Registrada em" :value="$record['created_at_label']" />
        <x-pdf.info-item label="Última atualização" :value="$record['updated_at_label']" />
    </x-pdf.row>
</x-pdf.table>
<x-pdf.text-area label="Análise inicial" :value="$plain($record['analysis_notes'])" empty="Nenhuma análise registrada." />
<x-pdf.text-area label="Providências e encaminhamentos" :value="$plain($record['referrals'])" empty="Nenhum encaminhamento registrado." />

<x-pdf.section-title title="Documentos" />
@if($record['attachments'] !== [])
    <table class="pdf-table pdf-data-table">
        <tr>
            <th class="pdf-w-12">Nº</th>
            <th>Documento anexado</th>
        </tr>
        @foreach($record['attachments'] as $attachment)
            <tr>
                <td class="pdf-text-center">{{ $loop->iteration }}</td>
                <td>{{ $attachment['name'] ?: 'Documento sem nome' }}</td>
            </tr>
        @endforeach
    </table>
@else
    <p class="pdf-empty">Nenhum documento anexado.</p>
@endif

</body>
</html>
