import { aeeRecordBreadcrumb } from '@/components/Inclusion/AeeRecords/AeeRecords.routes';
import type { AeeRecordCreateProps } from '@/components/Inclusion/AeeRecords/AeeRecords.types';
import AeeRecordForm from '@/components/Inclusion/AeeRecords/Form/AeeRecordForm';
import BusinessPage from '@/components/Navigation/BusinessPage/BusinessPage';

export default function InclusionAeeRecordsCreatePage({
    session,
    guardiansByStudent,
}: AeeRecordCreateProps): React.JSX.Element {
    return (
        <BusinessPage
            title="Novo Registro de atendimento AEE"
            subtitle={`Agendamento #${session.id}`}
            breadcrumbItems={aeeRecordBreadcrumb({ sessionId: session.id, current: 'Cadastrar' })}
        >
            <AeeRecordForm
                key={session.id}
                session={session}
                guardiansByStudent={guardiansByStudent}
            />
        </BusinessPage>
    );
}
