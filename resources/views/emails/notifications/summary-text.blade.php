{{ $heading }} - Gnai

Olá, {{ $beneficiaryName }}.
{{ $intro }}

{{ $institutionName }}
{{ $reference }}
@foreach ($rows as $row)
{{ $row['label'] }}: {{ $row['value'] }}
@endforeach

{{ $outro }}

Mensagem automática enviada pelo Gnai.
