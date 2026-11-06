import { studentRecordUrl } from '@/components/Students/Students.routes';
import FormActions from '@/components/Forms/FormActions/FormActions';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { supportRequestUrls } from '../SupportRequests.routes';
import { SUPPORT_REQUEST_TOUR_TARGETS } from '../supportRequestTours';
import SupportRequestAttachmentsFields from './SupportRequestAttachmentsFields';
import SupportRequestDemandFields from './SupportRequestDemandFields';
import type { SupportRequestFormProps } from './SupportRequestForm.types';
import SupportRequestIdentificationFields from './SupportRequestIdentificationFields';
import SupportRequestReviewFields from './SupportRequestReviewFields';
import { useSupportRequestForm } from './useSupportRequestForm';

export default function SupportRequestForm(props: SupportRequestFormProps): React.JSX.Element {
    const { form, formRef, errors, save, update } = useSupportRequestForm(props);
    const editing = Boolean(props.supportRequest);
    const fields = { data: form.data, errors, disabled: form.processing, update };
    const studentId = props.supportRequest?.student_id ?? Number(props.selectedStudentId);
    const fallbackUrl = props.supportRequest
        ? supportRequestUrls.show(props.supportRequest.id)
        : supportRequestUrls.index;
    const cancelUrl =
        props.fromStudent && studentId
            ? studentRecordUrl(studentId, 'support-requests')
            : fallbackUrl;

    const previousCourseName = props.supportRequest?.course_id
        ? undefined
        : props.supportRequest?.course_name;

    return (
        <FormLayout
            ref={formRef}
            aria-label={
                editing
                    ? 'Editar solicitação de atendimento'
                    : 'Registrar solicitação de atendimento'
            }
            aria-busy={form.processing}
            onSubmit={(event) => {
                event.preventDefault();
                save();
            }}
        >
            <CardBox>
                <fieldset disabled={form.processing}>
                    <SupportRequestIdentificationFields
                        {...fields}
                        options={props.options}
                        editing={editing || Boolean(props.fromStudent)}
                        previousCourseName={previousCourseName}
                    />
                    <SupportRequestDemandFields {...fields} options={props.options} />
                    <SupportRequestReviewFields
                        {...fields}
                        statuses={props.options.statuses}
                        editing={editing}
                    />
                    <SupportRequestAttachmentsFields
                        {...fields}
                        existing={props.supportRequest?.attachments ?? []}
                    />
                </fieldset>
            </CardBox>
            <FormActions
                status={form.processing ? 'Salvando solicitação…' : undefined}
                tourTarget={SUPPORT_REQUEST_TOUR_TARGETS.formActions}
            >
                <Button
                    href={cancelUrl}
                    tone="cancel"
                    label="Cancelar"
                    disabled={form.processing}
                />
                <Button type="submit" tone="save" label="Salvar" disabled={form.processing} />
            </FormActions>
        </FormLayout>
    );
}
