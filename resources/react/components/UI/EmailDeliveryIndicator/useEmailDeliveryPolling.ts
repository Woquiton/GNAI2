import { useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import { useTableListVisit } from '@/components/Tables/TableList/useTableListRequest';

/** Atualiza as props interessadas, enquanto houver e-mails pendentes visíveis. */
export function useEmailDeliveryPolling(
    hasPendingEmail: boolean,
    collection: string | readonly string[],
): void {
    const { url } = usePage();
    const only = useMemo(
        () => (typeof collection === 'string' ? [collection] : [...collection]),
        [collection],
    );
    useTableListVisit({
        url,
        failureText: 'Não foi possível atualizar os indicadores de e-mail.',
        polling: { enabled: hasPendingEmail, only },
    });
}
