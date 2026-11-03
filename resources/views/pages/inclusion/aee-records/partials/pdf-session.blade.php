{{-- Identificação do atendimento AEE: espera $session e $aeeRecord; o histórico omite "Gerado em" por atendimento. --}}
@php
    $startTime = $session->start_time ? \Carbon\Carbon::parse($session->start_time)->format('H:i') : '--:--';
    $endTime = $session->end_time ? \Carbon\Carbon::parse($session->end_time)->format('H:i') : '--:--';
    $origin = $session->isDirectRecord()
        ? 'Registro direto do atendimento'
        : 'Agendamento #'.$session->id;
@endphp

<x-pdf.section-title title="Identificação do Atendimento" />
<x-pdf.table>
    <x-pdf.row>
        <x-pdf.info-item label="Profissional" :value="$session->professional?->person?->name ?? 'Não informado'" colspan="2" />
        <x-pdf.info-item label="Data" :value="$session->session_date?->format('d/m/Y')" />
        <x-pdf.info-item label="Horário" :value="$startTime.' às '.$endTime" />
    </x-pdf.row>
    <x-pdf.row>
        <x-pdf.info-item label="Local" :value="$session->location ?: 'Não informado'" colspan="2" />
        <x-pdf.info-item label="Formato" :value="\App\Domains\Inclusion\Domain\Enums\SessionType::labelFor($session->type)" />
        <x-pdf.info-item label="Duração" :value="$aeeRecord->duration ?: 'Não informada'" />
    </x-pdf.row>
    <x-pdf.row>
        @if($showGeneratedAt ?? true)
            <x-pdf.info-item label="Origem" :value="$origin" colspan="2" />
            <x-pdf.info-item label="Gerado em" :value="now()->format('d/m/Y H:i')" colspan="2" />
        @else
            <x-pdf.info-item label="Origem" :value="$origin" colspan="4" />
        @endif
    </x-pdf.row>
</x-pdf.table>
