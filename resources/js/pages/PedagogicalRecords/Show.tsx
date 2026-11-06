import PedagogicalRecordDetails from '@/components/PedagogicalRecords/Details/PedagogicalRecordDetails';
import PedagogicalRecordDetailsActions from '@/components/PedagogicalRecords/Details/PedagogicalRecordDetailsActions';
import PedagogicalRecordDeleteModal from '@/components/PedagogicalRecords/PedagogicalRecordDeleteModal';
import { pedagogicalRecordFailureTexts } from '@/components/PedagogicalRecords/PedagogicalRecords.constants';
import {
    pedagogicalRecordBreadcrumb,
    pedagogicalRecordUrls,
} from '@/components/PedagogicalRecords/PedagogicalRecords.routes';
import type { PedagogicalRecordShowProps } from '@/components/PedagogicalRecords/PedagogicalRecords.types';
import { pedagogicalRecordShowTour } from '@/components/PedagogicalRecords/pedagogicalRecordTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function PedagogicalRecordsShowPage({
    pedagogicalRecord: record,
    session,
    can,
    returnStudentId,
}: PedagogicalRecordShowProps): React.JSX.Element {
    const studentId = returnStudentId && returnStudentId > 0 ? returnStudentId : undefined;
    const removal = useConfirmedAction<typeof record>({
        failureText: pedagogicalRecordFailureTexts.delete,
    });
    const subtitle = `Agendamento #${session.id} • Realizado em: ${session.session_date ?? 'Não informado'}`;

    return (
        <BusinessPage
            title="Atendimento Pedagógico"
            subtitle={subtitle}
            breadcrumbItems={pedagogicalRecordBreadcrumb({ sessionId: session.id })}
            busy={removal.processing}
            tour={pedagogicalRecordShowTour}
        >
            <PedagogicalRecordDetails pedagogicalRecord={record} session={session} />
            <PedagogicalRecordDetailsActions
                recordId={record.id}
                sessionId={session.id}
                studentId={studentId}
                permissions={can}
                deleting={removal.processing}
                onDelete={() => removal.open(record)}
            />
            <PedagogicalRecordDeleteModal
                open={removal.target !== null}
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={() =>
                    removal.submit('delete', pedagogicalRecordUrls.destroy(record.id, studentId))
                }
            />
        </BusinessPage>
    );
}
