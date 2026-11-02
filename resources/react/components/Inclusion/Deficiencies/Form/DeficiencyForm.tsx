import FormActions from '@/components/Forms/FormActions/FormActions';
import { RichTextField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import FormSection from '@/components/Forms/FormSection/FormSection';
import ToggleControl from '@/components/Forms/ToggleControl/ToggleControl';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { deficiencyUrls } from '../Deficiencies.routes';
import type { DeficiencyRecord } from '../Deficiencies.types';
import { useDeficiencyForm } from './useDeficiencyForm';

function submissionStatus(processing: boolean, editing: boolean): string | undefined {
    if (!processing) {
        return undefined;
    }

    return editing ? 'Salvando alterações…' : 'Cadastrando perfil de atendimento…';
}

/** Cadastro e edição de perfis de atendimento (deficiências e condições). */
export default function DeficiencyForm({
    deficiency,
}: {
    deficiency?: DeficiencyRecord;
}): React.JSX.Element {
    const { form, errors, formRef, editorFailed, reportEditorFailure, save } =
        useDeficiencyForm(deficiency);
    const editing = Boolean(deficiency);

    return (
        <FormLayout
            ref={formRef}
            aria-label={
                editing ? 'Editar perfil de atendimento' : 'Cadastrar perfil de atendimento'
            }
            aria-busy={form.processing}
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <fieldset disabled={form.processing}>
                    <FormSection
                        id="deficiency-information"
                        title="Identificação"
                        variant="inline"
                        iconClass="fa fa-list-alt"
                    >
                        <FormGrid columns={2}>
                            <TextInputField
                                id="deficiency-name"
                                name="name"
                                label="Nome do Perfil"
                                required
                                maxLength={255}
                                placeholder={editing ? undefined : 'Ex: Deficiência Visual'}
                                value={form.data.name}
                                error={errors.name}
                                onChange={(value) => form.setData('name', value)}
                            />
                            <TextInputField
                                id="deficiency-cid-code"
                                name="cid_code"
                                label="Código CID"
                                maxLength={20}
                                placeholder={editing ? undefined : 'Ex: F84.0'}
                                value={form.data.cid_code}
                                error={errors.cid_code}
                                onChange={(value) => form.setData('cid_code', value)}
                            />
                            <FormGridWide>
                                <RichTextField
                                    id="deficiency-description"
                                    label="Descrição / Detalhes"
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
                            <ToggleControl
                                id="deficiency-active"
                                name="is_active"
                                size="small"
                                label="Perfil Ativo"
                                checked={form.data.is_active}
                                disabled={form.processing}
                                onChange={(checked) => form.setData('is_active', checked)}
                            />
                        </FormGrid>
                    </FormSection>
                </fieldset>
            </CardBox>
            <FormActions status={submissionStatus(form.processing, editing)}>
                <Button
                    href={deficiency ? deficiencyUrls.show(deficiency.id) : deficiencyUrls.index}
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
