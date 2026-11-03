@props(['label', 'value', 'empty' => 'Nada declarado.'])
@php
    $html = \App\Shared\Infrastructure\Security\RichTextSanitizer::sanitize((string) $value);
    $isEmpty = \App\Shared\Infrastructure\Security\RichTextSanitizer::toPlainText($html) === '' && ! str_contains($html, '<img');
@endphp
<div class="pdf-field-label">{{ $label }}</div>
<div class="text-box break-word">
    @if($isEmpty)
        <span class="text-muted">{{ $empty }}</span>
    @else
        {!! $html !!}
    @endif
</div>
