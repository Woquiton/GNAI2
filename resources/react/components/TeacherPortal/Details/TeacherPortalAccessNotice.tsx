import { Link } from '@inertiajs/react';
import { teacherAccessUrls } from '@/components/Auth/TeacherAccess/TeacherAccess.routes';
import InlineAlert from '@/components/UI/InlineAlert/InlineAlert';
import './TeacherPortalDetails.css';

/** Contexto persistente do modo leitura: o link de acesso reflete a situação atual do aluno. */
export default function TeacherPortalAccessNotice(): React.JSX.Element {
    return (
        <InlineAlert variant="info" className="teacherPortal__notice">
            Esta página mostra a situação atual do aluno. Se o Estudo de Caso, o PAEE ou o PEI
            mudarem, é só{' '}
            <Link href={teacherAccessUrls.request}>gerar um novo link de acesso</Link> a qualquer
            momento para consultar as atualizações ou editar sua adaptação no PEI.
        </InlineAlert>
    );
}
