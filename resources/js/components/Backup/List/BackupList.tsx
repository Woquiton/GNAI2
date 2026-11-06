import { useMemo } from 'react';
import { TableListFooter, TableListRowActions, TableListScroll, TableListTable, type TableListColumn } from '@/components/Tables/TableList/TableList';
import Button from '@/components/UI/Button/Button';
import { backupUrls } from '../Backup.routes';
import type { BackupListPermissions, BackupPaginator, BackupRecord } from '../Backup.types';
import { backupColumns } from './backupColumns';
import '@styles/components/Backup/List/BackupList.css';

interface BackupListProps {
    backups: BackupPaginator;
    permissions: BackupListPermissions;
    loading: boolean;
    /** Alguma operação (importar, gerar, restaurar, excluir) em andamento. */
    processing: boolean;
    onRestore: (backup: BackupRecord) => void;
    onDelete: (backup: BackupRecord) => void;
    onPageSelect: (page: number) => void;
}

interface BackupRowActionsProps {
    backup: BackupRecord;
    permissions: BackupListPermissions;
    processing: boolean;
    onRestore: (backup: BackupRecord) => void;
    onDelete: (backup: BackupRecord) => void;
}

/** Baixar, restaurar (somente backups bem-sucedidos), visualizar e excluir, nesta ordem. */
function BackupRowActions({
    backup,
    permissions,
    processing,
    onRestore,
    onDelete,
}: BackupRowActionsProps): React.JSX.Element {
    const hasActions =
        permissions.download || permissions.restore || permissions.show || permissions.destroy;
    const actions = hasActions ? (
        <>
            {permissions.download ? (
                <Button
                    href={backupUrls.download(backup.id)}
                    download
                    size="sm"
                    tone="success"
                    iconOnly
                    leftIconClass="fa fa-download"
                    aria-label={`Baixar ${backup.file_name}`}
                />
            ) : null}
            {permissions.restore && backup.status === 'success' ? (
                <Button
                    size="sm"
                    tone="warning"
                    iconOnly
                    leftIconClass="fa fa-history"
                    aria-label={`Restaurar ${backup.file_name}`}
                    disabled={processing}
                    onClick={() => onRestore(backup)}
                />
            ) : null}
            {permissions.show ? (
                <Button
                    href={backupUrls.show(backup.id)}
                    size="sm"
                    tone="dark-blue"
                    iconOnly
                    leftIconClass="fa fa-eye"
                    title="Visualizar"
                    aria-label={`Visualizar ${backup.file_name}`}
                />
            ) : null}
        </>
    ) : undefined;

    return (
        <TableListRowActions
            emptyLabel="Sem ações"
            remove={
                permissions.destroy && {
                    label: `Excluir ${backup.file_name}`,
                    disabled: processing,
                    onClick: () => onDelete(backup),
                }
            }
        >
            {actions}
        </TableListRowActions>
    );
}

export default function BackupList({
    backups,
    permissions,
    loading,
    processing,
    onRestore,
    onDelete,
    onPageSelect,
}: BackupListProps): React.JSX.Element {
    const columns = useMemo<TableListColumn<BackupRecord>[]>(
        () => [
            ...backupColumns(permissions.show),
            {
                id: 'actions',
                label: 'Ações',
                width: '18%',
                fixed: 'end',
                render: (backup) => (
                    <BackupRowActions
                        backup={backup}
                        permissions={permissions}
                        processing={processing}
                        onRestore={onRestore}
                        onDelete={onDelete}
                    />
                ),
            },
        ],
        [permissions, processing, onRestore, onDelete],
    );

    return (
        <>
            <TableListScroll aria-label="Tabela de backups">
                <TableListTable
                    className="backupList"
                    columns={columns}
                    rows={backups.data}
                    rowKey={(backup) => backup.id}
                    page={backups}
                    emptyMessage="Nenhum backup encontrado no histórico."
                />
            </TableListScroll>
            <TableListFooter
                page={backups}
                disabled={loading}
                paginationLabel="Paginação de backups"
                onSelect={onPageSelect}
            />
        </>
    );
}
