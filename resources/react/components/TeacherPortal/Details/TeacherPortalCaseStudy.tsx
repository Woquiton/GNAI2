import FormSection from '@/components/Forms/FormSection/FormSection';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import type { TeacherPortalCaseStudy as CaseStudy } from '../TeacherPortal.types';
import TeacherPortalRecordList, {
    TeacherPortalEmpty,
    TeacherPortalText,
} from './TeacherPortalRecordList';
import './TeacherPortalDetails.css';

function richText(html: string | null): React.JSX.Element {
    return <RichTextContent html={html || 'Não informado'} />;
}

function CaseStudyContent({ caseStudy }: { caseStudy: CaseStudy }): React.JSX.Element {
    return (
        <>
            <DetailGrid columns={4}>
                <DetailField label="Versão">v{caseStudy.version}</DetailField>
                <DetailField label="Status">{caseStudy.status_label}</DetailField>
                <DetailField label="Semestre">{caseStudy.semester_label ?? '---'}</DetailField>
                <DetailField label="Origem da demanda">{caseStudy.demand_origin_label}</DetailField>
                <DetailField label="Observação do estudante" wide>
                    {richText(caseStudy.student_observation)}
                </DetailField>
                <DetailField label="Escuta do estudante/família" wide>
                    {richText(caseStudy.student_family_listening)}
                </DetailField>
                <DetailField label="Escuta dos professores" wide>
                    {richText(caseStudy.teachers_listening)}
                </DetailField>
            </DetailGrid>
            <DetailGrid>
                <DetailField label="Aspectos favoráveis">
                    {richText(caseStudy.favorable_aspects)}
                </DetailField>
                <DetailField label="Potenciais e interesses">
                    {richText(caseStudy.potentials_interests)}
                </DetailField>
                {caseStudy.other_info ? (
                    <DetailField label="Outras informações" wide>
                        {richText(caseStudy.other_info)}
                    </DetailField>
                ) : null}
            </DetailGrid>

            <TeacherPortalRecordList
                title="Barreiras identificadas"
                items={caseStudy.barriers}
                itemKey={(barrier) => barrier.id}
                renderItem={(barrier) => (
                    <>
                        <strong>{barrier.type_label}:</strong>{' '}
                        <TeacherPortalText value={barrier.observed_situation} />
                        <span className="teacherPortal__meta">
                            Implicação:{' '}
                            <TeacherPortalText value={barrier.participation_implication} />
                        </span>
                    </>
                )}
            />
            <TeacherPortalRecordList
                title="Estratégias"
                items={caseStudy.strategies}
                itemKey={(strategy) => strategy.id}
                renderItem={(strategy) => (
                    <>
                        <TeacherPortalText value={strategy.description} />
                        {strategy.linked_barrier_label ? (
                            <span className="teacherPortal__meta">
                                Relacionada a: {strategy.linked_barrier_label}
                            </span>
                        ) : null}
                    </>
                )}
            />
            <TeacherPortalRecordList
                title="Contribuições"
                items={caseStudy.contributions}
                itemKey={(contribution) => contribution.id}
                renderItem={(contribution) => (
                    <>
                        <strong>{contribution.author_name ?? '---'}</strong>
                        <span className="teacherPortal__meta">
                            {[contribution.role, contribution.created_at]
                                .filter(Boolean)
                                .join(', ')}
                        </span>
                        <TeacherPortalText value={contribution.content} />
                    </>
                )}
            />
        </>
    );
}

/** Aba "Estudo de Caso": versão vigente com escutas, barreiras, estratégias e contribuições. */
export default function TeacherPortalCaseStudy({
    caseStudy,
}: {
    caseStudy: CaseStudy | null;
}): React.JSX.Element {
    return (
        <FormSection
            id="estudo-de-caso"
            title="Estudo de Caso"
            iconClass="fa fa-stethoscope"
            variant="inline"
        >
            {caseStudy ? (
                <CaseStudyContent caseStudy={caseStudy} />
            ) : (
                <TeacherPortalEmpty>
                    Nenhum Estudo de Caso registrado para este aluno.
                </TeacherPortalEmpty>
            )}
        </FormSection>
    );
}
