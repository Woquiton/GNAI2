import { useEffect, useState, type ReactNode } from 'react';
import { joinClassNames } from '@/utils/joinClassNames';
import type { StudentStatusPanelData } from '../Students.types';
import StudentStatusSidebar from './StudentStatusSidebar';
import './StudentRecordWorkspace.css';

const SIDEBAR_PREFERENCE_KEY = 'gnai.studentRecord.statusSidebarOpen';
const OVERLAY_QUERY = '(max-width: 1279px)';

function readSidebarPreference(): boolean {
    if (typeof window === 'undefined') return false;

    try {
        return window.localStorage.getItem(SIDEBAR_PREFERENCE_KEY) === 'true';
    } catch {
        return false;
    }
}

function isOverlayViewport(): boolean {
    if (typeof window === 'undefined') return false;

    return window.matchMedia(OVERLAY_QUERY).matches;
}

interface StudentRecordWorkspaceProps {
    statusPanel: StudentStatusPanelData;
    children: ReactNode;
}

/** Conteúdo principal do prontuário e sua lateral contextual de acompanhamento. */
export default function StudentRecordWorkspace({
    statusPanel,
    children,
}: StudentRecordWorkspaceProps): React.JSX.Element {
    const [sidebarExpanded, setSidebarExpanded] = useState(readSidebarPreference);
    const [overlay, setOverlay] = useState(isOverlayViewport);

    useEffect(() => {
        const media = window.matchMedia(OVERLAY_QUERY);
        const updateMode = (): void => setOverlay(media.matches);

        media.addEventListener('change', updateMode);
        return () => media.removeEventListener('change', updateMode);
    }, []);

    function toggleSidebar(): void {
        const nextExpanded = !sidebarExpanded;
        setSidebarExpanded(nextExpanded);

        try {
            window.localStorage.setItem(SIDEBAR_PREFERENCE_KEY, String(nextExpanded));
        } catch {
            // Sem armazenamento, a lateral continua funcionando durante esta visita.
        }
    }

    return (
        <div
            className={joinClassNames(
                'studentRecordWorkspace',
                sidebarExpanded && 'studentRecordWorkspace--statusExpanded',
            )}
        >
            <div className="studentRecordWorkspace__main">{children}</div>
            {overlay && sidebarExpanded ? (
                <button
                    type="button"
                    className="studentRecordWorkspace__backdrop"
                    aria-label="Fechar status do atendimento"
                    onClick={toggleSidebar}
                />
            ) : null}
            <StudentStatusSidebar
                panel={statusPanel}
                expanded={sidebarExpanded}
                overlay={overlay}
                onToggle={toggleSidebar}
            />
        </div>
    );
}
