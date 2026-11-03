<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <title>Relatório de {{ $subject }}</title>
    <x-pdf.styles />
</head>
<body>
    <x-pdf.header
        :title="'Relatório de '.$subject"
        :meta="[
            'Gerado em' => now()->format('d/m/Y H:i'),
            'Registros' => (string) count($data),
        ]"
    />

    @if(count($data) > 0)
        {{-- Valores já chegam como texto simples (RunReportAction::format), então são apenas escapados. --}}
        <table class="report-table">
            <thead>
                <tr>
                    @foreach($headers as $header)
                        <th>{{ $header }}</th>
                    @endforeach
                </tr>
            </thead>
            <tbody>
                @foreach($data as $row)
                    <tr>
                        @foreach((array) $row as $value)
                            <td>{{ filled($value) ? $value : '---' }}</td>
                        @endforeach
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p class="pdf-empty">Nenhum registro encontrado com os filtros selecionados.</p>
    @endif
</body>
</html>
