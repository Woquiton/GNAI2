import MailSettingsForm from '@/components/Settings/Mail/MailSettingsForm';
import SettingsLayout from '@/components/Settings/SettingsLayout';
import type { MailSettingsProps } from '@/components/Settings/Settings.types';

export default function SettingsMail(props: MailSettingsProps): React.JSX.Element {
    return <MailSettingsForm {...props} />;
}

SettingsMail.layout = SettingsLayout;
