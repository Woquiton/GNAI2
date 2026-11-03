import FormField from '@/components/Forms/FormField/FormField';
import { fieldDescribedBy } from '@/components/Forms/FormField/fieldDescription';
import { TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormStack } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import RangeSlider from '@/components/Forms/RangeSlider/RangeSlider';
import ToggleControl from '@/components/Forms/ToggleControl/ToggleControl';
import InfoTooltip from '@/components/UI/InfoTooltip/InfoTooltip';
import { INSTITUTION_TOUR_TARGETS } from '../institutionTours';
import type { InstitutionFormSectionProps } from './InstitutionForm.types';

interface InstitutionSettingsFieldsProps extends InstitutionFormSectionProps {
    /** Zoom numérico exibido no controle deslizante. */
    zoom: number;
    onZoomChange: (zoom: number) => void;
}

/** Ativação, zoom padrão do mapa e coordenadas da sede. */
export default function InstitutionSettingsFields({
    form,
    errors,
    disabled,
    zoom,
    onZoomChange,
}: InstitutionSettingsFieldsProps): React.JSX.Element {
    return (
        <FormSection
            id="institution-map-settings"
            title="Configuração"
            variant="inline"
            tourTarget={INSTITUTION_TOUR_TARGETS.settings}
            iconClass="fa fa-globe"
        >
            <FormGrid columns={2}>
                <FormStack>
                    <ToggleControl
                        id="institution-active"
                        name="is_active"
                        size="small"
                        label="Instituição Ativa"
                        labelAddon={
                            <InfoTooltip text="Define se esta sede estará disponível para o mapeamento público." />
                        }
                        checked={form.data.is_active}
                        disabled={disabled}
                        onChange={(checked) => form.setData('is_active', checked)}
                    />
                </FormStack>
                <FormField
                    id="institution-default-zoom"
                    label="Zoom Padrão"
                    error={errors.default_zoom}
                >
                    <RangeSlider
                        id="institution-default-zoom"
                        name="default_zoom"
                        label="Zoom Padrão"
                        min={0}
                        max={20}
                        value={zoom}
                        disabled={disabled}
                        invalid={Boolean(errors.default_zoom)}
                        describedBy={fieldDescribedBy('institution-default-zoom', {
                            error: errors.default_zoom,
                        })}
                        onChange={onZoomChange}
                    />
                </FormField>
                <TextInputField
                    id="institution-latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    label="Latitude Sede"
                    required
                    placeholder="-14.2350"
                    disabled={disabled}
                    value={form.data.latitude}
                    error={errors.latitude}
                    onChange={(value) => form.setData('latitude', value)}
                />
                <TextInputField
                    id="institution-longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    label="Longitude Sede"
                    required
                    placeholder="-51.9253"
                    disabled={disabled}
                    value={form.data.longitude}
                    error={errors.longitude}
                    onChange={(value) => form.setData('longitude', value)}
                />
            </FormGrid>
        </FormSection>
    );
}
