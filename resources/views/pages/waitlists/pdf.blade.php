<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <title>Solicitação de Fila - #{{ $waitlist->id }}</title>
    <x-pdf.styles />
</head>
<body>

@php
    $notInformed = 'Não informado';
    $statusClass = match ($waitlist->status?->value) {
        'fulfilled' => 'pdf-status-success',
        'waiting' => 'pdf-status-warning',
        'cancelled' => 'pdf-status-danger',
        default => '',
    };
@endphp

<x-pdf.header
    title="Comprovante de Fila de Espera"
    :status="$waitlist->status?->label()"
    :meta="[
        'Protocolo' => '#' . $waitlist->id,
        'Semestre de origem' => $waitlist->semester?->label ?? 'Sem vínculo: revisar calendário',
        'Emissão' => now()->format('d/m/Y H:i'),
    ]"
/>

<x-pdf.section-title title="Recurso Solicitado" />
<x-pdf.table>
    <x-pdf.row>
        <x-pdf.info-item label="Tipo do Item" :value="$waitlist->waitlistable?->item_type?->label() ?? '---'" />
        <x-pdf.info-item label="Recurso Solicitado" :value="e($waitlist->waitlistable?->name ?? 'Item removido')" />
    </x-pdf.row>
    <x-pdf.row>
        <x-pdf.info-item label="Patrimônio / Tombamento" :value="e($waitlist->waitlistable?->asset_code ?: 'Não se aplica')" colspan="2" />
    </x-pdf.row>
</x-pdf.table>

<x-pdf.section-title title="Identificação do Solicitante" />
<x-pdf.table>
    <x-pdf.row>
        <x-pdf.info-item label="Estudante (Beneficiário)" :value="e($waitlist->student ? ($waitlist->student->person?->name ?? 'Sem nome') : $notInformed)" />
        <x-pdf.info-item label="Matrícula" :value="e($waitlist->student?->registration ?: $notInformed)" />
    </x-pdf.row>
    <x-pdf.row>
        <x-pdf.info-item label="Profissional (Beneficiário)" :value="e($waitlist->professional ? ($waitlist->professional->person?->name ?? 'Sem nome') : $notInformed)" />
        <x-pdf.info-item label="Registro" :value="e($waitlist->professional?->registration ?: $notInformed)" />
    </x-pdf.row>
</x-pdf.table>

<x-pdf.section-title title="Solicitação" />
<x-pdf.table>
    <x-pdf.row>
        <x-pdf.info-item label="Notificado em" :value="$waitlist->notified_at?->format('d/m/Y H:i') ?? $notInformed" />
        <x-pdf.info-item label="Atendido em" :value="$waitlist->fulfilled_at?->format('d/m/Y H:i') ?? $notInformed" />
    </x-pdf.row>
    <x-pdf.row>
        <x-pdf.info-item label="Cancelado em" :value="$waitlist->cancelled_at?->format('d/m/Y H:i') ?? $notInformed" />
        <x-pdf.info-item label="Empréstimo que atendeu a solicitação" :value="$waitlist->fulfilled_loan_id ? '#' . $waitlist->fulfilled_loan_id : $notInformed" />
    </x-pdf.row>
    <x-pdf.row>
        <x-pdf.info-item label="Data da Solicitação" :value="$waitlist->requested_at?->format('d/m/Y H:i') ?? $notInformed" />
        <td>
            <span class="label">Status da Solicitação:</span>
            <span class="value {{ $statusClass }}">{{ $waitlist->status?->label() ?? '---' }}</span>
        </td>
    </x-pdf.row>
    <x-pdf.row>
        <x-pdf.info-item label="Usuário Responsável" :value="e($waitlist->user?->name ?? $notInformed)" colspan="2" />
    </x-pdf.row>
</x-pdf.table>
<x-pdf.text-area label="Observações" :value="$waitlist->observation" empty="Nenhuma observação registrada." />

<div class="pdf-mt-60">
    <x-pdf.table-signatures>
        <x-pdf.table-signature-label label="Assinatura do Solicitante" />
        <x-pdf.table-signature-label label="Responsável pelo Setor / Carimbo" />
    </x-pdf.table-signatures>
</div>

</body>
</html>
