import type { WaitlistFilters } from './Waitlists.types';

export const emptyWaitlistFilters: WaitlistFilters = {
    item: '',
    student: '',
    professional: '',
    status: '',
};

/** Filtro de status da listagem (`WaitlistStatus`). */
export const waitlistStatusOptions = [
    { value: 'waiting', label: 'Em espera' },
    { value: 'notified', label: 'Notificado' },
    { value: 'fulfilled', label: 'Atendido' },
    { value: 'cancelled', label: 'Cancelado' },
];

/** Aluno com a matrícula entre parênteses, quando informada. */
export function waitlistStudentLabel(student: { name: string; registration?: string | null }) {
    return student.registration
        ? `${student.name} (Matrícula: ${student.registration})`
        : student.name;
}
