import StudentSessionList from '@/components/Inclusion/Sessions/List/StudentSessionList';
import { studentSessionsBreadcrumb } from '@/components/Inclusion/Sessions/Sessions.routes';
import type { SessionStudentIndexProps } from '@/components/Inclusion/Sessions/Sessions.types';
import { studentUrls } from '@/components/Inclusion/Students/Students.routes';
import { sessionStudentTour } from '@/components/Inclusion/Sessions/sessionTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import Button from '@/components/UI/Button/Button';

export default function InclusionSessionsStudentIndexPage({
    can,
    ...list
}: SessionStudentIndexProps): React.JSX.Element {
    const { student } = list;

    return (
        <BusinessPage
            title={`Agendamentos de Atendimento, ${student.name}`}
            subtitle="Histórico de atendimentos realizados para o aluno."
            breadcrumbItems={studentSessionsBreadcrumb(student)}
            tour={sessionStudentTour}
            actions={
                <Button
                    href={studentUrls.show(student.id)}
                    tone="cancel"
                    leftIconClass="fa fa-arrow-left"
                    label="Voltar"
                    title="Voltar ao prontuário"
                    aria-label="Voltar ao prontuário do aluno"
                />
            }
        >
            <StudentSessionList {...list} canView={can.view} />
        </BusinessPage>
    );
}
