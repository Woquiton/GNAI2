import BackupDeleteModal from '@/components/Backup/BackupDeleteModal';
import { backupBreadcrumb, backupUrls } from '@/components/Backup/Backup.routes';
import type { BackupShowProps } from '@/components/Backup/Backup.types';
import BackupDetails from '@/components/Backup/Details/BackupDetails';
import BackupDetailsActions from '@/components/Backup/Details/BackupDetailsActions';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function BackupShowPage({ backup, can }: BackupShowProps): React.JSX.Element {
    const removal = useConfirmedAction<typeof backup>({
        failureText: 'Não foi possível excluir o backup. Tente novamente.',
    });

    return (
        <BusinessPage
            title="Detalhes do Registro de Backup"
            subtitle="Informações técnicas e metadados da cópia de segurança."
            breadcrumbItems={backupBreadcrumb({ fileName: backup.file_name })}
            busy={removal.processing}
        >
            <BackupDetails backup={backup} />
            <BackupDetailsActions
                backupId={backup.id}
                permissions={can}
                deleting={removal.processing}
                onDelete={() => removal.open(backup)}
            />
            <BackupDeleteModal
                backup={removal.target}
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={() => removal.submit('delete', backupUrls.destroy(backup.id))}
            />
        </BusinessPage>
    );
}
