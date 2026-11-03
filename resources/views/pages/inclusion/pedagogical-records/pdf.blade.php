<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <title>Atendimento Pedagógico - ID #{{ $pedagogicalRecord->id }}</title>

    <x-pdf.styles />
</head>
<body>
    <x-pdf.header title="Registro de Atendimento Pedagógico" />

    @include('pages.inclusion.pedagogical-records.partials.pdf-record', [
        'pedagogicalRecord' => $pedagogicalRecord,
        'session' => $session,
    ])

    <div class="signature-wrapper">
        <x-pdf.table-signatures>
            <x-pdf.table-signature-label label="Profissional Responsável" />
            <x-pdf.table-signature-label label="Coordenação / Direção" />
        </x-pdf.table-signatures>
    </div>
</body>
</html>
