import ErrorScreen from './ErrorScreen';

const description = {
    title: 'Não foi possível exibir esta tela',
    paragraphs: ['Ocorreu um erro inesperado nesta tela. Volte ao início para continuar.'],
};

/** Tela avulsa exibida quando uma página falha ao renderizar, só com o retorno ao início. */
export default function RenderErrorScreen({ homeHref }: { homeHref: string }): React.JSX.Element {
    return <ErrorScreen code="500" description={description} homeHref={homeHref} />;
}
