import { TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide, FormStack } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import ToggleControl from '@/components/Forms/ToggleControl/ToggleControl';
import InfoTooltip from '@/components/UI/InfoTooltip/InfoTooltip';
import type { LocationFormSectionProps } from './LocationForm.types';

/** Ativação no mapa público e coordenadas do ponto. */
export default function LocationSettingsFields({
    form,
    errors,
    disabled,
}: LocationFormSectionProps): React.JSX.Element {
    return (
        <FormSection
            id="location-map-section"
            title="Configuração"
            variant="inline"
            iconClass="fa fa-globe"
        >
            <FormGrid columns={2}>
                <FormGridWide>
                    <FormStack>
                        <ToggleControl
                            id="location-active"
                            name="is_active"
                            size="small"
                            label="Ponto Ativo no Sistema"
                            labelAddon={
                                <InfoTooltip text="Define se este local aparecerá no mapa público." />
                            }
                            checked={form.data.is_active}
                            disabled={disabled}
                            onChange={(checked) => form.setData('is_active', checked)}
                        />
                    </FormStack>
                </FormGridWide>
                <TextInputField
                    id="location-latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    label="Latitude"
                    required
                    placeholder="-14.2350"
                    disabled={disabled}
                    value={form.data.latitude}
                    error={errors.latitude}
                    onChange={(value) => form.setData('latitude', value)}
                />
                <TextInputField
                    id="location-longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    label="Longitude"
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
