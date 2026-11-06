@props([
    'title',
    'subtitle' => null,
    'eyebrow' => "Gestor de Núcleos de\nAcessibilidade e Inclusão",
    'meta' => [],
    'status' => null,
])

@php
    $pdfHeader = app(\App\Domains\Application\Queries\Settings\GetPdfHeaderSettingsQuery::class)->execute();
    $logoPath = app(\App\Domains\Infrastructure\Storage\Settings\PdfHeaderLogoStorage::class)->absolutePath($pdfHeader);
    $metaItems = collect($meta)->filter(fn ($value): bool => filled($value));
@endphp

{{-- Logotipo e identificação à esquerda, título do documento à direita; a instituição cadastrada em Configurações substitui o nome do sistema. --}}
<div {{ $attributes->merge(['class' => 'pdf-header']) }}>
    <table class="pdf-header-table" role="presentation">
        <tr>
            @if($logoPath)
                <td class="pdf-header-logo">
                    <img
                        class="pdf-logo-{{ $pdfHeader->logoShape->value }}"
                        src="{{ $logoPath }}"
                        alt="{{ $pdfHeader->configured ? $pdfHeader->institutionName : 'Gnai' }}"
                    >
                </td>
            @endif
            <td class="pdf-header-identity">
                @if($pdfHeader->configured)
                    <span class="pdf-header-institution">{!! nl2br(e($pdfHeader->institutionName)) !!}</span>
                    @if($pdfHeader->issuingUnit)
                        <div class="pdf-header-unit">{!! nl2br(e($pdfHeader->issuingUnit)) !!}</div>
                    @endif
                    @if($pdfHeader->details)
                        <div class="pdf-header-details">{!! nl2br(e($pdfHeader->details)) !!}</div>
                    @endif
                @else
                    <div class="pdf-header-eyebrow">{!! nl2br(e($eyebrow)) !!}</div>
                @endif
            </td>
            <td class="pdf-header-title">
                <h1>{{ $title }}</h1>
                @if($subtitle)
                    <p>{!! \App\Shared\Infrastructure\Security\RichTextSanitizer::sanitize((string) $subtitle) !!}</p>
                @endif
            </td>
        </tr>
    </table>
</div>

@if($metaItems->isNotEmpty() || filled($status))
    <div class="pdf-header-meta">
        @foreach($metaItems as $label => $value)
            <span class="pdf-meta-item"><span class="pdf-meta-label">{{ $label }}:</span> {{ $value }}</span>
        @endforeach
        @if(filled($status))
            <span class="pdf-meta-item"><span class="pdf-meta-label">Situação:</span> {{ $status }}</span>
        @endif
    </div>
@endif
