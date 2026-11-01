import StudentCourseForm from "./StudentCourseForm";
import type { StudentCourseRecord, StudentCourseSemester } from "./StudentCourse.types";

export default function InclusionStudentCoursesEditPage({
    studentCourse,
    semesters,
}: {
    studentCourse: StudentCourseRecord;
    semesters: StudentCourseSemester[];
}): React.JSX.Element {
    return (
        <StudentCourseForm
            key={studentCourse.id}
            mode="edit"
            studentCourse={studentCourse}
            semesters={semesters}
        />
    );
}
