import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { priorityTone } from '../Pendencies.constants';
import type { PendencyDetailsRecord } from '../Pendencies.types';
import { PENDENCY_TOUR_TARGETS } from '../pendencyTours';
import '@styles/components/Pendencies/Details/PendencyDetails.css';

const NOT_INFORMED = 'Não informado';

/** Dados da pendência e informações do sistema. */
export default function PendencyDetails({
    pendency,
}: {
    pendency: PendencyDetailsRecord;
}): React.JSX.Element {
    const priority = pendency.priority_label ? (
        <TableLabel tone={priorityTone(pendency.priority_color)}>
            {pendency.priority_label}
        </TableLabel>
    ) : (
        NOT_INFORMED
    );

    return (
        <CardBox>
            <FormSection
                id="pendency-data"
                title="Identificação"
                variant="inline"
                iconClass="fa fa-tasks"
                tourTarget={PENDENCY_TOUR_TARGETS.details}
            >
                <DetailGrid columns={3}>
                    <DetailField label="Título" className="pendencyDetails__title">
                        {pendency.title}
                    </DetailField>
                    <DetailField label="Profissional Responsável">
                        {pendency.assigned_name}
                    </DetailField>
                    <DetailField label="Prioridade">{priority}</DetailField>
                    <DetailField label="Vencimento">{pendency.due_date}</DetailField>
                    <DetailField label="Concluída">
                        <TableLabel tone={pendency.is_completed ? 'success' : 'danger'}>
                            {pendency.is_completed ? 'Sim' : 'Não'}
                        </TableLabel>
                    </DetailField>
                    <DetailField label="Descrição" wide>
                        <RichTextContent html={pendency.description_html} />
                    </DetailField>
                </DetailGrid>
            </FormSection>
            <FormSection
                id="pendency-system"
                title="Informações do Sistema"
                variant="inline"
                iconClass="fa fa-info-circle"
                tourTarget={PENDENCY_TOUR_TARGETS.detailsSystem}
            >
                <DetailGrid columns={3}>
                    <DetailField label="Criado por">{pendency.creator_name}</DetailField>
                    <DetailField label="Criado em">{pendency.created_at}</DetailField>
                    <DetailField label="Última atualização">{pendency.updated_at}</DetailField>
                </DetailGrid>
            </FormSection>
        </CardBox>
    );
}
