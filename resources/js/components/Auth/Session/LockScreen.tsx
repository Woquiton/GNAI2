import { Head, router, useForm } from '@inertiajs/react';
import AccountLayout from '@/components/Navigation/AccountLayout/AccountLayout';
import FormLayout from '@/components/Forms/FormLayout/FormLayout';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import AccountCard from '@/components/Forms/AccountCard/AccountCard';
import FieldError from '@/components/Forms/FormField/FieldError';
import { fieldDescribedBy } from '@/components/Forms/FormField/fieldDescription';
import InputAction from '@/components/Forms/InputAction/InputAction';
import Button from '@/components/UI/Button/Button';
import ImageDisplay from '@/components/UI/ImageDisplay/ImageDisplay';
import type { LockScreenProps } from './Session.types';
import '@styles/components/Auth/Session/LockScreen.css';

export default function LockScreen({ lockedUser }: LockScreenProps): React.JSX.Element {
    const form = useForm({ password: '' });
    const { formRef, submit } = useFormSubmission(form);

    return (
        <AccountLayout>
            <Head title="Tela bloqueada | Gnai" />
            <AccountCard>
                <FormLayout
                    ref={formRef}
                    className="lockScreen"
                    aria-label="Desbloquear sua sessão no Gnai"
                    aria-busy={form.processing}
                    onSubmit={(event) => {
                        event.preventDefault();
                        if (!form.processing) {
                            submit({
                                url: '/autenticacao/sessao/desbloquear',
                                failureText: 'Não foi possível desbloquear a sessão.',
                                options: { onFinish: () => form.reset('password') },
                            });
                        }
                    }}
                >
                    <ImageDisplay
                        src={lockedUser.photo_url}
                        alt=""
                        shape="thumbnail"
                        size="lg"
                        className="lockScreen__avatar"
                    />
                    <h1>{lockedUser.name}</h1>
                    <p id="unlock-instructions">Digite sua senha para acessar o Gnai.</p>
                    <fieldset disabled={form.processing} className="lockScreen__credentials">
                        <InputAction
                            id="unlock-password"
                            name="password"
                            type="password"
                            placeholder="Senha"
                            aria-label="Senha (obrigatória)"
                            required
                            autoFocus
                            autoComplete="current-password"
                            value={form.data.password}
                            invalid={Boolean(form.errors.password)}
                            aria-describedby={fieldDescribedBy('unlock-password', {
                                error: form.errors.password,
                                describedBy: 'unlock-instructions',
                            })}
                            onChange={(event) => form.setData('password', event.target.value)}
                            label={form.processing ? 'Desbloqueando...' : 'Desbloquear'}
                            buttonDisabled={form.processing}
                        />
                        <FieldError id="unlock-password" error={form.errors.password} />
                    </fieldset>
                </FormLayout>
            </AccountCard>
            <div className="lockScreen__footer">
                <span>Não é {lockedUser.name}?</span>{' '}
                <Button
                    tone="link"
                    label="Entrar"
                    title="Sair e entrar com outra conta"
                    aria-label="Entrar com outra conta e encerrar esta sessão"
                    disabled={form.processing}
                    onClick={() => router.post('/autenticacao/sair')}
                />
            </div>
        </AccountLayout>
    );
}
