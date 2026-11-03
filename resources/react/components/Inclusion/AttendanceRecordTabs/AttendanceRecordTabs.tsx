import type { ReactNode } from 'react';
import Tabs from '@/components/Navigation/Tabs/Tabs';
import Badge from '@/components/UI/Badge/Badge';
import type { AttendanceRecordTabId, AttendanceRecordTabsState } from './useAttendanceRecordTabs';
import './AttendanceRecordTabs.css';

export interface AttendanceRecordTab {
    id: AttendanceRecordTabId;
    label: string;
    icon: string;
    /** Obrigatórios ainda sem resposta na aba, mostrados na bolinha vermelha. */
    pending?: number;
    content: ReactNode;
}

function tabDescription(label: string, pending: number, invalid: boolean): string | undefined {
    const pendingText = pending === 1 ? '1 campo obrigatório' : `${pending} campos obrigatórios`;
    const states = [
        pending ? `${pendingText} sem resposta` : null,
        invalid ? 'com campos a corrigir' : null,
    ].filter(Boolean);

    return states.length ? `${label} (${states.join(', ')})` : undefined;
}

interface AttendanceRecordTabsProps {
    tabs: AttendanceRecordTab[];
    state: AttendanceRecordTabsState;
}

/**
 * Etapas do registro de atendimento em abas, com a quantidade de obrigatórios sem resposta e o
 * ícone de alerta nas que têm campos a corrigir. Com uma só etapa, o conteúdo aparece direto, sem
 * a barra de abas.
 */
export default function AttendanceRecordTabs({
    tabs,
    state,
}: AttendanceRecordTabsProps): React.JSX.Element {
    if (tabs.length === 1) {
        return <>{tabs[0].content}</>;
    }

    const items = tabs.map((tab) => {
        const invalid = state.tabHasErrors(tab.id);
        const pending = tab.pending ?? 0;

        return {
            id: tab.id,
            icon: tab.icon,
            accessibleLabel: tabDescription(tab.label, pending, invalid),
            label: (
                <span className="attendanceRecordTabs__label">
                    {tab.label}
                    {pending ? (
                        <Badge
                            variant="danger"
                            ariaHidden
                            className="attendanceRecordTabs__pending"
                        >
                            {pending}
                        </Badge>
                    ) : null}
                    {invalid ? (
                        <i
                            className="fa fa-exclamation-circle attendanceRecordTabs__invalid"
                            aria-hidden="true"
                        />
                    ) : null}
                </span>
            ),
            content: tab.content,
        };
    });

    return <Tabs items={items} initialActiveId={state.activeTab} onChange={state.changeTab} />;
}
