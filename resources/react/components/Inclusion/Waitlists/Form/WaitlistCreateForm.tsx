import { optionsFromRecord } from '@/components/Forms/FormFields/fieldOptions';
import FormField from '@/components/Forms/FormField/FormField';
import { SelectInputField, TextAreaField } from '@/components/Forms/FormFields/FormFields';
import FormGrid, { FormGridWide, FormStack } from '@/components/Forms/FormGrid/FormGrid';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import FormSection from '@/components/Forms/FormSection/FormSection';
import TextInput from '@/components/Forms/TextInput/TextInput';
import CardBox from '@/components/UI/CardBox/CardBox';
import { waitlistUrls } from '../Waitlists.routes';
import type { WaitlistCreateProps } from '../Waitlists.types';
import WaitlistFormActions from './WaitlistFormActions';
import { useWaitlistCreateForm } from './useWaitlistCreateForm';
import './WaitlistForm.css';

/** Cadastro na fila de espera: recurso indisponível, beneficiário único e observações. */
export default function WaitlistCreateForm(props: WaitlistCreateProps): React.JSX.Element {
    const {
        form,
        errors,
        formRef,
        studentOptions,
        professionalOptions,
        resourceOptions,
        changeItemType,
        changeStudent,
        changeProfessional,
        save,
    } = useWaitlistCreateForm(props);
    const resourcePlaceholder = form.data.item_type
        ? 'Selecione o item'
        : 'Selecione o tipo primeiro';

    return (
        <FormLayout
            ref={formRef}
            aria-label="Cadastrar solicitação na fila de espera"
            aria-busy={form.processing}
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <FormSection
                    id="waitlist-identification"
                    title="Identificação"
                    variant="inline"
                    iconClass="fa fa-list-alt"
                >
                    <FormStack>
                        <FormGrid columns={2}>
                            <SelectInputField
                                id="waitlist-resource-type"
                                name="item_type"
                                label="Tipo do Item"
                                required
                                options={optionsFromRecord(props.itemTypes ?? {})}
                                value={form.data.item_type}
                                error={errors.item_type}
                                onChange={changeItemType}
                            />
                            <SelectInputField
                                id="waitlist-resource-item"
                                name="waitlistable_id"
                                label="Item Específico"
                                required
                                placeholder={resourcePlaceholder}
                                disabled={!form.data.item_type}
                                options={resourceOptions}
                                value={form.data.waitlistable_id}
                                error={errors.waitlistable_id}
                                onChange={(value) => form.setData('waitlistable_id', value)}
                            />
                            <SelectInputField
                                id="waitlist-student"
                                name="student_id"
                                label="Aluno (Beneficiário)"
                                disabled={Boolean(form.data.professional_id)}
                                options={studentOptions}
                                value={form.data.student_id}
                                error={errors.student_id}
                                onChange={changeStudent}
                            />
                            <SelectInputField
                                id="waitlist-professional"
                                name="professional_id"
                                label="Profissional (Beneficiário)"
                                disabled={Boolean(form.data.student_id)}
                                options={professionalOptions}
                                value={form.data.professional_id}
                                error={errors.professional_id}
                                onChange={changeProfessional}
                            />
                            <FormGridWide>
                                <FormField
                                    id="waitlist-user"
                                    label="Usuário Responsável pelo Registro"
                                >
                                    <TextInput
                                        id="waitlist-user"
                                        value={props.authUser.name}
                                        disabled
                                        readOnly
                                    />
                                </FormField>
                            </FormGridWide>
                        </FormGrid>
                        <p className="waitlistForm__hint">
                            Selecione um aluno ou um profissional como beneficiário, nunca ambos.
                        </p>
                        <TextAreaField
                            id="waitlist-observation-field"
                            name="observation"
                            label="Observações"
                            rows={3}
                            placeholder="Relate o motivo da urgência ou detalhes da solicitação..."
                            value={form.data.observation}
                            error={errors.observation}
                            onChange={(value) => form.setData('observation', value)}
                        />
                    </FormStack>
                </FormSection>
            </CardBox>
            <WaitlistFormActions
                editing={false}
                cancelHref={waitlistUrls.index}
                canSubmit={props.can.submit}
                processing={form.processing}
            />
        </FormLayout>
    );
}
