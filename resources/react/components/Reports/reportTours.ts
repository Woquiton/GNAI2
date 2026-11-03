import { helpUrls } from '@/components/Help/Help.routes';
import type {
    GuidedTourDemo,
    GuidedTourPageConfig,
} from '@/components/UI/GuidedTour/GuidedTour.types';
import { reportTourBridge, type ReportTourBridge } from './Form/reportTourBridge';

/** Valores de `data-tour` das partes do gerador de relatórios. */
export const REPORT_TOUR_TARGETS = {
    source: 'report-source',
    columns: 'report-columns',
    relations: 'report-relations',
    filters: 'report-filters',
    preview: 'report-preview',
    actions: 'report-actions',
} as const;

const targets = REPORT_TOUR_TARGETS;
const HELP_SLUG = 'relatorios';

/** Quantas informações a demonstração marca quando monta um relatório de exemplo. */
const DEMO_COLUMNS = 3;
const POLL_MS = 100;
const WAIT_LIMIT_MS = 10000;
/** Tempo para o próximo passo assumir a demonstração antes de o relatório voltar ao normal. */
const RESET_DELAY_MS = 80;

/**
 * Demonstração compartilhada pelos passos: o tutorial monta um relatório de exemplo só quando o
 * usuário ainda não escolheu um assunto. Ao sair do último passo de relatório (ou fechar o
 * tutorial), o assunto volta para vazio e o formulário limpa tudo o que foi preenchido.
 */
const session = { owned: false, resetTimer: 0 };

function bridge(): ReportTourBridge | null {
    return reportTourBridge.current;
}

function hold(): void {
    window.clearTimeout(session.resetTimer);
}

function release(): void {
    window.clearTimeout(session.resetTimer);
    session.resetTimer = window.setTimeout(() => {
        if (session.owned) {
            bridge()?.report.setSource('');
        }
        session.owned = false;
    }, RESET_DELAY_MS);
}

/** Escolhe o primeiro assunto quando o formulário está vazio; devolve o nome escolhido. */
function ensureSource(): string | null {
    const current = bridge();

    if (!current || current.report.source || !current.report.sources.length) {
        return null;
    }

    const [first] = current.report.sources;
    current.report.setSource(first.key);
    session.owned = true;

    return first.label.startsWith('database.models.') ? first.key : first.label;
}

/** Espera o formulário chegar a um estado (dados carregados, prévia pronta) e executa a ação. */
function when(
    ready: (current: ReportTourBridge) => boolean,
    action: (current: ReportTourBridge) => void,
): () => void {
    const started = Date.now();
    const timer = window.setInterval(() => {
        const current = bridge();

        if (current && ready(current)) {
            window.clearInterval(timer);
            action(current);
        } else if (Date.now() - started > WAIT_LIMIT_MS) {
            window.clearInterval(timer);
        }
    }, POLL_MS);

    return () => window.clearInterval(timer);
}

function metadataReady(current: ReportTourBridge): boolean {
    return current.report.metadata !== null && !current.report.loadingMetadata;
}

function markDemoColumns(current: ReportTourBridge): void {
    const { report } = current;

    if (!session.owned || !report.metadata || report.columns.length) {
        return;
    }

    Object.keys(report.metadata.columns)
        .slice(0, DEMO_COLUMNS)
        .forEach((key) => report.toggleColumn(key, true));
}

function sourceNote(chosen: string | null): string | undefined {
    return chosen
        ? `Escolhemos o assunto "${chosen}" para você ver como funciona. No fim do tutorial, tudo volta ao normal.`
        : undefined;
}

function sourceDemo(): GuidedTourDemo {
    hold();
    const chosen = ensureSource();

    return { note: sourceNote(chosen), undo: release };
}

function columnsDemo(): GuidedTourDemo {
    hold();
    ensureSource();
    const cancel = when(metadataReady, markDemoColumns);

    return {
        note: session.owned
            ? 'Marcamos algumas informações para você ver. Elas viram as colunas da tabela.'
            : undefined,
        undo: () => {
            cancel();
            release();
        },
    };
}

function relationsDemo(): GuidedTourDemo {
    hold();
    ensureSource();
    let added: string | null = null;
    const cancel = when(metadataReady, (current) => {
        const { report, can } = current;
        const relation = report.metadata?.relations[0];

        if (
            !session.owned ||
            !can.configureRelations ||
            !relation ||
            report.addedRelations.length
        ) {
            return;
        }

        report.addRelation(relation.name);
        added = relation.name;
    });

    return {
        note: session.owned
            ? 'Se o assunto tiver informações complementares, adicionamos a primeira para você ver. Ela sai no próximo passo.'
            : undefined,
        undo: () => {
            cancel();

            if (added && session.owned) {
                bridge()?.report.removeRelation(added);
            }

            release();
        },
    };
}

