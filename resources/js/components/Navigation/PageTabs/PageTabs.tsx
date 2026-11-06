import { Link } from '@inertiajs/react';
import TabNavigation from '@/components/Navigation/Tabs/TabNavigation';
import '@styles/components/Navigation/Tabs/Tabs.css';
import '@styles/components/Navigation/PageTabs/PageTabs.css';

export interface PageTabItem<Key extends string = string> {
    key: Key;
    label: string;
    href: string;
    iconClass: string;
}

export default function PageTabs<Key extends string>({
    items,
    activeKey,
    ariaLabel,
    preserveState = false,
    tourTarget,
}: {
    items: ReadonlyArray<PageTabItem<Key>>;
    activeKey: Key;
    ariaLabel: string;
    /** Mantém a página montada quando as abas são vistas do mesmo componente Inertia. */
    preserveState?: boolean;
    /** Valor de `data-tour`, para o tutorial ao vivo destacar as abas. */
    tourTarget?: string;
}): React.JSX.Element {
    return (
        <nav className="pageTabs" aria-label={ariaLabel} data-tour={tourTarget}>
            <TabNavigation
                activeKey={activeKey}
                itemKeys={items.map((item) => item.key)}
                className="tabs__nav"
            >
                {items.map((item) => (
                    <li key={item.key}>
                        <Link
                            data-tab-key={item.key}
                            href={item.href}
                            preserveScroll
                            preserveState={preserveState}
                            className={
                                item.key === activeKey
                                    ? 'pageTabs__link pageTabs__link--active'
                                    : 'pageTabs__link'
                            }
                            aria-current={item.key === activeKey ? 'page' : undefined}
                        >
                            <i className={item.iconClass} aria-hidden="true" />
                            <span>{item.label}</span>
                        </Link>
                    </li>
                ))}
            </TabNavigation>
        </nav>
    );
}
