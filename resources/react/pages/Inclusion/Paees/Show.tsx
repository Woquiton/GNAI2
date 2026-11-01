import type { ReactNode } from "react";
import FormActions from "@/components/Forms/FormActions/FormActions";
import FormSection from "@/components/Forms/FormSection/FormSection";
import BusinessPage from "@/components/Navigation/BusinessPage/BusinessPage";
import StudentRecordReturnButton from "@/components/Students/StudentRecordReturnButton";
import {
    dateLabel,
    studentUrl,
    studentsBase,
} from "@/components/Students/Students.utils";
import { useTableListAction } from "@/components/Tables/TableList/TableList";
import Button from "@/components/UI/Button/Button";
import CardBox from "@/components/UI/CardBox/CardBox";
import ConfirmActionModal from "@/components/UI/ConfirmActionModal/ConfirmActionModal";
import DetailField from "@/components/UI/DetailField/DetailField";
import TableLabel from "@/components/UI/TableLabel/TableLabel";
import PaeeReviewForm from "./PaeeReviewForm";
import type { PaeeShowProps } from "./Paees.types";
import {
    caseStudyUrl,
    paeeStatusTone,
    paeeUrl,
    paeeVersionLabel,
    studentPaeesTab,
} from "./Paees.utils";
import "./Paees.css";

const yesNo = (value: boolean): string => (value ? "Sim" : "Não");

function Text({ children }: { children: string | null }): React.JSX.Element {
    return children
        ? <span className="paeeShow__text">{children}</span>
        : <>Não informado</>;
}

function Empty({ children }: { children: ReactNode }): React.JSX.Element {
    return <p className="paeeShow__empty">{children}</p>;
}

