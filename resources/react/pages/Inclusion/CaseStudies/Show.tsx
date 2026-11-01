import FormActions from "@/components/Forms/FormActions/FormActions";
import FormSection from "@/components/Forms/FormSection/FormSection";
import BusinessPage from "@/components/Navigation/BusinessPage/BusinessPage";
import Tabs, { type TabItem } from "@/components/Navigation/Tabs/Tabs";
import StudentRecordReturnButton from "@/components/Students/StudentRecordReturnButton";
import {
    dateLabel,
    dateTimeLabel,
    studentRecordUrl,
    studentsBase,
} from "@/components/Students/Students.utils";
import Button from "@/components/UI/Button/Button";
import CardBox from "@/components/UI/CardBox/CardBox";
import DetailField from "@/components/UI/DetailField/DetailField";
import TableLabel from "@/components/UI/TableLabel/TableLabel";
import CaseStudyConfirmAction from "./CaseStudyConfirmAction";
import CaseStudyContributionForm from "./CaseStudyContributionForm";
import {
    caseStudiesTab,
    caseStudyUrl,
    createPaeeUrl,
} from "./caseStudies.utils";
import type { CaseStudyShowProps } from "./CaseStudies.types";
import "@/components/Students/Students.css";
import "./CaseStudyShow.css";

/** Texto simples com as quebras de linha digitadas no formulário. */
function PlainText({
    value,
}: {
    value: string | null | undefined;
}): React.JSX.Element {
    return value?.trim()
        ? <span className="caseStudyShow__text">{value}</span>
        : <>Não informado</>;
}

