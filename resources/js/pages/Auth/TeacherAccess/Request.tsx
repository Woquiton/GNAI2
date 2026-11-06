import type { ReactNode } from 'react';
import type { TeacherAccessRequestProps } from '@/components/Auth/TeacherAccess/TeacherAccess.types';
import TeacherAccessRequestForm from '@/components/Auth/TeacherAccess/TeacherAccessRequestForm';
import AuthLayout from '@/components/Navigation/AuthLayout/AuthLayout';

export default function AuthTeacherAccessRequestPage({
    allowedDomains,
}: TeacherAccessRequestProps): React.JSX.Element {
    return (
        <AuthLayout
            title="Acesso do professor"
            heading="ACESSO DO PROFESSOR"
            split
            centerVertically
        >
            <TeacherAccessRequestForm allowedDomains={allowedDomains} />
        </AuthLayout>
    );
}

AuthTeacherAccessRequestPage.layout = (page: ReactNode): ReactNode => page;
