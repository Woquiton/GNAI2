import AuthLayout from '@/components/Navigation/AuthLayout/AuthLayout';
import LoginForm from '@/components/Forms/LoginForm/LoginForm';
import DataProtectionNotice from '@/components/Auth/DataProtectionNotice/DataProtectionNotice';

export default function AuthLoginPage(): React.JSX.Element {
    return (
        <AuthLayout title="Entrar" heading="LOGIN" split centerVertically>
            <DataProtectionNotice />
            <LoginForm />
        </AuthLayout>
    );
}
