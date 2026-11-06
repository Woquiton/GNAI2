import type { ReactNode } from 'react';
import { joinClassNames } from '@/utils/joinClassNames';
import '@styles/components/UI/DetailField/DetailField.css';

interface DetailFieldProps {
    label: string;
    children: ReactNode;
    /** Ocupa todas as colunas do `DetailGrid` (textos longos, listas e editores ricos). */
    wide?: boolean;
    /** Mantém as quebras de linha de textos simples (sem editor rico). */
    preserveLineBreaks?: boolean;
    className?: string;
}

/** Par rótulo/valor de uma visualização. Deve ficar dentro de `DetailGrid` (um `<dl>`). */
export default function DetailField({
    label,
    children,
    wide = false,
    preserveLineBreaks = false,
    className,
}: DetailFieldProps): React.JSX.Element {
    return (
        <div className={joinClassNames('detailField', wide && 'detailField--wide', className)}>
            <dt>{label}</dt>
            <dd className={preserveLineBreaks ? 'detailField__value--preLine' : undefined}>
                {children}
            </dd>
        </div>
    );
}
