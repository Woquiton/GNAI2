import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import ExpandableContent from '@/components/UI/ExpandableContent/ExpandableContent';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { dateLabel } from '@/utils/formatters';
import { PAEE_NOT_INFORMED, paeeStatusTone, paeeVersionLabel } from '../Paees.constants';
import { paeeUrls } from '../Paees.routes';
import type { PaeeShowProps, PaeeShowRecord } from '../Paees.types';
import PaeeEntryList from './PaeeEntryList';
import PaeeReviews from './PaeeReviews';

type PaeeDetailsProps = Pick<PaeeShowProps, 'paee' | 'can'>;
type PaeeObjective = PaeeShowRecord['objectives'][number];
type PaeeResource = PaeeShowRecord['resources'][number];

const yesNo = (value: boolean): string => (value ? 'Sim' : 'Não');

/** Texto rico já sanitizado pelo servidor, recolhido quando extenso. */
function richText(html: string | null): React.JSX.Element {
    return (
        <ExpandableContent>
            <RichTextContent html={html || PAEE_NOT_INFORMED} />
        </ExpandableContent>
    );
}

function quantityLabel(value: number | null, suffix: string): string {
    return value == null ? PAEE_NOT_INFORMED : `${value}${suffix}`;
}

function linkedBarrierLabel(barrier: NonNullable<PaeeObjective['linked_barrier']>): string {
    return barrier.observed_situation
        ? `${barrier.type_label}, ${barrier.observed_situation}`
        : barrier.type_label;
}

function renderObjective(objective: PaeeObjective): React.JSX.Element {
    return (
        <DetailGrid>
            <DetailField label="Descrição" wide preserveLineBreaks>
                {objective.description}
            </DetailField>
            <DetailField label="Prazo">{objective.term_label}</DetailField>
            {objective.linked_barrier ? (
                <DetailField label="Barreira vinculada">
                    {linkedBarrierLabel(objective.linked_barrier)}
                </DetailField>
            ) : null}
        </DetailGrid>
    );
}

function renderResource(resource: PaeeResource): React.JSX.Element {
    return (
        <DetailGrid>
            <DetailField label="Descrição" wide preserveLineBreaks>
                {resource.description}
            </DetailField>
            <DetailField label="Tipo">{resource.acquisition_type_label}</DetailField>
            {resource.assistive_technology_name ? (
                <DetailField label="Tecnologia assistiva">
                    {resource.assistive_technology_name}
                </DetailField>
            ) : null}
        </DetailGrid>
    );
}

