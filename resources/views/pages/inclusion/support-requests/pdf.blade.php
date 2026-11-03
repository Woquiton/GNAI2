<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <title>Solicitação de Atendimento #{{ $record['id'] }}</title>
    <x-pdf.styles />
</head>
<body>
<x-pdf.header
    title="Solicitação de Atendimento"
    :meta="['Protocolo' => '#' . $record['id'], 'Emissão' => now()->format('d/m/Y H:i')]"
/>

<x-pdf.section-title title="Identificação" />
<x-pdf.table>
    <x-pdf.row>
        <x-pdf.info-item label="Aluno" :value="e($record['student_name'])" colspan="2" />
        <x-pdf.info-item label="Matrícula" :value="e($record['registration'])" />
        <x-pdf.info-item label="Data da solicitação" :value="$record['request_date_label']" />
    </x-pdf.row>
    <x-pdf.row>
        <x-pdf.info-item label="Curso" :value="e($record['course_name'] ?: 'Não informado')" colspan="2" />
        <x-pdf.info-item label="Contato do aluno" :value="e($record['student_contact'] ?: 'Não informado')" colspan="2" />
    </x-pdf.row>
    <x-pdf.row>
        <x-pdf.info-item label="Solicitante" :value="e($record['requester_name'])" colspan="2" />
        <x-pdf.info-item label="Vínculo com o aluno" :value="e($record['requester_other'] ?: $record['requester_role_label'])" colspan="2" />
    </x-pdf.row>
    <x-pdf.row>
        <x-pdf.info-item label="Contato do solicitante" :value="e($record['requester_contact'] ?: 'Não informado')" colspan="4" />
    </x-pdf.row>
</x-pdf.table>

<x-pdf.section-title title="Solicitação" />
<x-pdf.text-area label="Motivo da solicitação" :value="$record['reason_type_label']" />
@if($record['reason_type'] === 'profile')
    <x-pdf.text-area label="Perfis de atendimento" :value="e(implode('; ', array_column($record['reason_profiles'], 'name')) ?: 'Não informado')" />
@endif
<x-pdf.text-area label="Descrição do motivo" :value="nl2br(e($record['reason'] ?: 'Não informado'))" />
<x-pdf.text-area label="Dificuldades no contexto escolar" :value="nl2br(e($record['school_difficulties'] ?: 'Não informado'))" />
<x-pdf.table>
    <x-pdf.row>
        <x-pdf.info-item label="Situação diagnóstica informada" :value="$record['diagnosis_status_label']" colspan="4" />
    </x-pdf.row>
</x-pdf.table>
<x-pdf.text-area label="Datas ou observações sobre a investigação" :value="nl2br(e($record['diagnosis_notes'] ?: 'Não informado'))" />
<x-pdf.text-area label="Apoios solicitados" :value="e(implode('; ', $record['requested_support_labels']) ?: 'Não informado')" />
@if($record['other_support'])
    <x-pdf.text-area label="Outro apoio solicitado" :value="nl2br(e($record['other_support']))" />
@endif

<x-pdf.section-title title="Análise e encaminhamentos" />
<x-pdf.table>
    <x-pdf.row>
        <x-pdf.info-item label="Situação" :value="$record['status_label']" />
        <x-pdf.info-item label="Registrada por" :value="e($record['created_by_name'])" />
        <x-pdf.info-item label="Registrada em" :value="$record['created_at_label']" />
        <x-pdf.info-item label="Última atualização" :value="$record['updated_at_label']" />
    </x-pdf.row>
</x-pdf.table>
<x-pdf.text-area label="Análise inicial da equipe" :value="nl2br(e($record['analysis_notes'] ?: 'Nenhuma análise registrada.'))" />
<x-pdf.text-area label="Providências e encaminhamentos realizados" :value="nl2br(e($record['referrals'] ?: 'Nenhum encaminhamento registrado.'))" />

<x-pdf.section-title title="Documentos" />
<x-pdf.text-area label="Anexos da solicitação" :value="nl2br(e(implode(PHP_EOL, array_column($record['attachments'], 'name')) ?: 'Nenhum documento anexado.'))" />
</body>
</html>
