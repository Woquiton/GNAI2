<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <title>Relatório de Barreira - #{{ $barrier->id }}</title>
    <x-pdf.styles />
</head>
<body>

@php
    // Relator conforme a visualização: anônimo ou o usuário que registrou.
    $reporter = $barrier->is_anonymous
        ? 'Contribuidor Anônimo'
        : ($barrier->registeredBy?->name ?? 'Usuário não identificado');

    // Pessoas impactadas conforme o modo do relato: anônimo, geral (manual) ou cadastrado.
    if ($barrier->is_anonymous) {
        $affectedPeople = 'Relato Anônimo';
    } elseif ($barrier->not_applicable) {
        $manualPerson = trim(($barrier->affected_person_name ?? '').($barrier->affected_person_role ? ' ('.$barrier->affected_person_role.')' : ''));
        $affectedPeople = $manualPerson !== '' ? 'Relato Geral, identificação manual: '.$manualPerson : 'Relato Geral';
    } else {
        $people = array_filter([
            $barrier->affectedStudent?->person?->name ? $barrier->affectedStudent->person->name.' (Estudante)' : null,
            $barrier->affectedProfessional?->person?->name ? $barrier->affectedProfessional->person->name.' (Profissional)' : null,
        ]);
        $affectedPeople = $people !== [] ? implode('; ', $people) : 'Não informado';
    }

    $priorityClass = match ($barrier->priority?->value) {
        'urgent', 'high' => 'pdf-priority-high',
        'medium' => 'pdf-priority-medium',
        default => 'pdf-priority-default',
    };

    $blocksMap = (bool) $barrier->category?->blocks_map;
    $lastInspection = $barrier->inspections->sortByDesc('inspection_date')->first();
    $currentStatus = $lastInspection?->status?->label();
@endphp

<x-pdf.header
    title="Ficha de Identificação de Barreira"
    :status="$currentStatus"
    :meta="[
        'Registro' => '#' . $barrier->id,
        'Gerado em' => now()->format('d/m/Y H:i'),
    ]"
/>

<x-pdf.section-title title="Identificação" />
<x-pdf.table>
    <x-pdf.row>
        <x-pdf.info-item label="Título do Relato" :value="e($barrier->name)" colspan="2" />
        <x-pdf.info-item label="Data de Identificação" :value="$barrier->identified_at?->format('d/m/Y') ?? 'Não informada'" />
        <td>
            <span class="label">Prioridade:</span>
            <span class="value {{ $priorityClass }}">{{ $barrier->priority?->label() ?? '---' }}</span>
        </td>
    </x-pdf.row>
    <x-pdf.row>
        <x-pdf.info-item label="Categoria" :value="e($barrier->category?->name ?? 'Não categorizada')" colspan="2" />
        <x-pdf.info-item label="Relator" :value="e($reporter)" />
        <x-pdf.info-item label="Status no Sistema" :value="$barrier->is_active ? 'Ativo' : 'Inativo'" />
    </x-pdf.row>
    @if($barrier->resolved_at)
        <x-pdf.row>
            <x-pdf.info-item label="Data de Resolução" :value="$barrier->resolved_at->format('d/m/Y')" colspan="4" />
        </x-pdf.row>
    @endif
</x-pdf.table>
<x-pdf.text-area label="Descrição Detalhada" :value="$barrier->description" empty="Sem descrição detalhada." />

<x-pdf.section-title title="Localização" />
<x-pdf.table>
    <x-pdf.row>
        <x-pdf.info-item label="Campus / Unidade" :value="e($barrier->institution?->name ?? 'Não informado')" colspan="2" />
        <x-pdf.info-item label="Local / Ponto de Referência" :value="e($barrier->location?->name ?? 'Não informado')" colspan="2" />
    </x-pdf.row>
    @if(! $blocksMap)
        <x-pdf.row>
            <x-pdf.info-item label="Latitude" :value="$barrier->latitude ?? 'Não informado'" colspan="2" />
            <x-pdf.info-item label="Longitude" :value="$barrier->longitude ?? 'Não informado'" colspan="2" />
        </x-pdf.row>
    @endif
</x-pdf.table>
@if(filled($barrier->location_specific_details))
    <x-pdf.text-area label="Complemento" :value="$barrier->location_specific_details" />
@endif

