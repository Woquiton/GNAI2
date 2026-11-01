import AeeRecordForm from "./AeeRecordForm";
import type { AeeGuardiansByStudent, AeeRecordRecord, AeeSession } from "./AeeRecord.types";

export default function InclusionAeeRecordsEditPage({
    aeeRecord,
    session,
    guardiansByStudent,
}: {
    aeeRecord: AeeRecordRecord;
    session: AeeSession;
    guardiansByStudent: AeeGuardiansByStudent;
}): React.JSX.Element {
    return (
        <AeeRecordForm
            key={aeeRecord.id}
            session={session}
            aeeRecord={aeeRecord}
            guardiansByStudent={guardiansByStudent}
        />
    );
}
