<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <title>Ficha do Aluno - {{ $student->person?->name ?? $student->registration }}</title>
    <x-pdf.styles />
</head>
<body>
@php
    // Texto simples é escapado por {{ }}; texto rico passa pelo sanitizador antes de {!! !!}.
    $plain = fn ($value): string => filled($value) ? (string) $value : '---';
    $rich = fn ($value): string => filled($value)
        ? \App\Shared\Infrastructure\Security\RichTextSanitizer::sanitize((string) $value)
        : '---';
    $date = fn ($value): string => filled($value) ? \Carbon\Carbon::parse($value)->format('d/m/Y') : '---';
    $dateTime = fn ($value): string => filled($value) ? \Carbon\Carbon::parse($value)->format('d/m/Y H:i') : '---';
    $yesNo = fn ($value): string => $value === null ? '---' : ($value ? 'Sim' : 'Não');
    $upper = fn ($value): string => filled($value) ? mb_strtoupper((string) $value, 'UTF-8') : '---';

    $person = $student->person;
    $currentCourse = $student->currentCourse;
    $deficiencies = $student->deficiencies ?? collect();
    $guardians = $student->guardians ?? collect();
@endphp

    <x-pdf.header
        title="Ficha do Aluno"
        :status="$student->status?->label()"
        :meta="[
            'Aluno(a)' => $person?->name ?? '---',
            'Matrícula' => $student->registration ?? '---',
            'Gerado em' => now()->format('d/m/Y H:i'),
        ]"
    />

    {{-- ================= INFORMAÇÕES DO ALUNO ================= --}}
    <x-pdf.section-title title="Informações do Aluno" />
    <table class="pdf-table">
        <tr>
            <td class="pdf-cell" colspan="2"><strong>Nome:</strong> {{ $plain($person?->name) }}</td>
            <td class="pdf-cell" colspan="2"><strong>Matrícula:</strong> {{ $plain($student->registration) }}</td>
        </tr>
        <tr>
            <td class="pdf-cell" colspan="2"><strong>CPF:</strong> {{ $plain($person?->document) }}</td>
            <td class="pdf-cell" colspan="2"><strong>Gênero:</strong> {{ $plain($person?->gender?->label()) }}</td>
        </tr>
        <tr>
            <td class="pdf-cell" colspan="2"><strong>Data de Nascimento:</strong> {{ $date($person?->birth_date) }}</td>
            <td class="pdf-cell" colspan="2">
                <strong>Idade:</strong>
                {{ $person?->birth_date ? $person->birth_date->age.' anos' : '---' }}
            </td>
        </tr>
        <tr>
            <td class="pdf-cell" colspan="2"><strong>E-mail:</strong> {{ $plain($person?->email) }}</td>
            <td class="pdf-cell" colspan="2"><strong>Telefone:</strong> {{ $plain($person?->phone) }}</td>
        </tr>
        <tr>
            <td class="pdf-cell" colspan="4"><strong>Endereço:</strong> {!! $rich($person?->address) !!}</td>
        </tr>
        <tr>
            <td class="pdf-cell" colspan="2"><strong>Situação:</strong> {{ $plain($student->status?->label()) }}</td>
            <td class="pdf-cell" colspan="2">
                <strong>Tipo de acompanhamento:</strong> {{ $student->follow_up_type?->label() ?? 'Não informado' }}
            </td>
        </tr>
        <tr>
            <td class="pdf-cell" colspan="2"><strong>Data de Ingresso:</strong> {{ $date($student->entry_date) }}</td>
            <td class="pdf-cell" colspan="2">
                <strong>Quantidade de Perfis de Atendimento:</strong> {{ $deficiencies->count() }}
            </td>
        </tr>
    </table>

    {{-- ================= PERFIS DE ATENDIMENTO ================= --}}
    <x-pdf.section-title title="Perfis de Atendimento" />
    @if($deficiencies->isNotEmpty())
        <table class="pdf-table pdf-data-table">
            <tr>
                <th class="pdf-cell pdf-w-24">Perfil</th>
                <th class="pdf-cell pdf-w-16">Severidade</th>
                <th class="pdf-cell">Observações</th>
            </tr>
            @foreach($deficiencies as $deficiency)
                <tr>
                    <td class="pdf-cell">{{ $plain($deficiency->name) }}</td>
                    <td class="pdf-cell">
                        {{ \App\Domain\Enums\DeficiencySeverity::tryFrom((string) ($deficiency->pivot?->severity ?? ''))?->label() ?? 'Não informada' }}
                    </td>
                    <td class="pdf-cell">{!! $rich($deficiency->pivot?->notes) !!}</td>
                </tr>
            @endforeach
        </table>
    @else
        <p class="pdf-empty">Nenhum perfil de atendimento vinculado a este aluno.</p>
    @endif

    {{-- ================= CURSO ATUAL ================= --}}
    <x-pdf.section-title title="Curso Atual" />
    @if($currentCourse)
        <table class="pdf-table">
            <tr>
                <td class="pdf-cell" colspan="4">
                    <strong>Curso / Série:</strong> {{ $currentCourse->course?->name ?? 'Curso não identificado' }}
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="2"><strong>Ano Letivo:</strong> {{ $plain($currentCourse->academic_year) }}</td>
                <td class="pdf-cell" colspan="2"><strong>Semestre:</strong> {{ $plain($currentCourse->semester?->label) }}</td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="4">
                    <strong>Disciplinas com Reprovação:</strong>
                    {{ $plain($currentCourse->failed_discipline_names) }}
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="4">
                    <strong>Disciplinas com Risco de Insucesso Acadêmico:</strong>
                    {{ $plain($currentCourse->at_risk_discipline_names) }}
                </td>
            </tr>
        </table>
        <x-pdf.text-area
            label="Situação da Frequência Escolar"
            :value="$currentCourse->school_attendance_status"
            empty="Não informada."
        />
    @else
        <p class="pdf-empty">Nenhum curso atual vinculado a este aluno.</p>
    @endif

    {{-- ================= RESPONSÁVEIS ================= --}}
    <x-pdf.section-title title="Responsáveis" />
    @forelse($guardians as $guardian)
        @php $guardianPerson = $guardian->person; @endphp
        <table class="pdf-table pdf-mb-12">
            <tr>
                <td class="pdf-cell" colspan="2"><strong>Nome:</strong> {{ $plain($guardianPerson?->name) }}</td>
                <td class="pdf-cell" colspan="2">
                    <strong>Vínculo:</strong> {{ $plain($guardian->relationship?->label()) }}
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="2"><strong>CPF:</strong> {{ $plain($guardianPerson?->document) }}</td>
                <td class="pdf-cell" colspan="2"><strong>Gênero:</strong> {{ $plain($guardianPerson?->gender?->label()) }}</td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="2"><strong>Data de Nascimento:</strong> {{ $date($guardianPerson?->birth_date) }}</td>
                <td class="pdf-cell" colspan="2"><strong>Telefone:</strong> {{ $plain($guardianPerson?->phone) }}</td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="4"><strong>E-mail:</strong> {{ $plain($guardianPerson?->email) }}</td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="4"><strong>Endereço:</strong> {!! $rich($guardianPerson?->address) !!}</td>
            </tr>
        </table>
    @empty
        <p class="pdf-empty">Nenhum responsável vinculado a este aluno.</p>
    @endforelse

    {{-- ================= ESTUDO DE CASO ATUAL ================= --}}
    <x-pdf.section-title title="Estudo de Caso Atual" />
    @if($caseStudy = $student->currentCaseStudy)
        <table class="pdf-table">
            <tr>
                <td class="pdf-cell" colspan="2"><strong>Versão:</strong> {{ $plain($caseStudy->version) }}</td>
                <td class="pdf-cell" colspan="2"><strong>Semestre:</strong> {{ $plain($caseStudy->semester?->label) }}</td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="2">
                    <strong>Status:</strong> {{ \App\Shared\Domain\Support\AeeLabels::caseStudyStatus($caseStudy->status) }}
                </td>
                <td class="pdf-cell" colspan="2"><strong>Criado por:</strong> {{ $plain($caseStudy->creator?->name) }}</td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="2">
                    <strong>Origem da Demanda:</strong> {{ \App\Shared\Domain\Support\AeeLabels::demandOrigin($caseStudy->demand_origin) }}
                </td>
                <td class="pdf-cell" colspan="2"><strong>Data do Estudo de Caso:</strong> {{ $date($caseStudy->study_date) }}</td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="2">
                    <strong>Status de Aceite:</strong> {{ \App\Shared\Domain\Support\AeeLabels::acceptanceStatus($caseStudy->acceptance_status) }}
                </td>
                <td class="pdf-cell" colspan="2"><strong>Data do Aceite:</strong> {{ $date($caseStudy->acceptance_date) }}</td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="2"><strong>Concluído em:</strong> {{ $dateTime($caseStudy->completed_at) }}</td>
                <td class="pdf-cell" colspan="2"><strong>Última Atualização:</strong> {{ $dateTime($caseStudy->updated_at) }}</td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="4">
                    <strong>Apoios Necessários:</strong>
                    {{ $plain(\App\Shared\Domain\Support\AeeLabels::neededSupportsList($caseStudy->needed_supports)) }}
                </td>
            </tr>
        </table>

        <x-pdf.text-area label="Resumo dos Participantes" :value="$caseStudy->participants_summary" empty="Não informado." />
        <x-pdf.text-area label="Observação do Estudante" :value="$caseStudy->student_observation" empty="Não informado." />
        <x-pdf.text-area label="Escuta do Estudante/Família" :value="$caseStudy->student_family_listening" empty="Não informado." />
        <x-pdf.text-area label="Escuta dos Professores" :value="$caseStudy->teachers_listening" empty="Não informado." />
        <x-pdf.text-area label="Outras Informações" :value="$caseStudy->other_info" empty="Não informado." />
        <x-pdf.text-area label="Observações da Rede de Cuidado" :value="$caseStudy->care_network_notes" empty="Não informado." />
        <x-pdf.text-area label="Aspectos Favoráveis" :value="$caseStudy->favorable_aspects" empty="Não informado." />
        <x-pdf.text-area label="Potenciais e Interesses" :value="$caseStudy->potentials_interests" empty="Não informado." />
        <x-pdf.text-area label="Justificativa dos Apoios Necessários" :value="$caseStudy->needed_supports_justification" empty="Não informado." />

        <x-pdf.section-title title="Barreiras Identificadas" />
        @if($caseStudy->barriers->isNotEmpty())
            <table class="pdf-table pdf-data-table">
                <tr>
                    <th class="pdf-cell pdf-w-16">Tipo</th>
                    <th class="pdf-cell">Situação Observada</th>
                    <th class="pdf-cell">Implicação na Participação</th>
                </tr>
                @foreach($caseStudy->barriers as $barrier)
                    <tr>
                        <td class="pdf-cell">{{ $plain($barrier->type) }}</td>
                        <td class="pdf-cell">{!! $rich($barrier->observed_situation) !!}</td>
                        <td class="pdf-cell">{!! $rich($barrier->participation_implication) !!}</td>
                    </tr>
                @endforeach
            </table>
        @else
            <p class="pdf-empty">Nenhuma barreira registrada.</p>
        @endif

        <x-pdf.section-title title="Estratégias" />
        @if($caseStudy->strategies->isNotEmpty())
            <table class="pdf-table pdf-data-table">
                <tr>
                    <th class="pdf-cell">Descrição</th>
                    <th class="pdf-cell pdf-w-24">Barreira Relacionada</th>
                </tr>
                @foreach($caseStudy->strategies as $strategy)
                    <tr>
                        <td class="pdf-cell">{!! $rich($strategy->description) !!}</td>
                        <td class="pdf-cell">{{ $plain($strategy->linkedBarrier?->type) }}</td>
                    </tr>
                @endforeach
            </table>
        @else
            <p class="pdf-empty">Nenhuma estratégia registrada.</p>
        @endif

        <x-pdf.section-title title="Contribuições" />
        @if($caseStudy->contributions->isNotEmpty())
            <table class="pdf-table pdf-data-table">
                <tr>
                    <th class="pdf-cell pdf-w-18">Autor</th>
                    <th class="pdf-cell pdf-w-16">Papel</th>
                    <th class="pdf-cell">Conteúdo</th>
                    <th class="pdf-cell pdf-w-12">Data</th>
                </tr>
                @foreach($caseStudy->contributions as $contribution)
                    <tr>
                        <td class="pdf-cell">{{ $plain($contribution->author?->name) }}</td>
                        <td class="pdf-cell">{{ $plain($contribution->role) }}</td>
                        <td class="pdf-cell">{!! $rich($contribution->content) !!}</td>
                        <td class="pdf-cell">{{ $date($contribution->created_at) }}</td>
                    </tr>
                @endforeach
            </table>
        @else
            <p class="pdf-empty">Nenhuma contribuição registrada.</p>
        @endif
    @else
        <p class="pdf-empty">Nenhum Estudo de Caso atual encontrado para este aluno.</p>
    @endif

    {{-- ================= PAEE ATUAL ================= --}}
    <x-pdf.section-title title="PAEE Atual" />
    @if($paee = $student->currentPaee)
        <table class="pdf-table">
            <tr>
                <td class="pdf-cell" colspan="2"><strong>Versão:</strong> {{ $plain($paee->version) }}</td>
                <td class="pdf-cell" colspan="2"><strong>Semestre:</strong> {{ $plain($paee->semester?->label) }}</td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="2">
                    <strong>Status:</strong> {{ \App\Shared\Domain\Support\AeeLabels::paeeStatus($paee->status) }}
                </td>
                <td class="pdf-cell" colspan="2"><strong>Criado por:</strong> {{ $plain($paee->creator?->name) }}</td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="2"><strong>Frequência Semanal:</strong> {{ $plain($paee->attendance_frequency_per_week) }}</td>
                <td class="pdf-cell" colspan="2"><strong>Duração (minutos):</strong> {{ $plain($paee->attendance_duration_minutes) }}</td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="2">
                    <strong>Formato do Atendimento:</strong> {{ \App\Shared\Domain\Support\AeeLabels::attendanceFormat($paee->attendance_format) }}
                </td>
                <td class="pdf-cell" colspan="2">
                    <strong>Local do Atendimento:</strong> {{ \App\Shared\Domain\Support\AeeLabels::attendanceLocation($paee->attendance_location) }}
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="2">
                    <strong>Necessita de Tecnologia Assistiva:</strong> {{ $yesNo($paee->assistive_technology_needed) }}
                </td>
                <td class="pdf-cell" colspan="2">
                    <strong>TA é Dispositivo Digital Portátil:</strong> {{ $yesNo($paee->is_assistive_technology_portable_digital_device) }}
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="2">
                    <strong>Necessita de CAA:</strong> {{ $yesNo($paee->caa_needed) }}
                </td>
                <td class="pdf-cell" colspan="2">
                    <strong>Necessita de Profissional de Apoio:</strong> {{ $yesNo($paee->support_professional_needed) }}
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="2">
                    <strong>Necessita de Intérprete de Libras:</strong> {{ $yesNo($paee->libras_interpreter_needed) }}
                </td>
                <td class="pdf-cell" colspan="2">
                    <strong>Necessita de Guia-Intérprete:</strong> {{ $yesNo($paee->guide_interpreter_needed) }}
                </td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="4"><strong>Próxima Revisão:</strong> {{ $date($paee->next_review_date) }}</td>
            </tr>
        </table>

        <x-pdf.text-area label="Observações sobre Tecnologia Assistiva" :value="$paee->assistive_technology_notes" empty="Não informado." />
        <x-pdf.text-area label="Capacidade de Disponibilização da TA" :value="$paee->assistive_technology_availability_capacity" empty="Não informado." />
        @if($paee->is_assistive_technology_portable_digital_device)
            <x-pdf.text-area label="Parecer Pedagógico sobre a TA Portátil" :value="$paee->assistive_technology_pedagogical_opinion" empty="Não informado." />
        @endif
        @if($paee->caa_needed)
            <x-pdf.text-area label="Observações sobre CAA" :value="$paee->caa_notes" empty="Não informado." />
        @endif
        <x-pdf.text-area label="Justificativa do Profissional de Apoio" :value="$paee->support_professional_justification" empty="Não informado." />
        @if($paee->libras_interpreter_needed)
            <x-pdf.text-area label="Justificativa do Intérprete de Libras" :value="$paee->libras_interpreter_justification" empty="Não informado." />
        @endif
        @if($paee->guide_interpreter_needed)
            <x-pdf.text-area label="Justificativa do Guia-Intérprete" :value="$paee->guide_interpreter_justification" empty="Não informado." />
        @endif
        <x-pdf.text-area label="Orientações aos Profissionais da Escola" :value="$paee->school_professionals_orientation" empty="Não informado." />
        <x-pdf.text-area label="Articulação com Professores do Ensino Comum" :value="$paee->common_teachers_articulation" empty="Não informado." />
        <x-pdf.text-area label="Articulação com a Família" :value="$paee->family_articulation" empty="Não informado." />
        <x-pdf.text-area label="Articulação Intersetorial" :value="$paee->intersectoral_articulation" empty="Não informado." />
        <x-pdf.text-area label="Demandas de Formação" :value="$paee->training_demands" empty="Não informado." />

        <x-pdf.section-title title="Objetivos do PAEE" />
        @if($paee->objectives->isNotEmpty())
            <table class="pdf-table pdf-data-table">
                <tr>
                    <th class="pdf-cell">Descrição</th>
                    <th class="pdf-cell pdf-w-16">Prazo</th>
                    <th class="pdf-cell pdf-w-24">Barreira Relacionada</th>
                </tr>
                @foreach($paee->objectives as $objective)
                    <tr>
                        <td class="pdf-cell">{!! $rich($objective->description) !!}</td>
                        <td class="pdf-cell">{{ \App\Shared\Domain\Support\AeeLabels::objectiveTerm($objective->term) }}</td>
                        <td class="pdf-cell">{{ $plain($objective->linkedBarrier?->type) }}</td>
                    </tr>
                @endforeach
            </table>
        @else
            <p class="pdf-empty">Nenhum objetivo registrado.</p>
        @endif

        <x-pdf.section-title title="Recursos do PAEE" />
        @if($paee->resources->isNotEmpty())
            <table class="pdf-table pdf-data-table">
                <tr>
                    <th class="pdf-cell">Descrição</th>
                    <th class="pdf-cell pdf-w-16">Tipo de Aquisição</th>
                    <th class="pdf-cell pdf-w-24">Tecnologia Assistiva</th>
                </tr>
                @foreach($paee->resources as $resource)
                    <tr>
                        <td class="pdf-cell">{!! $rich($resource->description) !!}</td>
                        <td class="pdf-cell">{{ \App\Shared\Domain\Support\AeeLabels::acquisitionType($resource->acquisition_type) }}</td>
                        <td class="pdf-cell">{{ $plain($resource->assistiveTechnology?->name) }}</td>
                    </tr>
                @endforeach
            </table>
        @else
            <p class="pdf-empty">Nenhum recurso registrado.</p>
        @endif

        <x-pdf.section-title title="Revisões do PAEE" />
        @if($paee->reviews->isNotEmpty())
            <table class="pdf-table pdf-data-table">
                <tr>
                    <th class="pdf-cell pdf-w-12">Data</th>
                    <th class="pdf-cell pdf-w-18">Revisor</th>
                    <th class="pdf-cell">O que mudou</th>
                    <th class="pdf-cell">Por quê</th>
                </tr>
                @foreach($paee->reviews as $review)
                    <tr>
                        <td class="pdf-cell">{{ $date($review->reviewed_at) }}</td>
                        <td class="pdf-cell">{{ $plain($review->reviewer?->name) }}</td>
                        <td class="pdf-cell">{!! $rich($review->what_changed) !!}</td>
                        <td class="pdf-cell">{!! $rich($review->why) !!}</td>
                    </tr>
                @endforeach
            </table>
        @else
            <p class="pdf-empty">Nenhuma revisão registrada.</p>
        @endif
    @else
        <p class="pdf-empty">Nenhum PAEE atual encontrado para este aluno.</p>
    @endif

    {{-- ================= PEIs VIGENTES (um bloco por PEI) ================= --}}
    @forelse($student->peis as $pei)
        <div class="category-header">Plano Educacional Individualizado (PEI) - Versão {{ $plain($pei->version) }}</div>

        <x-pdf.section-title title="Dados do PEI" />
        <table class="pdf-table">
            <tr>
                <td class="pdf-cell" colspan="2"><strong>Curso:</strong> {{ $plain($pei->course?->name) }}</td>
                <td class="pdf-cell" colspan="2"><strong>Semestre/Ano:</strong> {{ $plain($pei->semester?->label) }}</td>
            </tr>
            <tr>
                <td class="pdf-cell" colspan="2">
                    <strong>Situação:</strong> {{ $pei->is_finished ? 'Finalizado' : 'Em preenchimento' }}
                </td>
                <td class="pdf-cell" colspan="2"><strong>Criado por:</strong> {{ $plain($pei->creator?->name) }}</td>
            </tr>
        </table>
        @if(filled($pei->other_relevant_info))
            <x-pdf.text-area label="Outras Informações Relevantes" :value="$pei->other_relevant_info" empty="Não informado." />
        @endif

        <x-pdf.section-title title="Informações de Apoio Pedagógico (NAPNE)" />
        @if($pei->paee)
            <table class="pdf-table">
                <tr>
                    <td class="pdf-cell" colspan="2"><strong>PAEE Vinculado (versão):</strong> {{ $plain($pei->paee->version) }}</td>
                    <td class="pdf-cell" colspan="2">
                        <strong>Status do PAEE:</strong> {{ \App\Shared\Domain\Support\AeeLabels::paeeStatus($pei->paee->status) }}
                    </td>
                </tr>
                <tr>
                    <td class="pdf-cell" colspan="2">
                        <strong>Frequência de Atendimento:</strong> {{ $plain($pei->paee->attendance_frequency_per_week) }}
                    </td>
                    <td class="pdf-cell" colspan="2">
                        <strong>Formato de Atendimento:</strong> {{ \App\Shared\Domain\Support\AeeLabels::attendanceFormat($pei->paee->attendance_format) }}
                    </td>
                </tr>
            </table>
        @else
            <p class="pdf-empty">Nenhum PAEE vinculado a este PEI.</p>
        @endif

        @forelse($pei->peiDisciplines as $item)
            @php $disciplineName = $upper($item->discipline?->name); @endphp
            <x-pdf.section-title :title="'Adaptações Razoáveis e/ou Acessibilidades Curriculares - '.$disciplineName" />
            <table class="pdf-table">
                <tr>
                    <td class="pdf-cell" colspan="2"><strong>Componente Curricular:</strong> {{ $disciplineName }}</td>
                    <td class="pdf-cell" colspan="2"><strong>Docente:</strong> {{ $plain($item->teacher?->person?->name) }}</td>
                </tr>
            </table>

            <x-pdf.text-area label="Objetivos Específicos" :value="$item->specific_objectives" empty="Não informado." />
            <x-pdf.text-area label="Prazo das Metas/Objetivos" :value="$item->objectives_deadline" empty="Não informado." />
            <x-pdf.text-area label="Conteúdos Programáticos" :value="$item->content_programmatic" empty="Não informado." />
            <x-pdf.text-area label="Referência Curricular (BNCC ou Ementa/Unidade)" :value="$item->curricular_reference" empty="Não informado." />
            <x-pdf.text-area label="Metodologia" :value="$item->methodologies" empty="Não informado." />
            <x-pdf.text-area label="Recursos Didáticos e Tecnologia Assistiva" :value="$item->materials_and_assistive_technology" empty="Não informado." />
            <x-pdf.text-area label="Avaliação" :value="$item->evaluations" empty="Não informado." />
            <x-pdf.text-area label="Registros Complementares" :value="$item->complementary_records" empty="Não informado." />
            <x-pdf.text-area label="Parecer" :value="$item->opinion" empty="Não informado." />

            @if($item->revisions->isNotEmpty())
                <x-pdf.section-title :title="'Revisões - '.$disciplineName" />
                <table class="pdf-table pdf-data-table">
                    <tr>
                        <th class="pdf-cell pdf-w-12">Data</th>
                        <th class="pdf-cell pdf-w-18">Revisor</th>
                        <th class="pdf-cell">O que mudou</th>
                        <th class="pdf-cell">Por quê</th>
                    </tr>
                    @foreach($item->revisions as $revision)
                        <tr>
                            <td class="pdf-cell">{{ $date($revision->reviewed_at) }}</td>
                            <td class="pdf-cell">{{ $plain($revision->reviewer?->name) }}</td>
                            <td class="pdf-cell">{!! $rich($revision->what_changed) !!}</td>
                            <td class="pdf-cell">{!! $rich($revision->why) !!}</td>
                        </tr>
                    @endforeach
                </table>
            @endif
        @empty
            <p class="pdf-empty">Nenhuma disciplina adaptada neste PEI.</p>
        @endforelse
    @empty
        <x-pdf.section-title title="PEIs do Aluno" />
        <p class="pdf-empty">Nenhum PEI atual encontrado para este aluno.</p>
    @endforelse

</body>
</html>
