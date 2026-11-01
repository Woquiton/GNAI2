import TableLabel from '@/components/UI/TableLabel/TableLabel';
import { backupStatusDisplay } from './Backup.constants';
import type { BackupRecord } from './Backup.types';

/** Etiqueta do status do backup, usada na listagem e na visualização. */
export default function BackupStatusLabel({
    status,
}: {
    status: BackupRecord['status'];
}): React.JSX.Element {
    const display = backupStatusDisplay(status);

    return <TableLabel tone={display.tone}>{display.label}</TableLabel>;
}
