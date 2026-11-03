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
            title="Novo Registro de Atendimento Educacional Especializado"
            subtitle={`Agendamento #${session.id}`}
            breadcrumbItems={aeeRecordBreadcrumb({ sessionId: session.id, current: 'Cadastrar' })}
        >
            <AeeRecordForm
                key={session.id}
                mode="session"
                session={session}
                guardiansByStudent={guardiansByStudent}
            />
        </BusinessPage>
    );
}
