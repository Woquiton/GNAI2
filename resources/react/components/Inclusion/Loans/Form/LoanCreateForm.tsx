import { optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import FormField from '@/components/Forms/FormField/FormField';
import ClockPicker from '@/components/Forms/ClockPicker/ClockPicker';
import {
    DateInputField,
    RichTextField,
    SelectInputField,
} from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide } from '@/components/Forms/FormGrid/FormGrid';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import FormSection from '@/components/Forms/FormSection/FormSection';
import TextInput from '@/components/Forms/TextInput/TextInput';
import CardBox from '@/components/UI/CardBox/CardBox';
import { loanUrls } from '../Loans.routes';
import type { LoanCreateProps } from '../Loans.types';
import LoanFormActions from './LoanFormActions';
import { useLoanCreateForm } from './useLoanCreateForm';
import './LoanForm.css';

/** Registro de empréstimo: item, beneficiário, saída, prazo de devolução e observações. */
export default function LoanCreateForm(props: LoanCreateProps): React.JSX.Element {
    const {
        form,
        errors,
        formRef,
        itemOptions,
        initialTime,
        loanDay,
        changeItemType,
        changeItem,
        changeLoanDay,
        changeLoanTime,
        editorFailed,
        reportEditorFailure,
        save,
    } = useLoanCreateForm(props);
    const itemPlaceholder = form.data.item_type ? 'Selecione' : 'Selecione o tipo primeiro';

    return (
        <FormLayout
            ref={formRef}
            aria-label="Registrar novo empréstimo"
            aria-busy={form.processing}
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <FormSection
                    id="loan-identification"
                    title="Identificação"
                    variant="inline"
                    iconClass="fa fa-exchange"
                >
                    <FormGrid>
                        <SelectInputField
                            id="loanable-type"
                            name="item_type"
                            label="Tipo do Item"
                            required
                            options={optionsFromRecord(props.itemTypes)}
                            value={form.data.item_type}
                            error={errors.item_type}
                            onChange={changeItemType}
                        />
                        <SelectInputField
                            id="loanable-item"
                            name="loanable_id"
                            label="Item Específico"
                            required
                            disabled={!form.data.item_type}
                            placeholder={itemPlaceholder}
                            options={itemOptions}
                            value={form.data.loanable_id}
                            error={errors.loanable_id}
                            onChange={changeItem}
                        />
                        <SelectInputField
                            id="loan-student"
                            name="student_id"
                            label="Estudante (Beneficiário)"
                            options={optionsFromRecord(props.students)}
                            value={form.data.student_id}
                            error={errors.student_id}
                            onChange={(value) => form.setData('student_id', value)}
                        />
                        <SelectInputField
                            id="loan-professional"
                            name="professional_id"
                            label="Profissional (Beneficiário)"
                            options={optionsFromRecord(props.professionals)}
                            value={form.data.professional_id}
                            error={errors.professional_id}
                            onChange={(value) => form.setData('professional_id', value)}
                        />
                        <FormGridWide>
                            <FormField id="loan-user" label="Usuário Autenticado (Responsável)">
                                <TextInput id="loan-user" value={props.authUser.name} disabled />
                            </FormField>
                        </FormGridWide>
                        <div className="loanForm__dateTimeFields">
                            <DateInputField
                                id="loan-date"
                                name="loan_date"
                                label="Data de Saída"
                                required
                                value={loanDay}
                                error={errors.loan_date}
                                onChange={changeLoanDay}
                            />
                            <FormField id="loan-time" label="Horário" requiredIndicator>
                                <ClockPicker
                                    id="loan-time"
                                    label="Horário da Saída"
                                    defaultValue={initialTime}
                                    required
                                    onChange={changeLoanTime}
                                />
                            </FormField>
                        </div>
                        <DateInputField
                            id="loan-due-date"
                            name="due_date"
                            label="Previsão de Devolução"
                            required
                            hint="Defina o prazo limite para a entrega do item."
                            hintLabel="Ajuda sobre a previsão de devolução"
                            value={form.data.due_date}
                            error={errors.due_date}
                            onChange={(date) => form.setData('due_date', date)}
                        />
                        <FormGridWide>
                            <RichTextField
                                id="loan-observation"
                                label="Observações / Estado do Item"
                                defaultValue={form.data.observation}
                                height={120}
                                disabled={form.processing}
                                error={errors.observation}
                                onLoadError={() =>
                                    reportEditorFailure('observation', 'observações')
                                }
                                onChange={(html) => form.setData('observation', html)}
                            />
                        </FormGridWide>
                    </FormGrid>
                </FormSection>
            </CardBox>
            <LoanFormActions
                cancelHref={loanUrls.index}
                submitLabel="Cadastrar"
                canSubmit={props.can.submit}
                processing={form.processing}
                blocked={editorFailed}
            />
        </FormLayout>
    );
}
