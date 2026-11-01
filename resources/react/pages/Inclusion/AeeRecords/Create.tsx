import AeeRecordForm from "./AeeRecordForm";
import type { AeeGuardiansByStudent, AeeSession } from "./AeeRecord.types";

export default function InclusionAeeRecordsCreatePage({
    session,
    guardiansByStudent,
}: {
    session: AeeSession;
    guardiansByStudent: AeeGuardiansByStudent;
}): React.JSX.Element {
    return (
        <AeeRecordForm
            key={session.id}
            session={session}
            guardiansByStudent={guardiansByStudent}
        />
    );
}
