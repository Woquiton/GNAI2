import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import {
    GROUP_SESSION,
    INDIVIDUAL_SESSION,
    localDate,
    PEDAGOGICAL_ATTENDANCE,
    sessionSaveFailureText,
} from '../Sessions.constants';
import { sessionUrls } from '../Sessions.routes';
import type { SessionFormData, SessionFormProps } from './SessionForm.types';
import { adjustEndTime } from './SessionForm.utils';

function initialData(props: SessionFormProps): SessionFormData {
    if (props.mode === 'edit') {
        return {
            attendance_type: props.sessionForm.attendance_type,
            type: props.session.type,
            professional_id: String(props.session.professional_id),
            student_ids: props.session.students.map((student) => String(student.id)),
            session_date: props.sessionForm.session_date,
            start_time: props.sessionForm.start_time,
            end_time: adjustEndTime(
                props.endTimes,
                props.sessionForm.start_time,
                props.sessionForm.end_time,
            ),
            location: props.session.location ?? '',
            session_objective: props.session.session_objective ?? '',
        };
    }

    return {
        attendance_type: props.defaults.attendance_type,
        type: props.defaults.type,
        professional_id: '',
        student_ids: [''],
        session_date: '',
        start_time: '',
        end_time: '',
        location: '',
        session_objective: '',
    };
}

/**
 * Estado, linhas de alunos, ajustes de horário e envio do agendamento. O envio passa antes pela
 * escolha do aviso por e-mail (`send_notification`), exceto no cadastro de datas passadas.
 */
export function useSessionForm(props: SessionFormProps) {
    const session = props.mode === 'edit' ? props.session : undefined;
    const editing = props.mode === 'edit';
    const nextRowKey = useRef(1);
    const [rowKeys, setRowKeys] = useState<number[]>([0]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const form = useForm<SessionFormData>(initialData(props));
    const submission = useFormSubmission(form);
    const errors = form.errors as Record<string, string | undefined>;
    const isPedagogical = form.data.attendance_type === PEDAGOGICAL_ATTENDANCE;
    const canAddStudents = !editing && !isPedagogical && form.data.type === GROUP_SESSION;

    function changeAttendanceType(value: string): void {
        form.setData((data) => {
            if (value !== PEDAGOGICAL_ATTENDANCE) {
                return { ...data, attendance_type: value };
            }

            return {
                ...data,
                attendance_type: value,
                type: INDIVIDUAL_SESSION,
                student_ids: data.student_ids.slice(0, 1),
            };
        });

        if (value === PEDAGOGICAL_ATTENDANCE) {
            setRowKeys((keys) => keys.slice(0, 1));
        }
    }

    function changeStudent(index: number, value: string): void {
        form.setData((data) => ({
            ...data,
            student_ids: data.student_ids.map((id, position) => (position === index ? value : id)),
        }));
        form.clearErrors('student_ids', `student_ids.${index}` as const);
    }

    function addStudent(): void {
        const key = nextRowKey.current;
        nextRowKey.current += 1;
        setRowKeys((keys) => [...keys, key]);
        form.setData((data) => ({ ...data, student_ids: [...data.student_ids, ''] }));
    }

    function removeStudent(index: number): void {
        if (form.data.student_ids.length <= 1) {
            return;
        }

        setRowKeys((keys) => keys.filter((_, position) => position !== index));
        form.setData((data) => ({
            ...data,
            student_ids: data.student_ids.filter((_, position) => position !== index),
        }));
    }

    function changeStartTime(value: string): void {
        form.setData((data) => ({
            ...data,
            start_time: value,
            end_time: adjustEndTime(props.endTimes, value, data.end_time),
        }));
    }

    function save(sendNotification?: boolean): void {
        submission.submit({
            url: session ? sessionUrls.update(session.id) : sessionUrls.store,
            method: session ? 'put' : 'post',
            failureText: sessionSaveFailureText,
            transform: () => {
                const data = form.data;
                const payload: Record<string, unknown> = {
                    ...data,
                    type:
                        data.attendance_type === PEDAGOGICAL_ATTENDANCE
                            ? INDIVIDUAL_SESSION
                            : data.type,
                    student_ids: data.student_ids.filter(Boolean),
                };

                if (session) {
                    payload.status = session.status;
                }

                if (sendNotification !== undefined) {
                    payload.send_notification = sendNotification;
                }

                return payload;
            },
        });
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        if (form.processing) {
            return;
        }

        // Paridade com o legado: no cadastro, datas passadas são salvas sem perguntar
        // sobre o e-mail; na edição, a escolha é sempre solicitada.
        if (!editing && form.data.session_date < localDate()) {
            save();
            return;
        }

        setConfirmOpen(true);
    }

    function chooseNotification(sendNotification: boolean): void {
        setConfirmOpen(false);
        save(sendNotification);
    }

    function closeConfirmation(): void {
        setConfirmOpen(false);
    }

    return {
        form,
        errors,
        formRef: submission.formRef,
        session,
        editing,
        rowKeys,
        isPedagogical,
        canAddStudents,
        confirmOpen,
        changeAttendanceType,
        changeStudent,
        addStudent,
        removeStudent,
        changeStartTime,
        handleSubmit,
        chooseNotification,
        closeConfirmation,
    };
}

export type SessionFormState = ReturnType<typeof useSessionForm>;
