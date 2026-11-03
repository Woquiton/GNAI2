import { optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import { SelectInputField, TextInputField } from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormStack } from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import ToggleControl from '@/components/Forms/ToggleControl/ToggleControl';
import InfoTooltip from '@/components/UI/InfoTooltip/InfoTooltip';
import InlineAlert from '@/components/UI/InlineAlert/InlineAlert';
import type { ItemFormOptions } from '../Items.types';
import { ITEM_TOUR_TARGETS } from '../itemTours';
import type { ItemFormSectionProps } from './ItemForm.types';

interface ItemManagementFieldsProps extends ItemFormSectionProps {
    resourceStatuses: ItemFormOptions['resourceStatuses'];
    /** Unidades emprestadas; a quantidade total não pode ficar abaixo delas. */
    activeLoans: number;
    showLoanWarning: boolean;
}

/** Quantidade, status do recurso, empréstimos e ativação. */
export default function ItemManagementFields({
    form,
    errors,
    disabled,
    resourceStatuses,
    activeLoans,
    showLoanWarning,
}: ItemManagementFieldsProps): React.JSX.Element {
    const physical = !form.data.is_digital;

    return (
        <FormSection
            id="item-management-form"
            title="Gestão"
            variant="inline"
            iconClass="fa fa-tasks"
            tourTarget={ITEM_TOUR_TARGETS.management}
        >
            <FormGrid>
                <FormStack>
                    <TextInputField
                        id="item-quantity"
                        name="quantity"
                        type="number"
                        label="Quantidade Total"
                        required={physical}
                        min={physical ? Math.max(1, activeLoans) : 0}
                        value={form.data.quantity}
                        error={errors.quantity}
                        onChange={(value) => form.setData('quantity', value)}
                    />
                    {showLoanWarning ? (
                        <InlineAlert variant="warning">
                            <i className="fa fa-lock" aria-hidden="true" /> {activeLoans} unidades
                            em uso.
                        </InlineAlert>
                    ) : null}
                </FormStack>
                <SelectInputField
                    id="item-status"
                    name="status"
                    label="Status do Recurso"
                    required
                    options={optionsFromRecord(resourceStatuses)}
                    value={form.data.status}
                    error={errors.status}
                    onChange={(value) => form.setData('status', value)}
                />
                <ToggleControl
                    id="item-loanable"
                    name="is_loanable"
                    size="small"
                    checked={form.data.is_loanable}
                    disabled={disabled}
                    label="Permitir Empréstimos"
                    labelAddon={<InfoTooltip text="Marque se este item pode ser emprestado." />}
                    onChange={(checked) => form.setData('is_loanable', checked)}
                />
                <ToggleControl
                    id="item-active"
                    name="is_active"
                    size="small"
                    checked={form.data.is_active}
                    disabled={disabled}
                    label="Ativar no Sistema"
                    labelAddon={<InfoTooltip text="Disponível para visualização e empréstimos." />}
                    onChange={(checked) => form.setData('is_active', checked)}
                />
            </FormGrid>
        </FormSection>
    );
}
