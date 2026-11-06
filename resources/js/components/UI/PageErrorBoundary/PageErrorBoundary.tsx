import { Component, type ErrorInfo, type ReactNode } from 'react';

/**
 * Isola falhas de renderização (por exemplo, de plugins jQuery) para que a aplicação
 * não fique em branco: o conteúdo é trocado por `fallback`, normalmente a tela de erro
 * avulsa. O erro é limpo quando `resetKey` muda (por exemplo, a URL), sem remontar a
 * página nas visitas que preservam o estado, como filtros e paginação.
 */
export default class PageErrorBoundary extends Component<
    { children: ReactNode; fallback: ReactNode; resetKey: string },
    { failed: boolean }
> {
    state = { failed: false };

    static getDerivedStateFromError(): { failed: boolean } {
        return { failed: true };
    }

    componentDidUpdate(previous: { resetKey: string }): void {
        if (this.state.failed && previous.resetKey !== this.props.resetKey) {
            this.setState({ failed: false });
        }
    }

    componentDidCatch(error: Error, info: ErrorInfo): void {
        console.error('Falha ao exibir a página.', error, info.componentStack);
    }

    render(): ReactNode {
        return this.state.failed ? this.props.fallback : this.props.children;
    }
}