export default function InclusionCaseStudiesShowPage({
    student,
    caseStudy,
    can,
}: CaseStudyShowProps): React.JSX.Element {
    const title = `Estudo de Caso v${caseStudy.version}`;
    const status = (
        <TableLabel tone={caseStudy.status_tone}>
            {caseStudy.status_label}
        </TableLabel>
    );
    const tabs: TabItem[] = [
        {
            id: "details",
            label: "Dados do estudo",
            icon: "fa fa-file-text-o",
            content: (
                <div className="caseStudyShow__sections">
                    <FormSection
                        id="case-study-demand"
                        title="Identificação da Demanda"
                        iconClass="fa fa-bullhorn"
                        variant="inline"
                    >
                        <dl className="caseStudyShow__grid">
                            <DetailField label="Origem da demanda">
                                {caseStudy.demand_origin_label}
                            </DetailField>
                            <DetailField label="Data do Estudo de Caso">
                                {dateLabel(caseStudy.study_date)}
                            </DetailField>
                            <DetailField label="Criador">
                                {caseStudy.creator_name || "Não informado"}
                            </DetailField>
                            <DetailField label="Participantes (resumo)" wide>
                                <PlainText value={caseStudy.participants_summary} />
                            </DetailField>
                        </dl>
                    </FormSection>
                    <FormSection
                        id="case-study-listening"
                        title="Escuta e Observação"
                        iconClass="fa fa-comments-o"
                        variant="inline"
                    >
                        <dl className="caseStudyShow__grid">
                            <DetailField label="Observação do estudante" wide>
                                <PlainText value={caseStudy.student_observation} />
                            </DetailField>
                            <DetailField label="Escuta do estudante/família" wide>
                                <PlainText value={caseStudy.student_family_listening} />
                            </DetailField>
                            <DetailField label="Escuta dos professores" wide>
                                <PlainText value={caseStudy.teachers_listening} />
                            </DetailField>
                            <DetailField label="Outras informações">
                                <PlainText value={caseStudy.other_info} />
                            </DetailField>
                            <DetailField label="Observações da rede de cuidado">
                                <PlainText value={caseStudy.care_network_notes} />
                            </DetailField>
                        </dl>
                    </FormSection>
                    <FormSection
                        id="case-study-potentials"
                        title="Potencialidades e Apoios"
                        iconClass="fa fa-star-o"
                        variant="inline"
                    >
                        <dl className="caseStudyShow__grid">
                            <DetailField label="Aspectos favoráveis">
                                <PlainText value={caseStudy.favorable_aspects} />
                            </DetailField>
                            <DetailField label="Potenciais e interesses">
                                <PlainText value={caseStudy.potentials_interests} />
                            </DetailField>
                            <DetailField label="Apoios necessários" wide>
                                {caseStudy.needed_supports_label || "Não informado"}
                            </DetailField>
                            <DetailField label="Justificativa dos apoios necessários" wide>
                                <PlainText value={caseStudy.needed_supports_justification} />
                            </DetailField>
                        </dl>
                    </FormSection>
                    <FormSection
                        id="case-study-acceptance"
                        title="Aceite da Família/Estudante"
                        iconClass="fa fa-thumbs-o-up"
                        variant="inline"
                    >
                        <dl className="caseStudyShow__grid">
                            <DetailField label="Status de aceite">
                                {caseStudy.acceptance_status_label}
                            </DetailField>
                            <DetailField label="Data do aceite">
                                {dateLabel(caseStudy.acceptance_date)}
                            </DetailField>
                            {caseStudy.completed_at ? (
                                <DetailField label="Concluído em">
                                    {dateTimeLabel(caseStudy.completed_at)}
                                </DetailField>
                            ) : null}
                        </dl>
                    </FormSection>
                </div>
            ),
        },
        {
            id: "barriers",
            label: "Barreiras e estratégias",
            icon: "fa fa-ban",
            content: (
                <div className="caseStudyShow__sections">
                    <FormSection
                        id="case-study-barriers"
                        title="Barreiras"
                        iconClass="fa fa-ban"
                        variant="inline"
                    >
                        {caseStudy.barriers.length ? (
                            <ul className="caseStudyShow__entries">
                                {caseStudy.barriers.map((barrier) => (
                                    <li key={barrier.id} className="caseStudyShow__entry">
                                        <strong>{barrier.type_label}</strong>
                                        <p className="caseStudyShow__text">{barrier.observed_situation}</p>
                                        <small className="caseStudyShow__meta">
                                            Implicação: <span className="caseStudyShow__text">{barrier.participation_implication}</span>
                                        </small>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="caseStudyShow__empty">Nenhuma barreira registrada.</p>
                        )}
                    </FormSection>
                    <FormSection
                        id="case-study-strategies"
                        title="Estratégias"
                        iconClass="fa fa-lightbulb-o"
                        variant="inline"
                    >
                        {caseStudy.strategies.length ? (
                            <ul className="caseStudyShow__entries">
                                {caseStudy.strategies.map((strategy) => (
                                    <li key={strategy.id} className="caseStudyShow__entry">
                                        <p className="caseStudyShow__text">{strategy.description}</p>
                                        {strategy.linked_barrier_label ? (
                                            <small className="caseStudyShow__meta">
                                                Relacionada à barreira: {strategy.linked_barrier_label}
                                            </small>
                                        ) : null}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="caseStudyShow__empty">Nenhuma estratégia registrada.</p>
                        )}
                    </FormSection>
                </div>
            ),
        },
        {
            id: "contributions",
            label: "Contribuições",
            icon: "fa fa-users",
            content: (
                <FormSection
                    id="case-study-contributions"
                    title="Contribuições"
                    iconClass="fa fa-users"
                    variant="inline"
                >
                    {caseStudy.contributions.length ? (
                        <ul className="caseStudyShow__entries">
                            {caseStudy.contributions.map((contribution) => (
                                <li key={contribution.id} className="caseStudyShow__entry">
                                    <span>
                                        <strong>{contribution.author_name || "Usuário removido"}</strong>
                                        {" "}
                                        <span className="caseStudyShow__meta">({contribution.role})</span>
                                    </span>
                                    <p className="caseStudyShow__text">{contribution.content}</p>
                                    <small className="caseStudyShow__meta">
                                        {dateTimeLabel(contribution.created_at)}
                                    </small>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="caseStudyShow__empty">Nenhuma contribuição registrada.</p>
                    )}
                    {can.contribute ? (
                        <CaseStudyContributionForm caseStudyId={caseStudy.id} />
                    ) : null}
                </FormSection>
            ),
        },
    ];

    return (
        <BusinessPage
            title={title}
            subtitle={`Aluno: ${student.name}`}
            breadcrumbItems={[
                { label: "Home", href: "/auth/dashboard" },
                { label: "Alunos", href: studentsBase },
                { label: student.name, href: studentRecordUrl(student.id, caseStudiesTab) },
                { label: title },
            ]}
            className="studentsPage caseStudyShow"
        >
            <CardBox className="studentsPage__summaryCard">
                <FormSection
                    id="case-study-identification"
                    title="Identificação do Estudo de Caso"
                    iconClass="fa fa-clipboard"
                    variant="inline"
                >
                    <div className="studentsPage__summary">
                        <img
                            src={student.photo_url || "/images/default-user.jpg"}
                            alt={`Foto de ${student.name}`}
                            className="studentsPage__summaryPhoto"
                        />
                        <div className="studentsPage__summaryBody">
                            <p className="studentsPage__summaryName">{student.name}</p>
                            <dl className="caseStudyShow__summaryDetails">
                                <DetailField label="Matrícula">
                                    {student.registration || "Não informado"}
                                </DetailField>
                                <DetailField label="Versão">
                                    <strong>v{caseStudy.version}</strong>
                                </DetailField>
                                <DetailField label="Status">
                                    {status}
                                </DetailField>
                                <DetailField label="Semestre">
                                    {caseStudy.semester_label || "Não informado"}
                                </DetailField>
                            </dl>
                        </div>
                    </div>
                </FormSection>
            </CardBox>
            <div className="studentsPage__recordTabs">
                <Tabs
                    items={tabs}
                    initialActiveId="details"
                    variant="vertical"
                />
            </div>
            <FormActions
                secondary={can.pdf ? (
                    <Button
                        href={caseStudyUrl(caseStudy.id, "pdf")}
                        target="_blank"
                        rel="noopener noreferrer"
                        tone="dark-red"
                        leftIconClass="fa fa-file-pdf-o"
                        label="PDF"
                        title="Gerar PDF do Estudo de Caso"
                        aria-label="Gerar PDF do Estudo de Caso"
                    />
                ) : undefined}
            >
                <StudentRecordReturnButton
                    studentId={student.id}
                    tab={caseStudiesTab}
                />
                {can.update ? (
                    <Button
                        href={caseStudyUrl(caseStudy.id, "edit")}
                        tone="warning"
                        leftIconClass="fa fa-pencil"
                        label="Editar"
                        aria-label="Editar Estudo de Caso"
                    />
                ) : null}
                {can.complete ? (
                    <CaseStudyConfirmAction
                        method="patch"
                        action={caseStudyUrl(caseStudy.id, "complete")}
                        label="Concluir"
                        ariaLabel="Concluir Estudo de Caso"
                        tone="success"
                        iconClass="fa fa-check-circle"
                        modalTitle="Concluir Estudo de Caso"
                        message="Concluir este Estudo de Caso? Essa ação libera a criação do PAEE e impede novas edições."
                        confirmLabel="Confirmar conclusão"
                        processingLabel="Concluindo Estudo de Caso..."
                        failureText="Não foi possível concluir o Estudo de Caso. Tente novamente."
                    />
                ) : null}
                {can.createPaee ? (
                    <Button
                        href={createPaeeUrl(caseStudy.id)}
                        tone="success"
                        leftIconClass="fa fa-plus"
                        label="Criar PAEE"
                        aria-label="Criar PAEE a partir deste Estudo de Caso"
                    />
                ) : null}
                {can.delete ? (
                    <CaseStudyConfirmAction
                        method="delete"
                        action={caseStudyUrl(caseStudy.id, "")}
                        label="Excluir"
                        ariaLabel="Excluir Estudo de Caso"
                        tone="dark-red"
                        iconClass="fa fa-trash-o"
                        modalTitle="Excluir Estudo de Caso"
                        message="Excluir permanentemente este Estudo de Caso?"
                        confirmLabel="Confirmar exclusão"
                        processingLabel="Excluindo Estudo de Caso..."
                        failureText="Não foi possível excluir o Estudo de Caso. Tente novamente."
                    />
                ) : null}
            </FormActions>
        </BusinessPage>
    );
}
