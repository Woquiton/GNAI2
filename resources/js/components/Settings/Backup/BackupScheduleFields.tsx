import ClockPicker from '@/components/Forms/ClockPicker/ClockPicker';
import FormField from '@/components/Forms/FormField/FormField';
import { fieldDescribedBy } from '@/components/Forms/FormField/fieldDescription';
import FormSection from '@/components/Forms/FormSection/FormSection';
import RemovableField from '@/components/Forms/RemovableField/RemovableField';
import Button from '@/components/UI/Button/Button';
import InfoTooltip from '@/components/UI/InfoTooltip/InfoTooltip';
import { SETTINGS_TOUR_TARGETS } from '../settingsTours';
import { MAX_BACKUP_TIMES, type BackupSettingsFormState } from './useBackupSettingsForm';
import '@styles/components/Settings/Backup/BackupSettings.css';

interface BackupScheduleFieldsProps {
    state: BackupSettingsFormState;
    timezone: string;
    canUpdate: boolean;
}

/** Horários diários do backup automático, com inclusão e remoção de horários. */
export default function BackupScheduleFields({
    state,
    timezone,
    canUpdate,
}: BackupScheduleFieldsProps): React.JSX.Element {
    const { form, errors, timeKeys, changeTime, addTime, removeTime } = state;
    const disabled = !canUpdate || form.processing;
    const tooltip = (
        <InfoTooltip
            text={`As cópias serão feitas todos os dias nos horários informados. Os horários seguem o fuso ${timezone}.`}
            label="Mais informações sobre os horários de backup"
        />
    );

    return (
        <FormSection
            id="backup-schedule"
            title="Backup automático"
            variant="inline"
            iconClass="fa fa-clock-o"
            titleAddon={tooltip}
            tourTarget={SETTINGS_TOUR_TARGETS.backupSchedule}
        >
            <div className="backupSettings__times">
                {form.data.times.map((time, index) => {
                    const id = `backup-time-${timeKeys[index]}`;
                    const label = `Horário ${index + 1}`;
                    const error = errors[`times.${index}`];

                    return (
                        <div className="backupSettings__time" key={timeKeys[index]}>
                            <FormField id={id} label={label} error={error} requiredIndicator>
                                <RemovableField
                                    removeLabel={`Remover horário ${index + 1}`}
                                    disabled={disabled || form.data.times.length <= 1}
                                    onRemove={() => removeTime(index)}
                                >
                                    <ClockPicker
                                        id={id}
                                        label={label}
                                        required
                                        defaultValue={time}
                                        invalid={Boolean(error)}
                                        describedBy={fieldDescribedBy(id, { error })}
                                        onChange={(value) => changeTime(index, value)}
                                    />
                                </RemovableField>
                            </FormField>
                        </div>
                    );
                })}
            </div>
            {errors.times ? <p className="formField__error">{errors.times}</p> : null}
            {canUpdate ? (
                <Button
                    type="button"
                    tone="white"
                    className="removableField__add"
                    labelIconClass="fa fa-plus"
                    label="Adicionar horário"
                    title="Adicionar horário de backup"
                    disabled={form.processing || form.data.times.length >= MAX_BACKUP_TIMES}
                    onClick={addTime}
                />
            ) : null}
        </FormSection>
    );
}
