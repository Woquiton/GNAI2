import TableLabel from '@/components/UI/TableLabel/TableLabel';
import TagList from '@/components/UI/TagList/TagList';
import type { TeacherCourseDiscipline } from '../Teachers.types';

interface CourseGroup {
    key: string;
    semester: string;
    course: string;
    items: TeacherCourseDiscipline[];
}

/** Agrupa por semestre e curso, mantendo a ordem recebida (semestre mais recente primeiro). */
function groupBySemesterAndCourse(items: readonly TeacherCourseDiscipline[]): CourseGroup[] {
    const groups = new Map<string, CourseGroup>();

    items.forEach((item) => {
        const semester = item.semester?.label ?? '';
        const course = item.course?.name ?? '';
        const key = `${item.semester?.id ?? ''}:${item.course?.id ?? ''}`;
        const group = groups.get(key) ?? { key, semester, course, items: [] };
        group.items.push(item);
        groups.set(key, group);
    });

    return Array.from(groups.values());
}

function disciplineCount(total: number): string {
    return `${total} ${total === 1 ? 'disciplina' : 'disciplinas'}`;
}

/** Disciplinas atribuídas ao professor, agrupadas por semestre e curso. */
export default function TeacherAssignments({
    assignments,
}: {
    assignments: readonly TeacherCourseDiscipline[];
}): React.JSX.Element {
    const courses = groupBySemesterAndCourse(assignments);

    if (!courses.length) {
        return (
            <div className="teacherAssignments__empty">
                <i className="fa fa-book" aria-hidden="true" />
                <strong>Nenhuma disciplina atribuída</strong>
                <span>
                    Utilize o botão <strong>Gerenciar Disciplinas</strong> para realizar as
                    atribuições.
                </span>
            </div>
        );
    }

    return (
        <ul className="teacherAssignments">
            {courses.map((group) => {
                const courseName = group.course || 'Curso não identificado';
                const semesterName = group.semester || 'Semestre não identificado';
                const disciplines = group.items.map((assignment) => ({
                    id: assignment.id,
                    name: (
                        <>
                            <i className="fa fa-book" aria-hidden="true" />{' '}
                            {assignment.discipline?.name ?? 'Disciplina não identificada'}
                        </>
                    ),
                }));

                return (
                    <li key={group.key} className="teacherAssignments__course">
                        <div className="teacherAssignments__header">
                            <strong className="teacherAssignments__courseName">
                                <i className="fa fa-graduation-cap" aria-hidden="true" />{' '}
                                {`${semesterName}: ${courseName}`}
                            </strong>
                            <TableLabel tone="inverse">
                                {disciplineCount(group.items.length)}
                            </TableLabel>
                        </div>
                        <TagList
                            className="teacherAssignments__disciplines"
                            items={disciplines}
                            emptyMessage="Nenhuma disciplina atribuída"
                        />
                    </li>
                );
            })}
        </ul>
    );
}
