@use('App\Shared\Domain\Support\AeeLabels')
@php
    $studentName = $caseStudy->student?->person?->name ?? 'Não informado';
    $versionLabel = $caseStudy->version ? 'v' . $caseStudy->version : 'Não informada';
    $neededSupports = AeeLabels::neededSupportsList($caseStudy->needed_supports);
    $contributions = $caseStudy->contributions->sortBy('created_at')->values();
@endphp
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <title>Estudo de Caso {{ $versionLabel }} - {{ $studentName }}</title>
    <x-pdf.styles />
</head>
<body>

    <x-pdf.header
        title="Estudo de Caso"
        :status="AeeLabels::caseStudyStatus($caseStudy->status)"
        :meta="[
            'Estudante' => $studentName,
            'Semestre' => $caseStudy->semester?->label,
            'Versão' => $versionLabel,
        ]"
    />

    <x-pdf.section-title title="Identificação da Demanda" />
    <x-pdf.table>
        <x-pdf.row>
            <x-pdf.info-item label="Estudante" :value="$studentName" />
            <x-pdf.info-item label="Matrícula" :value="$caseStudy->student?->registration ?? 'Não informada'" />
        </x-pdf.row>
        <x-pdf.row>
            <x-pdf.info-item label="Semestre" :value="$caseStudy->semester?->label ?? 'Não informado'" />
            <x-pdf.info-item label="Versão" :value="$versionLabel . ($caseStudy->is_current ? ' (vigente)' : ' (histórico)')" />
        </x-pdf.row>
        <x-pdf.row>
            <x-pdf.info-item label="Origem da demanda" :value="AeeLabels::demandOrigin($caseStudy->demand_origin)" />
            <x-pdf.info-item label="Data do Estudo de Caso" :value="$caseStudy->study_date?->format('d/m/Y') ?? 'Não informada'" />
        </x-pdf.row>
        <x-pdf.row>
            <x-pdf.info-item label="Criador" :value="$caseStudy->creator?->name ?? 'Não informado'" />
            <x-pdf.info-item label="Criado em" :value="$caseStudy->created_at?->format('d/m/Y') ?? 'Não informado'" />
        </x-pdf.row>
    </x-pdf.table>
    <x-pdf.text-area label="Participantes (resumo)" :value="$caseStudy->participants_summary" empty="Não informado." />

    <x-pdf.section-title title="Escuta e Observação" />
    <x-pdf.text-area label="Observação do estudante" :value="$caseStudy->student_observation" empty="Não informado." />
    <x-pdf.text-area label="Escuta do estudante/família" :value="$caseStudy->student_family_listening" empty="Não informado." />
    <x-pdf.text-area label="Escuta dos professores" :value="$caseStudy->teachers_listening" empty="Não informado." />
    <x-pdf.text-area label="Outras informações" :value="$caseStudy->other_info" empty="Não informado." />
    <x-pdf.text-area label="Observações da rede de cuidado" :value="$caseStudy->care_network_notes" empty="Não informado." />

    <x-pdf.section-title title="Potencialidades" />
    <x-pdf.text-area label="Aspectos favoráveis" :value="$caseStudy->favorable_aspects" empty="Não informado." />
    <x-pdf.text-area label="Potenciais e interesses" :value="$caseStudy->potentials_interests" empty="Não informado." />

    <x-pdf.section-title title="Apoios" />
    <x-pdf.table>
        <x-pdf.row>
            <x-pdf.info-item label="Apoios necessários" :value="$neededSupports !== '' ? $neededSupports : 'Não informado'" />
        </x-pdf.row>
    </x-pdf.table>
    <x-pdf.text-area label="Justificativa dos apoios necessários" :value="$caseStudy->needed_supports_justification" empty="Não informado." />

    <x-pdf.section-title title="Barreiras" />
    @if($caseStudy->barriers->isNotEmpty())
        <table class="pdf-table pdf-data-table">
            <thead>
                <tr>
                    <th class="pdf-w-24">Categoria</th>
                    <th>Situação observada</th>
                    <th>Implicação na participação</th>
                </tr>
            </thead>
            <tbody>
                @foreach($caseStudy->barriers as $barrier)
                    <tr>
                        <td>{{ $barrier->type ?: 'Não informada' }}</td>
                        <td>{!! nl2br(e((string) $barrier->observed_situation)) !!}</td>
                        <td>{!! nl2br(e((string) $barrier->participation_implication)) !!}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p class="pdf-empty">Nenhuma barreira registrada.</p>
    @endif

    <x-pdf.section-title title="Estratégias" />
    @if($caseStudy->strategies->isNotEmpty())
        <table class="pdf-table pdf-data-table">
            <thead>
                <tr>
                    <th>Descrição</th>
                    <th class="pdf-w-24">Barreira relacionada</th>
                </tr>
            </thead>
            <tbody>
                @foreach($caseStudy->strategies as $strategy)
                    <tr>
                        <td>{!! nl2br(e((string) $strategy->description)) !!}</td>
                        <td>{{ $strategy->linkedBarrier?->type ?: 'Nenhuma' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p class="pdf-empty">Nenhuma estratégia registrada.</p>
    @endif

    <x-pdf.section-title title="Aceite da Família/Estudante" />
    <x-pdf.table>
        <x-pdf.row>
            <x-pdf.info-item label="Status de aceite" :value="AeeLabels::acceptanceStatus($caseStudy->acceptance_status)" />
            <x-pdf.info-item label="Data do aceite" :value="$caseStudy->acceptance_date?->format('d/m/Y') ?? 'Não informada'" />
            <x-pdf.info-item label="Concluído em" :value="$caseStudy->completed_at?->format('d/m/Y H:i') ?? 'Não concluído'" />
        </x-pdf.row>
    </x-pdf.table>

    <x-pdf.section-title title="Contribuições" />
    @if($contributions->isNotEmpty())
        <table class="pdf-table pdf-data-table">
            <thead>
                <tr>
                    <th class="pdf-w-24">Autor</th>
                    <th class="pdf-w-16">Data</th>
                    <th>Contribuição</th>
                </tr>
            </thead>
            <tbody>
                @foreach($contributions as $contribution)
                    <tr>
                        <td>
                            {{ $contribution->author?->name ?? 'Usuário removido' }}
                            @if(filled($contribution->role))
                                <br><span class="text-muted">{{ $contribution->role }}</span>
                            @endif
                        </td>
                        <td>{{ $contribution->created_at?->format('d/m/Y H:i') ?? 'Sem data' }}</td>
                        <td>{!! nl2br(e((string) $contribution->content)) !!}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p class="pdf-empty">Nenhuma contribuição registrada.</p>
    @endif

</body>
</html>
