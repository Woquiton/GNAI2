import PdfHeaderSettingsForm from '@/components/Settings/Pdf/PdfHeaderSettingsForm';
import SettingsLayout from '@/components/Settings/SettingsLayout';
import type { PdfHeaderSettingsProps } from '@/components/Settings/Settings.types';

export default function SettingsPdf(props: PdfHeaderSettingsProps): React.JSX.Element {
    return <PdfHeaderSettingsForm {...props} />;
}

SettingsPdf.layout = SettingsLayout;
