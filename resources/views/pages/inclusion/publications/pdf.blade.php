<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <title>Relatório - {{ $publication->title }}</title>
    <x-pdf.styles />
</head>
<body>

@php
    $notInformed = 'Não informado';
    // Mesmo padrão da visualização: sem tipo gravado, a publicação é tratada como evento.
    $typeLabel = ($publication->type ?? \App\Domains\Inclusion\Domain\Enums\PublicationType::EVENT)->label();
    $scheduleStatusLabel = match ($publication->scheduleStatus()) {
        'upcoming' => 'Em breve',
        'ongoing' => 'Acontecendo',
        'finished' => 'Encerrado',
        default => null,
    };
    $link = $publication->link_url
        ? ($publication->link_label ? $publication->link_label.' ('.$publication->link_url.')' : $publication->link_url)
        : $notInformed;
    $coverPath = $publication->cover_path ? \Illuminate\Support\Facades\Storage::disk('public')->path($publication->cover_path) : null;
    $coverPath = $coverPath && is_file($coverPath) && @getimagesize($coverPath) ? $coverPath : null;
@endphp

<x-pdf.header
    title="Ficha de Publicação"
    :subtitle="e($typeLabel)"
    :status="$publication->is_active ? 'Publicado' : 'Rascunho'"
    :meta="[
        'Registro' => '#' . $publication->id,
        'Gerado em' => now()->format('d/m/Y H:i'),
    ]"
/>

<x-pdf.section-title title="Conteúdo" />
<x-pdf.table>
    <x-pdf.row>
        <x-pdf.info-item label="Título" :value="e($publication->title)" colspan="2" />
        <x-pdf.info-item label="Tipo" :value="$typeLabel" />
    </x-pdf.row>
    <x-pdf.row>
        <x-pdf.info-item label="Autor" :value="e($publication->author?->name ?? $notInformed)" />
        <x-pdf.info-item label="Etiquetas" :value="e($publication->tags->pluck('name')->join(', ') ?: $notInformed)" colspan="2" />
    </x-pdf.row>
    <x-pdf.row>
        <x-pdf.info-item label="Link" :value="e($link)" colspan="3" />
    </x-pdf.row>
</x-pdf.table>
<x-pdf.text-area label="Resumo" :value="nl2br(e($publication->summary))" empty="Nenhum resumo informado." />
<x-pdf.text-area label="Texto da publicação" :value="$publication->description" empty="Nenhum texto fornecido." />

<x-pdf.section-title title="Datas e Local" />
<x-pdf.table>
    @if($publication->has_schedule)
        <x-pdf.row>
            <x-pdf.info-item label="Data de Início" :value="$publication->start_date?->format('d/m/Y') ?? $notInformed" />
            <x-pdf.info-item label="Horário de Início" :value="$publication->start_time?->format('H:i') ?? $notInformed" />
            <x-pdf.info-item label="Andamento" :value="$scheduleStatusLabel ?? $notInformed" />
        </x-pdf.row>
        <x-pdf.row>
            <x-pdf.info-item label="Data de Término" :value="$publication->end_date?->format('d/m/Y') ?? $notInformed" />
            <x-pdf.info-item label="Horário de Término" :value="$publication->end_time?->format('H:i') ?? $notInformed" colspan="2" />
        </x-pdf.row>
    @else
        <x-pdf.row>
            <x-pdf.info-item label="Datas" value="Publicação sem data de início e término." colspan="3" />
        </x-pdf.row>
    @endif
    <x-pdf.row>
        <x-pdf.info-item label="Local" :value="e($publication->location ?: $notInformed)" />
        <x-pdf.info-item label="Organizador" :value="e($publication->organizer ?: $notInformed)" />
        <x-pdf.info-item label="Público" :value="e($publication->audience ?: $notInformed)" />
    </x-pdf.row>
</x-pdf.table>

<x-pdf.section-title title="Participantes" />
@if($publication->speakers->isNotEmpty())
    <table class="pdf-table pdf-data-table">
        <tr>
            <th>Participante</th>
            <th>Participação</th>
            <th>Cargo</th>
        </tr>
        @foreach($publication->speakers as $speaker)
            <tr>
                <td>{{ $speaker->displayName() }}</td>
                <td>{{ $speaker->participation ?: '---' }}</td>
                <td>{{ $speaker->professional?->position?->name ?? '---' }}</td>
            </tr>
        @endforeach
    </table>
@else
    <p class="pdf-empty">Nenhum participante vinculado.</p>
@endif

<x-pdf.section-title title="Mídia" />
<x-pdf.table>
    <x-pdf.row>
        <x-pdf.info-item label="Texto alternativo da capa" :value="e($publication->cover_path ? ($publication->cover_alt ?: 'Não informado') : 'Nenhuma capa enviada.')" />
        <x-pdf.info-item label="Galeria" :value="$publication->media->isNotEmpty() ? $publication->media->count() . ' foto(s)' : 'Nenhuma foto na galeria.'" />
    </x-pdf.row>
</x-pdf.table>
@if($coverPath)
    <div class="evidence-card pdf-mt-15">
        <img class="evidence-image" src="{{ $coverPath }}" alt="{{ $publication->cover_alt ?: 'Capa da publicação' }}">
        <div class="evidence-caption">Capa da publicação</div>
    </div>
@endif

<x-pdf.section-title title="Publicação no Site" />
<x-pdf.table>
    <x-pdf.row>
        <x-pdf.info-item label="Situação" :value="$publication->is_active ? 'Publicado' : 'Rascunho'" />
        <x-pdf.info-item label="Data de publicação" :value="$publication->published_at?->format('d/m/Y') ?? $notInformed" />
        <x-pdf.info-item label="Destaque" :value="$publication->is_featured ? 'Sim' : 'Não'" />
    </x-pdf.row>
    <x-pdf.row>
        <x-pdf.info-item label="Endereço da página" :value="e($publication->slug ? '/site/publicacoes/' . $publication->slug : $notInformed)" colspan="3" />
    </x-pdf.row>
    <x-pdf.row>
        <x-pdf.info-item label="Título para buscadores" :value="e($publication->seo_title ?: 'Usa o título da publicação')" colspan="3" />
    </x-pdf.row>
    <x-pdf.row>
        <x-pdf.info-item label="Descrição para buscadores" :value="e($publication->seo_description ?: 'Usa o resumo')" colspan="3" />
    </x-pdf.row>
</x-pdf.table>

</body>
</html>
