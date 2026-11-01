import FormActions from '@/components/Forms/FormActions/FormActions';
import {
    SelectInputField,
    TextAreaField,
    TextInputField,
} from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import FormSection from '@/components/Forms/FormSection/FormSection';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { disciplineStatusOptions } from '../Disciplines.constants';
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
    const { form, errors, formRef, save } = useDisciplineForm(discipline);
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
                        title={editing ? 'Dados da Disciplina' : 'Informações Básicas'}
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
                                <TextAreaField
                                    id="discipline-description"
                                    name="description"
                                    label="Descrição"
                                    rows={3}
                                    value={form.data.description}
                                    error={errors.description}
                                    onChange={(value) => form.setData('description', value)}
                                />
                            </FormGridWide>
                            <SelectInputField
                                id="discipline-status"
                                name="is_active"
                                label="Status"
                                required
                                options={disciplineStatusOptions}
                                value={form.data.is_active}
                                disabled={form.processing}
                                error={errors.is_active}
                                onChange={(value) => form.setData('is_active', value)}
                            />
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
                <Button type="submit" tone="save" label="Salvar" disabled={form.processing} />
            </FormActions>
        </FormLayout>
    );
}
