import { useHighContrast } from '@/hooks/useHighContrast';
import { joinClassNames } from '@/utils/joinClassNames';
import './ContrastToggle.css';

/**
 * Liga e desliga o alto contraste, como o botão de contraste do gov.br. A preferência fica salva
 * no navegador e é aplicada pelo `main.tsx` antes da primeira renderização.
 */
export default function ContrastToggle({ className }: { className?: string }): React.JSX.Element {
    const contrast = useHighContrast();
    const label = contrast.enabled ? 'Desativar alto contraste' : 'Ativar alto contraste';

    return (
        <button
            type="button"
            className={joinClassNames('contrastToggle', className)}
            aria-pressed={contrast.enabled}
            aria-label="Alto contraste"
            title={label}
            onClick={contrast.toggle}
        >
            <i className="fa fa-adjust" aria-hidden="true" />
        </button>
    );
}
