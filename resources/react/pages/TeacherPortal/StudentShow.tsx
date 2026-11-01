import type { ReactNode } from "react";
import { Link } from "@inertiajs/react";
import FormActions from "@/components/Forms/FormActions/FormActions";
import FormSection from "@/components/Forms/FormSection/FormSection";
import BusinessPage from "@/components/Navigation/BusinessPage/BusinessPage";
import Tabs, { type TabItem } from "@/components/Navigation/Tabs/Tabs";
import TeacherPortalLayout from "@/components/Navigation/TeacherPortalLayout/TeacherPortalLayout";
import TableActions from "@/components/Tables/TableActions/TableActions";
import {
    TableListCard,
    TableListEmpty,
    TableListScroll,
    TableListSummary,
    TableListTable,
    type TableListColumn,
} from "@/components/Tables/TableList/TableList";
import Button from "@/components/UI/Button/Button";
import CardBox from "@/components/UI/CardBox/CardBox";
import DetailField from "@/components/UI/DetailField/DetailField";
import InlineAlert from "@/components/UI/InlineAlert/InlineAlert";
import RichTextContent from "@/components/UI/RichTextContent/RichTextContent";
import TableLabel from "@/components/UI/TableLabel/TableLabel";
import {
    teacherPortalBase,
    type TeacherPortalCaseStudy,
    type TeacherPortalPaee,
    type TeacherPortalStudentShowProps,
} from "./TeacherPortal.types";
import "./TeacherPortal.css";

const documentColumns: TableListColumn[] = [
    {
        id: "type",
        label: "Tipo",
        width: "24%",
        minWidth: 100,
        fixed: "start",
    },
    { id: "title", label: "Título", width: "40%", minWidth: 130 },
    { id: "created_at", label: "Enviado em", width: "20%", minWidth: 90 },
    {
        id: "actions",
        label: "Ações",
        width: "16%",
        minWidth: 90,
        fixed: "end",
    },
];

function Text({ value }: { value: string | null | undefined }): React.JSX.Element {
    return <span className="teacherPortal__text">{value?.trim() ? value : "---"}</span>;
}

function YesNo({ value }: { value: boolean }): React.JSX.Element {
    return <TableLabel tone={value ? "success" : "danger"}>{value ? "Sim" : "Não"}</TableLabel>;
}

