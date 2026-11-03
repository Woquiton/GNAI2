import {
    RichTextField,
    SelectInputField,
    TextInputField,
} from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import type { LocationFormOptions } from '../Locations.types';
import { LOCATION_TOUR_TARGETS } from '../locationTours';
import type { LocationFormSectionProps } from './LocationForm.types';

interface LocationIdentificationFieldsProps extends LocationFormSectionProps {
    institutions: LocationFormOptions['institutions'];
    onInstitutionChange: (institutionId: string) => void;
    onEditorFailure: () => void;
}

/** Instituição base, nome, tipo e descrição do ponto de referência. */
export default function LocationIdentificationFields({
    form,
    errors,
    disabled,
    institutions,
    onInstitutionChange,
    onEditorFailure,
}: LocationIdentificationFieldsProps): React.JSX.Element {
    return (
        <FormSection
            id="location-identification"
            title="Identificação"
            variant="inline"
            tourTarget={LOCATION_TOUR_TARGETS.identification}
            iconClass="fa fa-map-marker"
        >
            <FormGrid columns={2}>
                <SelectInputField
                    id="location-institution"
                    name="institution_id"
                    label="Instituição Base"
                    required
                    options={institutions}
                    disabled={disabled}
                    value={form.data.institution_id}
                    error={errors.institution_id}
                    onChange={onInstitutionChange}
                />
                <TextInputField
                    id="location-name"
                    name="name"
                    label="Nome do Local"
                    required
                    maxLength={255}
                    placeholder="Ex.: Bloco Acadêmico II"
                    disabled={disabled}
                    value={form.data.name}
                    error={errors.name}
                    onChange={(value) => form.setData('name', value)}
                />
                <TextInputField
                    id="location-type"
                    name="type"
                    label="Tipo de Local"
                    maxLength={100}
                    placeholder="Ex.: Pavilhão, Bloco, Laboratório..."
                    disabled={disabled}
                    value={form.data.type}
                    error={errors.type}
                    onChange={(value) => form.setData('type', value)}
                />
                <FormGridWide>
                    <RichTextField
                        id="location-description"
                        label="Descrição/Observações"
                        defaultValue={form.data.description}
                        height={120}
                        disabled={disabled}
                        error={errors.description}
                        onLoadError={onEditorFailure}
                        onChange={(html) => form.setData('description', html)}
                    />
                </FormGridWide>
            </FormGrid>
        </FormSection>
    );
}
