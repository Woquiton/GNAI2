@props([
    'title',
    'subtitle' => null,
    'eyebrow' => 'Gestor de Núcleos de Acessibilidade e Inclusão',
    'meta' => [],
    'status' => null,
])

@php
    $pdfHeader = app(\App\Domains\Settings\Application\Queries\GetPdfHeaderSettingsQuery::class)->execute();
    $logoPath = app(\App\Domains\Settings\Infrastructure\Storage\PdfHeaderLogoStorage::class)->absolutePath($pdfHeader);
@endphp

<div {{ $attributes->merge(['class' => 'header pdf-header']) }}>
    @if($pdfHeader->configured)
        <table class="pdf-institution-header" role="presentation">
            <tr>
                @if($logoPath)
                    <td class="pdf-institution-header-logo">
                        <img src="{{ $logoPath }}" alt="{{ $pdfHeader->institutionName }}">
                    </td>
                @endif
                <td class="pdf-institution-header-text">
                    <strong>{{ $pdfHeader->institutionName }}</strong>
                    @if($pdfHeader->issuingUnit)
                        <div>{{ $pdfHeader->issuingUnit }}</div>
                    @endif
                    @if($pdfHeader->details)
                        <div>{!! nl2br(e($pdfHeader->details)) !!}</div>
                    @endif
                </td>
            </tr>
        </table>
    @else
        @if($logoPath)
            <img class="pdf-header-corner-logo" src="{{ $logoPath }}" alt="Gnai">
        @endif
        <p class="pdf-header-eyebrow">{{ $eyebrow }}</p>
    @endif

    <h2>{{ $title }}</h2>

    @if($subtitle)
        <p>{!! \App\Shared\Infrastructure\Security\RichTextSanitizer::sanitize((string) $subtitle) !!}</p>
    @endif
</div>
