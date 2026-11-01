import { Head } from '@inertiajs/react';
import type { ErrorPageProps } from '@/components/Errors/Errors.types';
import { errorCodeFromStatus } from '@/components/Errors/Errors.utils';
import AccountLayout from '@/components/Navigation/AccountLayout/AccountLayout';
import ErrorState from '@/components/UI/ErrorState/ErrorState';

export default function Error({ status, homeHref }: ErrorPageProps): React.JSX.Element {
    return (
        <>
            <Head title={`${status}, Erro | Gnai`} />
            <AccountLayout>
                <ErrorState
                    code={errorCodeFromStatus(status)}
                    homeHref={homeHref}
                    homeLabel="Voltar"
                />
            </AccountLayout>
        </>
    );
}
