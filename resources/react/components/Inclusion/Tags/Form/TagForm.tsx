import FormActions from '@/components/Forms/FormActions/FormActions';
import { TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import FormSection from '@/components/Forms/FormSection/FormSection';
import ToggleControl from '@/components/Forms/ToggleControl/ToggleControl';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import InfoTooltip from '@/components/UI/InfoTooltip/InfoTooltip';
import { tagUrls } from '../Tags.routes';
import type { TagRecord } from '../Tags.types';
import { useTagForm } from './useTagForm';

interface TagFormProps {
    tag?: TagRecord;
    canSubmit: boolean;
}

function submissionStatus(processing: boolean, editing: boolean): string | undefined {
    if (!processing) {
        return undefined;
    }

    return editing ? 'Salvando alterações…' : 'Cadastrando etiqueta…';
}

/** Cadastro e edição de etiquetas das publicações. */
export default function TagForm({ tag, canSubmit }: TagFormProps): React.JSX.Element {
    const { form, errors, formRef, save } = useTagForm({ tag, canSubmit });
    const editing = Boolean(tag);
    const submitLabel = editing ? 'Salvar' : 'Cadastrar';

    return (
        <FormLayout
            ref={formRef}
            aria-label={editing ? 'Editar etiqueta' : 'Cadastrar etiqueta'}
            aria-busy={form.processing}
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <fieldset disabled={form.processing}>
                    <FormSection
                        id="tag-identification"
                        title="Identificação"
                        variant="inline"
                        iconClass="fa fa-tags"
                    >
                        <FormGrid columns={2}>
                            <FormGridWide>
                                <TextInputField
                                    id="tag-name"
                                    name="name"
                                    label="Nome da Etiqueta"
                                    required
                                    maxLength={100}
                                    placeholder="Ex: Acessibilidade, Eventos, Editais, etc."
                                    value={form.data.name}
                                    error={errors.name}
                                    onChange={(value) => form.setData('name', value)}
                                />
                            </FormGridWide>
                            <ToggleControl
                                id="tag-active"
                                name="is_active"
                                size="small"
                                label="Etiqueta Ativa"
                                labelAddon={
                                    <InfoTooltip
                                        label="Informações sobre o status da etiqueta"
                                        text="Define se esta etiqueta estará disponível para seleção no sistema."
                                    />
                                }
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
                    href={tag ? tagUrls.show(tag.id) : tagUrls.index}
                    tone="cancel"
                    label="Cancelar"
                    aria-label="Cancelar e voltar"
                    disabled={form.processing}
                />
                {canSubmit ? (
                    <Button
                        type="submit"
                        tone="save"
                        label={submitLabel}
                        disabled={form.processing}
                    />
                ) : null}
            </FormActions>
        </FormLayout>
    );
}
