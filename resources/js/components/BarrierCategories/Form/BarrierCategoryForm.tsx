import FormActions from '@/components/Forms/FormActions/FormActions';
import { RichTextField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide, FormStack } from '@/components/Forms/FormGrid/FormGrid';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import FormSection from '@/components/Forms/FormSection/FormSection';
import ToggleControl from '@/components/Forms/ToggleControl/ToggleControl';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import InfoTooltip from '@/components/UI/InfoTooltip/InfoTooltip';
import { BARRIER_CATEGORY_TOUR_TARGETS } from '../barrierCategoryTours';
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
    const { form, errors, formRef, save, editorFailed, reportEditorFailure } =
        useBarrierCategoryForm({ category, canSubmit });
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
                                <div data-tour={BARRIER_CATEGORY_TOUR_TARGETS.name}>
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
                                </div>
                            </FormGridWide>
                            <FormGridWide>
                                <div data-tour={BARRIER_CATEGORY_TOUR_TARGETS.description}>
                                    <RichTextField
                                        id="barrier-category-description"
                                        label="Descrição Detalhada"
                                        defaultValue={form.data.description}
                                        height={120}
                                        disabled={form.processing}
                                        error={errors.description}
                                        onLoadError={() =>
                                            reportEditorFailure('description', 'descrição')
                                        }
                                        onChange={(html) => form.setData('description', html)}
                                    />
                                </div>
                            </FormGridWide>
                        </FormGrid>
                        <FormGrid columns={2}>
                            <FormStack>
                                <div data-tour={BARRIER_CATEGORY_TOUR_TARGETS.active}>
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
                                </div>
                            </FormStack>
                            <FormStack>
                                <div data-tour={BARRIER_CATEGORY_TOUR_TARGETS.blocksMap}>
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
                                </div>
                            </FormStack>
                        </FormGrid>
                    </FormSection>
                </fieldset>
            </CardBox>
            <FormActions
                status={submissionStatus(form.processing, editing)}
                tourTarget={BARRIER_CATEGORY_TOUR_TARGETS.formActions}
            >
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
                    <Button
                        type="submit"
                        tone="save"
                        label="Salvar"
                        disabled={form.processing || editorFailed}
                    />
                ) : null}
            </FormActions>
        </FormLayout>
    );
}
