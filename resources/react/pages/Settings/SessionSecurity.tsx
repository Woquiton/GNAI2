import SessionSecuritySettingsForm from '@/components/Settings/SessionSecurity/SessionSecuritySettingsForm';
import SettingsLayout from '@/components/Settings/SettingsLayout';
import type { SessionSecuritySettingsProps } from '@/components/Settings/Settings.types';

export default function SettingsSessionSecurity(
    props: SessionSecuritySettingsProps,
): React.JSX.Element {
    return <SessionSecuritySettingsForm {...props} />;
}

SettingsSessionSecurity.layout = SettingsLayout;
