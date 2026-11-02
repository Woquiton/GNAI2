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
    /** Filtros locais da coleção, exibidos dentro do card. */
    filters?: ReactNode;
    /** Mantém a estrutura visível enquanto a aba consulta os registros. */
    loading?: boolean;
    loadingLabel?: string;
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
    filters,
    loading = false,
    loadingLabel,
    ...content
}: StudentRecordTableProps<T>): React.JSX.Element {
    const rows = 'rows' in content ? content.rows : undefined;
    const rowKey = 'rowKey' in content ? content.rowKey : undefined;
    const count = rows !== undefined ? rows.length : 'count' in content ? content.count : 0;
    const summary = `${count} ${count === 1 ? 'registro' : 'registros'}`;
    const rowsContent = rows !== undefined ? undefined : count ? (
        'children' in content ? content.children : undefined
    ) : (
        <TableListEmptyRow colSpan={columns.length}>{emptyMessage}</TableListEmptyRow>
    );

    return (
        <div className="studentsPage__recordList">
            {actions ? <div className="studentsPage__recordListActions">{actions}</div> : null}
            <TableListCard
                aria-label={ariaLabel}
                loading={loading}
                loadingLabel={loadingLabel ?? `Carregando ${ariaLabel.toLocaleLowerCase('pt-BR')}`}
            >
                {filters}
                <TableListScroll aria-label={ariaLabel}>
                    <TableListTable
                        columns={columns}
                        summary={summary}
                        rows={rows}
                        rowKey={rowKey}
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
