import { useState } from 'react';
import StudentDetailsActions from '@/components/Inclusion/Students/Details/StudentDetailsActions';
import StudentRecordSummary from '@/components/Inclusion/Students/Details/StudentRecordSummary';
import { createStudentRecordTabs } from '@/components/Inclusion/Students/Details/studentRecordTabs';
import StudentStatusPanel from '@/components/Inclusion/Students/Details/StudentStatusPanel';
import StudentDeleteModal from '@/components/Inclusion/Students/StudentDeleteModal';
import { STUDENT_FAILURE_TEXT } from '@/components/Inclusion/Students/Students.constants';
import { studentBreadcrumb, studentUrls } from '@/components/Inclusion/Students/Students.routes';
import type {
    StudentRecord,
    StudentShowProps,
} from '@/components/Inclusion/Students/Students.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import RecordTabs from '@/components/Navigation/RecordTabs/RecordTabs';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function StudentsShow(props: StudentShowProps): React.JSX.Element {
    const { student, permissions, statusPanel } = props;
    const [activeTab, setActiveTab] = useState(props.activeTab || 'personal-data');
    const removal = useConfirmedAction<StudentRecord>({ failureText: STUDENT_FAILURE_TEXT });

    return (
        <BusinessPage
            title="Prontuário do Aluno"
            subtitle="Visualize o ecossistema completo e histórico detalhado do aluno."
            documentTitle={student.person.name}
            breadcrumbItems={studentBreadcrumb({ student })}
            busy={removal.processing}
        >
            <StudentRecordSummary {...props} />
            <StudentStatusPanel panel={statusPanel} onOpenTab={setActiveTab} />
            <RecordTabs
                items={createStudentRecordTabs(props)}
                initialActiveId={activeTab}
                onChange={setActiveTab}
            />
            <StudentDetailsActions
                studentId={student.id}
                studentName={student.person.name}
                permissions={permissions}
                deleting={removal.processing}
                onDelete={() => removal.open(student)}
            />
            <StudentDeleteModal
                student={removal.target}
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={() => removal.submit('delete', studentUrls.destroy(student.id))}
            />
        </BusinessPage>
    );
}
