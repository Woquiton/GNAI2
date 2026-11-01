import { useForm } from '@inertiajs/react';
import { TextAreaField } from '@/components/Forms/FormFields/FormFields';
import { FormStack } from '@/components/Forms/FormGrid/FormGrid';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import FormSection from '@/components/Forms/FormSection/FormSection';
import CardBox from '@/components/UI/CardBox/CardBox';
import DetailField from '@/components/UI/DetailField/DetailField';
import DetailGrid from '@/components/UI/DetailGrid/DetailGrid';
import WaitlistResourceDetails from '../WaitlistResourceDetails';
import { waitlistStudentLabel } from '../Waitlists.constants';
import { waitlistUrls } from '../Waitlists.routes';
import type { WaitlistRecord } from '../Waitlists.types';
import WaitlistFormActions from './WaitlistFormActions';
import type { WaitlistEditFormData } from './WaitlistForm.types';

const NOT_INFORMED = 'Não informado';

interface WaitlistEditFormProps {
    waitlist: WaitlistRecord;
    authUser: { name: string };
    statusLabel?: string;
    canSubmit: boolean;
}

/** Edição da solicitação: a identificação fica em leitura e só as observações mudam. */
export default function WaitlistEditForm({
    waitlist,
    authUser,
    statusLabel,
    canSubmit,
}: WaitlistEditFormProps): React.JSX.Element {
    const form = useForm<WaitlistEditFormData>({ observation: waitlist.observation ?? '' });
    const { formRef, submit } = useFormSubmission(form);
    const student = waitlist.student ? waitlistStudentLabel(waitlist.student) : NOT_INFORMED;

    function save(): void {
        submit({
            url: waitlistUrls.update(waitlist.id),
            method: 'put',
            failureText: 'Não foi possível concluir a operação. Tente novamente.',
            blocked: !canSubmit,
        });
    }

    return (
        <FormLayout
            ref={formRef}
            aria-label="Editar solicitação da fila de espera"
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
                        <DetailGrid>
                            <WaitlistResourceDetails {...waitlist} />
                            <DetailField label="Aluno (Beneficiário)">{student}</DetailField>
                            <DetailField label="Profissional (Beneficiário)">
                                {waitlist.professional?.name ?? NOT_INFORMED}
                            </DetailField>
                            <DetailField label="Usuário Responsável">{authUser.name}</DetailField>
                            <DetailField label="Status Atual">
                                {statusLabel ?? waitlist.status_label}
                            </DetailField>
                        </DetailGrid>
                        <TextAreaField
                            id="waitlist-observation-field"
                            name="observation"
                            label="Observações"
                            rows={3}
                            placeholder="Adicione informações relevantes sobre esta solicitação..."
                            value={form.data.observation}
                            error={form.errors.observation}
                            onChange={(value) => form.setData('observation', value)}
                        />
                    </FormStack>
                </FormSection>
            </CardBox>
            <WaitlistFormActions
                editing
                cancelHref={waitlistUrls.show(waitlist.id)}
                canSubmit={canSubmit}
                processing={form.processing}
            />
        </FormLayout>
    );
}
