import { optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import ChoiceControl from '@/components/Forms/ChoiceControl/ChoiceControl';
import { fieldErrorId } from '@/components/Forms/FormField/fieldDescription';
import {
    DateInputField,
    SelectInputField,
    TextInputField,
} from '@/components/Forms/FormFields/FormFields';
import FormGrid from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import ToggleControl from '@/components/Forms/ToggleControl/ToggleControl';
import InfoTooltip from '@/components/UI/InfoTooltip/InfoTooltip';
import type { ProfessionalFormOptions } from '../Professionals.types';
import type { ProfessionalFormMode, ProfessionalFormSectionProps } from './ProfessionalForm.types';

interface ProfessionalWorkFieldsProps extends ProfessionalFormSectionProps {
    mode: ProfessionalFormMode;
    options: Pick<ProfessionalFormOptions, 'positions' | 'professionalStatuses'>;
    canManageAdmin: boolean;
    /** O profissional já é administrador interno (somente informativo para quem não gerencia). */
    isAdministrator: boolean;
}

/** Cargo, matrícula, ingresso, status (edição), exibição no site e acesso de administrador. */
export default function ProfessionalWorkFields({
    form,
    errors,
    disabled,
    mode,
    options,
    canManageAdmin,
    isAdministrator,
}: ProfessionalWorkFieldsProps): React.JSX.Element {
    const editing = mode === 'edit';
    const positionOptions = options.positions.map((position) => ({
        value: String(position.id),
        label: position.name,
    }));

    return (
        <FormSection
            id="professional-work"
            title="Dados do Profissional"
            variant="inline"
            iconClass="fa fa-id-badge"
        >
            <FormGrid columns={editing ? 4 : 3}>
                <SelectInputField
                    id="professional-position_id"
                    name="position_id"
                    label="Cargo"
                    required
                    disabled={disabled}
                    options={positionOptions}
                    value={form.data.position_id}
                    error={errors.position_id}
                    onChange={(value) => form.setData('position_id', value)}
                />
                <TextInputField
                    id="professional-registration"
                    name="registration"
                    label="Matrícula"
                    required
                    maxLength={50}
                    value={form.data.registration}
                    error={errors.registration}
                    onChange={(value) => form.setData('registration', value)}
                />
                <DateInputField
                    id="professional-entry_date"
                    name="entry_date"
                    label="Data de Ingresso"
                    required
                    disabled={disabled}
                    value={form.data.entry_date}
                    error={errors.entry_date}
                    onChange={(value) => form.setData('entry_date', value)}
                />
                {editing ? (
                    <SelectInputField
                        id="professional-status"
                        name="status"
                        label="Status"
                        required
                        disabled={disabled}
                        options={optionsFromRecord(options.professionalStatuses)}
                        value={form.data.status}
                        error={errors.status}
                        onChange={(value) => form.setData('status', value)}
                    />
                ) : null}
            </FormGrid>
            <div className="professionalForm__option">
                <ToggleControl
                    id="professional-show-on-website"
                    name="show_on_website"
                    size="small"
                    label="Aparece no site"
                    labelAddon={
                        <InfoTooltip text="Exibe o profissional, com foto, nome e cargo, na página de equipe do site. Profissionais inativos não aparecem." />
                    }
                    checked={form.data.show_on_website}
                    disabled={disabled}
                    onChange={(checked) => form.setData('show_on_website', checked)}
                />
                {errors.show_on_website ? (
                    <p
                        id={fieldErrorId('professional-show-on-website')}
                        className="formField__error"
                        role="alert"
                    >
                        {errors.show_on_website}
                    </p>
                ) : null}
            </div>
            {canManageAdmin ? (
                <div className="professionalForm__option">
                    <ChoiceControl
                        type="checkbox"
                        id="professional-is-admin"
                        name="is_admin"
                        label="Definir este profissional como administrador interno da unidade"
                        checked={form.data.is_admin}
                        disabled={disabled}
                        onChange={(checked) => form.setData('is_admin', checked)}
                    />
                    <p className="formField__hint">
                        Somente o administrador superior do Gnai pode conceder ou retirar este
                        acesso.
                    </p>
                    {errors.is_admin ? (
                        <p
                            id={fieldErrorId('professional-is-admin')}
                            className="formField__error"
                            role="alert"
                        >
                            {errors.is_admin}
                        </p>
                    ) : null}
                </div>
            ) : null}
            {!canManageAdmin && isAdministrator ? (
                <p className="professionalForm__option formField__hint">
                    Este profissional é administrador interno da unidade. Somente o administrador
                    superior do Gnai pode alterar esse acesso, desativá-lo ou removê-lo.
                </p>
            ) : null}
        </FormSection>
    );
}
