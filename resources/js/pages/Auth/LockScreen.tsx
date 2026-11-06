import LockScreen from '@/components/Auth/Session/LockScreen';
import type { LockScreenProps } from '@/components/Auth/Session/Session.types';

export default function LockScreenPage(props: LockScreenProps): React.JSX.Element {
    return <LockScreen {...props} />;
}