export default function InclusionPaeesShowPage({
    paee,
    student,
    can,
}: PaeeShowProps): React.JSX.Element {
    const version = paeeVersionLabel(paee.version);
    const removal = useTableListAction<number>({
        failureText: "Não foi possível excluir o PAEE. Tente novamente.",
    });

    return (
        <BusinessPage
            title={`PAEE ${version}`}
            subtitle={`Aluno: ${student.name}`}
            breadcrumbItems={[
                { label: "Home", href: "/auth/dashboard" },
                { label: "Alunos", href: studentsBase },
                { label: student.name, href: studentUrl(student.id) },
                { label: `PAEE ${version}` },
            ]}
            className="paeesPage paeeShow"
        >
            <CardBox>
                <FormSection
                    id="paee-details"
                    title="Dados do PAEE"
                    variant="inline"
                    iconClass="fa fa-file-text-o"
                >
                    <dl className="paeeShow__grid">
                        <DetailField label="Status">
                            <TableLabel tone={paeeStatusTone(paee.status)}>
                                {paee.status_label}
                            </TableLabel>
                        </DetailField>
                        <DetailField label="Semestre">
                            {paee.semester_label || "Não informado"}
                        </DetailField>
                        <DetailField label="Elaborado por">
                            {`${paee.creator_name || "Não informado"} em ${dateLabel(paee.created_at)}`}
                        </DetailField>
                        <DetailField label="Estudo de Caso de origem">
                            {paee.case_study ? (
                                can.viewCaseStudy ? (
                                    <a href={caseStudyUrl(paee.case_study.id)}>
                                        {`Estudo de Caso ${paeeVersionLabel(paee.case_study.version)}`}
                                    </a>
                                ) : `Estudo de Caso ${paeeVersionLabel(paee.case_study.version)}`
                            ) : "Não informado"}
                        </DetailField>
                        <DetailField label="Frequência semanal">
                            {paee.attendance_frequency_per_week == null ? "Não informado" : `${paee.attendance_frequency_per_week}x`}
                        </DetailField>
                        <DetailField label="Duração">
                            {paee.attendance_duration_minutes == null ? "Não informado" : `${paee.attendance_duration_minutes} min`}
                        </DetailField>
                        <DetailField label="Formato">
                            {paee.attendance_format_label}
                        </DetailField>
                        <DetailField label="Local">
                            {paee.attendance_location_label}
                        </DetailField>
                        <DetailField label="Próxima revisão">
                            {dateLabel(paee.next_review_date)}
                        </DetailField>
                    </dl>
                </FormSection>

                <FormSection
                    id="paee-assistive-technology"
                    title="Tecnologia Assistiva e CAA"
                    variant="inline"
                    iconClass="fa fa-wheelchair"
                >
                    <dl className="paeeShow__grid paeeShow__grid--3">
                        <DetailField label="Necessita TA">
                            {yesNo(paee.assistive_technology_needed)}
                        </DetailField>
                        <DetailField label="Necessita CAA">
                            {yesNo(paee.caa_needed)}
                        </DetailField>
                        <DetailField label="TA é dispositivo digital portátil">
                            {yesNo(paee.is_assistive_technology_portable_digital_device)}
                        </DetailField>
                        <DetailField label="Observações TA">
                            <Text>{paee.assistive_technology_notes}</Text>
                        </DetailField>
                        <DetailField label="Observações CAA">
                            <Text>{paee.caa_notes}</Text>
                        </DetailField>
                        <DetailField label="Capacidade de disponibilização" wide>
                            <Text>{paee.assistive_technology_availability_capacity}</Text>
                        </DetailField>
                        {paee.is_assistive_technology_portable_digital_device ? (
                            <DetailField label="Parecer pedagógico (TA portátil)" wide>
                                <Text>{paee.assistive_technology_pedagogical_opinion}</Text>
                            </DetailField>
                        ) : null}
                    </dl>
                </FormSection>

                <FormSection
                    id="paee-supports"
                    title="Apoios de Profissionais"
                    variant="inline"
                    iconClass="fa fa-users"
                >
                    <dl className="paeeShow__grid paeeShow__grid--3">
                        <DetailField label="Profissional de apoio">
                            {yesNo(paee.support_professional_needed)}
                        </DetailField>
                        <DetailField label="Intérprete de Libras">
                            {yesNo(paee.libras_interpreter_needed)}
                        </DetailField>
                        <DetailField label="Guia-intérprete">
                            {yesNo(paee.guide_interpreter_needed)}
                        </DetailField>
                        {paee.support_professional_needed ? (
                            <DetailField label="Justificativa (apoio)" wide>
                                <Text>{paee.support_professional_justification}</Text>
                            </DetailField>
                        ) : null}
                        {paee.libras_interpreter_needed ? (
                            <DetailField label="Justificativa (Libras)" wide>
                                <Text>{paee.libras_interpreter_justification}</Text>
                            </DetailField>
                        ) : null}
                        {paee.guide_interpreter_needed ? (
                            <DetailField label="Justificativa (guia-intérprete)" wide>
                                <Text>{paee.guide_interpreter_justification}</Text>
                            </DetailField>
                        ) : null}
                    </dl>
                </FormSection>

                <FormSection
                    id="paee-objectives"
                    title="Objetivos"
                    variant="inline"
                    iconClass="fa fa-bullseye"
                >
                    {paee.objectives.length ? (
                        <ul className="paeeShow__items">
                            {paee.objectives.map((objective) => (
                                <li key={objective.id}>
                                    <p>{objective.description}</p>
                                    <small className="paeeShow__meta">Prazo: {objective.term_label}</small>
                                    {objective.linked_barrier ? (
                                        <small className="paeeShow__meta">
                                            Barreira vinculada: {objective.linked_barrier.type_label}
                                            {objective.linked_barrier.observed_situation
                                                ? `, ${objective.linked_barrier.observed_situation}`
                                                : ""}
                                        </small>
                                    ) : null}
                                </li>
                            ))}
                        </ul>
                    ) : <Empty>Nenhum objetivo registrado.</Empty>}
                </FormSection>

                <FormSection
                    id="paee-resources"
                    title="Recursos"
                    variant="inline"
                    iconClass="fa fa-cubes"
                >
                    {paee.resources.length ? (
                        <ul className="paeeShow__items">
                            {paee.resources.map((resource) => (
                                <li key={resource.id}>
                                    <p>{resource.description}</p>
                                    <small className="paeeShow__meta">Tipo: {resource.acquisition_type_label}</small>
                                    {resource.assistive_technology_name ? (
                                        <small className="paeeShow__meta">
                                            Tecnologia assistiva: {resource.assistive_technology_name}
                                        </small>
                                    ) : null}
                                </li>
                            ))}
                        </ul>
                    ) : <Empty>Nenhum recurso registrado.</Empty>}
                </FormSection>

                <FormSection
                    id="paee-articulations"
                    title="Articulações e Orientações"
                    variant="inline"
                    iconClass="fa fa-handshake-o"
                >
                    <dl className="paeeShow__grid paeeShow__grid--2">
                        <DetailField label="Orientação aos profissionais da escola">
                            <Text>{paee.school_professionals_orientation}</Text>
                        </DetailField>
                        <DetailField label="Articulação com professores do ensino comum">
                            <Text>{paee.common_teachers_articulation}</Text>
                        </DetailField>
                        <DetailField label="Como a família será envolvida">
                            <Text>{paee.family_articulation}</Text>
                        </DetailField>
                        <DetailField label="Articulação intersetorial">
                            <Text>{paee.intersectoral_articulation}</Text>
                        </DetailField>
                        <DetailField label="Demandas de formação" wide>
                            <Text>{paee.training_demands}</Text>
                        </DetailField>
                    </dl>
                </FormSection>

                <FormSection
                    id="paee-reviews"
                    title="Revisões"
                    variant="inline"
                    iconClass="fa fa-history"
                >
                    {paee.reviews.length ? (
                        <ul className="paeeShow__items">
                            {paee.reviews.map((review) => (
                                <li key={review.id}>
                                    <strong>
                                        {`${dateLabel(review.reviewed_at)}, ${review.reviewer_name || "Não informado"}`}
                                    </strong>
                                    <p>{review.what_changed}</p>
                                    <small className="paeeShow__meta">{review.why}</small>
                                </li>
                            ))}
                        </ul>
                    ) : <Empty>Nenhuma revisão registrada.</Empty>}
                    {can.update ? <PaeeReviewForm paeeId={paee.id} /> : null}
                </FormSection>
            </CardBox>
            <FormActions
                secondary={
                    <Button
                        href={paeeUrl(paee.id, "pdf")}
                        target="_blank"
                        rel="noopener noreferrer"
                        tone="dark-red"
                        leftIconClass="fa fa-file-pdf-o"
                        label="PDF"
                        title="Gerar PDF do PAEE"
                        aria-label="Gerar PDF do PAEE"
                    />
                }
            >
                <StudentRecordReturnButton
                    studentId={student.id}
                    tab={studentPaeesTab}
                />
                {can.update ? (
                    <Button
                        href={paeeUrl(paee.id, "edit")}
                        tone="warning"
                        leftIconClass="fa fa-pencil"
                        label="Editar"
                        aria-label="Editar PAEE"
                    />
                ) : null}
                {can.delete ? (
                    <Button
                        type="button"
                        tone="dark-red"
                        leftIconClass="fa fa-trash-o"
                        label="Excluir"
                        aria-label="Excluir PAEE"
                        disabled={removal.processing}
                        onClick={() => removal.open(paee.id)}
                    />
                ) : null}
            </FormActions>
            {can.delete ? (
                <ConfirmActionModal
                    open={removal.target !== null}
                    title="Excluir PAEE"
                    message="Deseja remover este PAEE? Objetivos, recursos e revisões também serão excluídos."
                    details={<strong>{`PAEE ${version} de ${student.name}`}</strong>}
                    processing={removal.processing}
                    confirmLabel="Confirmar exclusão"
                    processingLabel="Excluindo PAEE..."
                    confirmTone="dark-red"
                    onClose={removal.close}
                    onConfirm={() => removal.submit("delete", paeeUrl(paee.id, ""))}
                />
            ) : null}
        </BusinessPage>
    );
}
