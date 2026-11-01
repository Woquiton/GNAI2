import AuthLayout from '@/components/Navigation/AuthLayout/AuthLayout';
import ResetPasswordForm from '@/components/Forms/ResetPasswordForm/ResetPasswordForm';
import type { ResetPasswordProps } from '@/components/Forms/ResetPasswordForm/ResetPasswordForm.types';

export default function AuthResetPasswordPage(props: ResetPasswordProps): React.JSX.Element {
    return (
        <AuthLayout title="Redefinir senha" heading="REDEFINIR SENHA" backToLogin split>
            <ResetPasswordForm key={`${props.token}:${props.email}`} {...props} />
        </AuthLayout>
    );
}
