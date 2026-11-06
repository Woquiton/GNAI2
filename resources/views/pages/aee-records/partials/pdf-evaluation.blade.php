{{-- Desempenho de um aluno no atendimento AEE: espera $evaluation. --}}
@php
    $student = $evaluation->student;
    $guardianNames = $evaluation->guardians
        ->map(fn ($guardian): string => trim(($guardian->person?->name ?? 'Responsável').($guardian->relationship ? ' ('.$guardian->relationship->label().')' : '')))
        ->join(', ');
@endphp

<div class="pdf-subject-header">
    {{ 'Aluno(a): '.($student?->person?->name ?? 'Não informado').($student?->registration ? ', matrícula '.$student->registration : '') }}
</div>

<x-pdf.table>
    <x-pdf.row>
        <td>
            <span class="label">Presença:</span>
            @if($evaluation->is_present)
                <span class="pdf-status-success">Presente</span>
            @else
                <span class="pdf-status-danger">Ausente</span>
            @endif
        </td>
        <x-pdf.info-item
            label="Atendimento com participação de responsável"
            :value="$evaluation->is_present ? ($evaluation->with_guardians ? 'Sim' : 'Não') : 'Não se aplica'"
        />
    </x-pdf.row>
    @if($evaluation->is_present && $evaluation->with_guardians)
        <x-pdf.row>
            <x-pdf.info-item label="Responsáveis participantes" :value="$guardianNames ?: 'Não informados'" colspan="2" />
        </x-pdf.row>
    @endif
</x-pdf.table>

@if(! $evaluation->is_present)
    <x-pdf.text-area label="Motivo da Ausência" :value="$evaluation->absence_reason" empty="Não justificado." />
@else
    <x-pdf.text-area label="Participação" :value="$evaluation->student_participation" empty="Não informado." />
    <x-pdf.text-area label="Adaptações Realizadas" :value="$evaluation->adaptations_made" empty="Nenhuma adaptação informada." />
    <x-pdf.text-area label="Avaliação do Desenvolvimento" :value="$evaluation->development_evaluation" empty="Não informado." />
    <x-pdf.text-area label="Indicadores de Progresso" :value="$evaluation->progress_indicators" empty="Não informado." />
    <x-pdf.text-area label="Recomendações" :value="$evaluation->recommendations" empty="Nenhuma recomendação." />
    <x-pdf.text-area label="Ajustes para o Próximo Atendimento AEE" :value="$evaluation->next_session_adjustments" empty="Não informado." />
@endif