/** Dados, apoios, objetivos, recursos, articulações e revisões de um PAEE. */
export default function PaeeDetails({ paee, can }: PaeeDetailsProps): React.JSX.Element {
    const caseStudyLabel = paee.case_study
        ? `Estudo de Caso ${paeeVersionLabel(paee.case_study.version)}`
        : PAEE_NOT_INFORMED;
    const caseStudy =
        paee.case_study && can.viewCaseStudy ? (
            <a href={paeeUrls.caseStudy(paee.case_study.id)}>{caseStudyLabel}</a>
        ) : (
            caseStudyLabel
        );
    const creator = `${paee.creator_name || PAEE_NOT_INFORMED} em ${dateLabel(paee.created_at)}`;

    return (
        <CardBox>
            <FormSection
                id="paee-details"
                title="Dados do PAEE"
                variant="inline"
                iconClass="fa fa-file-text-o"
            >
                <DetailGrid columns={4}>
                    <DetailField label="Status">
                        <TableLabel tone={paeeStatusTone(paee.status)}>
                            {paee.status_label}
                        </TableLabel>
                    </DetailField>
                    <DetailField label="Semestre">
                        {paee.semester_label || PAEE_NOT_INFORMED}
                    </DetailField>
                    <DetailField label="Elaborado por">{creator}</DetailField>
                    <DetailField label="Estudo de Caso de origem">{caseStudy}</DetailField>
                    <DetailField label="Frequência semanal">
                        {quantityLabel(paee.attendance_frequency_per_week, 'x')}
                    </DetailField>
                    <DetailField label="Duração">
                        {quantityLabel(paee.attendance_duration_minutes, ' min')}
                    </DetailField>
                    <DetailField label="Formato">{paee.attendance_format_label}</DetailField>
                    <DetailField label="Local">{paee.attendance_location_label}</DetailField>
                    <DetailField label="Próxima revisão">
                        {dateLabel(paee.next_review_date)}
                    </DetailField>
                </DetailGrid>
            </FormSection>

            <FormSection
                id="paee-assistive-technology"
                title="Tecnologia Assistiva e CAA"
                variant="inline"
                iconClass="fa fa-wheelchair"
            >
                <DetailGrid columns={3}>
                    <DetailField label="Necessita TA">
                        {yesNo(paee.assistive_technology_needed)}
                    </DetailField>
                    <DetailField label="Necessita CAA">{yesNo(paee.caa_needed)}</DetailField>
                    <DetailField label="TA é dispositivo digital portátil">
                        {yesNo(paee.is_assistive_technology_portable_digital_device)}
                    </DetailField>
                    <DetailField label="Observações TA">
                        {richText(paee.assistive_technology_notes)}
                    </DetailField>
                    <DetailField label="Observações CAA">{richText(paee.caa_notes)}</DetailField>
                    <DetailField label="Capacidade de disponibilização" wide>
                        {richText(paee.assistive_technology_availability_capacity)}
                    </DetailField>
                    {paee.is_assistive_technology_portable_digital_device ? (
                        <DetailField label="Parecer pedagógico (TA portátil)" wide>
                            {richText(paee.assistive_technology_pedagogical_opinion)}
                        </DetailField>
                    ) : null}
                </DetailGrid>
            </FormSection>

            <FormSection
                id="paee-supports"
                title="Apoios de Profissionais"
                variant="inline"
                iconClass="fa fa-users"
            >
                <DetailGrid columns={3}>
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
                            {richText(paee.support_professional_justification)}
                        </DetailField>
                    ) : null}
                    {paee.libras_interpreter_needed ? (
                        <DetailField label="Justificativa (Libras)" wide>
                            {richText(paee.libras_interpreter_justification)}
                        </DetailField>
                    ) : null}
                    {paee.guide_interpreter_needed ? (
                        <DetailField label="Justificativa (guia-intérprete)" wide>
                            {richText(paee.guide_interpreter_justification)}
                        </DetailField>
                    ) : null}
                </DetailGrid>
            </FormSection>

            <FormSection
                id="paee-objectives"
                title="Objetivos"
                variant="inline"
                iconClass="fa fa-bullseye"
            >
                <PaeeEntryList
                    items={paee.objectives}
                    itemKey={(objective) => objective.id}
                    emptyMessage="Nenhum objetivo registrado."
                    renderItem={renderObjective}
                />
            </FormSection>

            <FormSection
                id="paee-resources"
                title="Recursos"
                variant="inline"
                iconClass="fa fa-cubes"
            >
                <PaeeEntryList
                    items={paee.resources}
                    itemKey={(resource) => resource.id}
                    emptyMessage="Nenhum recurso registrado."
                    renderItem={renderResource}
                />
            </FormSection>

            <FormSection
                id="paee-articulations"
                title="Articulações e Orientações"
                variant="inline"
                iconClass="fa fa-handshake-o"
            >
                <DetailGrid>
                    <DetailField label="Orientação aos profissionais da escola">
                        {richText(paee.school_professionals_orientation)}
                    </DetailField>
                    <DetailField label="Articulação com professores do ensino comum">
                        {richText(paee.common_teachers_articulation)}
                    </DetailField>
                    <DetailField label="Como a família será envolvida">
                        {richText(paee.family_articulation)}
                    </DetailField>
                    <DetailField label="Articulação intersetorial">
                        {richText(paee.intersectoral_articulation)}
                    </DetailField>
                    <DetailField label="Demandas de formação" wide>
                        {richText(paee.training_demands)}
                    </DetailField>
                </DetailGrid>
            </FormSection>

            <PaeeReviews paeeId={paee.id} reviews={paee.reviews} canReview={can.update} />
        </CardBox>
    );
}
