{{--
    Conteúdo de um atendimento pedagógico: espera $pedagogicalRecord e $session; $showStudent exibe
    estudante e curso (registro avulso) e $showGeneratedAt a data de emissão.
--}}
@php
    $student = $session->students->first();
    $startTime = $session->start_time ? \Carbon\Carbon::parse($session->start_time)->format('H:i') : '--:--';
    $endTime = $session->end_time ? \Carbon\Carbon::parse($session->end_time)->format('H:i') : '--:--';
    $origin = $session->isDirectRecord()
        ? 'Registro direto do atendimento'
        : 'Agendamento #'.$session->id;
    $hasGuardians = $pedagogicalRecord->guardians->isNotEmpty();
    $guardianNames = $pedagogicalRecord->guardians
        ->map(fn ($guardian): string => trim(($guardian->person?->name ?? 'Responsável').($guardian->relationship ? ' ('.$guardian->relationship->label().')' : '')))
        ->join(', ');
    // Sem o estudante e sem responsáveis o registro guarda só o motivo da ausência.
    $hasPedagogicalContent = $pedagogicalRecord->is_present || $hasGuardians;
@endphp

<x-pdf.section-title title="Identificação do Atendimento" />
<x-pdf.table>
    @if($showStudent ?? true)
        <x-pdf.row>
            <x-pdf.info-item label="Estudante" :value="$student?->person?->name ?? 'Não informado'" colspan="2" />
            <x-pdf.info-item label="Matrícula" :value="$student?->registration ?? 'Não informada'" colspan="2" />
        </x-pdf.row>
        <x-pdf.row>
            <x-pdf.info-item label="Curso" :value="$student?->currentCourse?->course?->name ?? 'Não informado'" colspan="2" />
            <x-pdf.info-item label="Profissional" :value="$session->professional?->person?->name ?? 'Não informado'" colspan="2" />
        </x-pdf.row>
    @else
        <x-pdf.row>
            <x-pdf.info-item label="Profissional" :value="$session->professional?->person?->name ?? 'Não informado'" colspan="4" />
        </x-pdf.row>
    @endif
    <x-pdf.row>
        <x-pdf.info-item label="Data" :value="$session->session_date?->format('d/m/Y')" />
        <x-pdf.info-item label="Horário" :value="$startTime.' às '.$endTime" />
        <x-pdf.info-item label="Local" :value="$session->location ?: 'Não informado'" colspan="2" />
    </x-pdf.row>
    <x-pdf.row>
        <x-pdf.info-item label="Período/Duração do Acompanhamento" :value="$pedagogicalRecord->duration ?: 'Não informado'" colspan="2" />
        <x-pdf.info-item label="Origem" :value="$origin" colspan="2" />
    </x-pdf.row>
    @if($showGeneratedAt ?? true)
        <x-pdf.row>
            <x-pdf.info-item label="Gerado em" :value="now()->format('d/m/Y H:i')" colspan="4" />
        </x-pdf.row>
    @endif
</x-pdf.table>

<x-pdf.section-title title="Participação no Atendimento" />
<x-pdf.table>
    <x-pdf.row>
        <td>
            <span class="label">Presença do Estudante:</span>
            @if($pedagogicalRecord->is_present)
                <span class="pdf-status-success">Presente</span>
            @else
                <span class="pdf-status-danger">Ausente</span>
            @endif
        </td>
        <x-pdf.info-item label="Atendimento com responsáveis" :value="$hasGuardians ? 'Sim' : 'Não'" />
    </x-pdf.row>
    @if($hasGuardians)
        <x-pdf.row>
            <x-pdf.info-item label="Responsáveis participantes" :value="$guardianNames" colspan="2" />
        </x-pdf.row>
    @endif
</x-pdf.table>

@if(! $pedagogicalRecord->is_present)
    <x-pdf.text-area label="Motivo da Ausência" :value="$pedagogicalRecord->absence_reason" empty="Não informado." />
    <div class="pdf-notice pdf-mt-15">
        @if($hasGuardians)
            O estudante não esteve presente; o atendimento foi realizado somente com os responsáveis.
        @else
            O estudante não esteve presente e não houve participação de responsáveis; o registro contém apenas a ausência.
        @endif
    </div>
@endif

<x-pdf.section-title title="Acompanhamento Pedagógico" />
<x-pdf.text-area label="Motivo do Acompanhamento" :value="$pedagogicalRecord->follow_up_reason" empty="Não informado." />

@if($hasPedagogicalContent)
    <x-pdf.text-area
        label="Registro do Acompanhamento Pedagógico Sistemático"
        :value="$pedagogicalRecord->systematic_pedagogical_follow_up_record"
        empty="Não informado."
    />
    <x-pdf.text-area
        label="Estratégias e Recursos Adotados (quando necessário)"
        :value="$pedagogicalRecord->strategies_and_resources_adopted"
        empty="N/A"
    />
    <x-pdf.text-area label="Encaminhamentos Realizados" :value="$pedagogicalRecord->referrals_made" empty="N/A" />
    <x-pdf.text-area label="Observações Complementares" :value="$pedagogicalRecord->complementary_observations" empty="N/A" />
@endif
