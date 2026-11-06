import FormActions from '@/components/Forms/FormActions/FormActions';
import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import ColorPicker from '@/components/Forms/ColorPicker/ColorPicker';
import FormField from '@/components/Forms/FormField/FormField';
import { fieldDescribedBy } from '@/components/Forms/FormField/fieldDescription';
import { optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import FormSection from '@/components/Forms/FormSection/FormSection';
import ToggleControl from '@/components/Forms/ToggleControl/ToggleControl';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import InfoTooltip from '@/components/UI/InfoTooltip/InfoTooltip';
import { TAG_TOUR_TARGETS } from '../tagTours';
import { tagUrls } from '../Tags.routes';
import type { TagRecord } from '../Tags.types';
import { useTagForm } from './useTagForm';

interface TagFormProps {
    tag?: TagRecord;
    canSubmit: boolean;
    modules: Record<string, string>;
}

function submissionStatus(processing: boolean, editing: boolean): string | undefined {
    if (!processing) {
        return undefined;
    }

    return editing ? 'Salvando alterações…' : 'Cadastrando etiqueta…';
}

/** Cadastro e edição de etiquetas por módulo. */
export default function TagForm({ tag, canSubmit, modules }: TagFormProps): React.JSX.Element {
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
                                <div data-tour={TAG_TOUR_TARGETS.name}>
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
                                </div>
                            </FormGridWide>
                            <div data-tour={TAG_TOUR_TARGETS.module}>
                                <SelectInputField
                                    id="tag-module"
                                    name="module"
                                    label="Módulo"
                                    required
                                    options={optionsFromRecord(modules)}
                                    value={form.data.module}
                                    error={errors.module}
                                    onChange={(value) => form.setData('module', value)}
                                />
                            </div>
                            <div data-tour={TAG_TOUR_TARGETS.color}>
                                <FormField
                                    id="tag-color"
                                    label="Cor"
                                    requiredIndicator
                                    error={errors.color}
                                    hint="Escolha na paleta ou informe uma cor no formato #RRGGBB."
                                    hintLabel="Sobre a cor da etiqueta"
                                >
                                    <ColorPicker
                                        id="tag-color"
                                        name="color"
                                        label="Cor da etiqueta"
                                        value={form.data.color}
                                        disabled={form.processing}
                                        invalid={Boolean(errors.color)}
                                        describedBy={fieldDescribedBy('tag-color', {
                                            error: errors.color,
                                        })}
                                        onChange={(value) => form.setData('color', value)}
                                    />
                                </FormField>
                            </div>
                            <div data-tour={TAG_TOUR_TARGETS.active}>
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
                            </div>
                        </FormGrid>
                    </FormSection>
                </fieldset>
            </CardBox>
            <FormActions
                status={submissionStatus(form.processing, editing)}
                tourTarget={TAG_TOUR_TARGETS.formActions}
            >
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
