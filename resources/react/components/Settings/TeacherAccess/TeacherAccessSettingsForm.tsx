import FieldError from '@/components/Forms/FormField/FieldError';
import FormActions from '@/components/Forms/FormActions/FormActions';
import FormField from '@/components/Forms/FormField/FormField';
import { fieldDescribedBy } from '@/components/Forms/FormField/fieldDescription';
import RemovableField from '@/components/Forms/RemovableField/RemovableField';
import TextInput from '@/components/Forms/TextInput/TextInput';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import FormSection from '@/components/Forms/FormSection/FormSection';
import RepeaterField from '@/components/Forms/RepeaterField/RepeaterField';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { settingsCancelUrl } from '../Settings.routes';
import { SETTINGS_TOUR_TARGETS } from '../settingsTours';
import type { TeacherAccessSettingsProps } from '../Settings.types';
import { useTeacherAccessSettingsForm } from './useTeacherAccessSettingsForm';

/** Domínios aceitos na solicitação do link de acesso de professores. */
export default function TeacherAccessSettingsForm({
    domains,
    canUpdate,
}: TeacherAccessSettingsProps): React.JSX.Element {
    const { form, formRef, errors, disabled, save } = useTeacherAccessSettingsForm({
        domains,
        canUpdate,
    });

    return (
        <FormLayout
            ref={formRef}
            aria-label="Configurações de acesso dos professores"
            aria-busy={form.processing}
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <fieldset disabled={disabled}>
                    <FormSection
                        id="teacher-access-settings"
                        title="Domínios de e-mail aceitos"
                        variant="inline"
                        iconClass="fa fa-envelope"
                        tourTarget={SETTINGS_TOUR_TARGETS.teacherDomains}
                        description="Informe somente o domínio, por exemplo escola.edu.br. Cadastre um ou mais domínios para restringir o acesso por link. Sem domínios, qualquer e-mail de professor cadastrado pode solicitar o link. Esta regra não altera o login com senha nem a recuperação de senha."
                    >
                        <FieldError id="teacher-access-domains" error={errors.domains} />
                        <RepeaterField
                            items={form.data.domains}
                            createItem={() => ({ domain: '' })}
                            onChange={(items) => {
                                form.setData('domains', items);
                                form.clearErrors();
                            }}
                            itemLabel={(index) => `Domínio ${index + 1}`}
                            addLabel="Domínio"
                            emptyMessage="Qualquer domínio é aceito para professores cadastrados."
                            disabled={disabled}
                            removePlacement="field"
                            variant="fields"
                            renderItem={(item, index, update, remove) => (
                                <FormField
                                    id={`teacher-access-domain-${index}`}
                                    label={`Domínio ${index + 1}`}
                                    requiredIndicator
                                    error={errors[`domains.${index}`]}
                                >
                                    <RemovableField
                                        removeLabel={`Remover domínio ${index + 1}`}
                                        disabled={disabled}
                                        onRemove={remove}
                                    >
                                        <TextInput
                                            id={`teacher-access-domain-${index}`}
                                            name={`domains[${index}]`}
                                            required
                                            maxLength={253}
                                            placeholder="escola.edu.br"
                                            value={item.domain}
                                            disabled={disabled}
                                            invalid={Boolean(errors[`domains.${index}`])}
                                            aria-describedby={fieldDescribedBy(
                                                `teacher-access-domain-${index}`,
                                                { error: errors[`domains.${index}`] },
                                            )}
                                            onChange={(event) =>
                                                update({ domain: event.target.value })
                                            }
                                        />
                                    </RemovableField>
                                </FormField>
                            )}
                        />
                    </FormSection>
                </fieldset>
            </CardBox>
            <FormActions
                status={form.processing ? 'Salvando configurações…' : undefined}
                tourTarget={SETTINGS_TOUR_TARGETS.teacherActions}
            >
                <Button
                    href={settingsCancelUrl}
                    tone="cancel"
                    label="Cancelar"
                    disabled={form.processing}
                />
                {canUpdate ? (
                    <Button type="submit" tone="save" label="Salvar" disabled={form.processing} />
                ) : null}
            </FormActions>
        </FormLayout>
    );
}
