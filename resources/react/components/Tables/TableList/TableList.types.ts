import type { Key, ReactNode } from 'react';
import type { TableProps } from '@/components/Tables/Table/Table';

export interface TableListColumn<T = unknown> {
    id: string;
    label: string;
    width?: number | string;
    /** @deprecated Mantido por compatibilidade; não limita o redimensionamento. */
    minWidth?: number;
    hideable?: boolean;
    /** Colunas complementares começam desmarcadas; fixas continuam sempre visíveis. */
    defaultVisible?: boolean;
    /** Mantém a coluna visível na extremidade; end também bloqueia o redimensionamento. */
    fixed?: 'start' | 'end';
    /**
     * Conteúdo da célula no modo por dados (`rows`). As células são associadas pelo `id` da coluna,
     * então ocultar colunas não depende da posição dos `<td>`.
     */
    render?(row: T): ReactNode;
    cellClassName?: string;
    /** Texto do `title` da célula, útil quando o conteúdo é truncado com reticências. */
    cellTitle?(row: T): string | undefined;
}

/** Intervalo exibido por uma listagem paginada (campos do paginador do Laravel). */
export interface TableListRange {
    from: number | null;
    to: number | null;
    total: number;
}

/** Paginador do Laravel consumido pelo rodapé da listagem. */
export interface TableListPage extends TableListRange {
    current_page: number;
    last_page: number;
}

export interface TableListTableProps<T = unknown> extends Omit<
    TableProps,
    'children' | 'width' | 'summary'
> {
    columns: TableListColumn<T>[];
    /** Paginador da listagem: a barra mostra "1 a 10 de 14 registros". */
    page?: TableListRange;
    /** Texto livre, só para coleções sem paginação (ex.: abas do prontuário). */
    summary?: ReactNode;
    /**
     * Modo por dados: cada coluna renderiza sua célula com `render`. Prefira este modo em telas
     * novas; `children` com `<tr>` permanece para as listagens existentes.
     */
    rows?: readonly T[];
    rowKey?: (row: T) => Key;
    /** Classe da linha no modo por dados (destaques como o semestre atual). */
    rowClassName?: (row: T) => string | undefined;
    /** Mensagem da linha vazia no modo por dados. */
    emptyMessage?: ReactNode;
    children?: ReactNode;
}
