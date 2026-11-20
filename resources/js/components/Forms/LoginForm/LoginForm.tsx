import { Link, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import InputAction from '@/components/Forms/InputAction/InputAction';
import TextInput from '@/components/Forms/TextInput/TextInput';
import Button from '@/components/UI/Button/Button';
import {
    notifyConnectionFailure,
    notifyOperationFailure,
} from '@/components/UI/NotificationToast/operationFeedback';
import '@styles/components/Forms/LoginForm/LoginForm.css';

const loginUrl = '/autenticacao/entrar';
const loginFailureText = 'Não foi possível entrar. Tente novamente.';

export default function LoginForm(): React.JSX.Element {
    const form = useForm({ email: '', password: '' });
    const { formRef, submit } = useFormSubmission(form);
    const sessionRequest = useRef<AbortController | null>(null);
    const [refreshingSession, setRefreshingSession] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const processing = refreshingSession || form.processing;

    useEffect(() => {
        return () => {
            sessionRequest.current?.abort();
            sessionRequest.current = null;
        };
    }, []);

    async function login(): Promise<void> {
        if (processing || sessionRequest.current) return;

        const controller = new AbortController();
        sessionRequest.current = controller;
        const timeout = window.setTimeout(() => controller.abort(), 10000);
        setRefreshingSession(true);
        try {
            // O Laravel emite um cookie XSRF válido mesmo se a aba ficou aberta até a sessão expirar.
            const response = await fetch(loginUrl, {
                method: 'HEAD',
                cache: 'no-store',
                signal: controller.signal,
            });
            if (controller.signal.aborted) return;
            if (!response.ok) {
                notifyOperationFailure(loginFailureText);
                return;
            }

            submit({
                url: loginUrl,
                failureText: loginFailureText,
                options: {
                    onFinish: () => {
                        form.reset('password');
                        setPasswordVisible(false);
                    },
                },
            });
        } catch {
            if (sessionRequest.current === controller) notifyConnectionFailure();
        } finally {
            window.clearTimeout(timeout);
            if (sessionRequest.current === controller) {
                sessionRequest.current = null;
                setRefreshingSession(false);
            }
        }
    }

    return (
        <form
            ref={formRef}
            className="loginForm"
            noValidate
            aria-label="Acesse sua conta no Gnai"
            aria-busy={processing}
            onSubmit={(event) => {
                event.preventDefault();
                void login();
            }}
        >
            <div className="loginForm__group">
                <TextInput
                    type="email"
                    name="email"
                    required
                    readOnly={processing}
                    autoFocus
                    autoComplete="username"
                    placeholder="E-mail institucional"
                    aria-label="E-mail institucional"
                    value={form.data.email}
                    onChange={(event) => form.setData('email', event.target.value)}
                    invalid={!!form.errors.email}
                    aria-describedby={form.errors.email ? 'login-email-error' : undefined}
                />
                {form.errors.email ? (
                    <p id="login-email-error" className="loginForm__error" role="alert">
                        {form.errors.email}
                    </p>
                ) : null}
            </div>
            <div className="loginForm__group">
                <InputAction
                    id="login-password"
                    type={passwordVisible ? 'text' : 'password'}
                    name="password"
                    required
                    readOnly={processing}
                    autoComplete="current-password"
                    placeholder="Senha"
                    aria-label="Senha"
                    value={form.data.password}
                    onChange={(event) => form.setData('password', event.target.value)}
                    invalid={!!form.errors.password}
                    aria-describedby={form.errors.password ? 'login-password-error' : undefined}
                    action={
                        <button
                            className="loginForm__passwordToggle"
                            type="button"
                            aria-label={passwordVisible ? 'Ocultar senha' : 'Mostrar senha'}
                            aria-controls="login-password"
                            aria-pressed={passwordVisible}
                            title={passwordVisible ? 'Ocultar senha' : 'Mostrar senha'}
                            disabled={processing}
                            onClick={() => setPasswordVisible((visible) => !visible)}
                        >
                            <i
                                className={`fa ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}
                                aria-hidden="true"
                            />
                        </button>
                    }
                />
                {form.errors.password ? (
                    <p id="login-password-error" className="loginForm__error" role="alert">
                        {form.errors.password}
                    </p>
                ) : null}
            </div>
            <div className="loginForm__submit">
                <Button
                    type="submit"
                    tone="list-action"
                    block
                    disabled={processing}
                    label={processing ? 'Entrando...' : 'Entrar'}
                    showIcon={false}
                    className="loginForm__submitButton"
                />
            </div>
            <div className="loginForm__forgot">
                <Link href="/autenticacao/esqueci-a-senha">
                    <i className="fa fa-lock" aria-hidden="true" /> Esqueceu sua senha?
                </Link>
            </div>
            <div className="loginForm__teacherAccess">
                <Link href="/autenticacao/acesso">
                    <i className="fa fa-graduation-cap" aria-hidden="true" /> Sou professor(a):
                    entrar com e-mail
                </Link>
            </div>
        </form>
    );
}
