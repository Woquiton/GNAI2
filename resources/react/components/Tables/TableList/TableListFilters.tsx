import { Children, type CSSProperties, type ReactNode } from 'react';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import { joinClassNames } from '@/utils/joinClassNames';
import TableListMoreFilters from './TableListMoreFilters';
import { TableListClearButton, TableListFilterActions } from './TableListControls';

interface TableListFiltersProps {
    /** Nome acessível do formulário, por exemplo "Filtrar itens". */
    label: string;
    /** Campos principais. O primeiro ocupa uma coluna mais larga, como a busca por nome. */
    children: ReactNode;
    /** Campos do acordeão "Mais filtros". */
    moreFilters?: ReactNode;
    /** Abre "Mais filtros" quando algum filtro complementar estiver preenchido. */
    moreFiltersActive?: boolean;
    onSubmit: () => void;
    onClear: () => void;
    clearDisabled?: boolean;
    className?: string;
}

/**
 * Barra de filtros das listagens: grade responsiva com os campos principais, botão de limpar
 * alinhado ao final e acordeão opcional de filtros complementares.
 */
export default function TableListFilters({
    label,
    children,
    moreFilters,
    moreFiltersActive = false,
    onSubmit,
    onClear,
    clearDisabled = false,
    className,
}: TableListFiltersProps): React.JSX.Element {
    const fieldCount = Children.toArray(children).length;
    const gridStyle = { '--tableListFilters-rest': Math.max(fieldCount - 1, 1) } as CSSProperties;

    return (
        <FormLayout
            className={joinClassNames('tableListFilters', className)}
            aria-label={label}
            onSubmit={(event) => {
                event.preventDefault();
                onSubmit();
            }}
        >
            <div
                className={joinClassNames(
                    'tableListFilters__grid',
                    fieldCount <= 1 && 'tableListFilters__grid--single',
                )}
                style={gridStyle}
            >
                {children}
                <TableListFilterActions>
                    <TableListClearButton disabled={clearDisabled} onClick={onClear} />
                </TableListFilterActions>
            </div>
            {moreFilters ? (
                <TableListMoreFilters active={moreFiltersActive}>
                    <div className="tableListFilters__more">{moreFilters}</div>
                </TableListMoreFilters>
            ) : null}
        </FormLayout>
    );
}
