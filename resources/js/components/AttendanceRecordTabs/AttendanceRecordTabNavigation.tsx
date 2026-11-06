import Button from '@/components/UI/Button/Button';
import type { AttendanceRecordTab } from './AttendanceRecordTabs';
import type { AttendanceRecordTabsState } from './useAttendanceRecordTabs';

interface AttendanceRecordTabNavigationProps {
    tabs: Pick<AttendanceRecordTab, 'id' | 'label'>[];
    state: AttendanceRecordTabsState;
    disabled?: boolean;
}

/**
 * Passagem para a aba anterior e a seguinte no rodapé do formulário, com o nome da aba de destino.
 * Some quando o formulário tem uma só etapa.
 */
export default function AttendanceRecordTabNavigation({
    tabs,
    state,
    disabled = false,
}: AttendanceRecordTabNavigationProps): React.JSX.Element | null {
    if (tabs.length < 2) {
        return null;
    }

    const index = Math.max(
        tabs.findIndex((tab) => tab.id === state.activeTab),
        0,
    );
    const previous = tabs[index - 1];
    const next = tabs[index + 1];

    return (
        <>
            {previous ? (
                <Button
                    tone="white"
                    leftIconClass="fa fa-arrow-left"
                    label={previous.label}
                    title={`Voltar para ${previous.label}`}
                    aria-label={`Voltar para a aba ${previous.label}`}
                    disabled={disabled}
                    onClick={() => state.goTo(previous.id)}
                />
            ) : null}
            {next ? (
                <Button
                    tone="white"
                    rightIconClass="fa fa-arrow-right"
                    label={next.label}
                    title={`Ir para ${next.label}`}
                    aria-label={`Ir para a aba ${next.label}`}
                    disabled={disabled}
                    onClick={() => state.goTo(next.id)}
                />
            ) : null}
        </>
    );
}
