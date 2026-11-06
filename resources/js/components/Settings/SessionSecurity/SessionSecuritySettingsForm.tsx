import FormActions from '@/components/Forms/FormActions/FormActions';
import TextInputField from '@/components/Forms/FormFields/TextInputField';
import FormGrid from '@/components/Forms/FormGrid/FormGrid';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import FormSection from '@/components/Forms/FormSection/FormSection';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import InfoTooltip from '@/components/UI/InfoTooltip/InfoTooltip';
import { settingsCancelUrl } from '../Settings.routes';
import type { SessionSecuritySettingsProps } from '../Settings.types';
import { SETTINGS_TOUR_TARGETS } from '../settingsTours';
import { useSessionSecuritySettingsForm } from './useSessionSecuritySettingsForm';

export default function SessionSecuritySettingsForm(
    props: SessionSecuritySettingsProps,
): React.JSX.Element {
    const { form, formRef, save } = useSessionSecuritySettingsForm(props);

    return (
        <FormLayout
            ref={formRef}
            aria-label="Configurações de segurança e sessões"
            aria-busy={form.processing}
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <fieldset disabled={form.processing}>
                    <FormSection
                        id="session-security-settings"
                        title="Inatividade da sessão"
                        variant="inline"
                        iconClass="fa fa-lock"
                        tourTarget={SETTINGS_TOUR_TARGETS.sessionTimeouts}
                        titleAddon={
                            <InfoTooltip
                                label="Mais informações sobre a inatividade da sessão"
                                text="Defina os prazos em minutos, contados desde a última atividade. Consultas automáticas não prolongam a sessão. Professores sem senha própria não passam pela tela de bloqueio, mas também são desconectados ao atingir o prazo de encerramento."
                            />
                        }
                    >
                        <FormGrid>
                            <TextInputField
                                id="session-lock-after"
                                name="lock_after"
                                type="number"
                                min={1}
                                step={1}
                                label="Bloquear tela após (minutos)"
                                hint="Para contas com senha própria. O bloqueio vale para todas as abas da mesma sessão."
                                hintLabel="Mais informações sobre o prazo de bloqueio"
                                required
                                readOnly={!props.canUpdate}
                                value={form.data.lock_after}
                                error={form.errors.lock_after}
                                onChange={(value) => form.setData('lock_after', value)}
                            />
                            <TextInputField
                                id="session-logout-after"
                                name="logout_after"
                                type="number"
                                min={2}
                                step={1}
                                label="Encerrar sessão após (minutos)"
                                hint="Deve ser maior que o prazo de bloqueio. Inclui o tempo na tela bloqueada."
                                hintLabel="Mais informações sobre o prazo de encerramento"
                                required
                                readOnly={!props.canUpdate}
                                value={form.data.logout_after}
                                error={form.errors.logout_after}
                                onChange={(value) => form.setData('logout_after', value)}
                            />
                        </FormGrid>
                    </FormSection>
                </fieldset>
            </CardBox>
            <FormActions
                status={form.processing ? 'Salvando configurações…' : undefined}
                tourTarget={SETTINGS_TOUR_TARGETS.sessionActions}
            >
                <Button
                    href={settingsCancelUrl}
                    tone="cancel"
                    label="Cancelar"
                    disabled={form.processing}
                />
                {props.canUpdate ? (
                    <Button type="submit" tone="save" label="Salvar" disabled={form.processing} />
                ) : null}
            </FormActions>
        </FormLayout>
    );
}
