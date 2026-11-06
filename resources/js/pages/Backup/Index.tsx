import { usePage } from '@inertiajs/react';
import BackupDeleteModal from '@/components/Backup/BackupDeleteModal';
import { emptyBackupFilters } from '@/components/Backup/Backup.constants';
import { backupBreadcrumb, backupUrls } from '@/components/Backup/Backup.routes';
import type { BackupIndexProps } from '@/components/Backup/Backup.types';
import { backupListTour } from '@/components/Backup/backupTours';
import BackupFilters from '@/components/Backup/List/BackupFilters';
import BackupHeaderActions from '@/components/Backup/List/BackupHeaderActions';
import BackupList from '@/components/Backup/List/BackupList';
import BackupRestoreModal from '@/components/Backup/List/BackupRestoreModal';
import BackupRetentionNotice from '@/components/Backup/List/BackupRetentionNotice';
import { useBackupListActions } from '@/components/Backup/List/useBackupListActions';
import { TableListLayout, useTableListFilters } from '@/components/Tables/TableList/TableList';

export default function BackupIndexPage({
    backups,
    users,
    filters: initialFilters,
    backupDirectory,
    can,
}: BackupIndexProps): React.JSX.Element {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const filters = useTableListFilters({
        url: backupUrls.index,
        initialFilters,
        emptyFilters: emptyBackupFilters,
        failureText: 'Não foi possível atualizar os backups. Tente novamente.',
    });
    const actions = useBackupListActions({ beforeOpen: filters.cancelScheduled });

    return (
        <TableListLayout
            title="Gerenciamento de Backups"
            subtitle="Visualize e administre as cópias de segurança do sistema."
            breadcrumbItems={backupBreadcrumb()}
            actions={
                <BackupHeaderActions
                    actions={actions}
                    permissions={can}
                    fileError={errors.backup_file}
                />
            }
            listLabel="Histórico de backups"
            tour={backupListTour}
            loading={filters.loading}
            loadingLabel="Atualizando histórico de backups"
            filters={
                <BackupFilters
                    values={filters.values}
                    users={users}
                    errors={errors}
                    onUpdate={filters.update}
                    onClear={filters.clear}
                    onSubmit={filters.submit}
                />
            }
            dialogs={
                <>
                    <BackupRetentionNotice backupDirectory={backupDirectory} />
                    <BackupRestoreModal actions={actions} />
                    <BackupDeleteModal
                        backup={actions.removal.target}
                        processing={actions.removal.processing}
                        onClose={actions.removal.close}
                        onConfirm={actions.confirmRemoval}
                    />
                </>
            }
        >
            <BackupList
                backups={backups}
                permissions={can}
                loading={filters.loading}
                processing={actions.actionBusy}
                onRestore={actions.openRestore}
                onDelete={actions.openRemoval}
                onPageSelect={filters.selectPage}
            />
        </TableListLayout>
    );
}
