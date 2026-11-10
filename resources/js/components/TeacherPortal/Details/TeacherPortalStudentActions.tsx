import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { teacherPortalUrls } from '../TeacherPortal.routes';
import { TEACHER_PORTAL_TOUR_TARGETS } from '../teacherPortalTours';
import type { TeacherPortalPei } from '../TeacherPortal.types';
import TeacherPortalAdaptationShortcuts from './TeacherPortalAdaptationShortcuts';

/** Retorno à lista e acesso às adaptações próprias para iniciar ou editar na aba PEI. */
export default function TeacherPortalStudentActions({
    pei,
    activeTab,
}: {
    pei: TeacherPortalPei | null;
    activeTab: string;
}): React.JSX.Element {
    const pending = (pei?.disciplines ?? []).filter(
        (discipline) => discipline.can_edit && !discipline.is_started,
    );
    const started = (pei?.disciplines ?? []).filter(
        (discipline) => discipline.can_edit && discipline.is_started,
    );

    return (
        <FormActions tourTarget={TEACHER_PORTAL_TOUR_TARGETS.studentActions}>
            <Button
                href={teacherPortalUrls.index}
                tone="cancel"
                label="Voltar"
                title="Voltar para meus alunos"
                aria-label="Voltar para meus alunos"
            />
            {activeTab === 'pei' && pending.length > 0 ? (
                <TeacherPortalAdaptationShortcuts disciplines={pending} mode="start" />
            ) : null}
            {activeTab === 'pei' && started.length > 0 ? (
                <TeacherPortalAdaptationShortcuts disciplines={started} mode="edit" />
            ) : null}
        </FormActions>
    );
}
