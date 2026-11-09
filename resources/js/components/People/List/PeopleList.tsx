import {
    TableListTable,
    TableListFooter,
    TableListScroll,
} from '@/components/Tables/TableList/TableList';
import '@styles/components/People/List/PeopleList.css';
import type { PeopleIndexProps } from '../People.types';
import { personColumns } from './personColumns';

export default function PeopleList({
    people,
    can,
    loading,
    onPageSelect,
}: Pick<PeopleIndexProps, 'people' | 'can'> & {
    loading: boolean;
    onPageSelect: (page: number) => void;
}): React.JSX.Element {
    const columns = personColumns(can);
    return (
        <>
            <TableListScroll aria-label="Tabela de pessoas">
                <TableListTable
                    columns={columns}
                    rows={people.data}
                    rowKey={(person) => person.id}
                    page={people}
                    emptyMessage="Nenhuma pessoa encontrada."
                />
            </TableListScroll>
            <TableListFooter
                page={people}
                disabled={loading}
                paginationLabel="Paginação de pessoas"
                onSelect={onPageSelect}
            />
        </>
    );
}
