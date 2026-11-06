import { useGuidedTourState } from '@/components/UI/GuidedTour/useGuidedTour';

/** Botão da barra do topo que abre e fecha o tutorial da tela; só aparece quando a tela tem um. */
export default function TopBarTourAction(): React.JSX.Element | null {
    const { available, active, start, stop } = useGuidedTourState();

    if (!available) {
        return null;
    }

    const hint = active ? 'Fechar o tutorial desta tela' : 'Abrir o tutorial desta tela';

    return (
        <li className="topbar__navItem">
            <button
                type="button"
                className={`topbar__navLink topbar__navButton${active ? ' is-active' : ''}`}
                onClick={active ? stop : start}
                aria-label="Tutorial desta tela"
                aria-expanded={active}
                title={hint}
            >
                <i className="icon-info" aria-hidden="true" />
            </button>
        </li>
    );
}
