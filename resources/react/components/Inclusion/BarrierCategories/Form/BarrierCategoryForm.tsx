import FormActions from '@/components/Forms/FormActions/FormActions';
import { TextAreaField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide, FormStack } from '@/components/Forms/FormGrid/FormGrid';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import FormSection from '@/components/Forms/FormSection/FormSection';
import ToggleControl from '@/components/Forms/ToggleControl/ToggleControl';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import InfoTooltip from '@/components/UI/InfoTooltip/InfoTooltip';
import { barrierCategoryUrls } from '../BarrierCategories.routes';
import type { BarrierCategoryRecord } from '../BarrierCategories.types';
import { useBarrierCategoryForm } from './useBarrierCategoryForm';

interface BarrierCategoryFormProps {
    category?: BarrierCategoryRecord;
    canSubmit: boolean;
}

function submissionStatus(processing: boolean, editing: boolean): string | undefined {
    if (!processing) {
        return undefined;
    }

    return editing ? 'Salvando alterações…' : 'Cadastrando categoria…';
}

/** Cadastro e edição de categorias de barreira. */
export default function BarrierCategoryForm({
    category,
    canSubmit,
}: BarrierCategoryFormProps): React.JSX.Element {
    const { form, errors, formRef, save } = useBarrierCategoryForm({ category, canSubmit });
    const editing = Boolean(category);

    return (
        <FormLayout
            ref={formRef}
            aria-label={
                editing ? 'Editar categoria de barreira' : 'Cadastrar categoria de barreira'
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
                        id="barrier-category-information"
                        title="Identificação"
                        variant="inline"
                        iconClass="fa fa-tags"
                    >
                        <FormGrid columns={2}>
                            <FormGridWide>
                                <TextInputField
                                    id="barrier-category-name"
                                    name="name"
                                    label="Nome da Categoria"
                                    required
                                    maxLength={150}
                                    placeholder="Ex: Arquitetônica, Atitudinal, Comunicacional..."
                                    value={form.data.name}
                                    error={errors.name}
                                    onChange={(value) => form.setData('name', value)}
                                />
                            </FormGridWide>
                            <FormGridWide>
                                <TextAreaField
                                    id="barrier-category-description"
                                    name="description"
                                    label="Descrição Detalhada"
                                    rows={4}
                                    placeholder="Descreva o que este tipo de barreira engloba..."
                                    value={form.data.description}
                                    error={errors.description}
                                    onChange={(value) => form.setData('description', value)}
                                />
                            </FormGridWide>
                        </FormGrid>
                        <FormGrid columns={2}>
                            <FormStack>
                                <ToggleControl
                                    id="barrier-category-active"
                                    name="is_active"
                                    size="small"
                                    label="Ativar no Sistema"
                                    labelAddon={
                                        <InfoTooltip text="Indica se esta categoria estará disponível para seleção no cadastro de novas barreiras." />
                                    }
                                    checked={form.data.is_active}
                                    disabled={form.processing}
                                    onChange={(checked) => form.setData('is_active', checked)}
                                />
                            </FormStack>
                            <FormStack>
                                <ToggleControl
                                    id="barrier-category-blocks-map"
                                    name="blocks_map"
                                    size="small"
                                    label="Bloquear Mapa"
                                    labelAddon={
                                        <InfoTooltip text="Oculta o mapa no cadastro de novas barreiras quando esta categoria for selecionada." />
                                    }
                                    checked={form.data.blocks_map}
                                    disabled={form.processing}
                                    onChange={(checked) => form.setData('blocks_map', checked)}
                                />
                            </FormStack>
                        </FormGrid>
                    </FormSection>
                </fieldset>
            </CardBox>
            <FormActions status={submissionStatus(form.processing, editing)}>
                <Button
                    href={
                        category ? barrierCategoryUrls.show(category.id) : barrierCategoryUrls.index
                    }
                    tone="cancel"
                    label="Cancelar"
                    aria-label="Cancelar e voltar"
                    disabled={form.processing}
                />
                {canSubmit ? (
                    <Button type="submit" tone="save" label="Salvar" disabled={form.processing} />
                ) : null}
            </FormActions>
        </FormLayout>
    );
}
