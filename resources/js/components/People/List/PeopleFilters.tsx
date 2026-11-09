import '@styles/components/Tags/TagSelect.css';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import { TextInputField, SelectInputField } from '@/components/Forms/FormFields/FormFields';
import type { PeopleIndexProps } from '../People.types';

export default function PeopleFilters({
    values,
    tags,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: {
    values: { name: string; tag_id: string };
    tags: PeopleIndexProps['tags'];
    errors: Record<string, string | undefined>;
    onUpdate: (field: 'name' | 'tag_id', value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}): React.JSX.Element {
    return (
        <TableListFilters label="Filtrar pessoas" onSubmit={onSubmit} onClear={onClear}>
            <TextInputField
                id="people-name"
                name="name"
                label="Nome"
                error={errors.name}
                value={values.name}
                onChange={(value) => onUpdate('name', value)}
            />
            <SelectInputField
                id="people-tags"
                name="tag_id"
                label="Etiquetas"
                error={errors.tag_id}
                value={values.tag_id}
                placeholder="Todas"
                iconsWithText
                options={tags.map((tag) => ({
                    value: String(tag.id),
                    label: tag.name,
                    ...(tag.system_key
                        ? {
                              iconClass: 'fa fa-star',
                              iconColor: 'var(--ui-color-special-tag)',
                              iconLabel: 'Etiqueta Especial',
                          }
                        : {}),
                }))}
                onChange={(value) => onUpdate('tag_id', value)}
            />
        </TableListFilters>
    );
}
