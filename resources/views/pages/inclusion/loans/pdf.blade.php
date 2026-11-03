<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <title>Relatório - Empréstimo {{ $loan->id }}</title>
    <x-pdf.styles />
</head>
<body>

@php
    $notApplicable = 'Não se aplica';
    $statusClass = $loan->isOverdue()
        ? 'pdf-status-danger'
        : match ($loan->status?->value) {
            'active' => 'pdf-status-success',
            'late' => 'pdf-status-warning',
            'damaged' => 'pdf-status-danger',
            default => '',
        };
@endphp

<x-pdf.header
    title="Ficha de Empréstimo de Recurso"
    :status="$statusLabel"
    :meta="[
        'Registro' => '#' . $loan->id,
        'Gerado em' => now()->format('d/m/Y H:i'),
    ]"
/>

@if($loan->isOverdue())
    <div class="pdf-notice">
        <strong>Este item está com a devolução atrasada.</strong>
        O prazo encerrou em {{ $loan->due_date?->format('d/m/Y') ?? '---' }}.
    </div>
@endif

<x-pdf.section-title title="Recurso Emprestado" />
<x-pdf.table>
    <x-pdf.row>
        <x-pdf.info-item label="Tipo do Item" :value="$loan->loanable?->item_type?->label() ?? '---'" />
        <x-pdf.info-item label="Recurso Emprestado" :value="e($loan->loanable?->name ?? 'Item removido')" />
    </x-pdf.row>
    <x-pdf.row>
        <x-pdf.info-item label="Patrimônio / Tombamento" :value="e($loan->loanable?->asset_code ?: $notApplicable)" colspan="2" />
    </x-pdf.row>
</x-pdf.table>

<x-pdf.section-title title="Envolvidos" />
<x-pdf.table>
    <x-pdf.row>
        <x-pdf.info-item label="Estudante (Beneficiário)" :value="e($loan->student ? ($loan->student->person?->name ?? 'Sem nome') : $notApplicable)" />
        <x-pdf.info-item label="Matrícula" :value="e($loan->student?->registration ?: $notApplicable)" />
    </x-pdf.row>
    <x-pdf.row>
        <x-pdf.info-item label="Profissional (Beneficiário)" :value="e($loan->professional ? ($loan->professional->person?->name ?? 'Sem nome') : $notApplicable)" />
        <x-pdf.info-item label="Registro" :value="e($loan->professional?->registration ?: $notApplicable)" />
    </x-pdf.row>
    <x-pdf.row>
        <x-pdf.info-item label="Usuário Responsável" :value="e($loan->user?->name ?? '---')" colspan="2" />
    </x-pdf.row>
</x-pdf.table>

<x-pdf.section-title title="Prazos e Situação" />
<x-pdf.table>
    <x-pdf.row>
        <x-pdf.info-item label="Data de Saída" :value="$loan->loan_date?->format('d/m/Y H:i') ?? '---'" />
        <x-pdf.info-item label="Previsão de Devolução" :value="$loan->due_date?->format('d/m/Y') ?? '---'" />
    </x-pdf.row>
    <x-pdf.row>
        <td>
            <span class="label">Status do Empréstimo:</span>
            <span class="value {{ $statusClass }}">{{ $statusLabel }}</span>
        </td>
        <x-pdf.info-item label="Data Real da Devolução" :value="$loan->return_date?->format('d/m/Y H:i') ?? 'Não devolvido'" />
    </x-pdf.row>
</x-pdf.table>
<x-pdf.text-area label="Observações / Estado do Item" :value="$loan->observation" empty="Nenhuma observação registrada." />

</body>
</html>
