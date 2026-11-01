import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import ExpandableContent from '@/components/UI/ExpandableContent/ExpandableContent';
import RecordSummary from '@/components/UI/RecordSummary/RecordSummary';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { dateLabel, dateTimeLabel } from '@/utils/formatters';
import type { CaseStudyDetail, CaseStudyShowProps } from '../CaseStudies.types';
import CaseStudyContributionForm from './CaseStudyContributionForm';
import CaseStudyEntryList, { CaseStudyEntryMeta, CaseStudyEntryText } from './CaseStudyEntryList';

type CaseStudyBarrier = CaseStudyDetail['barriers'][number];
type CaseStudyStrategy = CaseStudyDetail['strategies'][number];
type CaseStudyContribution = CaseStudyDetail['contributions'][number];

/** Texto rico sanitizado pelo servidor, recolhível quando extenso. */
function richText(html: string | null): React.JSX.Element {
    return (
        <ExpandableContent>
            <RichTextContent html={html || 'Não informado'} />
        </ExpandableContent>
    );
}

function renderBarrier(barrier: CaseStudyBarrier): React.JSX.Element {
    return (
        <>
            <strong>{barrier.type_label}</strong>
            <CaseStudyEntryText>{barrier.observed_situation}</CaseStudyEntryText>
            <CaseStudyEntryMeta>Implicação: {barrier.participation_implication}</CaseStudyEntryMeta>
        </>
    );
}

function renderStrategy(strategy: CaseStudyStrategy): React.JSX.Element {
    return (
        <>
            <CaseStudyEntryText>{strategy.description}</CaseStudyEntryText>
            {strategy.linked_barrier_label ? (
                <CaseStudyEntryMeta>
                    Relacionada à barreira: {strategy.linked_barrier_label}
                </CaseStudyEntryMeta>
            ) : null}
        </>
    );
}

function renderContribution(contribution: CaseStudyContribution): React.JSX.Element {
    return (
        <>
            <span>
                <strong>{contribution.author_name || 'Usuário removido'}</strong>{' '}
                <CaseStudyEntryMeta>({contribution.role})</CaseStudyEntryMeta>
            </span>
            <CaseStudyEntryText>{contribution.content}</CaseStudyEntryText>
            <CaseStudyEntryMeta>{dateTimeLabel(contribution.created_at)}</CaseStudyEntryMeta>
        </>
    );
}

/** Visualização do Estudo de Caso: identificação, seções do estudo, registros e contribuições. */
export default function CaseStudyDetails({
    student,
    caseStudy,
    can,
}: CaseStudyShowProps): React.JSX.Element {
    const studentPhoto = {
        src: student.photo_url || '/images/default-user.jpg',
        alt: `Foto de ${student.name}`,
    };

    return (
        <CardBox>
            <FormSection
                id="case-study-identification"
                title="Identificação do Estudo de Caso"
                iconClass="fa fa-clipboard"
                variant="inline"
            >
                <RecordSummary photo={studentPhoto} name={student.name}>
                    <DetailField label="Matrícula">
                        {student.registration || 'Não informado'}
                    </DetailField>
                    <DetailField label="Versão">
                        <strong>v{caseStudy.version}</strong>
                    </DetailField>
                    <DetailField label="Status">
                        <TableLabel tone={caseStudy.status_tone}>
                            {caseStudy.status_label}
                        </TableLabel>
                    </DetailField>
                    <DetailField label="Semestre">
                        {caseStudy.semester_label || 'Não informado'}
                    </DetailField>
                </RecordSummary>
            </FormSection>
            <FormSection
                id="case-study-demand"
                title="Identificação da Demanda"
                iconClass="fa fa-bullhorn"
                variant="inline"
            >
                <DetailGrid>
                    <DetailField label="Origem da demanda">
                        {caseStudy.demand_origin_label}
                    </DetailField>
                    <DetailField label="Data do Estudo de Caso">
                        {dateLabel(caseStudy.study_date)}
                    </DetailField>
                    <DetailField label="Criador">
                        {caseStudy.creator_name || 'Não informado'}
                    </DetailField>
                    <DetailField label="Participantes (resumo)" wide>
                        {richText(caseStudy.participants_summary)}
                    </DetailField>
                </DetailGrid>
            </FormSection>
            <FormSection
                id="case-study-listening"
                title="Escuta e Observação"
                iconClass="fa fa-comments-o"
                variant="inline"
            >
                <DetailGrid>
                    <DetailField label="Observação do estudante" wide>
                        {richText(caseStudy.student_observation)}
                    </DetailField>
                    <DetailField label="Escuta do estudante/família" wide>
                        {richText(caseStudy.student_family_listening)}
                    </DetailField>
                    <DetailField label="Escuta dos professores" wide>
                        {richText(caseStudy.teachers_listening)}
                    </DetailField>
                    <DetailField label="Outras informações">
                        {richText(caseStudy.other_info)}
                    </DetailField>
                    <DetailField label="Observações da rede de cuidado">
                        {richText(caseStudy.care_network_notes)}
                    </DetailField>
                </DetailGrid>
            </FormSection>
            <FormSection
                id="case-study-potentials"
                title="Potencialidades e Apoios"
                iconClass="fa fa-star-o"
                variant="inline"
            >
                <DetailGrid>
                    <DetailField label="Aspectos favoráveis">
                        {richText(caseStudy.favorable_aspects)}
                    </DetailField>
                    <DetailField label="Potenciais e interesses">
                        {richText(caseStudy.potentials_interests)}
                    </DetailField>
                    <DetailField label="Apoios necessários" wide>
                        {caseStudy.needed_supports_label || 'Não informado'}
                    </DetailField>
                    <DetailField label="Justificativa dos apoios necessários" wide>
                        {richText(caseStudy.needed_supports_justification)}
                    </DetailField>
                </DetailGrid>
            </FormSection>
            <FormSection
                id="case-study-acceptance"
                title="Aceite da Família/Estudante"
                iconClass="fa fa-thumbs-o-up"
                variant="inline"
            >
                <DetailGrid>
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
                </DetailGrid>
            </FormSection>
            <FormSection
                id="case-study-barriers"
                title="Barreiras"
                iconClass="fa fa-ban"
                variant="inline"
            >
                <CaseStudyEntryList
                    items={caseStudy.barriers}
                    itemKey={(barrier) => barrier.id}
                    renderItem={renderBarrier}
                    emptyMessage="Nenhuma barreira registrada."
                />
            </FormSection>
            <FormSection
                id="case-study-strategies"
                title="Estratégias"
                iconClass="fa fa-lightbulb-o"
                variant="inline"
            >
                <CaseStudyEntryList
                    items={caseStudy.strategies}
                    itemKey={(strategy) => strategy.id}
                    renderItem={renderStrategy}
                    emptyMessage="Nenhuma estratégia registrada."
                />
            </FormSection>
            <FormSection
                id="case-study-contributions"
                title="Contribuições"
                iconClass="fa fa-users"
                variant="inline"
            >
                <CaseStudyEntryList
                    items={caseStudy.contributions}
                    itemKey={(contribution) => contribution.id}
                    renderItem={renderContribution}
                    emptyMessage="Nenhuma contribuição registrada."
                />
                {can.contribute ? <CaseStudyContributionForm caseStudyId={caseStudy.id} /> : null}
            </FormSection>
        </CardBox>
    );
}
