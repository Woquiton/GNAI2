import { useState } from 'react';
import TeacherDetails from '@/components/Inclusion/Teachers/Details/TeacherDetails';
import TeacherDetailsActions from '@/components/Inclusion/Teachers/Details/TeacherDetailsActions';
import TeacherDeleteModal from '@/components/Inclusion/Teachers/TeacherDeleteModal';
import { teacherBreadcrumb, teacherUrls } from '@/components/Inclusion/Teachers/Teachers.routes';
import type { TeacherShowProps } from '@/components/Inclusion/Teachers/Teachers.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionTeachersShowPage({
    teacher,
    display,
    impersonationUserId,
    can,
}: TeacherShowProps): React.JSX.Element {
    const [impersonating, setImpersonating] = useState(false);
    const removal = useConfirmedAction<{ name: string }>({
        failureText: 'Não foi possível excluir o professor. Tente novamente.',
    });
    const { name } = teacher.person;
    const busy = removal.processing || impersonating;

    return (
        <BusinessPage
            title="Perfil do Professor"
            subtitle="Informações detalhadas do docente e atribuições acadêmicas."
            documentTitle={name}
            breadcrumbItems={teacherBreadcrumb({ current: name })}
            busy={busy}
        >
            <TeacherDetails teacher={teacher} display={display} />
            <TeacherDetailsActions
                teacherId={teacher.id}
                name={name}
                impersonationUserId={impersonationUserId}
                permissions={can}
                busy={busy}
                onImpersonatingChange={setImpersonating}
                onDelete={() => removal.open({ name })}
            />
            <TeacherDeleteModal
                target={removal.target}
                context="details"
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={() => removal.submit('delete', teacherUrls.destroy(teacher.id))}
            />
        </BusinessPage>
    );
}
