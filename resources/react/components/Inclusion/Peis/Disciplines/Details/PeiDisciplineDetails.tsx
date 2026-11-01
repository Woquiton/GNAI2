import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import { peiDisciplineUrls } from '../../Peis.routes';
import type {
    PeiDisciplineDetails as PeiDisciplineDetailsRecord,
    PeiDisciplineShowProps,
} from '../../Peis.types';
import PeiDisciplineRevisions from './PeiDisciplineRevisions';

type DetailHtmlField = keyof Omit<
    PeiDisciplineDetailsRecord,
    'id' | 'discipline_name' | 'teacher_name'
>;

/** `wide: false` mostra o campo em meia linha, ao lado do seguinte, como no Blade. */
const fields: Array<{ name: DetailHtmlField; label: string; wide?: boolean }> = [
    { name: 'specific_objectives_html', label: 'Objetivos Específicos', wide: false },
    { name: 'objectives_deadline_html', label: 'Prazo das metas/objetivos', wide: false },
    { name: 'content_programmatic_html', label: 'Conteúdo Programático', wide: false },
    { name: 'curricular_reference_html', label: 'Referência curricular', wide: false },
    { name: 'methodologies_html', label: 'Metodologias e Estratégias', wide: false },
    {
        name: 'materials_and_assistive_technology_html',
        label: 'Recursos didáticos e tecnologia assistiva',
        wide: false,
    },
    { name: 'evaluations_html', label: 'Processo de Avaliação' },
    { name: 'complementary_records_html', label: 'Registros Complementares' },
    { name: 'opinion_html', label: 'Parecer' },
];

type PeiDisciplineDetailsProps = Pick<
    PeiDisciplineShowProps,
    'pei' | 'peiDiscipline' | 'revisions' | 'can'
>;

/** Planejamento adaptado da disciplina e suas revisões. */
export default function PeiDisciplineDetails({
    pei,
    peiDiscipline,
    revisions,
    can,
}: PeiDisciplineDetailsProps): React.JSX.Element {
    return (
        <CardBox>
            <FormSection
                id="pei-discipline-details"
                title="Adaptações Razoáveis e/ou Acessibilidades Curriculares"
                iconClass="fa fa-book"
                variant="inline"
            >
                <DetailGrid>
                    {fields.map((field) => (
                        <DetailField
                            key={field.name}
                            label={field.label}
                            wide={field.wide !== false}
                        >
                            <RichTextContent html={peiDiscipline[field.name]} />
                        </DetailField>
                    ))}
                </DetailGrid>
            </FormSection>
            <PeiDisciplineRevisions
                action={peiDisciplineUrls.revisions(pei.id, peiDiscipline.id)}
                revisions={revisions}
                canAdd={can.addRevision}
            />
        </CardBox>
    );
}
