import { TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import { INSTITUTION_TOUR_TARGETS } from '../institutionTours';
import type { InstitutionFormSectionProps } from './InstitutionForm.types';

/** Nome, sigla e endereço da sede; o endereço também posiciona o mapa. */
export default function InstitutionIdentificationFields({
    form,
    errors,
    disabled,
}: InstitutionFormSectionProps): React.JSX.Element {
    return (
        <FormSection
            id="institution-information"
            title="Identificação"
            variant="inline"
            tourTarget={INSTITUTION_TOUR_TARGETS.identification}
            iconClass="fa fa-university"
        >
            <FormGrid columns={2}>
                <TextInputField
                    id="institution-name"
                    name="name"
                    label="Nome da Instituição"
                    required
                    maxLength={255}
                    placeholder="Ex.: IFBA - Campus Guanambi"
                    disabled={disabled}
                    value={form.data.name}
                    error={errors.name}
                    onChange={(value) => form.setData('name', value)}
                />
                <TextInputField
                    id="institution-short-name"
                    name="short_name"
                    label="Sigla / Nome Curto"
                    maxLength={100}
                    placeholder="Ex.: IFBA-GBI"
                    disabled={disabled}
                    value={form.data.short_name}
                    error={errors.short_name}
                    onChange={(value) => form.setData('short_name', value)}
                />
                <TextInputField
                    id="institution-city"
                    name="city"
                    label="Cidade"
                    required
                    maxLength={255}
                    disabled={disabled}
                    value={form.data.city}
                    error={errors.city}
                    onChange={(value) => form.setData('city', value)}
                />
                <TextInputField
                    id="institution-state"
                    name="state"
                    label="Estado"
                    required
                    maxLength={255}
                    disabled={disabled}
                    value={form.data.state}
                    error={errors.state}
                    onChange={(value) => form.setData('state', value)}
                />
                <TextInputField
                    id="institution-district"
                    name="district"
                    label="Bairro / Distrito"
                    maxLength={255}
                    disabled={disabled}
                    value={form.data.district}
                    error={errors.district}
                    onChange={(value) => form.setData('district', value)}
                />
                <TextInputField
                    id="institution-address"
                    name="address"
                    label="Rua / Logradouro"
                    maxLength={255}
                    disabled={disabled}
                    value={form.data.address}
                    error={errors.address}
                    onChange={(value) => form.setData('address', value)}
                />
            </FormGrid>
        </FormSection>
    );
}
