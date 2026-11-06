import type { TeacherAccessRequestProps } from '@/components/Auth/TeacherAccess/TeacherAccess.types';
import { Link, useForm } from '@inertiajs/react';
import InputAction from '@/components/Forms/InputAction/InputAction';
import InlineAlert from '@/components/UI/InlineAlert/InlineAlert';
import { teacherAccessUrls } from './TeacherAccess.routes';
import '@styles/components/Auth/TeacherAccess/TeacherAccess.css';

/** Solicitação de acesso por e-mail, conforme os domínios configurados na instalação. */
export default function TeacherAccessRequestForm({
    allowedDomains,
}: TeacherAccessRequestProps): React.JSX.Element {
    const form = useForm({ email: '' });
    const error = form.errors.email;
    const domainHint = allowedDomains.length
        ? `Domínios aceitos: ${allowedDomains.map((domain) => `@${domain}`).join(', ')}.`
        : 'São aceitos e-mails de qualquer domínio, desde que cadastrados como professor.';

    return (
        <form
            className="teacherAccessForm"
            noValidate
            aria-label="Solicitar link de acesso do professor"
            aria-busy={form.processing}
            onSubmit={(event) => {
                event.preventDefault();

                if (!form.processing) {
                    form.post(teacherAccessUrls.request);
                }
            }}
        >
            <InlineAlert variant="info">
                Informe o <b>e-mail cadastrado como professor</b> e enviaremos um link de acesso
                para que você edite o PEI dos alunos sob sua responsabilidade.
            </InlineAlert>
            <InputAction
                type="email"
                name="email"
                required
                autoFocus
                autoComplete="email"
                placeholder="Digite seu e-mail cadastrado"
                aria-label="E-mail cadastrado como professor"
                value={form.data.email}
                onChange={(event) => form.setData('email', event.target.value)}
                invalid={Boolean(error)}
                aria-describedby={`teacher-access-domains${error ? ' teacher-access-email-error' : ''}`}
                buttonDisabled={form.processing}
                label={form.processing ? 'Enviando...' : 'Enviar link'}
            />
            <p id="teacher-access-domains" className="teacherAccessForm__domains">
                {domainHint}
            </p>
            {error ? (
                <p
                    id="teacher-access-email-error"
                    className="teacherAccessForm__error"
                    role="alert"
                >
                    {error}
                </p>
            ) : null}
            <p className="teacherAccessForm__alternative">
                <Link href={teacherAccessUrls.login}>
                    <i className="fa fa-lock" aria-hidden="true" />
                    Sou administrador(a) ou profissional: fazer login com senha
                </Link>
            </p>
        </form>
    );
}
