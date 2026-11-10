import { booleanOptions } from '@/components/Forms/FormFields/fieldOptions';
import TableListCreatedFilters from '@/components/Tables/TableList/TableListCreatedFilters';
import { TextInputField, SelectInputField } from '@/components/Forms/FormFields/FormFields';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import type { PublicationFilters as Filters, SelectOption } from '../Publications.types';
export default function PublicationFilters({
    values,
    types,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: {
    values: Filters;
    types: SelectOption[];
    errors: Record<string, string | undefined>;
    onUpdate: (key: keyof Filters, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}): React.JSX.Element {
    return (
        <TableListFilters
            moreFilters={
                <>
                    <TextInputField
                        id="publications-filter-author_name"
                        name="author_name"
                        label="Autor"
                        maxLength={255}
                        value={values.author_name}
                        error={errors.author_name}
                        onChange={(value) => onUpdate('author_name', value)}
                    />
                    <TextInputField
                        id="publications-filter-tag_name"
                        name="tag_name"
                        label="Etiqueta"
                        maxLength={255}
                        value={values.tag_name}
                        error={errors.tag_name}
                        onChange={(value) => onUpdate('tag_name', value)}
                    />
                    <SelectInputField
                        id="publications-filter-is_featured"
                        name="is_featured"
                        label="Em destaque"
                        placeholder="Todos"
                        options={booleanOptions('Sim', 'Não')}
                        value={values.is_featured}
                        error={errors.is_featured}
                        onChange={(value) => onUpdate('is_featured', value)}
                    />
                    <TableListCreatedFilters values={values} errors={errors} onUpdate={onUpdate} />
                </>
            }
            label="Filtrar publicações"
            onSubmit={onSubmit}
            onClear={onClear}
        >
            <TextInputField
                id="publication-title-filter"
                name="title"
                label="Título"
                value={values.title}
                maxLength={255}
                placeholder="Filtrar por título..."
                error={errors.title}
                onChange={(value) => onUpdate('title', value)}
            />
            <SelectInputField
                id="publication-type-filter"
                name="type"
                label="Tipo"
                placeholder="Todos"
                value={values.type}
                options={types}
                error={errors.type}
                onChange={(value) => onUpdate('type', value)}
            />
            <SelectInputField
                id="publication-status-filter"
                name="is_active"
                label="Situação"
                placeholder="Todas"
                value={values.is_active}
                options={[
                    { value: '1', label: 'Publicado' },
                    { value: '0', label: 'Rascunho' },
                ]}
                error={errors.is_active}
                onChange={(value) => onUpdate('is_active', value)}
            />
        </TableListFilters>
    );
}
