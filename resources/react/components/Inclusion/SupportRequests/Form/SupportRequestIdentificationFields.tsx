import {
    DateInputField,
    SelectInputField,
    TextInputField,
} from '@/components/Forms/FormFields/FormFields';
import FormGrid from '@/components/Forms/FormGrid/FormGrid';
import FormSection from '@/components/Forms/FormSection/FormSection';
import type { SupportRequestOptions } from '../SupportRequests.types';
import { SUPPORT_REQUEST_TOUR_TARGETS } from '../supportRequestTours';
import type { SupportRequestFieldsProps } from './SupportRequestForm.types';

export default function SupportRequestIdentificationFields({
    data,
    errors,
    disabled,
    update,
    options,
    editing,
    previousCourseName,
}: SupportRequestFieldsProps & {
    options: SupportRequestOptions;
    editing: boolean;
    previousCourseName?: string | null;
}): React.JSX.Element {
    const courseHint =
        !data.course_id && previousCourseName
            ? `Informação registrada anteriormente: ${previousCourseName}. Selecione o curso cadastrado correspondente, se disponível.`
            : undefined;

    return (
        <FormSection
            id="support-request-identification"
            tourTarget={SUPPORT_REQUEST_TOUR_TARGETS.identification}
            title="Identificação"
            variant="inline"
            iconClass="fa fa-user"
        >
            <FormGrid columns={3}>
                <SelectInputField
                    id="support-request-student"
                    name="student_id"
                    label="Aluno"
                    required
                    options={options.students}
                    value={data.student_id}
                    disabled={disabled || editing}
                    error={errors.student_id}
                    onChange={(value) => update('student_id', value)}
                />
                <DateInputField
                    id="support-request-date"
                    name="request_date"
                    label="Data da solicitação"
                    required
                    value={data.request_date}
                    disabled={disabled}
                    error={errors.request_date}
                    onChange={(value) => update('request_date', value)}
                />
                <SelectInputField
                    id="support-request-course"
                    name="course_id"
                    label="Curso"
                    options={options.courses}
                    hint={courseHint}
                    value={data.course_id}
                    error={errors.course_id}
                    disabled={disabled}
                    onChange={(value) => update('course_id', value)}
                />
                <TextInputField
                    id="support-request-requester"
                    name="requester_name"
                    label="Nome do solicitante"
                    required
                    maxLength={255}
                    value={data.requester_name}
                    error={errors.requester_name}
                    onChange={(value) => update('requester_name', value)}
                />
                <SelectInputField
                    id="support-request-role"
                    name="requester_role"
                    label="Vínculo com o aluno"
                    required
                    options={options.requesterRoles}
                    value={data.requester_role}
                    error={errors.requester_role}
                    disabled={disabled}
                    onChange={(value) => update('requester_role', value)}
                />
                <TextInputField
                    id="support-request-contact"
                    name="requester_contact"
                    label="Contato do solicitante"
                    maxLength={255}
                    value={data.requester_contact}
                    error={errors.requester_contact}
                    onChange={(value) => update('requester_contact', value)}
                />
                {data.requester_role === 'other' ? (
                    <TextInputField
                        id="support-request-other-role"
                        name="requester_other"
                        label="Informe o vínculo"
                        required
                        maxLength={150}
                        value={data.requester_other}
                        error={errors.requester_other}
                        onChange={(value) => update('requester_other', value)}
                    />
                ) : null}
            </FormGrid>
        </FormSection>
    );
}
