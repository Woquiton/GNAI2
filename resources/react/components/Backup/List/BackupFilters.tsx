import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import { backupStatusOptions } from '../Backup.constants';
import type { BackupFilters as BackupFilterValues, BackupUser } from '../Backup.types';

interface BackupFiltersProps {
    values: BackupFilterValues;
    users: BackupUser[];
    errors: Record<string, string | undefined>;
    onUpdate: (name: keyof BackupFilterValues, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}

export default function BackupFilters({
    values,
    users,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: BackupFiltersProps): React.JSX.Element {
    const userOptions = users.map((user) => ({ value: String(user.id), label: user.name }));

    return (
        <TableListFilters label="Filtrar backups" onClear={onClear} onSubmit={onSubmit}>
            <TextInputField
                id="backup-filter-name"
                name="name"
                label="Arquivo ZIP"
                maxLength={255}
                placeholder="Filtrar por nome..."
                value={values.name}
                error={errors.name}
                onChange={(value) => onUpdate('name', value)}
            />
            <SelectInputField
                id="backup-filter-status"
                name="status"
                label="Status"
                placeholder="Todos os status"
                options={backupStatusOptions}
                value={values.status}
                error={errors.status}
                onChange={(value) => onUpdate('status', value)}
            />
            <SelectInputField
                id="backup-filter-user"
                name="user_id"
                label="Responsável"
                placeholder="Todos os responsáveis"
                options={userOptions}
                value={values.user_id}
                error={errors.user_id}
                onChange={(value) => onUpdate('user_id', value)}
            />
        </TableListFilters>
    );
}
