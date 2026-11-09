import type { PersonFormProps, PersonRole } from '../People.types';
import type { PersonFormState } from './usePersonForm';

export function usePersonTags(options: PersonFormProps, state: PersonFormState) {
    const { form, existingRoles } = state;
    const selectedTags = options.person?.tags ?? [];
    const ordinaryTags = [
        ...options.tags,
        ...selectedTags.filter((tag) => !options.tags.some((option) => option.id === tag.id)),
    ];
    const tagOptions = [
        ...options.specialTags
            .filter(
                (tag) => options.canRoles[tag.system_key] || existingRoles.includes(tag.system_key),
            )
            .map((tag) => ({
                value: `role:${tag.system_key}`,
                label: tag.name,
                iconClass: 'fa fa-star',
                iconColor: 'var(--ui-color-special-tag)',
                iconLabel: 'Etiqueta Especial',
            })),
        ...ordinaryTags.map((tag) => ({ value: `tag:${tag.id}`, label: tag.name })),
    ].sort((left, right) => left.label.localeCompare(right.label, 'pt-BR'));
    const selectedValues = [
        ...form.data.roles.map((role) => `role:${role}`),
        ...form.data.tag_ids.map((id) => `tag:${id}`),
    ];
    const tagsError =
        form.errors.roles ??
        form.errors.tag_ids ??
        Object.entries(form.errors).find(
            ([key]) => key.startsWith('tag_ids.') || key.startsWith('roles.'),
        )?.[1];
    function selectTags(values: string[]) {
        const roles = options.specialTags
            .filter((tag) => values.includes(`role:${tag.system_key}`))
            .map((tag) => tag.system_key);
        const ids = ordinaryTags
            .filter((tag) => values.includes(`tag:${tag.id}`))
            .map((tag) => tag.id);
        form.setData((data) => ({
            ...data,
            roles: [...new Set<PersonRole>([...existingRoles, ...roles])],
            tag_ids: ids,
        }));
    }
    return { tagOptions, selectedValues, tagsError, selectTags };
}
