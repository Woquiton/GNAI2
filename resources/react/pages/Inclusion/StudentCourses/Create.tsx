import StudentCourseForm from "./StudentCourseForm";
import type {
    StudentCourseCourse,
    StudentCourseSemester,
    StudentCourseStudent,
} from "./StudentCourse.types";

export default function InclusionStudentCoursesCreatePage({
    student,
    courses,
    semesters,
    mustBeCurrent,
}: {
    student: StudentCourseStudent;
    courses: StudentCourseCourse[];
    semesters: StudentCourseSemester[];
    mustBeCurrent: boolean;
}): React.JSX.Element {
    return (
        <StudentCourseForm
            mode="create"
            student={student}
            courses={courses}
            semesters={semesters}
            mustBeCurrent={mustBeCurrent}
        />
    );
}
