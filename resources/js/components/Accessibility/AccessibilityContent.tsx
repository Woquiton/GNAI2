import { Link } from '@inertiajs/react';
import CardBox from '@/components/UI/CardBox/CardBox';
import AccessibilityIllustration from './AccessibilityIllustration';
import { ACCESSIBILITY_TOUR_TARGETS } from './accessibilityTour';
import '@styles/components/Accessibility/AccessibilityContent.css';

export default function AccessibilityContent(): React.JSX.Element {
    return (
        <div className="accessibilityGuide">
            <CardBox
                className="accessibilityGuide__hero"
                tourTarget={ACCESSIBILITY_TOUR_TARGETS.intro}
            >
                <div className="accessibilityGuide__intro">
                    <span className="accessibilityGuide__eyebrow">Uma experiência para você</span>
                    <h2>
                        Seu jeito de navegar.<br />
                        Seu jeito de ler.
                    </h2>
                    <p>
                        Ajuste a apresentação e conheça os caminhos para usar o Gnai
                        com mais conforto e autonomia.
                    </p>
                    <span className="accessibilityGuide__hint">
                        <i className="md md-accessibility" aria-hidden="true" />
                        As opções estão no ícone de acessibilidade da barra superior.
                    </span>
                </div>
                <AccessibilityIllustration />
            </CardBox>

            <div className="accessibilityGuide__sectionHeading">
                <h2>Uma interface que acompanha você</h2>
                <p>Pequenos ajustes para facilitar a leitura e a navegação.</p>
            </div>

            <div className="accessibilityGuide__grid" data-tour={ACCESSIBILITY_TOUR_TARGETS.appearance}>
                <CardBox as="section" className="accessibilityGuide__card">
                    <span className="accessibilityGuide__icon">
                        <i className="fa fa-adjust" aria-hidden="true" />
                    </span>
                    <h3>Mais contraste, mais clareza</h3>
                    <p>
                        Ative Alto contraste na barra superior: fundo preto, texto branco,
                        links e foco amarelos. As imagens mantêm suas cores originais.
                    </p>
                    <div className="accessibilityGuide__contrastPreview" aria-hidden="true">
                        <span>Aa</span>
                        <div><strong>Alto contraste</strong><span>Leitura em destaque</span></div>
                        <i className="fa fa-check-circle" />
                    </div>
                </CardBox>
                <CardBox as="section" className="accessibilityGuide__card">
                    <span className="accessibilityGuide__icon">
                        <i className="fa fa-text-height" aria-hidden="true" />
                    </span>
                    <h3>O tamanho que funciona para você</h3>
                    <p>
                        Use A− e A+ para ajustar texto e controles em passos de 10%, de 90% a 150%.
                        Restaurar padrão retorna às cores originais e ao tamanho de 100%.
                    </p>
                    <div className="accessibilityGuide__sizePreview" aria-hidden="true">
                        <span>A</span><span>A</span><span>A</span>
                        <strong>90% a 150%</strong>
                    </div>
                    <p className="accessibilityGuide__footnote">
                        A escolha fica salva neste navegador, mesmo ao trocar de página.
                        O zoom do navegador também funciona: Ctrl e + ou − (Command no Mac).
                    </p>
                </CardBox>
            </div>

            <CardBox
                as="section"
                className="accessibilityGuide__keyboard"
                tourTarget={ACCESSIBILITY_TOUR_TARGETS.keyboard}
            >
                <div>
                    <span className="accessibilityGuide__eyebrow">Tudo ao alcance das teclas</span>
                    <h2>Navegue sem o mouse</h2>
                    <p>
                        Percorra os controles com Tab e Shift + Tab. O destaque de foco mostra
                        onde você está. As setas percorrem opções de seleção e menus compatíveis.
                    </p>
                    <div className="accessibilityGuide__keyArt" aria-hidden="true">
                        <span>Shift</span><span>Tab <i className="fa fa-long-arrow-right" /></span>
                        <span>↵</span>
                    </div>
                </div>
                <dl className="accessibilityGuide__keyList">
                    <div><dt><kbd>Tab</kbd></dt><dd>Avança para o próximo controle.</dd></div>
                    <div><dt><kbd>Shift</kbd> + <kbd>Tab</kbd></dt><dd>Volta ao controle anterior.</dd></div>
                    <div><dt><kbd>Enter</kbd></dt><dd>Ativa links e botões.</dd></div>
                    <div><dt><kbd>Espaço</kbd></dt><dd>Ativa botões e marca caixas de seleção.</dd></div>
                    <div><dt><kbd>Esc</kbd></dt><dd>Fecha janelas e devolve o foco ao controle que as abriu.</dd></div>
                </dl>
            </CardBox>

            <CardBox
                as="section"
                className="accessibilityGuide__shortcuts"
                tourTarget={ACCESSIBILITY_TOUR_TARGETS.shortcuts}
            >
                <h2>Vá direto ao que precisa</h2>
                <p>
                    Pressione Tab no início da página para encontrar a barra de atalhos.
                    Na área principal, você também pode usar as teclas de acesso:
                </p>
                <ol className="accessibilityGuide__destinations">
                    <li><kbd>1</kbd><span>Conteúdo</span></li>
                    <li><kbd>2</kbd><span>Página inicial</span></li>
                    <li><kbd>3</kbd><span>Menu principal</span></li>
                    <li><kbd>4</kbd><span>Rodapé</span></li>
                </ol>
                <p className="accessibilityGuide__footnote">
                    Chrome e Edge: Alt + número. Firefox: Alt + Shift + número.
                    A combinação pode variar conforme o navegador e o sistema operacional.
                </p>
            </CardBox>

            <div
                className="accessibilityGuide__grid accessibilityGuide__grid--three"
                data-tour={ACCESSIBILITY_TOUR_TARGETS.support}
            >
                <CardBox as="section" className="accessibilityGuide__card">
                    <span className="accessibilityGuide__icon">
                        <i className="fa fa-volume-up" aria-hidden="true" />
                    </span>
                    <h3>Leitura e preenchimento</h3>
                    <p>
                        Os componentes compartilhados oferecem títulos, rótulos, indicação de
                        campos obrigatórios e erros associados aos controles. Avisos de operação
                        podem ser anunciados por leitores de tela.
                    </p>
                    <p>Os diálogos mantêm a navegação por teclado dentro da janela aberta.</p>
                </CardBox>
                <CardBox as="section" className="accessibilityGuide__card">
                    <span className="accessibilityGuide__icon">
                        <i className="fa fa-pause" aria-hidden="true" />
                    </span>
                    <h3>Menos movimento</h3>
                    <p>
                        Prefere uma experiência mais tranquila? O Gnai respeita a opção de
                        reduzir movimento configurada no seu dispositivo, suavizando a experiência
                        com menos animações e transições.
                    </p>
                </CardBox>
                <CardBox as="section" className="accessibilityGuide__card">
                    <span className="accessibilityGuide__icon">
                        <i className="fa fa-compass" aria-hidden="true" />
                    </span>
                    <h3>Orientação pelo caminho</h3>
                    <p>
                        O botão Tutorial da barra superior explica as telas que oferecem
                        tutorial ao vivo. Para consultar orientações de uso, visite a Central de Ajuda.
                    </p>
                    <Link href="/ajuda" className="accessibilityGuide__help">
                        Ir para a Central de Ajuda <i className="fa fa-arrow-right" aria-hidden="true" />
                    </Link>
                </CardBox>
            </div>
        </div>
    );
}
