import { optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import {
    RichTextField,
    SelectInputField,
    TextInputField,
} from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import { phoneMask } from '@/utils/masks';
import type { GuardianFormSectionProps } from './GuardianForm.types';

interface GuardianContactFieldsProps extends GuardianFormSectionProps {
    relationships: Record<string, string>;
    onEditorFailure: () => void;
}

/** E-mail, telefone, parentesco e endereço do responsável. */
export default function GuardianContactFields({
    form,
    errors,
    disabled,
    relationships,
    onEditorFailure,
}: GuardianContactFieldsProps): React.JSX.Element {
    return (
        <FormSection
            id="guardian-contact"
            title="Contato e Vínculo"
            variant="inline"
            iconClass="fa fa-address-book"
        >
            <FormGrid columns={3}>
                <TextInputField
                    id="guardian-email"
                    name="email"
                    type="email"
                    label="E-mail"
                    maxLength={255}
                    value={form.data.email}
                    error={errors.email}
                    onChange={(value) => form.setData('email', value)}
                />
                <TextInputField
                    id="guardian-phone"
                    name="phone"
                    type="tel"
                    label="Telefone / WhatsApp"
                    required
                    inputMode="numeric"
                    maxLength={15}
                    placeholder="(00) 00000-0000"
                    value={form.data.phone}
                    error={errors.phone}
                    onChange={(value) => form.setData('phone', phoneMask(value))}
                />
                <SelectInputField
                    id="guardian-relationship"
                    name="relationship"
                    label="Parentesco / Vínculo"
                    required
                    disabled={disabled}
                    options={optionsFromRecord(relationships)}
                    value={form.data.relationship}
                    error={errors.relationship}
                    onChange={(value) => form.setData('relationship', value)}
                />
                <FormGridWide>
                    <RichTextField
                        id="guardian-address"
                        label="Endereço Completo"
                        defaultValue={form.data.address}
                        height={100}
                        disabled={disabled}
                        error={errors.address}
                        onLoadError={onEditorFailure}
                        onChange={(html) => form.setData('address', html)}
                    />
                </FormGridWide>
            </FormGrid>
        </FormSection>
    );
}
