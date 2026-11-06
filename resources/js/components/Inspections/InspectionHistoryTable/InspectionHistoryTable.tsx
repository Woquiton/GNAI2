import { useMemo } from 'react';
import FormSection from '@/components/Forms/FormSection/FormSection';
import {
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import RichTextContent from '@/components/UI/RichTextContent/RichTextContent';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import type { InspectionHistoryItem } from './InspectionHistoryTable.types';
import '@styles/components/Inspections/InspectionHistoryTable/InspectionHistoryTable.css';

interface InspectionHistoryTableProps {
    id: string;
    /** Endereço do recurso; cada vistoria abre em `${baseUrl}/vistoria/{id}`. */
    baseUrl: string;
    inspections: InspectionHistoryItem[];
    /** Rótulo da coluna de situação; itens usam o estado de conservação e barreiras, o status. */
    stateLabel?: string;
    /** Valor de `data-tour`, para o tutorial ao vivo destacar o histórico. */
    tourTarget?: string;
}

function evidenceSummary(count: number): string {
    return count ? `${count} registrada(s)` : 'Nenhuma';
}

function inspectionColumns(
    baseUrl: string,
    stateLabel: string,
): TableListColumn<InspectionHistoryItem>[] {
    return [
        {
            id: 'date',
            label: 'Data',
            width: '12%',
            fixed: 'start',
            render: (inspection) => <TableLabel tone="purple">{inspection.date}</TableLabel>,
        },
        { id: 'type', label: 'Tipo', width: '18%', render: (inspection) => inspection.type },
        { id: 'state', label: stateLabel, width: '18%', render: (inspection) => inspection.state },
        {
            id: 'description',
            label: 'Descrição',
            width: '29%',
            render: (inspection) =>
                inspection.descriptionHtml ? (
                    <RichTextContent
                        className="inspectionHistoryTable__description"
                        html={inspection.descriptionHtml}
                    />
                ) : (
                    'Não informada'
                ),
        },
        {
            id: 'evidence',
            label: 'Evidências',
            width: '15%',
            render: (inspection) => evidenceSummary(inspection.evidenceCount),
        },
        {
            id: 'actions',
            label: 'Ações',
            width: '8%',
            fixed: 'end',
            render: (inspection) => (
                <TableListRowActions
                    view={{
                        href: `${baseUrl}/vistoria/${inspection.id}`,
                        label: `Visualizar vistoria de ${inspection.date}`,
                    }}
                />
            ),
        },
    ];
}

/** Histórico de vistorias de um item ou barreira, com acesso aos detalhes de cada registro. */
export default function InspectionHistoryTable({
    id,
    baseUrl,
    inspections,
    stateLabel = 'Estado de conservação',
    tourTarget,
}: InspectionHistoryTableProps): React.JSX.Element {
    const columns = useMemo(() => inspectionColumns(baseUrl, stateLabel), [baseUrl, stateLabel]);

    return (
        <FormSection
            id={id}
            title="Histórico de Vistorias"
            variant="inline"
            iconClass="fa fa-history"
            tourTarget={tourTarget}
        >
            <TableListScroll aria-label="Histórico de vistorias">
                <TableListTable
                    className="inspectionHistoryTable__table"
                    columns={columns}
                    rows={inspections}
                    rowKey={(inspection) => inspection.id}
                    summary={`${inspections.length} registro(s)`}
                    emptyMessage="Nenhum histórico de vistoria encontrado."
                />
            </TableListScroll>
        </FormSection>
    );
}
