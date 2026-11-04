import { Head } from '@inertiajs/react';
import StatusPage from '@/components/UI/StatusPage/StatusPage';

export default function Maintenance(): React.JSX.Element {
    return (
        <>
            <Head title="Em manutenção | Gnai" />
            <StatusPage kind="maintenance" />
        </>
    );
}
