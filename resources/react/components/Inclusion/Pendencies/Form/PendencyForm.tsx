import { optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import FormActions from '@/components/Forms/FormActions/FormActions';
import {
    DateInputField,
    RichTextField,
    SelectInputField,
    TextInputField,
} from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import FormSection from '@/components/Forms/FormSection/FormSection';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { pendencyUrls } from '../Pendencies.routes';
import { PENDENCY_TOUR_TARGETS } from '../pendencyTours';
import type {
    PendencyFormOptions,
    PendencyProfessionalOption,
    PendencyRecord,
} from '../Pendencies.types';
import { usePendencyForm } from './usePendencyForm';
import './PendencyForm.css';

interface PendencyFormProps extends PendencyFormOptions {
    pendency?: PendencyRecord;
    dueDate?: string;
}

function professionalOptions(professionals: PendencyProfessionalOption[]) {
    return professionals.map((professional) => ({
        value: String(professional.id),
        label: professional.person?.name ?? '',
    }));
}

/** Cadastro e edição de pendências: título, descrição, responsável, prioridade e vencimento. */
export default function PendencyForm({
    pendency,
    dueDate,
    professionals,
    priorities,
}: PendencyFormProps): React.JSX.Element {
    const { form, errors, formRef, save, editorFailed, reportEditorFailure } = usePendencyForm({
        pendency,
        dueDate,
    });
    const submitLabel = form.processing ? 'Salvando pendência' : 'Salvar pendência';

    return (
        <FormLayout
            ref={formRef}
            aria-label={pendency ? 'Editar pendência' : 'Cadastrar pendência'}
            aria-busy={form.processing}
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <fieldset disabled={form.processing}>
                    <FormSection
                        id="pendency-data"
                        title="Dados da Pendência"
                        variant="inline"
                        iconClass="fa fa-tasks"
                        tourTarget={PENDENCY_TOUR_TARGETS.formData}
                    >
                        <FormGrid columns={4}>
                            <FormGridWide>
                                <TextInputField
                                    id="pendency-title"
                                    name="title"
                                    label="Título"
                                    required
                                    maxLength={255}
                                    value={form.data.title}
                                    error={errors.title}
                                    onChange={(value) => form.setData('title', value)}
                                />
                            </FormGridWide>
                            <FormGridWide>
                                <RichTextField
                                    id="pendency-description"
                                    label="Descrição"
                                    defaultValue={form.data.description}
                                    height={120}
                                    disabled={form.processing}
                                    error={errors.description}
                                    onLoadError={() =>
                                        reportEditorFailure('description', 'descrição')
                                    }
                                    onChange={(html) => form.setData('description', html)}
                                />
                            </FormGridWide>
                            <SelectInputField
                                id="pendency-assigned-to"
                                name="assigned_to"
                                label="Profissional Responsável"
                                required
                                fieldClassName="pendencyForm__half"
                                disabled={form.processing}
                                options={professionalOptions(professionals)}
                                value={form.data.assigned_to}
                                error={errors.assigned_to}
                                onChange={(value) => form.setData('assigned_to', value)}
                            />
                            <SelectInputField
                                id="pendency-priority"
                                name="priority"
                                label="Prioridade"
                                required
                                disabled={form.processing}
                                options={optionsFromRecord(priorities)}
                                value={form.data.priority}
                                error={errors.priority}
                                onChange={(value) => form.setData('priority', value)}
                            />
                            <DateInputField
                                id="pendency-due-date"
                                name="due_date"
                                label="Data de Vencimento"
                                disabled={form.processing}
                                value={form.data.due_date}
                                error={errors.due_date}
                                onChange={(value) => form.setData('due_date', value)}
                            />
                        </FormGrid>
                    </FormSection>
                </fieldset>
            </CardBox>
            <FormActions
                status={form.processing ? 'Salvando pendência...' : undefined}
                tourTarget={PENDENCY_TOUR_TARGETS.formActions}
            >
                <Button
                    href={pendencyUrls.index}
                    tone="cancel"
                    label="Cancelar"
                    title="Cancelar e voltar"
                    aria-label="Cancelar e voltar"
                    disabled={form.processing}
                />
                <Button
                    type="submit"
                    tone="save"
                    leftIconClass="fa fa-check"
                    label="Salvar"
                    title="Salvar pendência"
                    aria-label={submitLabel}
                    disabled={form.processing || editorFailed}
                />
            </FormActions>
        </FormLayout>
    );
}
