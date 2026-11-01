import type { ComponentProps } from 'react';
import Tabs from '@/components/Navigation/Tabs/Tabs';
import './RecordTabs.css';

type RecordTabsProps = Omit<ComponentProps<typeof Tabs>, 'variant'>;

/**
 * Abas verticais dos prontuários: navegação neutra à esquerda e painel com a seção completa.
 * Em telas estreitas, `Tabs` transforma a navegação em uma faixa horizontal rolável.
 */
export default function RecordTabs(props: RecordTabsProps): React.JSX.Element {
    return (
        <div className="recordTabs">
            <Tabs {...props} variant="vertical" />
        </div>
    );
}
