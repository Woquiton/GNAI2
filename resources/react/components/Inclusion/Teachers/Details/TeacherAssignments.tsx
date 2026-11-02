import TableLabel from '@/components/UI/TableLabel/TableLabel';
import TagList from '@/components/UI/TagList/TagList';
import type { TeacherCourseDiscipline } from '../Teachers.types';

interface CourseGroup {
    course: string;
    items: TeacherCourseDiscipline[];
}

function groupByCourse(items: readonly TeacherCourseDiscipline[]): CourseGroup[] {
    const groups = new Map<string, TeacherCourseDiscipline[]>();

    items.forEach((item) => {
        const course = item.course?.name ?? '';
        groups.set(course, [...(groups.get(course) ?? []), item]);
    });

    return Array.from(groups, ([course, groupItems]) => ({ course, items: groupItems }));
}

function disciplineCount(total: number): string {
    return `${total} ${total === 1 ? 'disciplina' : 'disciplinas'}`;
}

/** Disciplinas atribuídas ao professor, agrupadas por curso. */
export default function TeacherAssignments({
    assignments,
}: {
    assignments: readonly TeacherCourseDiscipline[];
}): React.JSX.Element {
    const courses = groupByCourse(assignments);

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
                    <li key={group.course} className="teacherAssignments__course">
                        <div className="teacherAssignments__header">
                            <strong className="teacherAssignments__courseName">
                                <i className="fa fa-graduation-cap" aria-hidden="true" />{' '}
                                {courseName}
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
