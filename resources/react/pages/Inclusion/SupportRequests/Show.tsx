import SupportRequestDetails from '@/components/Inclusion/SupportRequests/Details/SupportRequestDetails';
import SupportRequestDetailsActions from '@/components/Inclusion/SupportRequests/Details/SupportRequestDetailsActions';
import SupportRequestDeleteModal from '@/components/Inclusion/SupportRequests/SupportRequestDeleteModal';
import {
    supportRequestBreadcrumb,
    supportRequestUrls,
} from '@/components/Inclusion/SupportRequests/SupportRequests.routes';
import type {
    SupportRequestRecord,
    SupportRequestShowProps,
} from '@/components/Inclusion/SupportRequests/SupportRequests.types';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';
import { useConfirmedAction } from '@/components/UI/ConfirmActionModal/useConfirmedAction';

export default function SupportRequestShow({
    supportRequest: record,
    can,
    fromStudent,
}: SupportRequestShowProps): React.JSX.Element {
    const removal = useConfirmedAction<SupportRequestRecord>({
        failureText: 'Não foi possível excluir a solicitação. Tente novamente.',
    });
    return (
        <BusinessPage
            title={`Solicitação de Atendimento #${record.id}`}
            subtitle={record.student_name}
            breadcrumbItems={supportRequestBreadcrumb(
                record,
                undefined,
                fromStudent ? { id: record.student_id, name: record.student_name } : undefined,
            )}
            busy={removal.processing}
        >
            <SupportRequestDetails record={record} />
            <SupportRequestDetailsActions
                record={record}
                can={can}
                fromStudent={fromStudent}
                busy={removal.processing}
                onDelete={() => removal.open(record)}
            />
            <SupportRequestDeleteModal
                target={removal.target}
                processing={removal.processing}
                onClose={removal.close}
                onConfirm={() =>
                    removal.submit('delete', supportRequestUrls.destroy(record.id, fromStudent))
                }
            />
        </BusinessPage>
    );
}