<x-pdf.section-title title="Público e Pessoas Impactadas" />
<x-pdf.table>
    <x-pdf.row>
        <x-pdf.info-item label="Público Alvo" :value="e($barrier->deficiencies->pluck('name')->join(', ') ?: 'Não informado')" />
    </x-pdf.row>
    <x-pdf.row>
        <x-pdf.info-item label="Pessoa(s) Impactada(s)" :value="e($affectedPeople)" />
    </x-pdf.row>
</x-pdf.table>

<x-pdf.section-title title="Última Vistoria" />
@if($lastInspection)
    <x-pdf.table>
        <x-pdf.row>
            <x-pdf.info-item label="Data" :value="$lastInspection->inspection_date?->format('d/m/Y') ?? '---'" />
            <x-pdf.info-item label="Tipo" :value="$lastInspection->type?->label() ?? '---'" />
            <x-pdf.info-item label="Status da Barreira" :value="$lastInspection->status?->label() ?? '---'" />
        </x-pdf.row>
    </x-pdf.table>
    <x-pdf.text-area label="Parecer Técnico" :value="$lastInspection->description" empty="Nenhum parecer técnico registrado." />

    <div class="pdf-field-label">Evidências</div>
    @if($lastInspection->evidences->isNotEmpty())
        {{-- Fora de tabela para permitir quebra de página entre as imagens. --}}
        <div class="evidence-container">
            @foreach($lastInspection->evidences as $evidence)
                @php
                    $evidencePath = $evidence->path ? \Illuminate\Support\Facades\Storage::disk('public')->path($evidence->path) : null;
                    $evidenceSize = $evidence->isImage() && $evidencePath && is_file($evidencePath) ? @getimagesize($evidencePath) : false;
                    $evidenceClass = '';

                    if ($evidenceSize && $evidenceSize[1] > 0) {
                        $ratio = $evidenceSize[0] / $evidenceSize[1];
                        $evidenceClass = $ratio > 1.5 ? 'wide' : ($ratio < 0.67 ? 'tall' : '');
                    }
                @endphp

                @if($evidenceSize)
                    <div class="evidence-card {{ $evidenceClass }}">
                        <img class="evidence-image" src="{{ $evidencePath }}" alt="Evidência {{ $loop->iteration }} da vistoria">
                        <div class="evidence-caption">
                            Evidência {{ $loop->iteration }} de {{ $lastInspection->evidences->count() }}: {{ $evidence->displayName() }}
                        </div>
                    </div>
                @else
                    <div class="evidence-placeholder">
                        Evidência {{ $loop->iteration }}: {{ $evidence->displayName() }}
                    </div>
                @endif
            @endforeach
        </div>
    @else
        <p class="pdf-empty">Nenhuma evidência registrada.</p>
    @endif
@else
    <p class="pdf-empty">Nenhuma vistoria técnica registrada até o momento.</p>
@endif

@if($barrier->inspections->count() > 1)
    <x-pdf.section-title title="Histórico de Vistorias" />
    <table class="pdf-table pdf-data-table">
        <tr>
            <th class="pdf-w-18">Data</th>
            <th>Tipo</th>
            <th>Status da Barreira</th>
            <th class="pdf-w-16">Evidências</th>
        </tr>
        @foreach($barrier->inspections as $inspection)
            <tr>
                <td class="pdf-text-center">{{ $inspection->inspection_date?->format('d/m/Y') ?? '---' }}</td>
                <td>{{ $inspection->type?->label() ?? '---' }}</td>
                <td>{{ $inspection->status?->label() ?? '---' }}</td>
                <td class="pdf-text-center">{{ $inspection->evidences->count() }}</td>
            </tr>
        @endforeach
    </table>
@endif

<div class="pdf-mt-60">
    <x-pdf.table-signatures>
        @if(! $barrier->is_anonymous)
            @if($barrier->affectedStudent)
                <x-pdf.table-signature-label label="Assinatura do Estudante Contribuidor" />
            @endif

            @if($barrier->affectedProfessional)
                <x-pdf.table-signature-label label="Assinatura do Profissional Contribuidor" />
            @endif

            @if(! $barrier->affectedStudent && ! $barrier->affectedProfessional && $barrier->affected_person_name)
                <x-pdf.table-signature-label label="Assinatura do Contribuidor" />
            @endif
        @endif

        <x-pdf.table-signature-label label="Responsável pelo Setor / Carimbo" />
    </x-pdf.table-signatures>
</div>

</body>
</html>
