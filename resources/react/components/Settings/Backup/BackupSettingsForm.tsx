import FormActions from '@/components/Forms/FormActions/FormActions';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { settingsCancelUrl } from '../Settings.routes';
import type { BackupSettingsProps } from '../Settings.types';
import BackupRetentionFields from './BackupRetentionFields';
import BackupScheduleFields from './BackupScheduleFields';
import { useBackupSettingsForm } from './useBackupSettingsForm';

/** Retenção e horários do backup automático. */
export default function BackupSettingsForm({
    backup,
    retentionModes,
    timezone,
    canUpdate,
}: Omit<BackupSettingsProps, 'defaults'>): React.JSX.Element {
    const state = useBackupSettingsForm({ backup, canUpdate });
    const { form, formRef, save } = state;
    const disabled = !canUpdate || form.processing;

    return (
        <FormLayout
            ref={formRef}
            aria-label="Configurações de backup"
            aria-busy={form.processing}
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <fieldset disabled={disabled}>
                    <BackupRetentionFields
                        form={form}
                        retentionModes={retentionModes}
                        disabled={disabled}
                    />
                    <BackupScheduleFields state={state} timezone={timezone} canUpdate={canUpdate} />
                </fieldset>
            </CardBox>
            <FormActions status={form.processing ? 'Salvando configurações de backup...' : ''}>
                <Button
                    href={settingsCancelUrl}
                    tone="cancel"
                    label="Cancelar"
                    title="Cancelar e voltar ao início"
                    aria-label="Cancelar e voltar ao início"
                    disabled={form.processing}
                />
                {canUpdate ? (
                    <Button
                        type="submit"
                        tone="save"
                        leftIconClass="fa fa-check"
                        label="Salvar"
                        title="Salvar configurações de backup"
                        aria-label={
                            form.processing
                                ? 'Salvando configurações de backup'
                                : 'Salvar configurações de backup'
                        }
                        disabled={form.processing}
                    />
                ) : null}
            </FormActions>
        </FormLayout>
    );
}
