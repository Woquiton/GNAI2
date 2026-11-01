<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Estudo de Caso - {{ $caseStudy->student->person->name }}</title>
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
    <h1>Estudo de Caso (v{{ $caseStudy->version }}) — {{ $caseStudy->student->person->name }}</h1>
    <p>Semestre: {{ $caseStudy->semester?->label }} | Status: {{ match($caseStudy->status) { 'completed' => 'Concluído', 'in_progress' => 'Em andamento', default => 'Rascunho' } }} | Criador: {{ $caseStudy->creator?->name }}</p>

    <p>Data do Estudo de Caso: {{ $caseStudy->study_date?->format('d/m/Y') ?? '—' }}</p>

    <h2>Escuta e Observação</h2>
    <div class="box"><strong>Observação do estudante:</strong> {{ $caseStudy->student_observation }}</div>
    <div class="box"><strong>Escuta do estudante/família:</strong> {{ $caseStudy->student_family_listening }}</div>
    <div class="box"><strong>Escuta dos professores:</strong> {{ $caseStudy->teachers_listening }}</div>

    <h2>Potencialidades</h2>
    <div class="box"><strong>Aspectos favoráveis:</strong> {{ $caseStudy->favorable_aspects }}</div>
    <div class="box"><strong>Potenciais e interesses:</strong> {{ $caseStudy->potentials_interests }}</div>
    <div class="box"><strong>Apoios necessários:</strong> {{ \App\Shared\Domain\Support\AeeLabels::neededSupportsList($caseStudy->needed_supports) }}</div>

    <h2>Barreiras</h2>
    <table>
        <thead><tr><th>Tipo</th><th>Situação observada</th><th>Implicação</th></tr></thead>
        <tbody>
        @forelse($caseStudy->barriers as $barrier)
            <tr><td>{{ \App\Shared\Domain\Support\AeeLabels::barrierType($barrier->type) }}</td><td>{{ $barrier->observed_situation }}</td><td>{{ $barrier->participation_implication }}</td></tr>
        @empty
            <tr><td colspan="3">Nenhuma barreira registrada.</td></tr>
        @endforelse
        </tbody>
    </table>

    <h2>Estratégias</h2>
    <table>
        <thead><tr><th>Descrição</th></tr></thead>
        <tbody>
        @forelse($caseStudy->strategies as $strategy)
            <tr><td>{{ $strategy->description }}</td></tr>
        @empty
            <tr><td>Nenhuma estratégia registrada.</td></tr>
        @endforelse
        </tbody>
    </table>

    <h2>Aceite</h2>
    <p>Status: {{ \App\Shared\Domain\Support\AeeLabels::acceptanceStatus($caseStudy->acceptance_status) }} | Data: {{ $caseStudy->acceptance_date?->format('d/m/Y') ?? '—' }}</p>
</body>
</html>
