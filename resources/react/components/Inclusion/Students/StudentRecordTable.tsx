import type { Key, ReactNode } from 'react';
import {
    TableListCard,
    TableListEmptyRow,
    TableListScroll,
    TableListSummary,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import './StudentRecordTable.css';

interface StudentRecordTableBaseProps<T> {
    ariaLabel: string;
    columns: TableListColumn<T>[];
    emptyMessage: string;
    /** Cadastro exibido acima da tabela (normalmente `TableListCreateButton`). */
    actions?: ReactNode;
}

/** Modo por dados: cada coluna renderiza sua célula com `render`. */
interface StudentRecordTableRowsProps<T> extends StudentRecordTableBaseProps<T> {
    rows: readonly T[];
    rowKey: (row: T) => Key;
    count?: never;
    children?: never;
}

/** Modo com `<tr>` filhos, mantido para as tabelas existentes (por exemplo, disciplinas do PEI). */
interface StudentRecordTableChildrenProps<T> extends StudentRecordTableBaseProps<T> {
    count: number;
    children: ReactNode;
    rows?: never;
    rowKey?: never;
}

type StudentRecordTableProps<T> =
    StudentRecordTableRowsProps<T> | StudentRecordTableChildrenProps<T>;

/**
 * Coleção completa de um registro do aluno dentro de uma aba do prontuário: cadastro acima,
 * tabela com seletor de colunas e contagem estática no rodapé, sem paginação.
 */
export default function StudentRecordTable<T>({
    ariaLabel,
    columns,
    emptyMessage,
    actions,
    ...content
}: StudentRecordTableProps<T>): React.JSX.Element {
    const count = content.rows ? content.rows.length : content.count;
    const summary = `${count} ${count === 1 ? 'registro' : 'registros'}`;
    const rowsContent = content.rows ? undefined : count ? (
        content.children
    ) : (
        <TableListEmptyRow colSpan={columns.length}>{emptyMessage}</TableListEmptyRow>
    );

    return (
        <div className="studentsPage__recordList">
            {actions ? <div className="studentsPage__recordListActions">{actions}</div> : null}
            <TableListCard aria-label={ariaLabel}>
                <TableListScroll aria-label={ariaLabel}>
                    <TableListTable
                        columns={columns}
                        summary={summary}
                        rows={content.rows}
                        rowKey={content.rowKey}
                        emptyMessage={emptyMessage}
                    >
                        {rowsContent}
                    </TableListTable>
                </TableListScroll>
                <TableListSummary>{summary}</TableListSummary>
            </TableListCard>
        </div>
    );
}
