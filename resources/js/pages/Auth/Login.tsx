import AuthLayout from '@/components/Navigation/AuthLayout/AuthLayout';
import LoginForm from '@/components/Forms/LoginForm/LoginForm';

export default function AuthLoginPage(): React.JSX.Element {
    return (
        <AuthLayout title="Entrar" heading="LOGIN" split centerVertically>
            <LoginForm />
        </AuthLayout>
    );
}
