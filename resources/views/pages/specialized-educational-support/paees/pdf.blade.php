<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>PAEE - {{ $paee->student->person->name }}</title>
    <style>
        @page { margin: 1.5cm; }
        body { font-family: "Times New Roman", Times, serif; font-size: 12px; color: #000; line-height: 1.4; }
        .header { text-align: center; margin-bottom: 25px; text-transform: uppercase; font-weight: bold; }
        .header h1 { font-size: 14px; border: 1px solid #000; padding: 8px; }
        .section-title { font-weight: bold; text-transform: uppercase; margin-top: 18px; margin-bottom: 5px; border-bottom: 2px solid #000; font-size: 11px; padding-bottom: 2px; }
        .content-box { border: 1px solid #000; padding: 8px; margin-top: 4px; text-align: justify; }
        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        .info-table td { border: 1px solid #000; padding: 6px; vertical-align: top; }
    </style>
</head>
<body>
    <div class="header">
        <h1>PROGRAMA DE ATENDIMENTO EDUCACIONAL ESPECIALIZADO (PAEE) - VERSÃO {{ $paee->version }}</h1>
    </div>

    <table class="info-table">
        <tr>
            <td><strong>Estudante:</strong> {{ $paee->student->person->name }}</td>
            <td><strong>Semestre:</strong> {{ $paee->semester->label ?? '-' }}</td>
        </tr>
        <tr>
            <td><strong>Frequência:</strong> {{ $paee->attendance_frequency_per_week }}x/semana - {{ $paee->attendance_duration_minutes }} min</td>
            <td><strong>Local:</strong> {{ $paee->attendance_location->label() }}</td>
        </tr>
    </table>

    <div class="section-title">Objetivos</div>
    @foreach($paee->objectives as $objective)
        <p><strong>{{ $objective->term->label() }}:</strong> {{ $objective->description }}</p>
    @endforeach

    <div class="section-title">Materiais e Recursos</div>
    @foreach($paee->resources as $resource)
        <p><strong>{{ $resource->acquisition_type->label() }}:</strong> {{ $resource->description }}</p>
    @endforeach

    <div class="section-title">Articulações e Formação</div>
    <p><strong>Orientação aos Profissionais da Escola:</strong> {{ $paee->school_professionals_orientation ?? '-' }}</p>
    <p><strong>Articulação com Professores do Ensino Comum:</strong> {{ $paee->common_teachers_articulation ?? '-' }}</p>
    <p><strong>Articulação com a Família:</strong> {{ $paee->family_articulation ?? '-' }}</p>
    <p><strong>Articulação Intersetorial:</strong> {{ $paee->intersectoral_articulation ?? '-' }}</p>
    <p><strong>Demandas de Formação:</strong> {{ $paee->training_demands ?? '-' }}</p>

    <div class="section-title">Próxima Revisão</div>
    <p>{{ optional($paee->next_review_date)->format('d/m/Y') }}</p>
</body>
</html>
