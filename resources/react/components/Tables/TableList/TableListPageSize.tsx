import { router } from '@inertiajs/react';
import { useContext, useId } from 'react';
import SelectField from '@/components/Forms/SelectField/SelectField';
import {
    notifyConnectionFailure,
    notifyOperationFailure,
} from '@/components/UI/NotificationToast/operationFeedback';
import { TABLE_LIST_DEFAULT_PAGE_SIZE, TABLE_LIST_PAGE_SIZES } from './TableList.preferences';
import { TableListBusyContext } from './TableListBusyContext';

const options = TABLE_LIST_PAGE_SIZES.map((size) => ({
    value: String(size),
    label: String(size),
}));

/** Remove a página atual (`page`, `pedagogical_page`…) para a nova quantidade começar do início. */
function pageSizeUrl(size: number): string {
    const params = new URLSearchParams(window.location.search);

    [...params.keys()]
        .filter((name) => name !== 'per_page' && /(^|_)page$/.test(name))
        .forEach((name) => params.delete(name));
    params.set('per_page', String(size));

    return `${window.location.pathname}?${params.toString()}`;
}

/**
 * Quantidade de registros por página. A escolha segue na URL e o servidor a guarda como
 * preferência do usuário para esta tela, reaplicando-a nas próximas visitas.
 */
export default function TableListPageSize({
    value,
    disabled = false,
}: {
    value: number | undefined;
    disabled?: boolean;
}): React.JSX.Element {
    const id = useId();
    const setBusy = useContext(TableListBusyContext);
    const current = String(value ?? TABLE_LIST_DEFAULT_PAGE_SIZE);

    function change(next: string): void {
        if (next === current) return;

        router.get(
            pageSizeUrl(Number(next)),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onStart: () => setBusy(true),
                onNetworkError: () => {
                    notifyConnectionFailure();
                    return false;
                },
                onHttpException: () => {
                    notifyOperationFailure('Não foi possível alterar a quantidade por página.');
                    return false;
                },
                onFinish: () => setBusy(false),
            },
        );
    }

    return (
        <span className="tableListPageSize" title="Registros por página">
            <SelectField
                id={`${id}-per-page`}
                name="per_page"
                label="Registros por página"
                placeholder={null}
                searchable={false}
                value={current}
                options={options}
                disabled={disabled}
                onChange={(event) => change(event.target.value)}
            />
        </span>
    );
}
