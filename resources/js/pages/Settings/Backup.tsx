import BackupSettingsForm from '@/components/Settings/Backup/BackupSettingsForm';
import SettingsLayout from '@/components/Settings/SettingsLayout';
import type { BackupSettingsProps } from '@/components/Settings/Settings.types';

export default function SettingsBackup(props: BackupSettingsProps): React.JSX.Element {
    return <BackupSettingsForm {...props} />;
}

SettingsBackup.layout = SettingsLayout;
