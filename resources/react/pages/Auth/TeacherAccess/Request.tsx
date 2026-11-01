import type { ReactNode } from 'react';
import { Link, useForm } from '@inertiajs/react';
import InputAction from '@/components/Forms/InputAction/InputAction';
import AuthLayout from '@/components/Navigation/AuthLayout/AuthLayout';
import InlineAlert from '@/components/UI/InlineAlert/InlineAlert';
import './TeacherAccess.css';

/** Pedido do link mágico de acesso do professor (e-mail institucional, sem senha). */
export default function AuthTeacherAccessRequestPage(): React.JSX.Element {
  const form = useForm({ email: '' });

  return (
    <AuthLayout title="Acesso do professor" heading="ACESSO DO PROFESSOR" split>
      <form
        className="teacherAccessForm"
        noValidate
        aria-label="Solicitar link de acesso do professor"
        aria-busy={form.processing}
        onSubmit={(event) => {
          event.preventDefault();
          if (!form.processing) form.post('/autenticacao/acesso');
        }}
      >
        <InlineAlert variant="info">
          Informe seu <b>e-mail institucional (@ifbaiano.edu.br)</b> e enviaremos um link de acesso
          para que você edite o PEI dos alunos sob sua responsabilidade.
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
          invalid={!!form.errors.email}
          aria-describedby={form.errors.email ? 'teacher-access-email-error' : undefined}
          buttonDisabled={form.processing}
          label={form.processing ? 'Enviando...' : 'Enviar link'}
        />
        {form.errors.email ? (
          <p id="teacher-access-email-error" className="teacherAccessForm__error" role="alert">
            {form.errors.email}
          </p>
        ) : null}
        <p className="teacherAccessForm__alternative">
          <Link href="/autenticacao/entrar">
            <i className="fa fa-lock" aria-hidden="true" />
            Sou administrador(a) ou profissional: fazer login com senha
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

AuthTeacherAccessRequestPage.layout = (page: ReactNode): ReactNode => page;
