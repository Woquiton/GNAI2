import '@styles/components/Tags/TagSelect.css';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import FormActions from '@/components/Forms/FormActions/FormActions';
import FormField from '@/components/Forms/FormField/FormField';
import SelectField from '@/components/Forms/SelectField/SelectField';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import type { PersonFormProps } from '../People.types';
import { personUrls } from '../People.routes';
import { usePersonForm } from './usePersonForm';
import { usePersonTags } from './usePersonTags';
import PersonIdentityFields from './PersonIdentityFields';
import PersonRoleFields from './PersonRoleFields';

export default function PersonForm(options: PersonFormProps): React.JSX.Element {
    const state = usePersonForm(options);
    const { form, formRef, save, existingRoles } = state;
    const { tagOptions, selectedValues, tagsError, selectTags } = usePersonTags(options, state);
    return (
        <FormLayout
            ref={formRef}
            aria-label="Cadastro central de pessoas"
            aria-busy={form.processing}
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <fieldset disabled={form.processing}>
                    <PersonIdentityFields
                        state={state}
                        options={options}
                        tags={
                            <div data-tour="person-roles">
                                <FormField
                                    id="person-tags"
                                    label="Etiquetas"
                                    error={tagsError}
                                    hint={
                                        existingRoles.length
                                            ? 'Para remover uma etiqueta especial já cadastrada, utilize a exclusão do respectivo cadastro, que verifica seus vínculos e históricos.'
                                            : undefined
                                    }
                                >
                                    <SelectField
                                        id="person-tags"
                                        name="etiquetas"
                                        label="Etiquetas"
                                        multiple
                                        iconsWithText
                                        disabled={form.processing}
                                        options={tagOptions}
                                        value={selectedValues}
                                        invalid={Boolean(tagsError)}
                                        aria-describedby={
                                            [
                                                tagsError ? 'person-tags-error' : undefined,
                                                existingRoles.length
                                                    ? 'person-tags-hint'
                                                    : undefined,
                                            ]
                                                .filter(Boolean)
                                                .join(' ') || undefined
                                        }
                                        onChange={(event) =>
                                            selectTags(
                                                Array.from(
                                                    event.target.selectedOptions,
                                                    (option) => option.value,
                                                ),
                                            )
                                        }
                                    />
                                </FormField>
                            </div>
                        }
                    />
                    <div data-tour="person-details">
                        {form.data.roles.map((role) => (
                            <PersonRoleFields
                                key={role}
                                state={state}
                                options={options}
                                role={role}
                            />
                        ))}
                    </div>
                </fieldset>
            </CardBox>
            <FormActions status={form.processing ? 'Salvando pessoa e seus cadastros...' : ''}>
                <Button
                    href={personUrls.index}
                    tone="cancel"
                    label="Cancelar"
                    disabled={form.processing}
                />
                {options.canSave ? (
                    <Button
                        type="submit"
                        tone="save"
                        label="Salvar"
                        disabled={form.processing || state.editorFailed || state.photoValidating}
                    />
                ) : null}
            </FormActions>
        </FormLayout>
    );
}
