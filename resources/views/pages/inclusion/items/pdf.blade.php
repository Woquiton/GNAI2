<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <title>Relatório - {{ $item->name }}</title>
    <x-pdf.styles />
</head>
<body>

@php
    $notApplicable = 'Não se aplica';
    $lastInspection = $item->inspections->sortByDesc('inspection_date')->first();
@endphp

<x-pdf.header
    title="Ficha de Item"
    :subtitle="e($item->item_type?->label() ?? '')"
    :status="$item->status?->label()"
    :meta="[
        'Registro' => '#' . $item->id,
        'Gerado em' => now()->format('d/m/Y H:i'),
    ]"
/>

<x-pdf.section-title title="Identificação" />
<x-pdf.table>
    <x-pdf.row>
        <x-pdf.info-item label="Tipo do Item" :value="$item->item_type?->label() ?? '---'" />
        <x-pdf.info-item label="Descrição do Item" :value="e($item->name)" />
    </x-pdf.row>
    <x-pdf.row>
        <x-pdf.info-item label="Natureza do Recurso" :value="$item->is_digital ? 'Recurso Digital' : 'Recurso Físico'" />
        <x-pdf.info-item label="Patrimônio / Tombamento" :value="e($item->asset_code ?: $notApplicable)" />
    </x-pdf.row>
    <x-pdf.row>
        <x-pdf.info-item label="Recursos de Acessibilidade" :value="e($item->accessibilityFeatures->pluck('name')->join(', ') ?: 'Nenhum recurso definido.')" colspan="2" />
    </x-pdf.row>
</x-pdf.table>
<x-pdf.text-area label="Descrição Detalhada" :value="$item->notes" empty="Nenhuma descrição registrada." />

<x-pdf.section-title title="Gestão" />
<x-pdf.table>
    <x-pdf.row>
        <x-pdf.info-item label="Quantidade Total" :value="$item->is_digital ? $notApplicable : ($item->quantity ?? '---')" />
        <x-pdf.info-item label="Quantidade Disponível" :value="$item->is_digital ? $notApplicable : ($item->quantity_available ?? '---')" />
        <x-pdf.info-item label="Status do Recurso" :value="$item->status?->label() ?? '---'" />
    </x-pdf.row>
    <x-pdf.row>
        <x-pdf.info-item label="Permite Empréstimos" :value="$item->is_loanable ? 'Sim' : 'Não'" />
        <x-pdf.info-item label="Status no Sistema" :value="$item->is_active ? 'Ativo' : 'Inativo'" colspan="2" />
    </x-pdf.row>
    <x-pdf.row>
        <x-pdf.info-item label="Público Alvo" :value="e($item->deficiencies->pluck('name')->join(', ') ?: 'Nenhum público-alvo definido.')" colspan="3" />
    </x-pdf.row>
</x-pdf.table>

<x-pdf.section-title title="Última Vistoria" />
@if($lastInspection)
    <x-pdf.table>
        <x-pdf.row>
            <x-pdf.info-item label="Data" :value="$lastInspection->inspection_date?->format('d/m/Y') ?? '---'" />
            <x-pdf.info-item label="Tipo" :value="$lastInspection->type?->label() ?? '---'" />
            <x-pdf.info-item label="Estado de Conservação" :value="$lastInspection->state?->label() ?? '---'" />
        </x-pdf.row>
    </x-pdf.table>
    <x-pdf.text-area label="Parecer Técnico" :value="$lastInspection->description" empty="Nenhum parecer técnico registrado." />

    <div class="pdf-field-label">Evidências</div>
    @if($lastInspection->evidences->isNotEmpty())
        {{-- Fora de tabela para permitir quebra de página entre as imagens. --}}
        <div class="inspection-evidences">
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
    <p class="pdf-empty">Nenhuma vistoria registrada.</p>
@endif

@if($item->inspections->count() > 1)
    <x-pdf.section-title title="Histórico de Vistorias" />
    <table class="pdf-table pdf-data-table">
        <tr>
            <th class="pdf-w-18">Data</th>
            <th>Tipo</th>
            <th>Estado de Conservação</th>
            <th class="pdf-w-16">Evidências</th>
        </tr>
        @foreach($item->inspections as $inspection)
            <tr>
                <td class="pdf-text-center">{{ $inspection->inspection_date?->format('d/m/Y') ?? '---' }}</td>
                <td>{{ $inspection->type?->label() ?? '---' }}</td>
                <td>{{ $inspection->state?->label() ?? '---' }}</td>
                <td class="pdf-text-center">{{ $inspection->evidences->count() }}</td>
            </tr>
        @endforeach
    </table>
@endif

</body>
</html>
