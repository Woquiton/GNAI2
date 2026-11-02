import {
    formatTableListDate,
    formatTableListText,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import {
    barrierPriorityLabels,
    barrierPriorityTone,
    barrierStatusLabels,
    barrierStatusTone,
} from '../Barriers.constants';
import type { BarrierRecord } from '../Barriers.types';

const NOT_INFORMED = 'Não informado';

/** Situação da vistoria mais recente; sem vistoria, usa o status do próprio registro. */
function currentStatus(barrier: BarrierRecord): string {
    return barrier.inspections?.[0]?.status ?? barrier.status ?? '';
}

function reporter(barrier: BarrierRecord): string {
    if (barrier.is_anonymous) {
        return 'Contribuidor Anônimo';
    }

    return barrier.registered_by?.name || 'Usuário não identificado';
}

function StatusLabel({ barrier }: { barrier: BarrierRecord }): React.JSX.Element {
    const status = currentStatus(barrier);

    return (
        <TableLabel tone={barrierStatusTone(status)}>
            {barrierStatusLabels[status] ?? 'Pendente'}
        </TableLabel>
    );
}

/** Colunas da listagem; as complementares começam ocultas no seletor de colunas. */
export const barrierColumns: TableListColumn<BarrierRecord>[] = [
    {
        id: 'name',
        label: 'Nome',
        width: '31%',
        fixed: 'start',
        render: (barrier) => barrier.name,
    },
    {
        id: 'category',
        label: 'Categoria',
        width: '22%',
        render: (barrier) => barrier.category?.name ?? NOT_INFORMED,
    },
    {
        id: 'priority',
        label: 'Prioridade',
        width: '16%',
        render: (barrier) => (
            <TableLabel tone={barrierPriorityTone(barrier.priority)}>
                {barrierPriorityLabels[barrier.priority] ?? barrier.priority}
            </TableLabel>
        ),
    },
    {
        id: 'status',
        label: 'Status',
        width: '16%',
        render: (barrier) => <StatusLabel barrier={barrier} />,
    },
    {
        id: 'location',
        label: 'Ponto de referência',
        width: '16%',
        defaultVisible: false,
        render: (barrier) => barrier.location?.name || NOT_INFORMED,
    },
    {
        id: 'identified',
        label: 'Identificada em',
        width: '16%',
        defaultVisible: false,
        render: (barrier) => formatTableListDate(barrier.identified_at),
    },
    {
        id: 'reporter',
        label: 'Relator',
        width: '16%',
        defaultVisible: false,
        render: reporter,
    },
    {
        id: 'description',
        label: 'Descrição',
        width: '16%',
        defaultVisible: false,
        render: (barrier) => formatTableListText(barrier.description),
    },
    {
        id: 'audience',
        label: 'Público impactado',
        width: '16%',
        defaultVisible: false,
        render: (barrier) =>
            barrier.deficiencies?.map(({ name }) => name).join(', ') || NOT_INFORMED,
    },
];
