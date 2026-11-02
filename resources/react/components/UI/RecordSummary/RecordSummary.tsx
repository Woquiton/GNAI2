import type { ReactNode } from 'react';
import { joinClassNames } from '@/utils/joinClassNames';
import './RecordSummary.css';

interface RecordSummaryProps {
    /** Foto da pessoa; omita em registros sem foto. */
    photo?: { src: string; alt: string };
    name: ReactNode;
    /** `DetailField`s essenciais do registro (matrícula, status, versão...). */
    children: ReactNode;
    className?: string;
}

/**
 * Identificação compacta exibida no topo de um prontuário (aluno, PEI, estudo de caso): foto,
 * nome e poucos dados essenciais. Componha dentro de `CardBox` + `FormSection variant="inline"`.
 */
export default function RecordSummary({
    photo,
    name,
    children,
    className,
}: RecordSummaryProps): React.JSX.Element {
    return (
        <div
            className={joinClassNames(
                'recordSummary',
                !photo && 'recordSummary--noPhoto',
                className,
            )}
        >
            {photo ? (
                <img src={photo.src} alt={photo.alt} className="recordSummary__photo" />
            ) : null}
            <div className="recordSummary__body">
                <p className="recordSummary__name">{name}</p>
                <dl className="recordSummary__details">{children}</dl>
            </div>
        </div>
    );
}