function Documents({
    documents,
}: Pick<TeacherPortalStudentShowProps, "documents">): React.JSX.Element {
    const summary = `${documents.length} ${documents.length === 1 ? "registro" : "registros"}`;

    return (
        <FormSection id="laudo-documentos" title="Laudo e Documentos" iconClass="fa fa-file-text-o" variant="inline">
            <TableListCard aria-label="Laudo e documentos do aluno">
                <TableListScroll aria-label="Laudo e documentos do aluno">
                    <TableListTable columns={documentColumns} summary={summary}>
                        {documents.length ? documents.map((document) => (
                            <tr key={document.id}>
                                <td>{document.type_label ?? "Não informado"}</td>
                                <td>{document.title ?? "Sem título"}</td>
                                <td>{document.created_at ?? "---"}</td>
                                <td>
                                    <TableActions>
                                        <Button
                                            href={`${teacherPortalBase}/documentos/${document.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            size="sm"
                                            tone="dark-blue"
                                            iconOnly
                                            leftIconClass="fa fa-eye"
                                            aria-label={`Ver documento ${document.title ?? ""}`.trim()}
                                        />
                                    </TableActions>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <TableListEmpty colSpan={documentColumns.length}>
                                    Nenhum documento anexado para este aluno.
                                </TableListEmpty>
                            </tr>
                        )}
                    </TableListTable>
                </TableListScroll>
                <TableListSummary>{summary}</TableListSummary>
            </TableListCard>
        </FormSection>
    );
}

function CaseStudy({ caseStudy }: { caseStudy: TeacherPortalCaseStudy | null }): React.JSX.Element {
    return (
        <FormSection id="estudo-de-caso" title="Estudo de Caso" iconClass="fa fa-stethoscope" variant="inline">
            {caseStudy ? (
                <>
                    <dl className="teacherPortal__grid teacherPortal__grid--four">
                        <DetailField label="Versão">v{caseStudy.version}</DetailField>
                        <DetailField label="Status">{caseStudy.status_label}</DetailField>
                        <DetailField label="Semestre">{caseStudy.semester_label ?? "---"}</DetailField>
                        <DetailField label="Origem da demanda">{caseStudy.demand_origin_label}</DetailField>
                        <DetailField label="Observação do estudante" wide>
                            <RichTextContent html={caseStudy.student_observation || "Não informado"} />
                        </DetailField>
                        <DetailField label="Escuta do estudante/família" wide>
                            <RichTextContent html={caseStudy.student_family_listening || "Não informado"} />
                        </DetailField>
                        <DetailField label="Escuta dos professores" wide>
                            <RichTextContent html={caseStudy.teachers_listening || "Não informado"} />
                        </DetailField>
                    </dl>
                    <dl className="teacherPortal__grid teacherPortal__notice">
                        <DetailField label="Aspectos favoráveis">
                            <RichTextContent html={caseStudy.favorable_aspects || "Não informado"} />
                        </DetailField>
                        <DetailField label="Potenciais e interesses">
                            <RichTextContent html={caseStudy.potentials_interests || "Não informado"} />
                        </DetailField>
                        {caseStudy.other_info ? (
                            <DetailField label="Outras informações" wide>
                                <RichTextContent html={caseStudy.other_info || "Não informado"} />
                            </DetailField>
                        ) : null}
                    </dl>

                    {caseStudy.barriers.length ? (
                        <>
                            <h3 className="teacherPortal__subheading">Barreiras identificadas</h3>
                            <ul className="teacherPortal__list">
                                {caseStudy.barriers.map((barrier) => (
                                    <li key={barrier.id} className="teacherPortal__listItem">
                                        <strong>{barrier.type_label}:</strong>{" "}
                                        <Text value={barrier.observed_situation} />
                                        <span className="teacherPortal__meta">
                                            Implicação: <Text value={barrier.participation_implication} />
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : null}

                    {caseStudy.strategies.length ? (
                        <>
                            <h3 className="teacherPortal__subheading">Estratégias</h3>
                            <ul className="teacherPortal__list">
                                {caseStudy.strategies.map((strategy) => (
                                    <li key={strategy.id} className="teacherPortal__listItem">
                                        <Text value={strategy.description} />
                                        {strategy.linked_barrier_label ? (
                                            <span className="teacherPortal__meta">
                                                Relacionada a: {strategy.linked_barrier_label}
                                            </span>
                                        ) : null}
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : null}

                    {caseStudy.contributions.length ? (
                        <>
                            <h3 className="teacherPortal__subheading">Contribuições</h3>
                            <ul className="teacherPortal__list">
                                {caseStudy.contributions.map((contribution) => (
                                    <li key={contribution.id} className="teacherPortal__listItem">
                                        <strong>{contribution.author_name ?? "---"}</strong>
                                        <span className="teacherPortal__meta">
                                            {[contribution.role, contribution.created_at].filter(Boolean).join(", ")}
                                        </span>
                                        <Text value={contribution.content} />
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : null}
                </>
            ) : (
                <p className="teacherPortal__empty">Nenhum Estudo de Caso registrado para este aluno.</p>
            )}
        </FormSection>
    );
}

function Paee({ paee }: { paee: TeacherPortalPaee | null }): React.JSX.Element {
    return (
        <FormSection id="paee" title="PAEE" iconClass="fa fa-list-alt" variant="inline">
            {paee ? (
                <>
                    <dl className="teacherPortal__grid teacherPortal__grid--four">
                        <DetailField label="Versão">v{paee.version}</DetailField>
                        <DetailField label="Status">{paee.status_label}</DetailField>
                        <DetailField label="Frequência">
                            {paee.attendance_frequency_per_week !== null ? `${paee.attendance_frequency_per_week}x/semana` : "---"}
                        </DetailField>
                        <DetailField label="Duração">
                            {paee.attendance_duration_minutes !== null ? `${paee.attendance_duration_minutes} min` : "---"}
                        </DetailField>
                        <DetailField label="Formato">{paee.attendance_format_label}</DetailField>
                        <DetailField label="Local">{paee.attendance_location_label}</DetailField>
                        <DetailField label="Tecnologia assistiva">
                            <YesNo value={paee.assistive_technology_needed} />
                        </DetailField>
                        <DetailField label="Profissional de apoio">
                            <YesNo value={paee.support_professional_needed} />
                        </DetailField>
                        {paee.assistive_technology_notes ? (
                            <DetailField label="Notas sobre tecnologia assistiva" wide>
                                <Text value={paee.assistive_technology_notes} />
                            </DetailField>
                        ) : null}
                        {paee.school_professionals_orientation ? (
                            <DetailField label="Orientações aos profissionais da escola" wide>
                                <Text value={paee.school_professionals_orientation} />
                            </DetailField>
                        ) : null}
                        {paee.common_teachers_articulation ? (
                            <DetailField label="Articulação com professores comuns" wide>
                                <Text value={paee.common_teachers_articulation} />
                            </DetailField>
                        ) : null}
                        {paee.family_articulation ? (
                            <DetailField label="Articulação com a família" wide>
                                <Text value={paee.family_articulation} />
                            </DetailField>
                        ) : null}
                    </dl>

                    {paee.objectives.length ? (
                        <>
                            <h3 className="teacherPortal__subheading">Objetivos</h3>
                            <ul className="teacherPortal__list">
                                {paee.objectives.map((objective) => (
                                    <li key={objective.id} className="teacherPortal__listItem">
                                        <Text value={objective.description} />
                                        <span className="teacherPortal__meta">{objective.term_label}</span>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : null}

                    {paee.resources.length ? (
                        <>
                            <h3 className="teacherPortal__subheading">Recursos</h3>
                            <ul className="teacherPortal__list">
                                {paee.resources.map((resource) => (
                                    <li key={resource.id} className="teacherPortal__listItem">
                                        <Text value={resource.description} />
                                        <span className="teacherPortal__meta">{resource.acquisition_type_label}</span>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : null}

                    {paee.reviews.length ? (
                        <>
                            <h3 className="teacherPortal__subheading">Revisões</h3>
                            <ul className="teacherPortal__list">
                                {paee.reviews.map((review) => (
                                    <li key={review.id} className="teacherPortal__listItem">
                                        <strong>{review.reviewed_at ?? "---"}</strong>
                                        <span className="teacherPortal__meta">{review.reviewer_name ?? "---"}</span>
                                        <Text value={review.what_changed} />
                                        {review.why ? (
                                            <span className="teacherPortal__meta">
                                                <Text value={review.why} />
                                            </span>
                                        ) : null}
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : null}
                </>
            ) : (
                <p className="teacherPortal__empty">Nenhum PAEE registrado para este aluno.</p>
            )}
        </FormSection>
    );
}

function Pei({ pei }: Pick<TeacherPortalStudentShowProps, "pei">): React.JSX.Element {
    return (
        <FormSection id="pei" title="PEI" iconClass="fa fa-map-o" variant="inline">
            {pei ? (
                <>
                    <p className="teacherPortal__empty">
                        Versão v{pei.version}{" "}
                        <TableLabel tone={pei.is_finished ? "success" : "warning"}>
                            {pei.is_finished ? "Finalizado" : "Em preenchimento"}
                        </TableLabel>
                    </p>
                    {pei.disciplines.length ? (
                        <ul className="teacherPortal__list teacherPortal__notice">
                            {pei.disciplines.map((discipline) => (
                                <li key={discipline.id} className="teacherPortal__listItem teacherPortal__discipline">
                                    <div className="teacherPortal__disciplineHeader">
                                        <h4>{discipline.discipline_name ?? "Disciplina não informada"}</h4>
                                        <span className="teacherPortal__meta">
                                            Professor(a): {discipline.teacher_name ?? "---"}
                                        </span>
                                    </div>
                                    <dl className="teacherPortal__grid">
                                        <DetailField label="Objetivos específicos" wide>
                                            <RichTextContent html={discipline.specific_objectives_html} />
                                        </DetailField>
                                        <DetailField label="Conteúdo programático" wide>
                                            <RichTextContent html={discipline.content_programmatic_html} />
                                        </DetailField>
                                        <DetailField label="Metodologias" wide>
                                            <RichTextContent html={discipline.methodologies_html} />
                                        </DetailField>
                                        <DetailField label="Avaliação" wide>
                                            <RichTextContent html={discipline.evaluations_html} />
                                        </DetailField>
                                        {discipline.opinion_html ? (
                                            <DetailField label="Parecer" wide>
                                                <RichTextContent html={discipline.opinion_html} />
                                            </DetailField>
                                        ) : null}
                                    </dl>
                                    {discipline.can_edit ? (
                                        <div className="teacherPortal__disciplineActions">
                                            <Button
                                                href={`${teacherPortalBase}/adaptacoes/${discipline.id}/edit`}
                                                tone="warning"
                                                size="sm"
                                                leftIconClass="fa fa-pencil"
                                                label="Editar minha adaptação"
                                                title={`Editar minha adaptação de ${discipline.discipline_name ?? "disciplina"}`}
                                                aria-label={`Editar minha adaptação de ${discipline.discipline_name ?? "disciplina"}`}
                                            />
                                        </div>
                                    ) : null}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="teacherPortal__empty teacherPortal__notice">
                            Nenhuma adaptação cadastrada ainda neste PEI.
                        </p>
                    )}
                </>
            ) : (
                <p className="teacherPortal__empty">Nenhum PEI registrado para este aluno.</p>
            )}
        </FormSection>
    );
}

export default function TeacherPortalStudentShowPage({
    student,
    status,
    documents,
    caseStudy,
    paee,
    pei,
}: TeacherPortalStudentShowProps): React.JSX.Element {
    const tabs: TabItem[] = [
        { id: "documents", label: "Laudo e Documentos", content: <Documents documents={documents} /> },
        { id: "case-study", label: "Estudo de Caso", content: <CaseStudy caseStudy={caseStudy} /> },
        { id: "paee", label: "PAEE", content: <Paee paee={paee} /> },
        { id: "pei", label: "PEI", content: <Pei pei={pei} /> },
    ];

    return (
        <BusinessPage
            title={student.name}
            subtitle={`Matrícula: ${student.registration ?? "não informada"}`}
            breadcrumbItems={[
                { label: "Portal do Professor", href: teacherPortalBase },
                { label: student.name },
            ]}
            actions={<TableLabel tone="inverse">Modo leitura</TableLabel>}
            className="teacherPortal"
        >
            <InlineAlert variant="info" className="teacherPortal__notice">
                Esta página mostra a situação atual do aluno. Se o Estudo de Caso, o PAEE ou o PEI
                mudarem, é só <Link href="/auth/acesso">gerar um novo link de acesso</Link> a qualquer
                momento para consultar as atualizações ou editar sua adaptação no PEI.
            </InlineAlert>

            <CardBox className="teacherPortal__summaryCard">
                <FormSection id="situacao-do-aluno" title="Situação do aluno" iconClass="fa fa-user" variant="inline">
                    <div className={`teacherPortal__summary${student.photo_url ? "" : " teacherPortal__summary--noPhoto"}`}>
                        {student.photo_url ? (
                            <img src={student.photo_url} alt={`Foto de ${student.name}`} className="teacherPortal__photo" />
                        ) : null}
                        <div>
                            <p className="teacherPortal__summaryName">{student.name}</p>
                            <dl className="teacherPortal__grid teacherPortal__grid--four">
                                <DetailField label="Laudo"><YesNo value={status.has_laudo} /></DetailField>
                                <DetailField label="Estudo de Caso"><YesNo value={status.has_case_study} /></DetailField>
                                <DetailField label="PAEE"><YesNo value={status.has_paee} /></DetailField>
                                <DetailField label="PEI"><YesNo value={status.has_pei} /></DetailField>
                            </dl>
                        </div>
                    </div>
                </FormSection>
            </CardBox>

            <div className="teacherPortal__tabs">
                <Tabs items={tabs} variant="vertical" />
            </div>

            <FormActions>
                <Button
                    href={teacherPortalBase}
                    tone="cancel"
                    label="Voltar"
                    title="Voltar para meus alunos"
                    aria-label="Voltar para meus alunos"
                />
            </FormActions>
        </BusinessPage>
    );
}

TeacherPortalStudentShowPage.layout = (page: ReactNode): ReactNode => (
    <TeacherPortalLayout>{page}</TeacherPortalLayout>
);
