import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "@inertiajs/react";
import "@/components/Navigation/Tabs/Tabs.css";
import "./PageTabs.css";

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
}: {
    items: ReadonlyArray<PageTabItem<Key>>;
    activeKey: Key;
    ariaLabel: string;
}): React.JSX.Element {
    const listRef = useRef<HTMLUListElement>(null);
    const itemRefs = useRef(new Map<Key, HTMLLIElement>());
    const previousActiveKey = useRef(activeKey);
    const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

    useLayoutEffect(() => {
        const list = listRef.current;
        const activeItem = itemRefs.current.get(activeKey);

        if (!list || !activeItem) {
            return;
        }

        function updateIndicator(): void {
            const listRect = list.getBoundingClientRect();
            const itemRect = activeItem.getBoundingClientRect();

            setIndicator({
                left: itemRect.left - listRect.left,
                width: itemRect.width,
                ready: true,
            });
        }

        updateIndicator();

        const activeTabChanged = previousActiveKey.current !== activeKey;
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        activeItem.scrollIntoView({
            behavior: activeTabChanged && !reduceMotion ? "smooth" : "auto",
            block: "nearest",
            inline: "nearest",
        });
        previousActiveKey.current = activeKey;

        const observer = typeof ResizeObserver === "undefined"
            ? null
            : new ResizeObserver(updateIndicator);
        observer?.observe(list);
        observer?.observe(activeItem);
        window.addEventListener("resize", updateIndicator);

        return () => {
            observer?.disconnect();
            window.removeEventListener("resize", updateIndicator);
        };
    }, [activeKey, items.length]);

    return (
        <nav className="pageTabs" aria-label={ariaLabel}>
            <ul ref={listRef} className="pageTabs__list tabs__nav--animated">
                {items.map((item) => (
                    <li
                        key={item.key}
                        ref={(element) => {
                            if (element) itemRefs.current.set(item.key, element);
                            else itemRefs.current.delete(item.key);
                        }}
                    >
                        <Link
                            href={item.href}
                            preserveScroll
                            className={
                                item.key === activeKey
                                    ? "pageTabs__link pageTabs__link--active"
                                    : "pageTabs__link"
                            }
                            aria-current={item.key === activeKey ? "page" : undefined}
                        >
                            <i className={item.iconClass} aria-hidden="true" />
                            <span>{item.label}</span>
                        </Link>
                    </li>
                ))}
                <li
                    className={indicator.ready
                        ? "tabs__indicator tabs__indicator--ready"
                        : "tabs__indicator"}
                    style={{
                        width: `${indicator.width}px`,
                        transform: `translateX(${indicator.left}px)`,
                    }}
                    role="presentation"
                    aria-hidden="true"
                />
            </ul>
        </nav>
    );
}
