import type { ReactNode } from 'react';
import '@styles/components/Tables/TableActions/TableActions.css';

export default function TableActions({ children }: { children: ReactNode }): React.JSX.Element {
    return <span className="tableActions">{children}</span>;
}
