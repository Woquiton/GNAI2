import FormSection from '@/components/Forms/FormSection/FormSection';
import Button from '@/components/UI/Button/Button';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { teacherPortalUrls } from '../TeacherPortal.routes';
import type { TeacherPortalPei as Pei, TeacherPortalPeiDiscipline } from '../TeacherPortal.types';
import TeacherPortalRecordList, { TeacherPortalEmpty } from './TeacherPortalRecordList';
import '@styles/components/TeacherPortal/Details/TeacherPortalDetails.css';

function PeiDiscipline({
    discipline,
}: {
    discipline: TeacherPortalPeiDiscipline;
}): React.JSX.Element {
    const editLabel = `Editar minha adaptação de ${discipline.discipline_name ?? 'disciplina'}`;

    return (
        <>
            <div className="teacherPortal__disciplineHeader">
                <h4>{discipline.discipline_name ?? 'Disciplina não informada'}</h4>
                <span className="teacherPortal__meta">
                    Professor(a): {discipline.teacher_name ?? '---'}
                </span>
            </div>
            <DetailGrid>
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
            </DetailGrid>
            {discipline.can_edit ? (
                <div className="teacherPortal__disciplineActions">
                    <Button
                        href={teacherPortalUrls.editDiscipline(discipline.id)}
                        tone="warning"
                        size="sm"
                        leftIconClass="fa fa-pencil"
                        label="Editar minha adaptação"
                        title={editLabel}
                        aria-label={editLabel}
                    />
                </div>
            ) : null}
        </>
    );
}

function PeiContent({ pei }: { pei: Pei }): React.JSX.Element {
    return (
        <>
            <TeacherPortalEmpty>
                Versão v{pei.version}{' '}
                <TableLabel tone={pei.is_finished ? 'success' : 'warning'}>
                    {pei.is_finished ? 'Finalizado' : 'Em preenchimento'}
                </TableLabel>
            </TeacherPortalEmpty>
            {pei.disciplines.length ? (
                <TeacherPortalRecordList
                    items={pei.disciplines}
                    itemKey={(discipline) => discipline.id}
                    className="teacherPortal__notice"
                    itemClassName="teacherPortal__discipline"
                    renderItem={(discipline) => <PeiDiscipline discipline={discipline} />}
                />
            ) : (
                <TeacherPortalEmpty className="teacherPortal__notice">
                    Nenhuma adaptação cadastrada ainda neste PEI.
                </TeacherPortalEmpty>
            )}
        </>
    );
}

/** Aba "PEI": versão vigente e as adaptações de cada disciplina, com edição da própria. */
export default function TeacherPortalPei({ pei }: { pei: Pei | null }): React.JSX.Element {
    return (
        <FormSection id="pei" title="PEI" iconClass="fa fa-map-o" variant="inline">
            {pei ? (
                <PeiContent pei={pei} />
            ) : (
                <TeacherPortalEmpty>Nenhum PEI registrado para este aluno.</TeacherPortalEmpty>
            )}
        </FormSection>
    );
}
