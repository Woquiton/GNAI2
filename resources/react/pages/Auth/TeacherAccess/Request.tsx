import type { ReactNode } from 'react';
import TeacherAccessRequestForm from '@/components/Auth/TeacherAccess/TeacherAccessRequestForm';
import AuthLayout from '@/components/Navigation/AuthLayout/AuthLayout';

export default function AuthTeacherAccessRequestPage(): React.JSX.Element {
    return (
        <AuthLayout title="Acesso do professor" heading="ACESSO DO PROFESSOR" split>
            <TeacherAccessRequestForm />
        </AuthLayout>
    );
}

AuthTeacherAccessRequestPage.layout = (page: ReactNode): ReactNode => page;
