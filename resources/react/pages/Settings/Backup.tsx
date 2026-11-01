import { useRef } from "react";
import { useForm } from "@inertiajs/react";
import ClockPicker from "@/components/Forms/ClockPicker/ClockPicker";
import FormActions from "@/components/Forms/FormActions/FormActions";
import FormField from "@/components/Forms/FormField/FormField";
import FormGrid from "@/components/Forms/FormGrid/FormGrid";
import FormLayout from "@/components/Forms/FormLayout/FormLayout";
import FormSection from "@/components/Forms/FormSection/FormSection";
import RemovableField from "@/components/Forms/RemovableField/RemovableField";
import InfoTooltip from "@/components/UI/InfoTooltip/InfoTooltip";
import SelectField from "@/components/Forms/SelectField/SelectField";
import TextInput from "@/components/Forms/TextInput/TextInput";
import Button from "@/components/UI/Button/Button";
import CardBox from "@/components/UI/CardBox/CardBox";
import { notify } from "@/components/UI/NotificationToast/notify";
import { settingsBase, SettingsLayout } from "./SettingsPage";
import type { BackupSettingsProps } from "./Settings.types";

const MAX_TIMES = 6;

type FormData = {
    retention_mode: string;
    retention_value: string;
    times: string[];
};

export default function SettingsBackup({
    backup,
    retentionModes,
    timezone,
    canUpdate,
}: BackupSettingsProps): React.JSX.Element {
    const form = useForm<FormData>({
        retention_mode: backup.retention_mode,
        retention_value: String(backup.retention_value),
        times: backup.times.length ? backup.times : [""],
    });
    const busy = useRef(false);
    const timeSequence = useRef(form.data.times.length);
    const timeKeys = useRef(form.data.times.map((_, index) => index));
    const element = useRef<HTMLFormElement>(null);
    const errors = form.errors as Record<string, string | undefined>;
    const byDays = form.data.retention_mode === "days";
    const timeError = (index: number): string | undefined =>
        errors[`times.${index}`];
    const describedBy = (id: string, error?: string): string | undefined =>
        [error ? `${id}-error` : null]
            .filter(Boolean)
            .join(" ") || undefined;
    const updateTimes = (times: string[], removedIndex?: number): void => {
        if (removedIndex !== undefined) {
            timeKeys.current = timeKeys.current.filter((_, index) => index !== removedIndex);
        } else if (times.length > timeKeys.current.length) {
            timeKeys.current.push(timeSequence.current++);
        }
        // Os erros dos horários são indexados; ao mudar a lista, deixam de corresponder.
        form.setData("times", times);
        form.clearErrors();
    };

    return (
        <FormLayout
            ref={element}
            aria-label="Configurações de backup"
            aria-busy={form.processing}
            onSubmit={(event) => {
                event.preventDefault();
                if (!canUpdate || busy.current || form.processing) return;
                busy.current = true;
                form.put(`${settingsBase}/backups`, {
                    preserveScroll: true,
                    onError: () =>
                        requestAnimationFrame(() =>
                            element.current
                                ?.querySelector<HTMLElement>(
                                    '[aria-invalid="true"]',
                                )
                                ?.focus(),
                        ),
                    onHttpException: () => {
                        notify({
                            tone: "error",
                            title: "Não foi possível concluir",
                            text: "Não foi possível concluir a operação. Atualize a página e tente novamente.",
                        });
                        return false;
                    },
                    onNetworkError: () => {
                        notify({
                            tone: "error",
                            title: "Falha de conexão",
                            text: "Não foi possível conectar ao servidor. Confira sua conexão e tente novamente.",
                        });
                        return false;
                    },
                    onFinish: () => {
                        busy.current = false;
                    },
                });
            }}
        >
            <CardBox>
                <fieldset disabled={!canUpdate || form.processing}>
                    <FormSection
                        id="backup-retention"
                        title="Retenção"
                        variant="inline"
                        iconClass="fa fa-history"
                    >
                        <FormGrid>
                            <FormField
                                id="backup-retention-mode"
                                label="Como manter os backups"
                                hint="Escolha se deseja guardar as cópias por um número de dias ou manter uma quantidade de cópias recentes."
                                hintLabel="Mais informações sobre a retenção de backups"
                                error={form.errors.retention_mode}
                                requiredIndicator
                            >
                                <SelectField
                                    id="backup-retention-mode"
                                    name="retention_mode"
                                    label="Como manter os backups"
                                    required
                                    disabled={!canUpdate || form.processing}
                                    value={form.data.retention_mode}
                                    aria-invalid={!!form.errors.retention_mode}
                                    aria-describedby={describedBy(
                                        "backup-retention-mode",
                                        form.errors.retention_mode,
                                    )}
                                    options={Object.entries(retentionModes).map(
                                        ([value, label]) => ({ value, label }),
                                    )}
                                    onChange={(event) =>
                                        form.setData(
                                            "retention_mode",
                                            event.target.value,
                                        )
                                    }
                                />
                            </FormField>
                            <FormField
                                id="backup-retention-value"
                                label={
                                    byDays
                                        ? "Dias de retenção"
                                        : "Quantidade de backups mantidos"
                                }
                                hint={
                                    byDays
                                        ? "Informe por quantos dias as cópias devem ser guardadas, de 1 a 365. As mais antigas serão removidas; a cópia mais recente será mantida."
                                        : "Informe quantas cópias recentes deseja guardar, de 1 a 365. As cópias que excederem essa quantidade serão removidas."
                                }
                                hintLabel="Mais informações sobre quantos backups manter"
                                error={form.errors.retention_value}
                                requiredIndicator
                            >
                                <TextInput
                                    id="backup-retention-value"
                                    name="retention_value"
                                    type="number"
                                    required
                                    min={1}
                                    max={365}
                                    inputMode="numeric"
                                    value={form.data.retention_value}
                                    invalid={!!form.errors.retention_value}
                                    aria-describedby={describedBy(
                                        "backup-retention-value",
                                        form.errors.retention_value,
                                    )}
                                    onChange={(event) =>
                                        form.setData(
                                            "retention_value",
                                            event.target.value,
                                        )
                                    }
                                />
                            </FormField>
                        </FormGrid>
                    </FormSection>
                    <FormSection
                        id="backup-schedule"
                        title="Backup automático"
                        variant="inline"
                        iconClass="fa fa-clock-o"
                        titleAddon={
                            <InfoTooltip
                                text={`As cópias serão feitas todos os dias nos horários informados. Os horários seguem o fuso ${timezone}.`}
                                label="Mais informações sobre os horários de backup"
                            />
                        }
                    >
                        <div className="settingsPage__times">
                            {form.data.times.map((time, index) => (
                                <div
                                    className="settingsPage__time"
                                    key={timeKeys.current[index]}
                                >
                                    <FormField
                                        id={`backup-time-${timeKeys.current[index]}`}
                                        label={`Horário ${index + 1}`}
                                        error={timeError(index)}
                                        requiredIndicator
                                    >
                                        <RemovableField
                                            removeLabel={`Remover horário ${index + 1}`}
                                            disabled={!canUpdate || form.processing || form.data.times.length <= 1}
                                            onRemove={() => updateTimes(form.data.times.filter((_, position) => position !== index), index)}
                                        >
                                            <ClockPicker
                                                id={`backup-time-${timeKeys.current[index]}`}
                                                label={`Horário ${index + 1}`}
                                                required
                                                defaultValue={time}
                                                invalid={!!timeError(index)}
                                                describedBy={describedBy(
                                                    `backup-time-${timeKeys.current[index]}`,
                                                    timeError(index),
                                                )}
                                                onChange={(value) =>
                                                    updateTimes(
                                                        form.data.times.map(
                                                            (current, position) =>
                                                                position === index
                                                                    ? value
                                                                    : current,
                                                        ),
                                                    )
                                                }
                                            />
                                        </RemovableField>
                                    </FormField>
                                </div>
                            ))}
                        </div>
                        {errors.times ? (
                            <p className="formField__error">{errors.times}</p>
                        ) : null}
                        {canUpdate ? (
                            <Button
                                type="button"
                                tone="white"
                                className="removableField__add"
                                labelIconClass="fa fa-plus"
                                label="Adicionar horário"
                                title="Adicionar horário de backup"
                                disabled={
                                    form.processing ||
                                    form.data.times.length >= MAX_TIMES
                                }
                                onClick={() =>
                                    updateTimes([...form.data.times, ""])
                                }
                            />
                        ) : null}
                    </FormSection>
                </fieldset>
            </CardBox>
            <FormActions
                status={
                    form.processing
                        ? "Salvando configurações de backup..."
                        : ""
                }
            >
                <Button
                    href="/autenticacao/painel"
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
                                ? "Salvando configurações de backup"
                                : "Salvar configurações de backup"
                        }
                        disabled={form.processing}
                    />
                ) : null}
            </FormActions>
        </FormLayout>
    );
}

SettingsBackup.layout = SettingsLayout;
