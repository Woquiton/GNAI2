import FormSection from '@/components/Forms/FormSection/FormSection';
import PeiConfirmAction from '../../PeiConfirmAction';
import { peiDisciplineUrls } from '../../Peis.routes';
import type { PeiDisciplineShowProps } from '../../Peis.types';
import { PEI_TOUR_TARGETS } from '../../peiTours';

export default function PeiDisciplineReminders({
    peiId,
    disciplineId,
    reminders,
    canManage,
}: {
    peiId: number;
    disciplineId: number;
    reminders: PeiDisciplineShowProps['reminders'];
    canManage: boolean;
}): React.JSX.Element {
    const stopped = reminders.stoppedAt !== null;
    let status =
        'Enquanto não houver preenchimento, quem criou a adaptação recebe um lembrete a cada cinco dias.';
    if (reminders.hasPlanningContent) {
        status =
            'O preenchimento já foi iniciado. Os lembretes de pendência não são enviados enquanto houver conteúdo no planejamento.';
    } else if (stopped) {
        status = `Os lembretes foram encerrados em ${reminders.stoppedAt}. Você pode retomá-los se precisar acompanhar o preenchimento novamente.`;
    } else if (!reminders.applicable) {
        status =
            'Não há lembretes para PEIs finalizados ou fora da versão vigente, nem para alunos que não estão ativos.';
    }
    const action = stopped
        ? peiDisciplineUrls.resumeReminders(peiId, disciplineId)
        : peiDisciplineUrls.stopReminders(peiId, disciplineId);
    const label = stopped ? 'Retomar lembretes' : 'Encerrar lembretes';

    return (
        <FormSection
            title="Lembretes de preenchimento"
            iconClass="fa fa-bell-o"
            variant="inline"
            tourTarget={PEI_TOUR_TARGETS.disciplineReminders}
        >
            <p>{status}</p>
            {canManage && !reminders.hasPlanningContent ? (
                <PeiConfirmAction
                    method="patch"
                    action={action}
                    label={label}
                    ariaLabel={label}
                    tone={stopped ? 'save' : 'cancel'}
                    iconClass={stopped ? 'fa fa-bell-o' : 'fa fa-bell-slash-o'}
                    modalTitle={label}
                    message={
                        stopped
                            ? 'Retomar o acompanhamento desta adaptação? Se ela continuar sem preenchimento, o próximo lembrete será após cinco dias.'
                            : 'Não é mais necessário acompanhar este preenchimento? Os lembretes serão encerrados. Você poderá retomá-los depois.'
                    }
                    confirmLabel={label}
                    processingLabel={stopped ? 'Retomando lembretes...' : 'Encerrando lembretes...'}
                />
            ) : null}
        </FormSection>
    );
}
