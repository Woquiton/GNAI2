import { Link, useForm } from '@inertiajs/react';
import InputAction from '@/components/Forms/InputAction/InputAction';
import InlineAlert from '@/components/UI/InlineAlert/InlineAlert';
import { teacherAccessUrls } from './TeacherAccess.routes';
import './TeacherAccess.css';

/** Pedido do link mágico de acesso do professor (e-mail institucional, sem senha). */
export default function TeacherAccessRequestForm(): React.JSX.Element {
    const form = useForm({ email: '' });
    const error = form.errors.email;

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
                Informe seu <b>e-mail institucional (@ifbaiano.edu.br)</b> e enviaremos um link de
                acesso para que você edite o PEI dos alunos sob sua responsabilidade.
            </InlineAlert>
            <InputAction
                type="email"
                name="email"
                required
                autoFocus
                autoComplete="email"
                placeholder="seu.nome@ifbaiano.edu.br"
                aria-label="E-mail institucional"
                value={form.data.email}
                onChange={(event) => form.setData('email', event.target.value)}
                invalid={Boolean(error)}
                aria-describedby={error ? 'teacher-access-email-error' : undefined}
                buttonDisabled={form.processing}
                label={form.processing ? 'Enviando...' : 'Enviar link'}
            />
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
