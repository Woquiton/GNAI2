import { useId, type ReactNode } from 'react';

import { joinClassNames } from '@/utils/joinClassNames';
import { TABLE_LIST_TOUR_TARGETS } from './tableListTour';
import { useRememberedOpen } from './useRememberedOpen';

interface TableListMoreFiltersProps {
    children: ReactNode;
    /** Quantos filtros complementares estão aplicados; aparece num selo no botão. */
    activeCount?: number;
}

/**
 * Acordeão "Mais filtros". Começa fechado e lembra a última escolha do usuário por tela; com
 * filtros aplicados dentro dele, o selo do botão mostra quantos são, sem abri-lo sozinho.
 */
export default function TableListMoreFilters({
    children,
    activeCount = 0,
}: TableListMoreFiltersProps): React.JSX.Element {
    const [open, toggle] = useRememberedOpen('more');
    const contentId = useId();

    return (
        <section
            className={joinClassNames('tableListMoreFilters', open && 'tableListMoreFilters--open')}
            data-tour={TABLE_LIST_TOUR_TARGETS.moreFilters}
        >
            <button
                type="button"
                className="tableListMoreFilters__trigger"
                aria-controls={contentId}
                aria-expanded={open}
                onClick={toggle}
            >
                <span className="tableListMoreFilters__chevron" aria-hidden="true" />
                Mais filtros
                <TableListActiveBadge count={activeCount} />
            </button>

            <div id={contentId} className="tableListMoreFilters__collapse" aria-hidden={!open}>
                <div className="tableListMoreFilters__content">{children}</div>
            </div>
        </section>
    );
}

/** Selo com a quantidade de filtros aplicados numa região recolhida, também anunciado. */
export function TableListActiveBadge({ count }: { count: number }): React.JSX.Element | null {
    if (count <= 0) return null;

    return (
        <span className="tableListFilters__badge">
            <span aria-hidden="true">{count}</span>
            <span className="tableListFilters__srOnly">
                {count === 1 ? ', 1 filtro aplicado' : `, ${count} filtros aplicados`}
            </span>
        </span>
    );
}
