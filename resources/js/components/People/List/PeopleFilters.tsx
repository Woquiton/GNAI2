import TableListCreatedFilters from '@/components/Tables/TableList/TableListCreatedFilters';
import '@styles/components/Tags/TagSelect.css';
import { TableListFilters } from '@/components/Tables/TableList/TableList';
import { TextInputField, SelectInputField } from '@/components/Forms/FormFields/FormFields';
import type { PeopleIndexProps, PersonFilters } from '../People.types';

export default function PeopleFilters({
    values,
    tags,
    errors,
    onUpdate,
    onClear,
    onSubmit,
}: {
    values: PersonFilters;
    tags: PeopleIndexProps['tags'];
    errors: Record<string, string | undefined>;
    onUpdate: (field: keyof PersonFilters, value: string) => void;
    onClear: () => void;
    onSubmit: () => void;
}): React.JSX.Element {
    return (
        <TableListFilters
            moreFilters={
                <>
                    <TextInputField
                        id="people-filter-email"
                        name="email"
                        label="E-mail"
                        value={values.email}
                        maxLength={255}
                        error={errors.email}
                        onChange={(value) => onUpdate('email', value)}
                    />
                    <TextInputField
                        id="people-filter-phone"
                        name="phone"
                        label="Telefone"
                        value={values.phone}
                        maxLength={255}
                        error={errors.phone}
                        onChange={(value) => onUpdate('phone', value)}
                    />
                    <TableListCreatedFilters values={values} errors={errors} onUpdate={onUpdate} />
                </>
            }
            label="Filtrar pessoas"
            onSubmit={onSubmit}
            onClear={onClear}
        >
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
