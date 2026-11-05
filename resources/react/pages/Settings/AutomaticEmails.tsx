import AutomaticEmailSettingsForm from '@/components/Settings/AutomaticEmails/AutomaticEmailSettingsForm';
import SettingsLayout from '@/components/Settings/SettingsLayout';
import type { AutomaticEmailSettingsProps } from '@/components/Settings/Settings.types';

export default function SettingsAutomaticEmails(
    props: AutomaticEmailSettingsProps,
): React.JSX.Element {
    return <AutomaticEmailSettingsForm {...props} />;
}

SettingsAutomaticEmails.layout = SettingsLayout;
