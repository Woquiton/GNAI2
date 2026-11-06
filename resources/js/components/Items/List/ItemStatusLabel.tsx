import TableLabel from '@/components/UI/TableLabel/TableLabel';
import type { ItemSummary } from '../Items.types';

/** O status tem o mesmo significado na tabela e nos cards. */
export default function ItemStatusLabel({ item }: { item: ItemSummary }): React.JSX.Element {
    const exhausted = !item.is_digital && (item.quantity_available ?? 0) <= 0;

    if (exhausted) return <TableLabel tone="danger">Esgotado</TableLabel>;

    return (
        <TableLabel tone={item.is_active ? 'success' : 'inverse'}>
            {item.is_active ? 'Ativo' : 'Inativo'}
        </TableLabel>
    );
}
