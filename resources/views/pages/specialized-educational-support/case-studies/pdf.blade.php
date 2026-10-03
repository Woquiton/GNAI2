<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Estudo de Caso - {{ $caseStudy->student->person->name }}</title>
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
        <h1>ESTUDO DE CASO - VERSÃO {{ $caseStudy->version }}</h1>
    </div>

    <table class="info-table">
        <tr>
            <td><strong>Estudante:</strong> {{ $caseStudy->student->person->name }}</td>
            <td><strong>Semestre:</strong> {{ $caseStudy->semester->label ?? '-' }}</td>
        </tr>
        <tr>
            <td><strong>Origem da Demanda:</strong> {{ $caseStudy->demand_origin->label() }}</td>
            <td><strong>Status:</strong> {{ $caseStudy->status->label() }}</td>
        </tr>
    </table>

    <div class="section-title">Observação e Escuta</div>
    <p><strong>Observação do(a) Estudante:</strong></p>
    <div class="content-box">{!! $caseStudy->student_observation !!}</div>
    <p><strong>Escuta do(a) Estudante/Família:</strong></p>
    <div class="content-box">{!! $caseStudy->student_family_listening !!}</div>
    <p><strong>Escuta dos(as) Professores(as):</strong></p>
    <div class="content-box">{!! $caseStudy->teachers_listening !!}</div>

    <div class="section-title">Aspectos Favoráveis e Potencialidades</div>
    <div class="content-box">{!! $caseStudy->favorable_aspects !!}</div>
    <div class="content-box">{!! $caseStudy->potentials_interests !!}</div>

    <div class="section-title">Barreiras</div>
    @foreach($caseStudy->barriers as $barrier)
        <p><strong>{{ $barrier->type->label() }}:</strong> {{ $barrier->observed_situation }} — {{ $barrier->participation_implication }}</p>
    @endforeach

    <div class="section-title">Estratégias e Recursos</div>
    @foreach($caseStudy->strategies as $strategy)
        <p>{{ $strategy->description }}</p>
    @endforeach

    <div class="section-title">Apoios Necessários</div>
    <p>{{ implode(', ', $caseStudy->needed_supports ?? []) }}</p>

    <div class="section-title">Aceite</div>
    <p>{{ $caseStudy->acceptance_status->label() }} @if($caseStudy->acceptance_date) em {{ $caseStudy->acceptance_date->format('d/m/Y') }} @endif</p>
</body>
</html>
