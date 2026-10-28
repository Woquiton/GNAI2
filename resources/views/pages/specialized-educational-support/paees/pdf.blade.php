<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>PAEE - {{ $paee->student->person->name }}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; color: #222; }
        h1 { font-size: 16px; color: #322b75; }
        h2 { font-size: 13px; margin-top: 16px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
        .box { border: 1px solid #ddd; padding: 6px; margin-bottom: 6px; }
        table { width: 100%; border-collapse: collapse; }
        td, th { border: 1px solid #ccc; padding: 4px; text-align: left; }
    </style>
</head>
<body>
    <h1>PAEE (v{{ $paee->version }}) — {{ $paee->student->person->name }}</h1>
    <p>Semestre: {{ $paee->semester?->label }} | Status: {{ match($paee->status) { 'active' => 'Ativo', 'under_review' => 'Em revisão', default => 'Rascunho' } }} | Próxima revisão: {{ $paee->next_review_date?->format('d/m/Y') }}</p>
    <p>Estudo de Caso de origem: v{{ $paee->caseStudy->version ?? '—' }} | Elaborado por: {{ $paee->creator->name ?? '—' }} em {{ $paee->created_at?->format('d/m/Y') }}</p>

    <h2>Caracterização do Atendimento</h2>
    <div class="box">Frequência: {{ $paee->attendance_frequency_per_week }}x/semana | Duração: {{ $paee->attendance_duration_minutes }} min | Formato: {{ \App\Shared\Domain\Support\AeeLabels::attendanceFormat($paee->attendance_format) }} | Local: {{ \App\Shared\Domain\Support\AeeLabels::attendanceLocation($paee->attendance_location) }}</div>

    <h2>Tecnologia Assistiva e CAA</h2>
    <div class="box">
        TA necessária: {{ $paee->assistive_technology_needed ? 'Sim' : 'Não' }} — {{ $paee->assistive_technology_notes }}<br>
        Capacidade de disponibilização: {{ $paee->assistive_technology_availability_capacity ?? '—' }}<br>
        CAA necessária: {{ $paee->caa_needed ? 'Sim' : 'Não' }} — {{ $paee->caa_notes }}<br>
        @if($paee->is_assistive_technology_portable_digital_device)
            TA é dispositivo digital portátil — Parecer pedagógico: {{ $paee->assistive_technology_pedagogical_opinion ?? '—' }}
        @endif
    </div>

    <h2>Apoios de Profissionais</h2>
    <div class="box">
        Profissional de apoio: {{ $paee->support_professional_needed ? 'Sim — '.$paee->support_professional_justification : 'Não' }}<br>
        Intérprete de Libras: {{ $paee->libras_interpreter_needed ? 'Sim — '.$paee->libras_interpreter_justification : 'Não' }}<br>
        Guia-intérprete: {{ $paee->guide_interpreter_needed ? 'Sim — '.$paee->guide_interpreter_justification : 'Não' }}
    </div>

    <h2>Objetivos</h2>
    <table>
        <thead><tr><th>Descrição</th><th>Prazo</th></tr></thead>
        <tbody>
        @forelse($paee->objectives as $objective)
            <tr><td>{{ $objective->description }}</td><td>{{ \App\Shared\Domain\Support\AeeLabels::objectiveTerm($objective->term) }}</td></tr>
        @empty
            <tr><td colspan="2">Nenhum objetivo registrado.</td></tr>
        @endforelse
        </tbody>
    </table>

    <h2>Recursos</h2>
    <table>
        <thead><tr><th>Descrição</th><th>Tipo</th></tr></thead>
        <tbody>
        @forelse($paee->resources as $resource)
            <tr><td>{{ $resource->description }}</td><td>{{ \App\Shared\Domain\Support\AeeLabels::acquisitionType($resource->acquisition_type) }}</td></tr>
        @empty
            <tr><td colspan="2">Nenhum recurso registrado.</td></tr>
        @endforelse
        </tbody>
    </table>
</body>
</html>
