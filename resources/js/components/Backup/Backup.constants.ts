import type { TableLabelTone } from '@/components/UI/TableLabel/TableLabel';
import type { BackupFilters, BackupRecord } from './Backup.types';

export const emptyBackupFilters: BackupFilters = { name: '', status: '', user_id: '' };

export const backupStatusOptions = [
    { value: 'success', label: 'Sucesso' },
    { value: 'failed', label: 'Falha' },
    { value: 'archived', label: 'Arquivado' },
];

/** Rótulo e tom do status de um backup; status ausente aparece como desconhecido. */
export function backupStatusDisplay(status: BackupRecord['status']): {
    label: string;
    tone: TableLabelTone;
} {
    switch (status) {
        case 'success':
            return { label: 'Sucesso', tone: 'success' };
        case 'failed':
            return { label: 'Falha', tone: 'danger' };
        case 'archived':
            return { label: 'Arquivado', tone: 'info' };
        default:
            return { label: 'Status desconhecido', tone: 'inverse' };
    }
}
