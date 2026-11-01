import type { ReactNode } from 'react';
import { useForm } from '@inertiajs/react';
import AuthLayout from '@/components/Navigation/AuthLayout/AuthLayout';
import Button from '@/components/UI/Button/Button';
import InlineAlert from '@/components/UI/InlineAlert/InlineAlert';
import './TeacherAccess.css';

/**
 * Confirmação explícita do link mágico: o token só é consumido no POST, para
 * que leitores de e-mail que abrem links automaticamente não gastem o acesso.
 */
export default function AuthTeacherAccessConfirmPage({ token }: { token: string }): React.JSX.Element {
  const form = useForm({});

  return (
    <AuthLayout title="Confirmar acesso" heading="CONFIRMAR ACESSO" split>
      <form
        className="teacherAccessForm"
        noValidate
        aria-label="Confirmar acesso do professor"
        aria-busy={form.processing}
        onSubmit={(event) => {
          event.preventDefault();
          if (!form.processing) form.post(`/autenticacao/acesso/${encodeURIComponent(token)}`);
        }}
      >
        <InlineAlert variant="info">
          Por segurança, pedimos essa confirmação extra antes de liberar o acesso. Assim evitamos
          que o link seja consumido automaticamente por algum aplicativo de e-mail.
        </InlineAlert>
        <p className="teacherAccessForm__note">
          Este link é de uso único. Ao confirmar, você será autenticado(a) no Gnai.
        </p>
        <Button
          type="submit"
          tone="save"
          block
          className="teacherAccessForm__submit"
          leftIconClass="fa fa-sign-in"
          label={form.processing ? 'Confirmando...' : 'Confirmar e acessar'}
          title="Confirmar e acessar o Gnai"
          aria-label="Confirmar e acessar o Gnai"
          disabled={form.processing}
        />
      </form>
    </AuthLayout>
  );
}

AuthTeacherAccessConfirmPage.layout = (page: ReactNode): ReactNode => page;
