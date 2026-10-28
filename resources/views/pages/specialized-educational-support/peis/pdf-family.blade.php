<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>PEI (resumo para a família) - {{ $pei->student->person->name }}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; color: #222; }
        h1 { font-size: 16px; color: #322b75; }
        h2 { font-size: 13px; margin-top: 16px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
        .box { border: 1px solid #ddd; padding: 6px; margin-bottom: 6px; }
        .notice { background: #fff9db; border-left: 4px solid #ffd700; padding: 8px; margin-bottom: 12px; font-size: 11px; }
    </style>
</head>
<body>
    <h1>Plano Educacional Individualizado — Resumo para a Família</h1>
    <p><strong>Estudante:</strong> {{ $pei->student->person->name }} | <strong>Curso:</strong> {{ $pei->course->name }} | <strong>Semestre:</strong> {{ $pei->semester->label }}</p>

    <div class="notice">
        Este é um resumo do PEI preparado para compartilhamento com a família. Não contém observações internas da
        equipe pedagógica nem motivos de ausência em atendimentos.
    </div>

    <h2>Adaptações por Disciplina</h2>
    @foreach($peiDisciplines as $item)
        <div class="box">
            <strong>{{ $item->discipline->name }}</strong> — Professor(a): {{ $item->teacher->person->name ?? '—' }}<br>
            <strong>Objetivos:</strong> {{ $item->specific_objectives }}<br>
            @if($item->curricular_reference)
                <strong>Referência curricular:</strong> {{ $item->curricular_reference }}<br>
            @endif
            <strong>Metodologias:</strong> {{ $item->methodologies }}
        </div>
    @endforeach

    <h2>Acompanhamento do Semestre</h2>
    @forelse($attendanceSummary['aee']->filter(fn($e) => $e->is_present) as $evaluation)
        <div class="box">
            <strong>{{ optional($evaluation->aeeRecord->attendanceSession)->session_date?->format('d/m/Y') }}</strong> — Atendimento AEE<br>
            {{ $evaluation->development_evaluation }}
        </div>
    @empty
    @endforelse
    @forelse($attendanceSummary['pedagogical'] as $record)
        <div class="box">
            <strong>{{ optional($record->attendanceSession)->session_date?->format('d/m/Y') }}</strong> — Atendimento Pedagógico<br>
            {{ $record->systematic_pedagogical_follow_up_record }}
        </div>
    @empty
    @endforelse
    @if($attendanceSummary['aee']->where('is_present', true)->isEmpty() && $attendanceSummary['pedagogical']->isEmpty())
        <p>Nenhum acompanhamento registrado neste semestre.</p>
    @endif

    <h2>Devolutivas à Família</h2>
    @forelse($attendanceSummary['returns'] as $return)
        <div class="box">
            <strong>{{ optional($return['date'])->format('d/m/Y') }}</strong> — {{ $return['source'] }}<br>
            Responsáveis presentes: {{ $return['guardians'] ?: '—' }}<br>
            {{ $return['summary'] }}
        </div>
    @empty
        <p>Nenhuma devolutiva registrada neste semestre.</p>
    @endforelse

    @if($pei->other_relevant_info)
        <h2>Outras Informações</h2>
        <div class="box">{{ $pei->other_relevant_info }}</div>
    @endif
</body>
</html>
