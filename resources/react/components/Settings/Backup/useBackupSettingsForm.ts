import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { settingsUrls } from '../Settings.routes';
import type { BackupSettingsProps } from '../Settings.types';

export interface BackupSettingsFormData {
    retention_mode: string;
    retention_value: string;
    times: string[];
}

/** Limite de horários diários aceitos pelo backend. */
export const MAX_BACKUP_TIMES = 6;

/**
 * Estado das configurações de backup. Cada horário recebe uma chave estável, independente da
 * posição: remover um horário intermediário não reaproveita o `ClockPicker` (não controlado) dos
 * seguintes. O payload continua sendo o array `times`.
 */
export function useBackupSettingsForm({
    backup,
    canUpdate,
}: Pick<BackupSettingsProps, 'backup' | 'canUpdate'>) {
    const form = useForm<BackupSettingsFormData>({
        retention_mode: backup.retention_mode,
        retention_value: String(backup.retention_value),
        times: backup.times.length ? backup.times : [''],
    });
    const { formRef, submit } = useFormSubmission(form);
    const nextKey = useRef(form.data.times.length);
    const [timeKeys, setTimeKeys] = useState(() => form.data.times.map((_, index) => index));
    const errors = form.errors as Record<string, string | undefined>;

    // Os erros dos horários são indexados; ao mudar a lista, deixam de corresponder.
    function setTimes(times: string[]): void {
        form.setData('times', times);
        form.clearErrors();
    }

    function changeTime(index: number, value: string): void {
        setTimes(
            form.data.times.map((current, position) => (position === index ? value : current)),
        );
    }

    function addTime(): void {
        setTimeKeys((keys) => [...keys, nextKey.current++]);
        setTimes([...form.data.times, '']);
    }

    function removeTime(index: number): void {
        setTimeKeys((keys) => keys.filter((_, position) => position !== index));
        setTimes(form.data.times.filter((_, position) => position !== index));
    }

    function save(): void {
        submit({
            url: settingsUrls.backup,
            method: 'put',
            failureText:
                'Não foi possível concluir a operação. Atualize a página e tente novamente.',
            blocked: !canUpdate,
        });
    }

    return { form, errors, formRef, timeKeys, changeTime, addTime, removeTime, save };
}

export type BackupSettingsFormState = ReturnType<typeof useBackupSettingsForm>;
