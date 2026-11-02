import FormActions from '@/components/Forms/FormActions/FormActions';
import { RichTextField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import FormSection from '@/components/Forms/FormSection/FormSection';
import FieldError from '@/components/Forms/FormField/FieldError';
import { fieldErrorId } from '@/components/Forms/FormField/fieldDescription';
import ToggleControl from '@/components/Forms/ToggleControl/ToggleControl';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { disciplineUrls } from '../Disciplines.routes';
import type { DisciplineRecord } from '../Disciplines.types';
import { useDisciplineForm } from './useDisciplineForm';

function submissionStatus(processing: boolean, editing: boolean): string | undefined {
    if (!processing) {
        return undefined;
    }

    return editing ? 'Salvando alterações…' : 'Cadastrando disciplina…';
}

/** Cadastro e edição de disciplinas: nome, descrição e status. */
export default function DisciplineForm({
    discipline,
}: {
    discipline?: DisciplineRecord;
}): React.JSX.Element {
    const { form, errors, formRef, save, editorFailed, reportEditorFailure } =
        useDisciplineForm(discipline);
    const editing = Boolean(discipline);

    return (
        <FormLayout
            ref={formRef}
            aria-label={editing ? 'Editar disciplina' : 'Cadastrar disciplina'}
            aria-busy={form.processing}
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <fieldset disabled={form.processing}>
                    <FormSection
                        id="discipline-information"
                        title="Identificação"
                        variant="inline"
                        iconClass="fa fa-book"
                    >
                        <FormGrid columns={2}>
                            <FormGridWide>
                                <TextInputField
                                    id="discipline-name"
                                    name="name"
                                    label="Nome da Disciplina"
                                    required
                                    maxLength={255}
                                    value={form.data.name}
                                    error={errors.name}
                                    onChange={(value) => form.setData('name', value)}
                                />
                            </FormGridWide>
                            <FormGridWide>
                                <RichTextField
                                    id="discipline-description"
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
                            <div>
                                <ToggleControl
                                    id="discipline-status"
                                    name="is_active"
                                    label="Disciplina Ativa"
                                    size="small"
                                    checked={form.data.is_active === '1'}
                                    disabled={form.processing}
                                    invalid={Boolean(errors.is_active)}
                                    describedBy={
                                        errors.is_active
                                            ? fieldErrorId('discipline-status')
                                            : undefined
                                    }
                                    onChange={(checked) =>
                                        form.setData('is_active', checked ? '1' : '0')
                                    }
                                />
                                <FieldError id="discipline-status" error={errors.is_active} />
                            </div>
                        </FormGrid>
                    </FormSection>
                </fieldset>
            </CardBox>
            <FormActions status={submissionStatus(form.processing, editing)}>
                <Button
                    href={discipline ? disciplineUrls.show(discipline.id) : disciplineUrls.index}
                    tone="cancel"
                    label="Cancelar"
                    aria-label="Cancelar e voltar"
                    disabled={form.processing}
                />
                <Button
                    type="submit"
                    tone="save"
                    label="Salvar"
                    disabled={form.processing || editorFailed}
                />
            </FormActions>
        </FormLayout>
    );
}