function filtersDemo(): GuidedTourDemo {
    hold();
    ensureSource();
    let previousIds: number[] | null = null;
    const cancel = when(
        (current) => metadataReady(current) && current.report.definitions.length > 0,
        (current) => {
            if (!session.owned) {
                return;
            }

            previousIds = current.report.filters.map((filter) => filter.id);
            current.report.addFilter();
        },
    );

    return {
        note: session.owned
            ? 'Adicionamos um critério para você ver os campos. Ele sai no próximo passo.'
            : undefined,
        undo: () => {
            cancel();
            const current = bridge();

            if (previousIds && session.owned && current) {
                current.report.filters
                    .filter((filter) => !previousIds?.includes(filter.id))
                    .forEach((filter) => current.report.removeFilter(filter.id));
            }

            release();
        },
    };
}

/** Monta o exemplo, se preciso, e clica em Gerar prévia, como o usuário faria. */
function previewDemo(note: string) {
    return (): GuidedTourDemo => {
        hold();
        ensureSource();
        let cancelRun = (): void => undefined;
        const cancel = when(metadataReady, (current) => {
            if (!session.owned || current.report.result || !current.can.run) {
                return;
            }

            markDemoColumns(current);
            cancelRun = when(
                (latest) => latest.report.columns.length > 0 && latest.report.operation === null,
                (latest) => void latest.report.perform('run'),
            );
        });

        return {
            note: session.owned ? note : undefined,
            undo: () => {
                cancel();
                cancelRun();
                release();
            },
        };
    };
}

export const reportBuilderTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show(HELP_SLUG, 'montar-um-relatorio'),
    steps: [
        {
            id: 'report-source',
            target: targets.source,
            title: 'Assunto do relatório',
            content: [
                'Comece escolhendo sobre o que é o relatório, como alunos, atendimentos ou empréstimos.',
                'Depois disso, a tela mostra as informações que você pode incluir.',
            ],
            onEnter: sourceDemo,
        },
        {
            id: 'report-columns',
            target: targets.columns,
            title: 'Informações do relatório',
            content: [
                'Marque as informações que você quer ver. Cada uma vira uma coluna da tabela.',
                'Marque pelo menos uma para gerar o relatório.',
            ],
            onEnter: columnsDemo,
        },
        {
            id: 'report-relations',
            target: targets.relations,
            availableWith: targets.columns,
            title: 'Informações complementares',
            content: [
                'Esta parte não é obrigatória. Ela traz dados ligados ao assunto, como responsáveis ou documentos.',
                'Escolha uma opção, clique em Adicionar e marque o que quer ver. O X tira a informação do relatório.',
            ],
            onEnter: relationsDemo,
        },
        {
            id: 'report-filters',
            target: targets.filters,
            title: 'Critérios de busca',
            content: [
                'Esta parte não é obrigatória. Use critérios para buscar algo específico, como um nome, uma data ou uma situação.',
                'Clique em Adicionar critério de busca e escolha o campo, a condição e o valor. Critérios sem valor não entram na busca.',
            ],
            onEnter: filtersDemo,
        },
        {
            id: 'report-actions',
            target: targets.actions,
            title: 'Gerar prévia e PDF',
            content: [
                'Gerar prévia mostra o relatório aqui mesmo, na tela. PDF abre o relatório em uma nova aba, pronto para imprimir ou salvar.',
                'Os botões funcionam depois de escolher o assunto e marcar ao menos uma informação. Alguns só aparecem para quem tem permissão.',
            ],
            onEnter: previewDemo(
                'Clicamos em Gerar prévia para você ver o resultado do relatório de exemplo.',
            ),
        },
        {
            id: 'report-preview',
            target: targets.preview,
            title: 'Prévia do relatório',
            content: [
                'Aqui aparece a tabela com o resultado, com o total de linhas e de colunas. Confira antes de exportar.',
                'O botão Copiar copia a tabela para você colar em uma planilha ou em um documento.',
            ],
            onEnter: previewDemo(
                'Esta é a prévia do relatório de exemplo. Ela some no fim do tutorial.',
            ),
        },
    ],
};
