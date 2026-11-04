import { usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDialogFocus } from '@/components/UI/Modal/useDialogFocus';
import axios from 'axios';
import type { SessionSecurityState } from './Session.types';
import './SessionActivity.css';

// Mantém atividade ainda não enviada durante a troca de páginas do Inertia.
let pendingActivity = false;

export default function SessionActivity(): React.JSX.Element | null {
    const { props, component } = usePage<{
        sessionSecurity: SessionSecurityState | null;
        [key: string]: unknown;
    }>();
    const security = props.sessionSecurity;
    const onLockScreen = component === 'Auth/LockScreen';
    const [covered, setCovered] = useState(false);
    const [showStatus, setShowStatus] = useState(false);
    // A lock screen já oculta os dados protegidos; seu formulário deve continuar acessível.
    const obscured = covered && !onLockScreen && Boolean(security);
    const coverRef = useRef<HTMLDivElement>(null);
    useDialogFocus(coverRef, obscured);

    useEffect(() => {
        setShowStatus(false);
        if (!obscured) return;

        // A transição normal é rápida; só explica a espera se ela se prolongar.
        const timer = window.setTimeout(() => setShowStatus(true), 1500);
        return () => window.clearTimeout(timer);
    }, [obscured]);

    useEffect(() => {
        const root = document.getElementById('root');
        if (!obscured || !root) return;
        const wasInert = root.inert;
        root.inert = true;
        return () => {
            root.inert = wasInert;
        };
    }, [obscured]);

    useEffect(() => {
        setCovered(false);
        if (!security) {
            pendingActivity = false;
            return;
        }
        let current = security;
        let busy = false;
        let disposed = false;
        let redirecting = false;
        let lastCheck = 0;

        function navigate(destination: string): void {
            redirecting = true;
            setCovered(!onLockScreen);
            window.location.assign(destination);
        }

        async function synchronize(): Promise<void> {
            if (busy || disposed || redirecting) return;
            busy = true;
            lastCheck = Date.now();
            const reportActivity = pendingActivity && !onLockScreen;
            pendingActivity = false;
            try {
                const response = reportActivity
                    ? await axios.post<SessionSecurityState>(
                          '/autenticacao/sessao/atividade',
                          { return_to: window.location.pathname + window.location.search },
                          { timeout: 10000 },
                      )
                    : await axios.get<SessionSecurityState>('/autenticacao/sessao/estado', {
                          timeout: 10000,
                      });
                if (disposed) return;
                if (
                    !response.data ||
                    typeof response.data !== 'object' ||
                    typeof response.data.lastActivity !== 'number'
                ) {
                    navigate(current.loginHref);
                    return;
                }
                current = response.data;
                if (current.locked && !onLockScreen) {
                    navigate('/autenticacao/sessao/bloqueada');
                } else if (!current.locked && onLockScreen) {
                    navigate(current.returnTo);
                } else {
                    setCovered(false);
                }
            } catch (error) {
                if (disposed) return;
                if (axios.isAxiosError(error)) {
                    const destination = error.response?.data?.redirectTo;
                    if (
                        typeof destination === 'string' &&
                        destination.startsWith('/') &&
                        !destination.startsWith('//')
                    ) {
                        navigate(destination);
                    } else if ([401, 419].includes(error.response?.status ?? 0)) {
                        navigate(current.loginHref);
                    }
                }
                // Se o prazo vencer sem conexão, mantém o conteúdo oculto até confirmar a sessão.
                pendingActivity ||= reportActivity;
            } finally {
                busy = false;
            }
        }

        function activity(event: Event): void {
            if (event.isTrusted && !onLockScreen) pendingActivity = true;
        }
        function isOverdue(): boolean {
            const timeout =
                current.canLock && !onLockScreen ? current.lockAfter : current.logoutAfter;
            return Date.now() >= current.lastActivity + timeout * 1000;
        }
        function resume(): void {
            if (document.visibilityState === 'visible') {
                if (!onLockScreen && isOverdue()) setCovered(true);
                void synchronize();
            }
        }
        const events = ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart'];
        events.forEach((event) => window.addEventListener(event, activity, { passive: true }));
        window.addEventListener('focus', resume);
        window.addEventListener('online', resume);
        window.addEventListener('pageshow', resume);
        document.addEventListener('visibilitychange', resume);
        const timer = window.setInterval(() => {
            const overdue = isOverdue();
            if (overdue && !onLockScreen) setCovered(true);
            if (Date.now() - lastCheck >= (overdue ? 5000 : 15000)) void synchronize();
        }, 1000);
        void synchronize();

        return () => {
            disposed = true;
            window.clearInterval(timer);
            events.forEach((event) => window.removeEventListener(event, activity));
            window.removeEventListener('focus', resume);
            window.removeEventListener('online', resume);
            window.removeEventListener('pageshow', resume);
            document.removeEventListener('visibilitychange', resume);
        };
    }, [security, onLockScreen]);

    return obscured
        ? createPortal(
              <div
                  ref={coverRef}
                  className="sessionActivity__cover"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Verificando sua sessão"
                  tabIndex={-1}
              >
                  {showStatus ? (
                      <p role="status">
                          Verificando sua sessão. Se estiver sem conexão, reconecte-se para continuar.
                      </p>
                  ) : null}
              </div>,
              document.body,
          )
        : null;
}
