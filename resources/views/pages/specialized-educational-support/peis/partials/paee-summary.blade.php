@php
    $statusLabels = [
        'draft' => 'Rascunho',
        'active' => 'Ativo',
        'under_review' => 'Em revisão',
    ];
@endphp

<div class="row g-3">
    <div class="col-md-3">
        <strong>Versão:</strong> v{{ $paee->version ?? '—' }}
    </div>
    <div class="col-md-3">
        <strong>Status:</strong> {{ $statusLabels[$paee->status] ?? ($paee->status ?? '—') }}
    </div>
    <div class="col-md-3">
        <strong>Frequência semanal:</strong> {{ $paee->attendance_frequency_per_week ?? '—' }}
    </div>
    <div class="col-md-3">
        <strong>Duração (min):</strong> {{ $paee->attendance_duration_minutes ?? '—' }}
    </div>
    <div class="col-md-6">
        <strong>Formato de atendimento:</strong> {{ \App\Shared\Domain\Support\AeeLabels::attendanceFormat($paee->attendance_format) }}
    </div>
    <div class="col-md-6">
        <strong>Local de atendimento:</strong> {{ \App\Shared\Domain\Support\AeeLabels::attendanceLocation($paee->attendance_location) }}
    </div>
    <div class="col-md-12">
        <strong>Articulação com o professor regente:</strong> {{ $paee->common_teachers_articulation ?? '—' }}
    </div>
</div>
