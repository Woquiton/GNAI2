import PaeeHistoryList from '@/components/Inclusion/Paees/List/PaeeHistoryList';
import { paeeStudentBreadcrumb, studentPaeesTab } from '@/components/Inclusion/Paees/Paees.routes';
import type { PaeeHistoryProps } from '@/components/Inclusion/Paees/Paees.types';
import StudentRecordReturnButton from '@/components/Inclusion/Students/StudentRecordReturnButton';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionPaeesHistoryPage({
    student,
    paees,
    can,
}: PaeeHistoryProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Histórico de PAEE"
            subtitle={`Aluno: ${student.name}`}
            breadcrumbItems={paeeStudentBreadcrumb(student, {
                recordTab: true,
                current: 'Histórico de PAEE',
            })}
            actions={<StudentRecordReturnButton studentId={student.id} tab={studentPaeesTab} />}
        >
            <PaeeHistoryList paees={paees} permissions={can} />
        </BusinessPage>
    );
}
