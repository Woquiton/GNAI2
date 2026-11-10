import { useForm } from '@inertiajs/react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { TEACHER_PORTAL_TOUR_TARGETS } from '@/components/TeacherPortal/teacherPortalTours';

export default function TeacherPortalViewAction({
    mode,
}: {
    mode: 'centered' | 'full';
}): React.JSX.Element {
    const form = useForm({ mode });
    const { submit } = useFormSubmission(form);
    const centered = mode === 'centered';
    const label = centered ? 'Usar largura total' : 'Centralizar conteúdo';
    const title = form.processing ? 'Salvando visualização...' : label;

    return (
        <li className="topbar__navItem" data-tour={TEACHER_PORTAL_TOUR_TARGETS.view}>
            <button
                type="button"
                className="topbar__navLink topbar__navButton"
                title={title}
                aria-label="Conteúdo centralizado"
                aria-pressed={centered}
                aria-busy={form.processing}
                disabled={form.processing}
                onClick={() =>
                    submit({
                        url: '/autenticacao/preferencias/visualizacao-do-portal',
                        method: 'put',
                        transform: () => ({ mode: centered ? 'full' : 'centered' }),
                        failureText: 'Não foi possível salvar a visualização do portal. Tente novamente.',
                    })
                }
            >
                <i
                    className={centered ? 'fa fa-expand' : 'fa fa-compress'}
                    aria-hidden="true"
                />
            </button>
        </li>
    );
}
