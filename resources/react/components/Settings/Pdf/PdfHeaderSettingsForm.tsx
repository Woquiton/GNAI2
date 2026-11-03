import FormActions from '@/components/Forms/FormActions/FormActions';
import FormField from '@/components/Forms/FormField/FormField';
import { fieldDescribedBy } from '@/components/Forms/FormField/fieldDescription';
import {
    optionsFromRecord,
    SelectInputField,
    TextAreaField,
} from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import FormSection from '@/components/Forms/FormSection/FormSection';
import ImageUploadField from '@/components/Forms/ImageUploadField/ImageUploadField';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { settingsCancelUrl } from '../Settings.routes';
import type { PdfHeaderSettingsProps } from '../Settings.types';
import PdfHeaderPreview from './PdfHeaderPreview';
import { usePdfHeaderSettingsForm } from './usePdfHeaderSettingsForm';

export default function PdfHeaderSettingsForm(props: PdfHeaderSettingsProps): React.JSX.Element {
    const { form, formRef, errors, disabled, save, imageError } = usePdfHeaderSettingsForm(props);

    return (
        <FormLayout
            ref={formRef}
            aria-label="Configurações dos PDFs"
            aria-busy={form.processing}
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <fieldset disabled={disabled}>
                    <FormSection
                        id="pdf-header-settings"
                        title="Identificação"
                        variant="inline"
                        iconClass="fa fa-file-pdf-o"
                        description="Defina a instituição e o núcleo que emitem os documentos. Este cabeçalho será usado nos próximos PDFs gerados pelo sistema."
                    >
                        <FormGrid columns={2}>
                            <FormGridWide>
                                <FormField
                                    id="pdf-header-logo"
                                    label="Logotipo da instituição"
                                    error={errors.logo}
                                    hint="JPG ou PNG, até 4 MB e 4000 pixels de largura e altura. Remover deixa o cabeçalho sem imagem."
                                >
                                    <ImageUploadField
                                        id="pdf-header-logo"
                                        name="logo"
                                        label="Logotipo da instituição"
                                        variant="logo"
                                        file={form.data.logo}
                                        currentUrl={props.pdfHeader.logo_url}
                                        removed={form.data.remove_logo}
                                        previewAlt={form.data.institution_name}
                                        accept=".jpg,.jpeg,.png"
                                        disabled={disabled}
                                        invalid={Boolean(errors.logo)}
                                        describedBy={fieldDescribedBy('pdf-header-logo', {
                                            error: errors.logo,
                                            hint: true,
                                        })}
                                        onChange={(logo) =>
                                            form.setData((current) => ({
                                                ...current,
                                                logo,
                                                remove_logo: false,
                                            }))
                                        }
                                        onRemove={() =>
                                            form.setData((current) => ({
                                                ...current,
                                                logo: null,
                                                remove_logo: true,
                                            }))
                                        }
                                        onError={imageError}
                                    />
                                </FormField>
                            </FormGridWide>
                            <SelectInputField
                                id="pdf-logo-shape"
                                name="logo_shape"
                                label="Formato do logotipo"
                                required
                                hint="Redonda e cantos arredondados funcionam melhor com imagens quadradas."
                                disabled={disabled}
                                options={optionsFromRecord(props.logoShapes)}
                                value={form.data.logo_shape}
                                error={errors.logo_shape}
                                onChange={(value) => form.setData('logo_shape', value)}
                            />
                            <FormGridWide>
                                <TextAreaField
                                    id="pdf-institution-name"
                                    name="institution_name"
                                    label="Nome da instituição"
                                    required
                                    hint="Pressione Enter para quebrar a linha no PDF."
                                    rows={2}
                                    maxLength={180}
                                    value={form.data.institution_name}
                                    error={errors.institution_name}
                                    onChange={(value) => form.setData('institution_name', value)}
                                />
                            </FormGridWide>
                            <FormGridWide>
                                <TextAreaField
                                    id="pdf-issuing-unit"
                                    name="issuing_unit"
                                    label="Núcleo ou setor emissor"
                                    hint="Pressione Enter para quebrar a linha no PDF."
                                    rows={2}
                                    maxLength={180}
                                    value={form.data.issuing_unit}
                                    error={errors.issuing_unit}
                                    onChange={(value) => form.setData('issuing_unit', value)}
                                />
                            </FormGridWide>
                            <FormGridWide>
                                <TextAreaField
                                    id="pdf-header-details"
                                    name="details"
                                    label="Texto complementar"
                                    hint="Endereço, CNPJ, telefone ou outras informações da instituição. Use uma linha para cada informação."
                                    rows={4}
                                    maxLength={1000}
                                    value={form.data.details}
                                    error={errors.details}
                                    onChange={(value) => form.setData('details', value)}
                                />
                            </FormGridWide>
                        </FormGrid>
                    </FormSection>
                </fieldset>
                <FormSection
                    id="pdf-header-preview"
                    title="Prévia do cabeçalho"
                    variant="inline"
                    iconClass="fa fa-eye"
                >
                    <PdfHeaderPreview data={form.data} currentLogoUrl={props.pdfHeader.logo_url} />
                </FormSection>
            </CardBox>
            <FormActions status={form.processing ? 'Salvando cabeçalho…' : undefined}>
                <Button
                    href={settingsCancelUrl}
                    tone="cancel"
                    label="Cancelar"
                    disabled={form.processing}
                />
                {props.canUpdate ? (
                    <Button type="submit" tone="save" label="Salvar" disabled={form.processing} />
                ) : null}
            </FormActions>
        </FormLayout>
    );
}
