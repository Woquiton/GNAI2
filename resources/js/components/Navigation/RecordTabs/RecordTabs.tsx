import type { ComponentProps } from 'react';
import Tabs from '@/components/Navigation/Tabs/Tabs';
import '@styles/components/Navigation/RecordTabs/RecordTabs.css';

type RecordTabsProps = Omit<ComponentProps<typeof Tabs>, 'variant'>;

/**
 * Prontuários usam a faixa horizontal compartilhada e um painel para a seção completa.
 */
export default function RecordTabs(props: RecordTabsProps): React.JSX.Element {
    return (
        <div className="recordTabs">
            <Tabs {...props} variant="standard" />
        </div>
    );
}
