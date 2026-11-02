import { optionsFromRecord, SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import type { SettingsOptions } from '../Settings.types';
import type { BackupSettingsFormState } from './useBackupSettingsForm';

interface BackupRetentionFieldsProps {
    form: BackupSettingsFormState['form'];
    retentionModes: SettingsOptions;
    disabled: boolean;
}

/** Modo de retenção (dias ou quantidade de cópias) e o valor correspondente. */
export default function BackupRetentionFields({
    form,
    retentionModes,
    disabled,
}: BackupRetentionFieldsProps): React.JSX.Element {
    const byDays = form.data.retention_mode === 'days';
    const valueLabel = byDays ? 'Dias de retenção' : 'Quantidade de backups mantidos';
    const valueHint = byDays
        ? 'Informe por quantos dias as cópias devem ser guardadas, de 1 a 365. As mais antigas serão removidas; a cópia mais recente será mantida.'
        : 'Informe quantas cópias recentes deseja guardar, de 1 a 365. As cópias que excederem essa quantidade serão removidas.';

    return (
        <FormSection
            id="backup-retention"
            title="Retenção"
            variant="inline"
            iconClass="fa fa-history"
        >
            <FormGrid>
                <SelectInputField
                    id="backup-retention-mode"
                    name="retention_mode"
                    label="Como manter os backups"
                    required
                    hint="Escolha se deseja guardar as cópias por um número de dias ou manter uma quantidade de cópias recentes."
                    hintLabel="Mais informações sobre a retenção de backups"
                    disabled={disabled}
                    options={optionsFromRecord(retentionModes)}
                    value={form.data.retention_mode}
                    error={form.errors.retention_mode}
                    onChange={(value) => form.setData('retention_mode', value)}
                />
                <TextInputField
                    id="backup-retention-value"
                    name="retention_value"
                    type="number"
                    label={valueLabel}
                    required
                    min={1}
                    max={365}
                    inputMode="numeric"
                    hint={valueHint}
                    hintLabel="Mais informações sobre quantos backups manter"
                    value={form.data.retention_value}
                    error={form.errors.retention_value}
                    onChange={(value) => form.setData('retention_value', value)}
                />
            </FormGrid>
        </FormSection>
    );
}
