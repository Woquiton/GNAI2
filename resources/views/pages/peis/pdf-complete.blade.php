@use('App\Shared\Domain\Support\AeeLabels')
@php
    $student = $pei->student;
    $studentName = $student?->person?->name ?? 'Não informado';
    $studentDocument = $student?->person?->document;
    $versionLabel = $pei->version ? 'v' . $pei->version : 'Não informada';
    $responsible = $pei->creator?->is_admin ? 'Administrador' : ($pei->creator?->name ?? 'Não informado');
    $deficiencies = $student?->deficiencies?->pluck('name')->filter()->implode(', ');
    $paee = $pei->paee;
@endphp
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <title>PEI Completo - {{ $studentName }}</title>
    <x-pdf.styles />
</head>
<body>

    <x-pdf.header
        title="Plano Educacional Individualizado (PEI) - Completo"
        :status="$pei->is_finished ? 'Finalizado' : 'Em preenchimento'"
        :meta="[
            'Estudante' => $studentName,
            'Semestre' => $pei->semester?->label,
            'Versão' => $versionLabel,
        ]"
    />

    <x-pdf.section-title title="Identificação" />
    <x-pdf.table>
        <x-pdf.row>
            <x-pdf.info-item label="Estudante" :value="$studentName" />
            <x-pdf.info-item label="Matrícula" :value="$student?->registration ?? 'Não informada'" />
        </x-pdf.row>
        <x-pdf.row>
            <x-pdf.info-item label="Curso" :value="$pei->course?->name ?? 'Não informado'" />
            <x-pdf.info-item label="Semestre" :value="$pei->semester?->label ?? 'Não informado'" />
        </x-pdf.row>
        <x-pdf.row>
            <x-pdf.info-item label="Versão do PEI" :value="$versionLabel" />
            <x-pdf.info-item label="PEI vigente" :value="$pei->is_current ? 'Sim' : 'Não (histórico)'" />
        </x-pdf.row>
        <x-pdf.row>
            <x-pdf.info-item label="Responsável pelo PEI" :value="$responsible" />
            <x-pdf.info-item label="Criado em" :value="$pei->created_at?->format('d/m/Y') ?? 'Não informado'" />
        </x-pdf.row>
        <x-pdf.row>
            <x-pdf.info-item label="Perfis de atendimento" :value="$deficiencies ?: 'Nenhum perfil de atendimento registrado'" colspan="2" />
        </x-pdf.row>
    </x-pdf.table>

    <x-pdf.section-title title="PAEE Vinculado" />
    @if($paee)
        <x-pdf.table>
            <x-pdf.row>
                <x-pdf.info-item label="Versão" :value="$paee->version ? 'v' . $paee->version : 'Não informada'" />
                <x-pdf.info-item label="Status" :value="AeeLabels::paeeStatus($paee->status)" />
            </x-pdf.row>
            <x-pdf.row>
                <x-pdf.info-item label="Frequência semanal" :value="$paee->attendance_frequency_per_week !== null ? $paee->attendance_frequency_per_week . 'x por semana' : 'Não informada'" />
                <x-pdf.info-item label="Duração" :value="$paee->attendance_duration_minutes !== null ? $paee->attendance_duration_minutes . ' min' : 'Não informada'" />
            </x-pdf.row>
            <x-pdf.row>
                <x-pdf.info-item label="Formato de atendimento" :value="AeeLabels::attendanceFormat($paee->attendance_format)" />
                <x-pdf.info-item label="Local de atendimento" :value="AeeLabels::attendanceLocation($paee->attendance_location)" />
            </x-pdf.row>
        </x-pdf.table>
        <x-pdf.text-area label="Articulação com o professor regente" :value="$paee->common_teachers_articulation" empty="Não informado." />
    @else
        <p class="pdf-empty">Nenhum PAEE vinculado a este PEI.</p>
    @endif

    <x-pdf.section-title title="Outras Informações Relevantes" />
    @if(filled($pei->other_relevant_info))
        <x-pdf.text-area label="Outras informações relevantes" :value="nl2br(e((string) $pei->other_relevant_info))" />
    @else
        <p class="pdf-empty">Nenhuma informação adicional registrada.</p>
    @endif

    @forelse ($peiDisciplines as $index => $item)
        <div class="page-break"></div>

        <div class="category-header">
            Disciplina {{ $index + 1 }} de {{ $peiDisciplines->count() }}:
            {{ $item->discipline?->name ? mb_strtoupper($item->discipline->name, 'UTF-8') : 'Não informada' }}
        </div>

        <x-pdf.table>
            <x-pdf.row>
                <x-pdf.info-item label="Docente" :value="$item->teacher?->person?->name ?? 'Não informado'" />
                <x-pdf.info-item label="Criada por" :value="$item->creator?->name ?? 'Sistema'" />
            </x-pdf.row>
        </x-pdf.table>

        <x-pdf.section-title title="Adaptações Razoáveis e/ou Acessibilidades Curriculares" />

        <x-pdf.text-area label="Objetivos Específicos" :value="$item->specific_objectives" empty="Não informado." />
        <x-pdf.text-area label="Prazo das metas/objetivos" :value="$item->objectives_deadline" empty="Não informado." />
        <x-pdf.text-area label="Conteúdo Programático" :value="$item->content_programmatic" empty="Não informado." />
        <x-pdf.text-area label="Referência curricular" :value="$item->curricular_reference" empty="Não informada." />
        <x-pdf.text-area label="Metodologias e Estratégias" :value="$item->methodologies" empty="Não informado." />
        <x-pdf.text-area label="Recursos didáticos e tecnologia assistiva" :value="$item->materials_and_assistive_technology" empty="Não informado." />
        <x-pdf.text-area label="Processo de Avaliação" :value="$item->evaluations" empty="Não informado." />
        <x-pdf.text-area label="Registros Complementares" :value="$item->complementary_records" empty="Nenhum registro complementar informado." />
        <x-pdf.text-area label="Parecer" :value="$item->opinion" empty="Não informado." />

        <x-pdf.section-title title="Revisões desta Adaptação" />
        @if($item->revisions->isNotEmpty())
            <table class="pdf-table pdf-data-table">
                <thead>
                    <tr>
                        <th class="pdf-w-16">Data</th>
                        <th class="pdf-w-18">Revisado por</th>
                        <th>O que mudou</th>
                        <th>Por quê</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($item->revisions as $revision)
                        <tr>
                            <td>{{ $revision->reviewed_at?->format('d/m/Y') ?? 'Sem data' }}</td>
                            <td>{{ $revision->reviewer?->name ?? 'Não informado' }}</td>
                            <td>{!! nl2br(e((string) $revision->what_changed)) !!}</td>
                            <td>{!! nl2br(e((string) $revision->why)) !!}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p class="pdf-empty">Nenhuma revisão registrada.</p>
        @endif
    @empty
        <x-pdf.section-title title="Adaptações Razoáveis e/ou Acessibilidades Curriculares" />
        <p class="pdf-empty">Nenhuma disciplina vinculada a este PEI.</p>
    @endforelse

    <table class="signature-table">
        <tr>
            <td><div class="sig-line">Assinatura do Docente</div></td>
            <td><div class="sig-line">Assinatura do Coordenador de Curso</div></td>
        </tr>
        <tr>
            <td class="pdf-signature-cell-spaced"><div class="sig-line">NAPNE / NAAf</div></td>
            <td class="pdf-signature-cell-spaced"><div class="sig-line">Setor Pedagógico / Assistência Estudantil</div></td>
        </tr>
    </table>

    <div class="page-break"></div>

    <x-pdf.header
        title="Declaração"
        :meta="[
            'Estudante' => $studentName,
            'CPF' => $studentDocument ?? 'Não informado',
        ]"
    />

    <div class="pdf-text-justify pdf-mt-40 pdf-line-height-2">
        <p>
            Declaro para os devidos fins que eu, <strong>{{ $studentName }}</strong>,
            CPF nº <strong>{{ $studentDocument ?? '___________' }}</strong>, na condição de pessoa com deficiência
            e tendo ingressado por reserva de vagas nesta instituição, estou ciente de que tenho direito ao apoio,
            acompanhamentos e demais procedimentos previstos no processo de acessibilidade curricular -
            Plano Educacional Individualizado (PEI).
        </p>

        <p class="pdf-mt-20">
            ( &nbsp; ) Desejo receber os acompanhamentos previstos.
        </p>
        <p>
            ( &nbsp; ) Declaro, outrossim, que me <strong>recuso</strong> a receber os acompanhamentos e demais procedimentos supramencionados.
        </p>

        <div class="pdf-mt-50 pdf-text-right">
            {{ config('app.city', 'Guanambi - BA') }}, {{ now()->locale('pt_BR')->translatedFormat('d \d\e F \d\e Y') }}.
        </div>

        <div class="pdf-mt-80 pdf-text-center">
            <div class="pdf-signature-line-black"></div>
            <p class="pdf-signature-caption">Assinatura do estudante ou responsável legal</p>
        </div>
    </div>

</body>
</html>
