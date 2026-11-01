import FormActions from '@/components/Forms/FormActions/FormActions';
import { TextAreaField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import FormSection from '@/components/Forms/FormSection/FormSection';
import ToggleControl from '@/components/Forms/ToggleControl/ToggleControl';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import InfoTooltip from '@/components/UI/InfoTooltip/InfoTooltip';
import { accessibilityFeatureUrls } from '../AccessibilityFeatures.routes';
import type { AccessibilityFeatureRecord } from '../AccessibilityFeatures.types';
import { useAccessibilityFeatureForm } from './useAccessibilityFeatureForm';

interface AccessibilityFeatureFormProps {
    feature?: AccessibilityFeatureRecord;
    canSubmit: boolean;
}

function submissionStatus(processing: boolean, editing: boolean): string | undefined {
    if (!processing) {
        return undefined;
    }

    return editing ? 'Salvando alterações…' : 'Cadastrando recurso…';
}

/** Cadastro e edição de recursos de acessibilidade. */
export default function AccessibilityFeatureForm({
    feature,
    canSubmit,
}: AccessibilityFeatureFormProps): React.JSX.Element {
    const { form, errors, formRef, save } = useAccessibilityFeatureForm({ feature, canSubmit });
    const editing = Boolean(feature);
    const submitLabel = editing ? 'Salvar' : 'Cadastrar';

    return (
        <FormLayout
            ref={formRef}
            aria-label={
                editing ? 'Editar recurso de acessibilidade' : 'Cadastrar recurso de acessibilidade'
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
                        id="accessibility-feature-identification"
                        title="Identificação"
                        variant="inline"
                        iconClass="fa fa-universal-access"
                    >
                        <FormGrid columns={2}>
                            <FormGridWide>
                                <TextInputField
                                    id="accessibility-feature-name"
                                    name="name"
                                    label="Nome do Recurso"
                                    required
                                    maxLength={255}
                                    placeholder="Ex: Intérprete de Libras, Piso Podotátil, etc."
                                    value={form.data.name}
                                    error={errors.name}
                                    onChange={(value) => form.setData('name', value)}
                                />
                            </FormGridWide>
                            <FormGridWide>
                                <TextAreaField
                                    id="accessibility-feature-description"
                                    name="description"
                                    label="Descrição Detalhada"
                                    rows={4}
                                    maxLength={1000}
                                    placeholder="Descreva a finalidade e aplicação deste recurso de acessibilidade"
                                    value={form.data.description}
                                    error={errors.description}
                                    onChange={(value) => form.setData('description', value)}
                                />
                            </FormGridWide>
                            <ToggleControl
                                id="accessibility-feature-active"
                                name="is_active"
                                size="small"
                                label="Recurso Ativo"
                                labelAddon={
                                    <InfoTooltip
                                        label="Informações sobre o status do recurso"
                                        text="Define se este recurso estará disponível para seleção no sistema."
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
                    href={
                        feature
                            ? accessibilityFeatureUrls.show(feature.id)
                            : accessibilityFeatureUrls.index
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
                        label={submitLabel}
                        disabled={form.processing}
                    />
                ) : null}
            </FormActions>
        </FormLayout>
    );
}
