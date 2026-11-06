import type { ErrorPageProps } from '@/components/Errors/Errors.types';
import { errorCodeFromStatus } from '@/components/Errors/Errors.utils';
import ErrorScreen from '@/components/Errors/ErrorScreen';

export default function Error({ status, homeHref }: ErrorPageProps): React.JSX.Element {
    return <ErrorScreen code={errorCodeFromStatus(status)} homeHref={homeHref} />;
}
