import Button from '@/components/UI/Button/Button';
import { pedagogicalRecordUrls } from '../PedagogicalRecords.routes';

interface PedagogicalRecordScopeButtonProps {
    /** `own` leva aos atendimentos do usuário; `all`, à visão geral. */
    scope: 'all' | 'own';
}

/** Alterna entre a listagem geral e a pessoal, exibido conforme a permissão da outra visão. */
export default function PedagogicalRecordScopeButton({
    scope,
}: PedagogicalRecordScopeButtonProps): React.JSX.Element {
    if (scope === 'own') {
        return (
            <Button href={pedagogicalRecordUrls.myRecords} tone="cancel" leftIconClass="fa fa-user">
                Meus Atendimentos
            </Button>
        );
    }

    return (
        <Button href={pedagogicalRecordUrls.index} tone="cancel" leftIconClass="fa fa-users">
            Todos os Atendimentos
        </Button>
    );
}
