{!! $heading !!} - Gnai

{!! $greeting !!}

@foreach ($paragraphs as $paragraph)
{!! $paragraph !!}

@endforeach
@if (!empty($details))
{!! $detailsHeading ?? 'Informações' !!}
@foreach ($details as $detail)
{!! $detail['label'] !!}: {!! $detail['value'] !!}
@endforeach

@endif
@if (!empty($actionUrl) && !empty($actionLabel))
{!! $actionLabel !!}: {!! $actionUrl !!}

@endif
{!! $outro !!}

Mensagem automática enviada pelo Gnai.
