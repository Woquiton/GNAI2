import {
    CheckboxListField,
    DateInputField,
    optionsFromNamed,
    RichTextField,
    SelectInputField,
    TextInputField,
} from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import type { BarrierFormOptions, BarrierInstitution } from '../Barriers.types';
import { BARRIER_TOUR_TARGETS } from '../barrierTours';
import BarrierAffectedPeopleFields from './BarrierAffectedPeopleFields';
import type { BarrierEditorField, BarrierFormSectionProps } from './BarrierForm.types';

interface BarrierIdentificationFieldsProps extends BarrierFormSectionProps {
    options: BarrierFormOptions;
    institution: BarrierInstitution | null;
    onInstitutionChange: (institutionId: string) => void;
    onLocationChange: (locationId: string) => void;
    onEditorFailure: (field: BarrierEditorField) => void;
}

/** O formulário envia os identificadores como texto, inclusive no público-alvo. */
function textOptions(records: ReadonlyArray<{ id: number; name: string }>) {
    return optionsFromNamed(records).map(({ value, label }) => ({ value: String(value), label }));
}

/** Relato, data, prioridade, categoria, local, descrição, público-alvo e pessoas impactadas. */
export default function BarrierIdentificationFields({
    form,
    errors,
    disabled,
    options,
    institution,
    onInstitutionChange,
    onLocationChange,
    onEditorFailure,
}: BarrierIdentificationFieldsProps): React.JSX.Element {
    const locationOptions = textOptions(institution?.locations ?? []);

    return (
        <FormSection
            id="barrier-identification"
            title="Identificação"
            variant="inline"
            iconClass="fa fa-exclamation-triangle"
            tourTarget={BARRIER_TOUR_TARGETS.identification}
        >
            <FormGrid columns={3}>
                <TextInputField
                    id="barrier-name"
                    name="name"
                    label="Título do Relato"
                    required
                    maxLength={255}
                    placeholder="Ex.: Calçada irregular"
                    disabled={disabled}
                    value={form.data.name}
                    error={errors.name}
                    onChange={(value) => form.setData('name', value)}
                />
                <DateInputField
                    id="barrier-date"
                    name="identified_at"
                    label="Data"
                    required
                    disabled={disabled}
                    value={form.data.identified_at}
                    error={errors.identified_at}
                    onChange={(value) => form.setData('identified_at', value)}
                />
                <SelectInputField
                    id="barrier-priority"
                    name="priority"
                    label="Prioridade"
                    required
                    options={options.priorities}
                    disabled={disabled}
                    value={form.data.priority}
                    error={errors.priority}
                    onChange={(value) => form.setData('priority', value)}
                />
                <SelectInputField
                    id="barrier-category"
                    name="barrier_category_id"
                    label="Categoria"
                    required
                    options={textOptions(options.categories)}
                    disabled={disabled}
                    value={form.data.barrier_category_id}
                    error={errors.barrier_category_id}
                    onChange={(value) => form.setData('barrier_category_id', value)}
                />
                <SelectInputField
                    id="barrier-institution"
                    name="institution_id"
                    label="Campus / Unidade"
                    required
                    options={textOptions(options.institutions)}
                    disabled={disabled}
                    value={form.data.institution_id}
                    error={errors.institution_id}
                    onChange={onInstitutionChange}
                />
                <SelectInputField
                    id="barrier-location"
                    name="location_id"
                    label="Local / Ponto de Referência"
                    placeholder="Selecione um local..."
                    options={locationOptions}
                    disabled={!institution || disabled}
                    value={form.data.location_id}
                    error={errors.location_id}
                    onChange={onLocationChange}
                />
                <FormGridWide>
                    <RichTextField
                        id="barrier-location-details"
                        label="Complemento"
                        defaultValue={form.data.location_specific_details}
                        height={80}
                        disabled={disabled}
                        error={errors.location_specific_details}
                        onLoadError={() => onEditorFailure('location_specific_details')}
                        onChange={(html) => form.setData('location_specific_details', html)}
                    />
                </FormGridWide>
                <FormGridWide>
                    <RichTextField
                        id="barrier-description"
                        label="Descrição Detalhada"
                        required
                        defaultValue={form.data.description}
                        height={120}
                        disabled={disabled}
                        error={errors.description}
                        onLoadError={() => onEditorFailure('description')}
                        onChange={(html) => form.setData('description', html)}
                    />
                </FormGridWide>
                <FormGridWide>
                    <CheckboxListField
                        id="barrier-deficiency"
                        name="deficiencies"
                        label="Público Alvo"
                        required
                        options={textOptions(options.deficiencies)}
                        disabled={disabled}
                        value={form.data.deficiencies}
                        error={errors.deficiencies ?? errors['deficiencies.0']}
                        onChange={(values) => form.setData('deficiencies', values)}
                    />
                </FormGridWide>
                <FormGridWide>
                    <BarrierAffectedPeopleFields
                        form={form}
                        errors={errors}
                        disabled={disabled}
                        students={options.students}
                        professionals={options.professionals}
                    />
                </FormGridWide>
            </FormGrid>
        </FormSection>
    );
}
