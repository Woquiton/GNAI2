import AeeRecordDeleteModal from '@/components/Inclusion/AeeRecords/AeeRecordDeleteModal';
import { AEE_DELETE_FAILURE_TEXT } from '@/components/Inclusion/AeeRecords/AeeRecords.constants';
import {
    aeeRecordBreadcrumb,
    aeeRecordUrls,
} from '@/components/Inclusion/AeeRecords/AeeRecords.routes';
import type { AeeRecordShowProps } from '@/components/Inclusion/AeeRecords/AeeRecords.types';
import AeeRecordDetails from '@/components/Inclusion/AeeRecords/Details/AeeRecordDetails';
import AeeRecordDetailsActions from '@/components/Inclusion/AeeRecords/Details/AeeRecordDetailsActions';
import { aeeRecordShowTour } from '@/components/Inclusion/AeeRecords/aeeRecordTours';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';
import { dateLabel } from '@/utils/formatters';

export default function InclusionAeeRecordsShowPage({
    aeeRecord,
    session,
    can,
}: AeeRecordShowProps): React.JSX.Element {
    const sessionId = aeeRecord.attendance_session_id;
    const deletion = useConfirmedAction<number>({ failureText: AEE_DELETE_FAILURE_TEXT });
    const subtitle = `Agendamento #${sessionId} • Realizada em: ${dateLabel(session?.session_date)}`;

    return (
        <BusinessPage
            title="Registro de Atendimento AEE"
            subtitle={subtitle}
            tour={aeeRecordShowTour}
            breadcrumbItems={aeeRecordBreadcrumb({
                sessionId,
                sessionLabel: `Agendamento #${sessionId}`,
                current: 'Registro',
            })}
            busy={deletion.processing}
        >
            <AeeRecordDetails aeeRecord={aeeRecord} />
            <AeeRecordDetailsActions
                recordId={aeeRecord.id}
                sessionId={sessionId}
                permissions={can}
                deleting={deletion.processing}
                onDelete={() => deletion.open(aeeRecord.id)}
            />
            <AeeRecordDeleteModal
                scope="record"
                open={deletion.target !== null}
                processing={deletion.processing}
                onClose={deletion.close}
                onConfirm={() => deletion.submit('delete', aeeRecordUrls.destroy(aeeRecord.id))}
            />
        </BusinessPage>
    );
}
