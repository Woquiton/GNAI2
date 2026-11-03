/** Resultado de uma demonstração: como desfazê-la e uma frase sobre o que aconteceu na tela. */
export interface GuidedTourDemo {
    undo?: () => void;
    /** Exibida em destaque no cartão, por exemplo "A linha foi arrastada para a direita." */
    note?: string;
}

/**
 * Um passo do tutorial da tela. O alvo é o valor do atributo `data-tour` do elemento destacado;
 * uma lista de alvos destaca a área que envolve todos eles, como um grupo de gráficos.
 */
export interface GuidedTourStep {
    /** Identificador estável do passo dentro do tutorial. */
    id: string;
    /** Valor de `data-tour` do elemento destacado. Sem alvo, o cartão aparece no centro da tela. */
    target?: string | string[];
    /** Nome curto do que está destacado. */
    title: string;
    /** Explicação em linguagem simples; cada item vira um parágrafo. */
    content: string | string[];
    /** Agrupa passos na lista "Todos os passos", como "Gráficos do atendimento". */
    group?: string;
    /**
     * Prepara a tela ao entrar no passo, como abrir um menu ou demonstrar uma ação.
     * Retorne uma função que desfaz a demonstração (ou um `GuidedTourDemo`); ela roda ao sair
     * do passo ou do tutorial e precisa deixar as preferências salvas do usuário como estavam.
     */
    onEnter?: (target: HTMLElement | null) => void | (() => void) | GuidedTourDemo;
}

/** Tutorial informado pela página ao `BusinessPage`, sem os passos comuns da moldura. */
export interface GuidedTourPageConfig {
    steps: GuidedTourStep[];
    /** Artigo da Central de Ajuda sobre a tela, oferecido no último passo. */
    helpHref?: string;
}

/** Tutorial completo registrado para a tela atual. */
export interface GuidedTourDefinition {
    /** Nome da tela, exibido no cartão. */
    title: string;
    steps: GuidedTourStep[];
    helpHref?: string;
}
