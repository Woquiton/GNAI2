import { joinClassNames } from '@/utils/joinClassNames';
import './SweetAlertErrorIcon.css';

/**
 * X vermelho animado do SweetAlert. Com `leaving`, faz a entrada ao contrário: o X recolhe e o
 * círculo gira para trás. Decorativo: o texto ao lado comunica a situação.
 */
export default function SweetAlertErrorIcon({
    className,
    leaving = false,
}: {
    className?: string;
    leaving?: boolean;
}): React.JSX.Element {
    return (
        <span
            className={joinClassNames(
                'sweetAlertErrorIcon',
                leaving && 'sweetAlertErrorIcon--leaving',
                className,
            )}
            aria-hidden="true"
        >
            <span className="sweetAlertErrorIcon__xMark">
                <span className="sweetAlertErrorIcon__line sweetAlertErrorIcon__line--left" />
                <span className="sweetAlertErrorIcon__line sweetAlertErrorIcon__line--right" />
            </span>
        </span>
    );
}
