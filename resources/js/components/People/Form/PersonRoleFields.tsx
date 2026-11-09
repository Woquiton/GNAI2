import FormSection from '@/components/Forms/FormSection/FormSection';
import FormGrid from '@/components/Forms/FormGrid/FormGrid';
import {
    TextInputField,
    DateInputField,
    SelectInputField,
    CheckboxListField,
} from '@/components/Forms/FormFields/FormFields';
import { optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import Button from '@/components/UI/Button/Button';
import FieldError from '@/components/Forms/FormField/FieldError';
import type { PersonFormProps, PersonRole } from '../People.types';
import type { PersonFormState } from './usePersonForm';

export default function PersonRoleFields({
    state,
    options,
    role,
}: {
    state: PersonFormState;
    options: PersonFormProps;
    role: PersonRole;
}): React.JSX.Element {
    const { form, updateDetails } = state;
    const fields = form.data.details[role];
    const errors = form.errors as Record<string, string | undefined>;
    const disabled = form.processing || !options.canRoles[role];
    const prefix = `details.${role}`;
    const label = options.specialTags.find((tag) => tag.system_key === role)?.name ?? role;
    const oldLinks = options.person?.guardians ?? [];
    function updateLink(index: number, key: 'student_id' | 'relationship', value: string) {
        updateDetails(role, {
            links: fields.links.map((link, position) =>
                position === index ? { ...link, [key]: value } : link,
            ),
        });
    }
    return (
        <FormSection variant="inline" title={label} iconClass="fa fa-tag">
            <fieldset disabled={disabled}>
                {role === 'guardian' ? (
                    <>
                        <FieldError id="person-guardian-links" error={errors[`${prefix}.links`]} />
                        {fields.links.map((link, index) => (
                            <FormGrid key={index}>
                                <SelectInputField
                                    id={`person-guardian-student-${index}`}
                                    name={`${prefix}.links.${index}.student_id`}
                                    label="Aluno"
                                    required
                                    disabled={disabled || index < oldLinks.length}
                                    value={link.student_id}
                                    options={options.students.map((student) => ({
                                        value: String(student.id),
                                        label: student.name,
                                    }))}
                                    error={errors[`${prefix}.links.${index}.student_id`]}
                                    onChange={(value) => updateLink(index, 'student_id', value)}
                                />
                                <SelectInputField
                                    disabled={disabled}
                                    id={`person-guardian-relationship-${index}`}
                                    name={`${prefix}.links.${index}.relationship`}
                                    label="Parentesco / vínculo"
                                    required
                                    value={link.relationship}
                                    options={optionsFromRecord(options.relationships)}
                                    error={errors[`${prefix}.links.${index}.relationship`]}
                                    onChange={(value) => updateLink(index, 'relationship', value)}
                                />
                                {index >= oldLinks.length ? (
                                    <Button
                                        type="button"
                                        tone="cancel"
                                        label="Remover vínculo"
                                        onClick={() =>
                                            updateDetails(role, {
                                                links: fields.links.filter(
                                                    (_, position) => position !== index,
                                                ),
                                            })
                                        }
                                    />
                                ) : null}
                            </FormGrid>
                        ))}
                        <Button
                            type="button"
                            tone="white"
                            label="Adicionar aluno"
                            onClick={() =>
                                updateDetails(role, {
                                    links: [...fields.links, { student_id: '', relationship: '' }],
                                })
                            }
                        />
                    </>
                ) : (
                    <FormGrid>
                        <TextInputField
                            id={`person-${role}-registration`}
                            name={`${prefix}.registration`}
                            label="Matrícula"
                            required
                            value={fields.registration}
                            error={errors[`${prefix}.registration`]}
                            onChange={(value) => updateDetails(role, { registration: value })}
                        />
                        {role !== 'teacher' ? (
                            <DateInputField
                                disabled={disabled}
                                id={`person-${role}-entry`}
                                name={`${prefix}.entry_date`}
                                label="Data de ingresso"
                                required={role === 'professional'}
                                value={fields.entry_date}
                                error={errors[`${prefix}.entry_date`]}
                                onChange={(value) => updateDetails(role, { entry_date: value })}
                            />
                        ) : null}
                        {role !== 'teacher' ? (
                            <SelectInputField
                                disabled={disabled}
                                id={`person-${role}-status`}
                                name={`${prefix}.status`}
                                label="Situação"
                                required
                                value={fields.status}
                                options={optionsFromRecord(
                                    role === 'student'
                                        ? options.studentStatuses
                                        : options.professionalStatuses,
                                )}
                                error={errors[`${prefix}.status`]}
                                onChange={(value) => updateDetails(role, { status: value })}
                            />
                        ) : null}
                        {role === 'student' ? (
                            <SelectInputField
                                disabled={disabled}
                                id="person-follow-up"
                                name={`${prefix}.follow_up_type`}
                                label="Tipo de acompanhamento"
                                required={fields.status === 'active'}
                                value={fields.follow_up_type}
                                options={optionsFromRecord(options.followUpTypes)}
                                error={errors[`${prefix}.follow_up_type`]}
                                onChange={(value) => updateDetails(role, { follow_up_type: value })}
                            />
                        ) : null}
                        {role === 'professional' ? (
                            <SelectInputField
                                disabled={disabled}
                                id="person-position"
                                name={`${prefix}.position_id`}
                                label="Cargo"
                                required
                                value={fields.position_id}
                                options={options.positions.map((position) => ({
                                    value: String(position.id),
                                    label: position.name,
                                }))}
                                error={errors[`${prefix}.position_id`]}
                                onChange={(value) => updateDetails(role, { position_id: value })}
                            />
                        ) : null}
                        {role === 'professional' ? (
                            <CheckboxListField
                                id="person-website"
                                name={`${prefix}.show_on_website`}
                                label="Site público"
                                options={[{ value: 'visible', label: 'Exibir na equipe do site' }]}
                                value={fields.show_on_website ? ['visible'] : []}
                                error={errors[`${prefix}.show_on_website`]}
                                onChange={(values) =>
                                    updateDetails(role, {
                                        show_on_website: values.includes('visible'),
                                    })
                                }
                            />
                        ) : null}
                    </FormGrid>
                )}
            </fieldset>
        </FormSection>
    );
}
