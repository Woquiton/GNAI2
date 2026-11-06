import {
    Children,
    useId,
    useLayoutEffect,
    useRef,
    useState,
    type CSSProperties,
    type ReactNode,
} from 'react';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import { joinClassNames } from '@/utils/joinClassNames';
import TableListMoreFilters, { TableListActiveBadge } from './TableListMoreFilters';
import { TableListClearButton, TableListFilterActions } from './TableListControls';
import { TABLE_LIST_TOUR_TARGETS } from './tableListTour';
import { useRememberedOpen } from './useRememberedOpen';

interface TableListFiltersProps {
    /** Nome acessível do formulário, por exemplo "Filtrar itens". */
    label: string;
    /** Campos principais. O primeiro ocupa uma coluna mais larga, como a busca por nome. */
    children: ReactNode;
    /** Campos do acordeão "Mais filtros". */
    moreFilters?: ReactNode;
    onSubmit: () => void;
    onClear: () => void;
    clearDisabled?: boolean;
    className?: string;
}

/** Quantos campos nomeados da região estão preenchidos (um por `name`). */
function countActiveFields(region: HTMLElement | null): number {
    const active = new Set<string>();

    region
        ?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
            'input[name], select[name], textarea[name]',
        )
        .forEach((field) => {
            if (field.disabled || field.type === 'hidden') return;
            const filled =
                field instanceof HTMLInputElement &&
                (field.type === 'checkbox' || field.type === 'radio')
                    ? field.checked && field.value !== ''
                    : field instanceof HTMLSelectElement && field.multiple
                      ? field.selectedOptions.length > 0
                      : field.value.trim() !== '';
            if (filled) active.add(field.name);
        });

    return active.size;
}

/**
 * Barra de filtros das listagens: grade responsiva com os campos principais, botão de limpar
 * alinhado ao final e acordeão opcional de filtros complementares.
 *
 * Com a barra estreita (celular), como no controle-bar, só o primeiro campo (a busca) fica à
 * vista; "Filtros" vira um botão que mostra os demais campos e o "Mais filtros", com um selo da
 * quantidade de filtros aplicados ali, e a borracha sobe para o lado dele. "Filtros" e "Mais
 * filtros" começam fechados, não abrem sozinhos e lembram a escolha do usuário por tela, mesmo
 * com filtros aplicados: o selo avisa o que está escondido. É o mesmo conjunto de
 * campos nos dois tamanhos: na barra larga a região recolhível usa `display: contents`, por
 * container query, sem desenhar nada em dobro.
 */
export default function TableListFilters({
    label,
    children,
    moreFilters,
    onSubmit,
    onClear,
    clearDisabled = false,
    className,
}: TableListFiltersProps): React.JSX.Element {
    const [first, ...rest] = Children.toArray(children);
    const fieldCount = rest.length + (first === undefined ? 0 : 1);
    const gridStyle = { '--tableListFilters-rest': Math.max(fieldCount - 1, 1) } as CSSProperties;
    const collapsible = rest.length > 0 || Boolean(moreFilters);

    const id = useId();
    const fieldsId = `${id}-fields`;
    const moreId = `${id}-more`;
    const fieldsRef = useRef<HTMLDivElement>(null);
    const moreRef = useRef<HTMLDivElement>(null);
    const [open, toggle] = useRememberedOpen('fields');
    const [counts, setCounts] = useState({ fields: 0, more: 0 });

    // Os campos são controlados pela página: a cada renderização, conta os preenchidos em cada
    // região recolhível, para os selos de "Filtros" e de "Mais filtros".
    useLayoutEffect(() => {
        const fields = countActiveFields(fieldsRef.current);
        const more = countActiveFields(moreRef.current);
        setCounts((current) =>
            current.fields === fields && current.more === more ? current : { fields, more },
        );
    });

    const controls = [rest.length > 0 && fieldsId, moreFilters && moreId].filter(Boolean).join(' ');

    return (
        <FormLayout
            className={joinClassNames('tableListFilters', className)}
            aria-label={label}
            data-tour={TABLE_LIST_TOUR_TARGETS.filters}
            onSubmit={(event) => {
                event.preventDefault();
                onSubmit();
            }}
        >
            <div className="tableListFilters__bar">
                {collapsible ? (
                    <button
                        type="button"
                        className="tableListFilters__toggle"
                        aria-expanded={open}
                        aria-controls={controls}
                        onClick={toggle}
                    >
                        Filtros
                        <TableListActiveBadge count={counts.fields + counts.more} />
                        <span className="tableListFilters__chevron" aria-hidden="true" />
                    </button>
                ) : (
                    <span className="tableListFilters__title">Filtros</span>
                )}
                <TableListClearButton disabled={clearDisabled} onClick={onClear} />
            </div>
            <div
                className={joinClassNames(
                    'tableListFilters__grid',
                    fieldCount <= 1 && 'tableListFilters__grid--single',
                )}
                style={gridStyle}
            >
                {first}
                {rest.length > 0 ? (
                    <div
                        id={fieldsId}
                        ref={fieldsRef}
                        className="tableListFilters__region"
                        data-open={open}
                    >
                        <div className="tableListFilters__regionContent tableListFilters__regionContent--fields">
                            {rest}
                        </div>
                    </div>
                ) : null}
                <TableListFilterActions>
                    <TableListClearButton disabled={clearDisabled} onClick={onClear} />
                </TableListFilterActions>
            </div>
            {moreFilters ? (
                <div
                    id={moreId}
                    ref={moreRef}
                    className="tableListFilters__region"
                    data-open={open}
                >
                    <div className="tableListFilters__regionContent">
                        <TableListMoreFilters activeCount={counts.more}>
                            <div className="tableListFilters__more">{moreFilters}</div>
                        </TableListMoreFilters>
                    </div>
                </div>
            ) : null}
        </FormLayout>
    );
}
