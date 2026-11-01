import { formatTableListDate, type TableListColumn } from '@/components/Tables/TableList/TableList';
import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { itemTypeLabels } from '../Items.constants';
import type { ItemSummary } from '../Items.types';

const NOT_INFORMED = 'Não informado';
const NOT_APPLICABLE = 'Não se aplica';

function joinNames(entries: ReadonlyArray<{ name: string }>): string {
    return entries.map(({ name }) => name).join(', ') || NOT_INFORMED;
}

/** Item físico sem unidades disponíveis aparece como "Esgotado". */
function ItemStatusLabel({ item }: { item: ItemSummary }): React.JSX.Element {
    const exhausted = !item.is_digital && (item.quantity_available ?? 0) <= 0;

    if (exhausted) {
        return <TableLabel tone="danger">Esgotado</TableLabel>;
    }

    return (
        <TableLabel tone={item.is_active ? 'success' : 'inverse'}>
            {item.is_active ? 'Ativo' : 'Inativo'}
        </TableLabel>
    );
}

function stock(item: ItemSummary): string {
    if (item.is_digital) {
        return 'Ilimitado';
    }

    return `${item.quantity_available ?? 0} / ${item.quantity ?? 0}`;
}

/** Colunas da listagem; as complementares começam ocultas no seletor de colunas. */
export const itemColumns: TableListColumn<ItemSummary>[] = [
    {
        id: 'name',
        label: 'Descrição',
        width: '28%',
        fixed: 'start',
        render: (item) => item.name,
    },
    { id: 'type', label: 'Tipo', width: '20%', render: (item) => itemTypeLabels[item.item_type] },
    {
        id: 'nature',
        label: 'Natureza',
        width: '12%',
        render: (item) => (item.is_digital ? 'Digital' : 'Físico'),
    },
    { id: 'stock', label: 'Estoque', width: '12%', render: stock },
    {
        id: 'status',
        label: 'Status',
        width: '12%',
        render: (item) => <ItemStatusLabel item={item} />,
    },
    {
        id: 'asset',
        label: 'Patrimônio / Tombamento',
        width: '16%',
        defaultVisible: false,
        render: (item) => item.asset_code || NOT_INFORMED,
    },
    {
        id: 'quantity',
        label: 'Quantidade total',
        width: '16%',
        defaultVisible: false,
        render: (item) => (item.is_digital ? NOT_APPLICABLE : (item.quantity ?? 0)),
    },
    {
        id: 'available',
        label: 'Quantidade disponível',
        width: '16%',
        defaultVisible: false,
        render: (item) => (item.is_digital ? NOT_APPLICABLE : (item.quantity_available ?? 0)),
    },
    {
        id: 'conservation',
        label: 'Conservação',
        width: '16%',
        defaultVisible: false,
        render: (item) => item.conservation_state_label || NOT_INFORMED,
    },
    {
        id: 'resourceStatus',
        label: 'Status do recurso',
        width: '16%',
        defaultVisible: false,
        render: (item) => item.resource_status_label || NOT_INFORMED,
    },
    {
        id: 'loanable',
        label: 'Permite empréstimos',
        width: '16%',
        defaultVisible: false,
        render: (item) => (item.is_loanable ? 'Sim' : 'Não'),
    },
    {
        id: 'audience',
        label: 'Público-alvo',
        width: '16%',
        defaultVisible: false,
        render: (item) => joinNames(item.deficiencies),
    },
    {
        id: 'features',
        label: 'Recursos presentes no item',
        width: '16%',
        defaultVisible: false,
        render: (item) => joinNames(item.accessibility_features),
    },
    {
        id: 'created',
        label: 'Criado em',
        width: '16%',
        defaultVisible: false,
        render: (item) => formatTableListDate(item.created_at, true),
    },
    {
        id: 'updated',
        label: 'Atualizado em',
        width: '16%',
        defaultVisible: false,
        render: (item) => formatTableListDate(item.updated_at, true),
    },
];
