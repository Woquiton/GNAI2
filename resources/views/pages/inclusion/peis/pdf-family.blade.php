@php
    $studentName = $pei->student?->person?->name ?? 'Não informado';
    $presentAeeEvaluations = $attendanceSummary['aee']->filter(fn ($evaluation) => (bool) $evaluation->is_present);
    $pedagogicalRecords = $attendanceSummary['pedagogical'];
    $familyReturns = $attendanceSummary['returns'];
    // Texto rico sanitizado; texto simples mantém as quebras de linha, como na visualização do PEI.
    $richText = static function (?string $value): string {
        $value = trim((string) $value);

        if ($value === '') {
            return e('Não informado.');
        }

        return $value === strip_tags($value)
            ? nl2br(e($value), false)
            : \App\Shared\Infrastructure\Security\RichTextSanitizer::sanitize($value);
    };
@endphp
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <title>PEI (resumo para a família) - {{ $studentName }}</title>
    <x-pdf.styles />
</head>
<body>

    <x-pdf.header
        title="Plano Educacional Individualizado (PEI) - Resumo para a Família"
        :status="$pei->is_finished ? 'Finalizado' : 'Em preenchimento'"
        :meta="[
            'Estudante' => $studentName,
            'Semestre' => $pei->semester?->label,
            'Versão' => $pei->version ? 'v' . $pei->version : null,
        ]"
    />

    <div class="pdf-notice">
        Este é um resumo do PEI preparado para compartilhamento com a família. Não contém observações internas da
        equipe pedagógica nem motivos de ausência em atendimentos.
    </div>

    <x-pdf.section-title title="Identificação" />
    <x-pdf.table>
        <x-pdf.row>
            <x-pdf.info-item label="Estudante" :value="$studentName" />
            <x-pdf.info-item label="Matrícula" :value="$pei->student?->registration ?? 'Não informada'" />
        </x-pdf.row>
        <x-pdf.row>
            <x-pdf.info-item label="Curso" :value="$pei->course?->name ?? 'Não informado'" />
            <x-pdf.info-item label="Semestre" :value="$pei->semester?->label ?? 'Não informado'" />
        </x-pdf.row>
    </x-pdf.table>

    <x-pdf.section-title title="Adaptações por Disciplina" />
    @forelse($peiDisciplines as $item)
        <div class="pdf-subject-header">
            {{ $item->discipline?->name ?? 'Disciplina não informada' }}
        </div>
        <x-pdf.table>
            <x-pdf.row>
                <x-pdf.info-item label="Professor(a)" :value="$item->teacher?->person?->name ?? 'Não informado'" />
            </x-pdf.row>
        </x-pdf.table>
        <x-pdf.text-area label="Objetivos" :value="$item->specific_objectives" empty="Não informado." />
        @if(filled($item->objectives_deadline))
            <x-pdf.text-area label="Prazo das metas/objetivos" :value="$item->objectives_deadline" />
        @endif
        @if(filled($item->curricular_reference))
            <x-pdf.text-area label="Referência curricular" :value="$item->curricular_reference" />
        @endif
        <x-pdf.text-area label="Metodologias" :value="$item->methodologies" empty="Não informado." />
        @if(filled($item->materials_and_assistive_technology))
            <x-pdf.text-area label="Recursos didáticos e tecnologia assistiva" :value="$item->materials_and_assistive_technology" />
        @endif
    @empty
        <p class="pdf-empty">Nenhuma adaptação registrada neste PEI.</p>
    @endforelse

    <x-pdf.section-title title="Acompanhamento do Semestre" />
    @if($presentAeeEvaluations->isEmpty() && $pedagogicalRecords->isEmpty())
        <p class="pdf-empty">Nenhum acompanhamento registrado neste semestre.</p>
    @else
        <table class="pdf-table pdf-data-table">
            <thead>
                <tr>
                    <th class="pdf-w-12">Data</th>
                    <th class="pdf-w-24">Atendimento</th>
                    <th>Acompanhamento</th>
                </tr>
            </thead>
            <tbody>
                @foreach($presentAeeEvaluations as $evaluation)
                    <tr>
                        <td>{{ $evaluation->aeeRecord?->attendanceSession?->session_date?->format('d/m/Y') ?? 'Sem data' }}</td>
                        <td>Atendimento AEE</td>
                        <td class="value">{!! $richText($evaluation->development_evaluation) !!}</td>
                    </tr>
                @endforeach
                @foreach($pedagogicalRecords as $record)
                    <tr>
                        <td>{{ $record->attendanceSession?->session_date?->format('d/m/Y') ?? 'Sem data' }}</td>
                        <td>Atendimento Pedagógico</td>
                        <td class="value">{!! $richText($record->systematic_pedagogical_follow_up_record) !!}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <x-pdf.section-title title="Devolutivas à Família" />
    @if($familyReturns->isEmpty())
        <p class="pdf-empty">Nenhuma devolutiva registrada neste semestre.</p>
    @else
        <table class="pdf-table pdf-data-table">
            <thead>
                <tr>
                    <th class="pdf-w-12">Data</th>
                    <th class="pdf-w-24">Atendimento</th>
                    <th class="pdf-w-24">Responsáveis presentes</th>
                    <th>Devolutiva</th>
                </tr>
            </thead>
            <tbody>
                @foreach($familyReturns as $return)
                    <tr>
                        <td>{{ $return['date']?->format('d/m/Y') ?? 'Sem data' }}</td>
                        <td>
                            {{ $return['source'] }}
                            @if(filled($return['professional'] ?? null))
                                <br>{{ $return['professional'] }}
                            @endif
                        </td>
                        <td>{{ $return['guardians'] ?: 'Não informado' }}</td>
                        <td class="value">{!! $richText($return['summary']) !!}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    @if(filled($pei->other_relevant_info))
        <x-pdf.section-title title="Outras Informações" />
        <x-pdf.text-area label="Outras informações relevantes" :value="nl2br(e((string) $pei->other_relevant_info))" />
    @endif

</body>
</html>
