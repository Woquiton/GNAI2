import Button from '@/components/UI/Button/Button';
import { pedagogicalRecordUrls } from '../PedagogicalRecords.routes';

interface PedagogicalRecordScopeButtonProps {
    /** `own` leva aos atendimentos do usuário; `all`, à visão geral. */
    scope: 'all' | 'own';
}

/**
 * Alterna entre a listagem geral e a pessoal, exibido conforme a permissão da outra visão. Segue o
 * formato dos atalhos dos atendimentos especializados.
 */
export default function PedagogicalRecordScopeButton({
    scope,
}: PedagogicalRecordScopeButtonProps): React.JSX.Element {
    if (scope === 'own') {
        return (
            <Button
                href={pedagogicalRecordUrls.myRecords}
                tone="list-action"
                labelIconClass="fa fa-user"
                aria-label="Ver meus atendimentos pedagógicos"
            >
                Meus Atendimentos
            </Button>
        );
    }

    return (
        <Button
            href={pedagogicalRecordUrls.index}
            tone="list-action"
            labelIconClass="fa fa-users"
            aria-label="Ver todos os atendimentos pedagógicos"
        >
            Todos os Atendimentos
        </Button>
    );
}
