{{-- Resumo do PAEE vinculado a este PEI --}}
@if($paee)
<div class="row g-3">
    <x-ui.info-card label="Versão" column="col-md-3">
        v{{ $paee->version }}
    </x-ui.info-card>
    <x-ui.info-card label="Status" column="col-md-3">
        <span class="badge bg-{{ $paee->status->color() }}">{{ $paee->status->label() }}</span>
    </x-ui.info-card>
    <x-ui.info-card label="Frequência semanal" column="col-md-3">
        {{ $paee->attendance_frequency_per_week }}x/semana
    </x-ui.info-card>
    <x-ui.info-card label="Formato do atendimento" column="col-md-3">
        {{ $paee->attendance_format?->label() ?? 'Não informado' }}
    </x-ui.info-card>
</div>
<div class="mt-3">
    @can('paee.view')
    <x-buttons.link-button
        :href="route('specialized-educational-support.paee.show', $paee->id)"
        variant="info"
        class="btn-sm">
        <i class="fas fa-eye"></i> Ver PAEE completo
    </x-buttons.link-button>
    @endcan
</div>
@else
<p class="text-muted fw-bold py-3">Nenhum PAEE vinculado a este PEI.</p>
@endif
