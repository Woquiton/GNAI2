import TeacherAccessSettingsForm from '@/components/Settings/TeacherAccess/TeacherAccessSettingsForm';
import SettingsLayout from '@/components/Settings/SettingsLayout';
import type { TeacherAccessSettingsProps } from '@/components/Settings/Settings.types';

export default function SettingsTeacherAccess(props: TeacherAccessSettingsProps): React.JSX.Element {
    return <TeacherAccessSettingsForm {...props} />;
}

SettingsTeacherAccess.layout = SettingsLayout;
