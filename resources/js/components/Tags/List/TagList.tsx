import { useMemo } from 'react';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import { tagUrls } from '../Tags.routes';
import type { TagListPermissions, TagPaginator, TagRecord } from '../Tags.types';
import { tagColumns } from './tagColumns';

interface TagListProps {
    tags: TagPaginator;
    permissions: TagListPermissions;
    loading: boolean;
    processing: boolean;
    onDelete: (tag: TagRecord) => void;
    onPageSelect: (page: number) => void;
}

export default function TagList({
    tags,
    permissions,
    loading,
    processing,
    onDelete,
    onPageSelect,
}: TagListProps): React.JSX.Element {
    const columns = useMemo<TableListColumn<TagRecord>[]>(
        () => [
            ...tagColumns,
            {
                id: 'actions',
                label: 'Ações',
                width: '20%',
                fixed: 'end',
                render: (tag) => (
                    <TableListRowActions
                        emptyLabel="Sem ações"
                        view={
                            permissions.show && {
                                href: tagUrls.show(tag.id),
                                label: `Visualizar ${tag.name}`,
                            }
                        }
                        remove={
                            permissions.destroy && {
                                label: `Excluir ${tag.name}`,
                                disabled: processing,
                                onClick: () => onDelete(tag),
                            }
                        }
                    />
                ),
            },
        ],
        [permissions.show, permissions.destroy, processing, onDelete],
    );

    return (
        <>
            <TableListScroll aria-label="Tabela de etiquetas">
                <TableListTable
                    columns={columns}
                    rows={tags.data}
                    rowKey={(tag) => tag.id}
                    page={tags}
                    emptyMessage="Nenhuma etiqueta cadastrada."
                />
            </TableListScroll>
            <TableListFooter
                page={tags}
                disabled={loading}
                paginationLabel="Paginação de etiquetas"
                onSelect={onPageSelect}
            />
        </>
    );
}
