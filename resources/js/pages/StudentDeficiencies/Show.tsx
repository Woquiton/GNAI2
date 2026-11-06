import StudentDeficiencyDetails from '@/components/StudentDeficiencies/Details/StudentDeficiencyDetails';
import StudentDeficiencyDetailsActions from '@/components/StudentDeficiencies/Details/StudentDeficiencyDetailsActions';
import { UNKNOWN_PROFILE } from '@/components/StudentDeficiencies/StudentDeficiencies.constants';
import {
    studentDeficiencyBreadcrumb,
    studentDeficiencyUrls,
} from '@/components/StudentDeficiencies/StudentDeficiencies.routes';
import type { StudentDeficiencyShowProps } from '@/components/StudentDeficiencies/StudentDeficiencies.types';
import StudentDeficiencyDeleteModal from '@/components/StudentDeficiencies/StudentDeficiencyDeleteModal';
import { studentDeficiencyShowTour } from '@/components/StudentDeficiencies/studentDeficiencyTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function StudentDeficienciesShowPage({
    student,
    deficiency,
    can,
}: StudentDeficiencyShowProps): React.JSX.Element {
    const profileName = deficiency.deficiency?.name ?? UNKNOWN_PROFILE;
    const removal = useConfirmedAction<{ profileName: string }>({
        failureText: 'Não foi possível excluir o perfil de atendimento. Tente novamente.',
    });

    return (
        <BusinessPage
            title="Detalhes do Perfil de Atendimento do Aluno"
            subtitle={`Aluno: ${student.person.name}`}
            breadcrumbItems={studentDeficiencyBreadcrumb({
                student,
                studentDeficiency: deficiency,
            })}
            busy={removal.processing}
            tour={studentDeficiencyShowTour}
        >
            <StudentDeficiencyDetails deficiency={deficiency} profileName={profileName} />
            <StudentDeficiencyDetailsActions
                studentId={student.id}
                studentDeficiencyId={deficiency.id}
                permissions={can}
                deleting={removal.processing}
                onDelete={() => removal.open({ profileName })}
            />
            <StudentDeficiencyDeleteModal
                target={removal.target}
                context="details"
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={() =>
                    removal.submit(
                        'delete',
                        studentDeficiencyUrls.destroy(student.id, deficiency.id),
                    )
                }
            />
        </BusinessPage>
    );
}
