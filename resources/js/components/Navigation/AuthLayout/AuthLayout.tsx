import type { ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import AccountLayout from '@/components/Navigation/AccountLayout/AccountLayout';
import AccountCard from '@/components/Forms/AccountCard/AccountCard';
import AuthFooter from '@/components/Navigation/AuthFooter/AuthFooter';
import '@styles/components/Navigation/AuthLayout/AuthLayout.css';

function AuthBanner(): React.JSX.Element {
    return (
        <div className="authLayout__welcome">
            <img
                className="authLayout__bannerImage"
                src="/images/banner-login.png"
                alt=""
            />
            <div className="authLayout__welcomeCopy">
                <span className="authLayout__welcomeEyebrow">
                    Núcleo de Acessibilidade e Inclusão
                </span>
                <h1>Acessibilidade que acolhe e transforma</h1>
                <p>
                    Tecnologia, cuidado e inclusão para apoiar trajetórias educacionais.
                </p>
            </div>
        </div>
    );
}

export default function AuthLayout({
    title,
    heading,
    children,
    backToLogin = false,
    split = false,
    centerVertically = false,
}: {
    title: string;
    heading: ReactNode;
    children: ReactNode;
    backToLogin?: boolean;
    split?: boolean;
    centerVertically?: boolean;
}): React.JSX.Element {
    if (split) {
        const formClassName = [
            'authLayout__formInner',
            backToLogin ? 'authLayout__formInner--recovery' : '',
            centerVertically ? 'authLayout__formInner--centered' : '',
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <>
                <Head title={`${title} - Gnai`} />
                <AccountLayout illustration={<AuthBanner />}>
                    <div className={formClassName}>
                        <div className="authLayout__brandMark">
                            <span>
                                <img src="/images/logo.png" alt="" />
                            </span>
                            <strong>Gnai</strong>
                        </div>
                        <AccountCard title={heading}>{children}</AccountCard>
                        <AuthFooter backToLogin={backToLogin} />
                    </div>
                </AccountLayout>
            </>
        );
    }
    return (
        <AccountLayout>
            <Head title={`${title} - Gnai`} />
            <AccountCard title={heading}>{children}</AccountCard>
            <AuthFooter backToLogin={backToLogin} />
        </AccountLayout>
    );
}
