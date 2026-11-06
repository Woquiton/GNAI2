@use('App\Shared\Domain\Support\AeeLabels')
@php
    $studentName = $paee->student?->person?->name ?? 'Não informado';
    $versionLabel = $paee->version ? 'v' . $paee->version : 'Não informada';
    $yesNo = static fn (?bool $value): string => $value ? 'Sim' : 'Não';
    $creator = ($paee->creator?->name ?? 'Não informado')
        . ($paee->created_at ? ' em ' . $paee->created_at->format('d/m/Y') : '');
    $caseStudyLabel = $paee->caseStudy
        ? 'Estudo de Caso v' . $paee->caseStudy->version
        : 'Não informado';
@endphp
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <title>PAEE {{ $versionLabel }} - {{ $studentName }}</title>
    <x-pdf.styles />
</head>
<body>

    <x-pdf.header
        title="Plano de Atendimento Educacional Especializado (PAEE)"
        :status="AeeLabels::paeeStatus($paee->status)"
        :meta="[
            'Estudante' => $studentName,
            'Semestre' => $paee->semester?->label,
            'Versão' => $versionLabel,
        ]"
    />

    <x-pdf.section-title title="Dados do PAEE" />
    <x-pdf.table>
        <x-pdf.row>
            <x-pdf.info-item label="Estudante" :value="$studentName" />
            <x-pdf.info-item label="Matrícula" :value="$paee->student?->registration ?? 'Não informada'" />
        </x-pdf.row>
        <x-pdf.row>
            <x-pdf.info-item label="Semestre" :value="$paee->semester?->label ?? 'Não informado'" />
            <x-pdf.info-item label="Versão" :value="$versionLabel . ($paee->is_current ? ' (vigente)' : ' (histórico)')" />
        </x-pdf.row>
        <x-pdf.row>
            <x-pdf.info-item label="Elaborado por" :value="$creator" />
            <x-pdf.info-item label="Estudo de Caso de origem" :value="$caseStudyLabel" />
        </x-pdf.row>
        <x-pdf.row>
            <x-pdf.info-item label="Frequência semanal" :value="$paee->attendance_frequency_per_week !== null ? $paee->attendance_frequency_per_week . 'x por semana' : 'Não informada'" />
            <x-pdf.info-item label="Duração" :value="$paee->attendance_duration_minutes !== null ? $paee->attendance_duration_minutes . ' min' : 'Não informada'" />
        </x-pdf.row>
        <x-pdf.row>
            <x-pdf.info-item label="Formato" :value="AeeLabels::attendanceFormat($paee->attendance_format)" />
            <x-pdf.info-item label="Local" :value="AeeLabels::attendanceLocation($paee->attendance_location)" />
        </x-pdf.row>
        <x-pdf.row>
            <x-pdf.info-item label="Próxima revisão" :value="$paee->next_review_date?->format('d/m/Y') ?? 'Não informada'" colspan="2" />
        </x-pdf.row>
    </x-pdf.table>

    <x-pdf.section-title title="Tecnologia Assistiva e CAA" />
    <x-pdf.table>
        <x-pdf.row>
            <x-pdf.info-item label="Necessita TA" :value="$yesNo($paee->assistive_technology_needed)" />
            <x-pdf.info-item label="Necessita CAA" :value="$yesNo($paee->caa_needed)" />
            <x-pdf.info-item label="TA é dispositivo digital portátil" :value="$yesNo($paee->is_assistive_technology_portable_digital_device)" />
        </x-pdf.row>
    </x-pdf.table>
    <x-pdf.text-area label="Observações sobre tecnologia assistiva" :value="$paee->assistive_technology_notes" empty="Não informado." />
    <x-pdf.text-area label="Observações sobre CAA" :value="$paee->caa_notes" empty="Não informado." />
    <x-pdf.text-area label="Capacidade de disponibilização da TA" :value="$paee->assistive_technology_availability_capacity" empty="Não informado." />
    @if($paee->is_assistive_technology_portable_digital_device)
        <x-pdf.text-area label="Parecer pedagógico (TA portátil)" :value="$paee->assistive_technology_pedagogical_opinion" empty="Não informado." />
    @endif

    <x-pdf.section-title title="Apoios de Profissionais" />
    <x-pdf.table>
        <x-pdf.row>
            <x-pdf.info-item label="Profissional de apoio" :value="$yesNo($paee->support_professional_needed)" />
            <x-pdf.info-item label="Intérprete de Libras" :value="$yesNo($paee->libras_interpreter_needed)" />
            <x-pdf.info-item label="Guia-intérprete" :value="$yesNo($paee->guide_interpreter_needed)" />
        </x-pdf.row>
    </x-pdf.table>
    @if($paee->support_professional_needed)
        <x-pdf.text-area label="Justificativa (profissional de apoio)" :value="$paee->support_professional_justification" empty="Não informado." />
    @endif
    @if($paee->libras_interpreter_needed)
        <x-pdf.text-area label="Justificativa (intérprete de Libras)" :value="$paee->libras_interpreter_justification" empty="Não informado." />
    @endif
    @if($paee->guide_interpreter_needed)
        <x-pdf.text-area label="Justificativa (guia-intérprete)" :value="$paee->guide_interpreter_justification" empty="Não informado." />
    @endif

    <x-pdf.section-title title="Objetivos" />
    @if($paee->objectives->isNotEmpty())
        <table class="pdf-table pdf-data-table">
            <thead>
                <tr>
                    <th>Descrição</th>
                    <th class="pdf-w-16">Prazo</th>
                    <th class="pdf-w-40">Barreira vinculada</th>
                </tr>
            </thead>
            <tbody>
                @foreach($paee->objectives as $objective)
                    @php
                        $barrier = $objective->linkedBarrier;
                        $barrierLabel = $barrier
                            ? trim((string) $barrier->type) . (filled($barrier->observed_situation) ? ', ' . $barrier->observed_situation : '')
                            : 'Nenhuma';
                    @endphp
                    <tr>
                        <td>{!! nl2br(e((string) $objective->description)) !!}</td>
                        <td>{{ AeeLabels::objectiveTerm($objective->term) }}</td>
                        <td>{{ $barrierLabel }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p class="pdf-empty">Nenhum objetivo registrado.</p>
    @endif

    <x-pdf.section-title title="Recursos" />
    @if($paee->resources->isNotEmpty())
        <table class="pdf-table pdf-data-table">
            <thead>
                <tr>
                    <th>Descrição</th>
                    <th class="pdf-w-18">Tipo</th>
                    <th class="pdf-w-24">Tecnologia assistiva</th>
                </tr>
            </thead>
            <tbody>
                @foreach($paee->resources as $resource)
                    <tr>
                        <td>{!! nl2br(e((string) $resource->description)) !!}</td>
                        <td>{{ AeeLabels::acquisitionType($resource->acquisition_type) }}</td>
                        <td>{{ $resource->assistiveTechnology?->name ?? 'Não vinculada' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p class="pdf-empty">Nenhum recurso registrado.</p>
    @endif

    <x-pdf.section-title title="Articulações e Orientações" />
    <x-pdf.text-area label="Orientação aos profissionais da escola" :value="$paee->school_professionals_orientation" empty="Não informado." />
    <x-pdf.text-area label="Articulação com professores do ensino comum" :value="$paee->common_teachers_articulation" empty="Não informado." />
    <x-pdf.text-area label="Como a família será envolvida" :value="$paee->family_articulation" empty="Não informado." />
    <x-pdf.text-area label="Articulação intersetorial" :value="$paee->intersectoral_articulation" empty="Não informado." />
    <x-pdf.text-area label="Demandas de formação" :value="$paee->training_demands" empty="Não informado." />

    <x-pdf.section-title title="Revisões" />
    @if($paee->reviews->isNotEmpty())
        <table class="pdf-table pdf-data-table">
            <thead>
                <tr>
                    <th class="pdf-w-12">Data</th>
                    <th class="pdf-w-18">Revisado por</th>
                    <th>O que mudou</th>
                    <th>Por quê</th>
                </tr>
            </thead>
            <tbody>
                @foreach($paee->reviews as $review)
                    <tr>
                        <td>{{ $review->reviewed_at?->format('d/m/Y') ?? 'Sem data' }}</td>
                        <td>{{ $review->reviewer?->name ?? 'Não informado' }}</td>
                        <td class="value">{!! \App\Shared\Infrastructure\Security\RichTextSanitizer::sanitize((string) ($review->what_changed ?: 'Não informado.')) !!}</td>
                        <td class="value">{!! \App\Shared\Infrastructure\Security\RichTextSanitizer::sanitize((string) ($review->why ?: 'Não informado.')) !!}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p class="pdf-empty">Nenhuma revisão registrada.</p>
    @endif

</body>
</html>
