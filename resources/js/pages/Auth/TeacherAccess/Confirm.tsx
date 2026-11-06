import type { ReactNode } from 'react';
import type {
    TeacherAccessConfirmProps,
} from '@/components/Auth/TeacherAccess/TeacherAccess.types';
import TeacherAccessConfirmForm from '@/components/Auth/TeacherAccess/TeacherAccessConfirmForm';
import AuthLayout from '@/components/Navigation/AuthLayout/AuthLayout';

export default function AuthTeacherAccessConfirmPage({
    token,
}: TeacherAccessConfirmProps): React.JSX.Element {
    return (
        <AuthLayout title="Confirmar acesso" heading="CONFIRMAR ACESSO" split>
            <TeacherAccessConfirmForm token={token} />
        </AuthLayout>
    );
}

AuthTeacherAccessConfirmPage.layout = (page: ReactNode): ReactNode => page;
