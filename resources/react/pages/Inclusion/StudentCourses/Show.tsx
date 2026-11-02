import StudentCourseDetails from '@/components/Inclusion/StudentCourses/Details/StudentCourseDetails';
import StudentCourseDetailsActions from '@/components/Inclusion/StudentCourses/Details/StudentCourseDetailsActions';
import StudentCourseMakeCurrentModal from '@/components/Inclusion/StudentCourses/Details/StudentCourseMakeCurrentModal';
import StudentCourseDeleteModal from '@/components/Inclusion/StudentCourses/StudentCourseDeleteModal';
import { UNKNOWN_COURSE } from '@/components/Inclusion/StudentCourses/StudentCourses.constants';
import {
    studentCourseBreadcrumb,
    studentCourseUrls,
} from '@/components/Inclusion/StudentCourses/StudentCourses.routes';
import type { StudentCourseShowProps } from '@/components/Inclusion/StudentCourses/StudentCourses.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function InclusionStudentCoursesShowPage({
    studentCourse,
    display,
    can,
}: StudentCourseShowProps): React.JSX.Element {
    const studentId = studentCourse.student?.id ?? studentCourse.student_id;
    const studentName = studentCourse.student?.person?.name ?? '';
    const courseName = studentCourse.course?.name ?? UNKNOWN_COURSE;
    const removal = useConfirmedAction<{ courseName: string }>({
        failureText: 'Não foi possível excluir a matrícula. Tente novamente.',
    });
    const makeCurrent = useConfirmedAction<{ courseName: string }>({
        failureText: 'Não foi possível tornar este o curso atual. Tente novamente.',
    });
    const processing = removal.processing || makeCurrent.processing;

    return (
        <BusinessPage
            title={`Matrícula, ${studentName}`}
            subtitle="Detalhes completos da matrícula do aluno."
            breadcrumbItems={studentCourseBreadcrumb({
                student: { id: studentId, name: studentName },
                studentCourse: { id: studentCourse.id, courseName },
            })}
            busy={processing}
        >
            <StudentCourseDetails
                studentCourse={studentCourse}
                studentName={studentName}
                courseName={courseName}
                display={display}
            />
            <StudentCourseDetailsActions
                studentId={studentId}
                studentCourseId={studentCourse.id}
                courseName={courseName}
                isCurrent={studentCourse.is_current}
                permissions={can}
                processing={processing}
                onMakeCurrent={() => makeCurrent.open({ courseName })}
                onDelete={() => removal.open({ courseName })}
            />
            <StudentCourseMakeCurrentModal
                open={makeCurrent.target !== null}
                processing={makeCurrent.processing}
                onClose={makeCurrent.close}
                onConfirm={() =>
                    makeCurrent.submit('patch', studentCourseUrls.makeCurrent(studentCourse.id))
                }
            />
            <StudentCourseDeleteModal
                target={removal.target}
                context="details"
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={() =>
                    removal.submit('delete', studentCourseUrls.destroy(studentCourse.id))
                }
            />
        </BusinessPage>
    );
}
