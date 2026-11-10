import { usePage } from '@inertiajs/react';
import FormActions from '@/components/Forms/FormActions/FormActions';
import Button from '@/components/UI/Button/Button';
import { PAGE_BACK_ACTIONS_TOUR_TARGET } from './pageBackActionsTour';

/** Rodapé das páginas de apoio, com retorno à página inicial da área do usuário. */
export default function PageBackActions(): React.JSX.Element {
    const { usesTeacherPortal } = usePage<{ usesTeacherPortal: boolean }>().props;
    const href = usesTeacherPortal ? '/professor' : '/autenticacao/painel';
    const title = usesTeacherPortal ? 'Voltar ao Portal do Professor' : 'Voltar ao Painel';

    return (
        <FormActions tourTarget={PAGE_BACK_ACTIONS_TOUR_TARGET}>
            <Button
                href={href}
                tone="cancel"
                label="Voltar"
                title={title}
                aria-label={title}
            />
        </FormActions>
    );
}
