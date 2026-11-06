import { Head } from '@inertiajs/react';
import AccountLayout from '@/components/Navigation/AccountLayout/AccountLayout';
import ErrorState from '@/components/UI/ErrorState/ErrorState';
import type { ErrorCode, ErrorDescription } from '@/components/UI/ErrorState/ErrorState.types';

interface ErrorScreenProps {
    code: ErrorCode;
    homeHref: string;
    description?: ErrorDescription;
    homeLabel?: string;
}

/**
 * Tela de erro avulsa, fora do layout autenticado: usada pelas respostas de erro do
 * servidor (403, 404, 500…) e pelas falhas de renderização das páginas.
 */
export default function ErrorScreen({
    code,
    homeHref,
    description,
    homeLabel,
}: ErrorScreenProps): React.JSX.Element {
    return (
        <>
            <Head title={`${code}, Erro | Gnai`} />
            <AccountLayout>
                <ErrorState
                    code={code}
                    description={description}
                    homeHref={homeHref}
                    homeLabel={homeLabel}
                />
            </AccountLayout>
        </>
    );
}
