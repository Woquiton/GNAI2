import type { ReactNode } from 'react';
import { joinClassNames } from '@/utils/joinClassNames';
import '@styles/components/People/PersonPhotoFields.css';

interface PersonPhotoFieldsProps {
    /** `PersonPhotoUpload` controlado pelo formulário. */
    photo: ReactNode;
    /** Campos pessoais exibidos à direita da foto. */
    children: ReactNode;
    className?: string;
}

/**
 * Foto da pessoa em uma coluna estreita à esquerda e os dados pessoais à direita; abaixo de
 * 900 px as colunas se empilham. A coluna dos campos é um container de consulta, para que cada
 * cadastro ajuste suas grades à largura disponível.
 */
export default function PersonPhotoFields({
    photo,
    children,
    className,
}: PersonPhotoFieldsProps): React.JSX.Element {
    return (
        <div className={joinClassNames('personPhotoFields', className)}>
            {photo}
            <div className="personPhotoFields__fields">{children}</div>
        </div>
    );
}
