import { useMemo } from 'react';
import {
    TableListFooter,
    TableListRowActions,
    TableListScroll,
    TableListTable,
    type TableListColumn,
} from '@/components/Tables/TableList/TableList';
import Button from '@/components/UI/Button/Button';
import { publicationUrls } from '../Publications.routes';
import type {
    PublicationRecord,
    PublicationPaginator,
    PublicationListPermissions,
} from '../Publications.types';
import { publicationColumns } from './publicationColumns';
import '@styles/components/Publications/List/PublicationList.css';
export default function PublicationList({
    publications,
    permissions,
    loading,
    processing,
    onDelete,
    onPageSelect,
}: {
    publications: PublicationPaginator;
    permissions: PublicationListPermissions;
    loading: boolean;
    processing: boolean;
    onDelete: (publication: PublicationRecord) => void;
    onPageSelect: (page: number) => void;
}): React.JSX.Element {
    const columns = useMemo<TableListColumn<PublicationRecord>[]>(
        () => [
            ...publicationColumns,
            {
                id: 'actions',
                label: 'Ações',
                width: '12%',
                fixed: 'end',
                render: (publication) => (
                    <TableListRowActions
                        view={
                            permissions.show && {
                                href: publicationUrls.show(publication.id),
                                label: `Visualizar publicação ${publication.title}`,
                            }
                        }
                        remove={
                            permissions.destroy && {
                                label: `Excluir publicação ${publication.title}`,
                                disabled: processing,
                                onClick: () => onDelete(publication),
                            }
                        }
                    >
                        {publication.public_url ? (
                            <Button
                                href={publication.public_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                size="sm"
                                tone="dark-blue"
                                iconOnly
                                leftIconClass="fa fa-external-link"
                                title="Abrir no site"
                                aria-label={`Abrir ${publication.title} no site (nova aba)`}
                            />
                        ) : null}
                    </TableListRowActions>
                ),
            },
        ],
        [permissions.show, permissions.destroy, processing, onDelete],
    );
    return (
        <>
            <TableListScroll aria-label="Tabela de publicações">
                <TableListTable
                    columns={columns}
                    rows={publications.data}
                    rowKey={(publication) => publication.id}
                    page={publications}
                    emptyMessage="Nenhuma publicação cadastrada."
                />
            </TableListScroll>
            <TableListFooter
                page={publications}
                disabled={loading}
                paginationLabel="Páginas de publicações"
                onSelect={onPageSelect}
            />
        </>
    );
}
