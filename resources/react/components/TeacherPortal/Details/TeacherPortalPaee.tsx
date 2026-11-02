import FormSection from '@/components/Forms/FormSection/FormSection';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import ExpandableContent from '@/components/UI/ExpandableContent/ExpandableContent';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import type { TeacherPortalPaee as Paee } from '../TeacherPortal.types';
import TeacherPortalRecordList, {
    TeacherPortalEmpty,
    TeacherPortalText,
} from './TeacherPortalRecordList';
import TeacherPortalYesNo from './TeacherPortalYesNo';
import './TeacherPortalDetails.css';

function expandableText(html: string | null): React.JSX.Element {
    return (
        <ExpandableContent>
            <RichTextContent html={html || 'Não informado'} />
        </ExpandableContent>
    );
}

/** Textos longos do PAEE, exibidos somente quando preenchidos. */
function paeeNotes(paee: Paee): Array<{ label: string; html: string | null }> {
    return [
        { label: 'Notas sobre tecnologia assistiva', html: paee.assistive_technology_notes },
        {
            label: 'Orientações aos profissionais da escola',
            html: paee.school_professionals_orientation,
        },
        { label: 'Articulação com professores comuns', html: paee.common_teachers_articulation },
        { label: 'Articulação com a família', html: paee.family_articulation },
    ].filter((note) => Boolean(note.html));
}

function PaeeContent({ paee }: { paee: Paee }): React.JSX.Element {
    const frequency =
        paee.attendance_frequency_per_week !== null
            ? `${paee.attendance_frequency_per_week}x/semana`
            : '---';
    const duration =
        paee.attendance_duration_minutes !== null
            ? `${paee.attendance_duration_minutes} min`
            : '---';

    return (
        <>
            <DetailGrid columns={4}>
                <DetailField label="Versão">v{paee.version}</DetailField>
                <DetailField label="Status">{paee.status_label}</DetailField>
                <DetailField label="Frequência">{frequency}</DetailField>
                <DetailField label="Duração">{duration}</DetailField>
                <DetailField label="Formato">{paee.attendance_format_label}</DetailField>
                <DetailField label="Local">{paee.attendance_location_label}</DetailField>
                <DetailField label="Tecnologia assistiva">
                    <TeacherPortalYesNo value={paee.assistive_technology_needed} />
                </DetailField>
                <DetailField label="Profissional de apoio">
                    <TeacherPortalYesNo value={paee.support_professional_needed} />
                </DetailField>
                {paeeNotes(paee).map((note) => (
                    <DetailField key={note.label} label={note.label} wide>
                        {expandableText(note.html)}
                    </DetailField>
                ))}
            </DetailGrid>

            <TeacherPortalRecordList
                title="Objetivos"
                items={paee.objectives}
                itemKey={(objective) => objective.id}
                renderItem={(objective) => (
                    <>
                        <TeacherPortalText value={objective.description} />
                        <span className="teacherPortal__meta">{objective.term_label}</span>
                    </>
                )}
            />
            <TeacherPortalRecordList
                title="Recursos"
                items={paee.resources}
                itemKey={(resource) => resource.id}
                renderItem={(resource) => (
                    <>
                        <TeacherPortalText value={resource.description} />
                        <span className="teacherPortal__meta">
                            {resource.acquisition_type_label}
                        </span>
                    </>
                )}
            />
            <TeacherPortalRecordList
                title="Revisões"
                items={paee.reviews}
                itemKey={(review) => review.id}
                renderItem={(review) => (
                    <>
                        <strong>{review.reviewed_at ?? '---'}</strong>
                        <span className="teacherPortal__meta">{review.reviewer_name ?? '---'}</span>
                        {expandableText(review.what_changed)}
                        {review.why ? (
                            <div className="teacherPortal__meta">{expandableText(review.why)}</div>
                        ) : null}
                    </>
                )}
            />
        </>
    );
}

/** Aba "PAEE": atendimento, necessidades, orientações, objetivos, recursos e revisões. */
export default function TeacherPortalPaee({ paee }: { paee: Paee | null }): React.JSX.Element {
    return (
        <FormSection id="paee" title="PAEE" iconClass="fa fa-list-alt" variant="inline">
            {paee ? (
                <PaeeContent paee={paee} />
            ) : (
                <TeacherPortalEmpty>Nenhum PAEE registrado para este aluno.</TeacherPortalEmpty>
            )}
        </FormSection>
    );
}
