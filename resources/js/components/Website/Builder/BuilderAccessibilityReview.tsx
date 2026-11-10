import Button from '@/components/UI/Button/Button';
import type { BuilderEditTarget, BuilderFormData } from './websiteBuilder';
import { builderAccessibilityIssues } from './websiteAccessibility';
import { WEBSITE_BUILDER_TOUR_TARGETS } from './websiteBuilderTours';
import '@styles/components/Website/Builder/BuilderAccessibilityReview.css';

export default function BuilderAccessibilityReview({
    data,
    errors,
    disabled,
    onEdit,
}: {
    data: BuilderFormData;
    errors: Record<string, string | undefined>;
    disabled: boolean;
    onEdit: (target: BuilderEditTarget) => void;
}): React.JSX.Element {
    const issues = builderAccessibilityIssues(data, errors);
    const summary = issues.length
        ? `${issues.length} ${issues.length === 1 ? 'pendência' : 'pendências'} para revisar antes de publicar.`
        : 'Nenhuma pendência nas verificações iniciais.';

    return (
        <section
            className="builderAccessibilityReview"
            aria-labelledby="website-accessibility-title"
            data-tour={WEBSITE_BUILDER_TOUR_TARGETS.accessibility}
        >
            <div className="builderAccessibilityReview__heading">
                <i className="md md-accessibility" aria-hidden="true" />
                <h2 id="website-accessibility-title">Acessibilidade antes de publicar</h2>
            </div>
            <p role="status" aria-live="polite" aria-atomic="true">
                {summary}
            </p>
            <p>
                Preencha os títulos, descreva as imagens informativas e identifique o destino
                das ações. Ao salvar, o sistema também verifica as cores e o conteúdo formatado.
                Seções ocultas podem ficar incompletas enquanto você prepara o conteúdo.
            </p>
            {issues.length ? (
                <ul className="builderAccessibilityReview__issues">
                    {issues.map((issue) => (
                        <li key={issue.key}>
                            <span>
                                <strong>{issue.label}:</strong> {issue.message}
                            </span>
                            <Button
                                tone="white"
                                size="sm"
                                label="Revisar"
                                leftIconClass="fa fa-pencil"
                                title={`Revisar ${issue.label}: ${issue.message}`}
                                disabled={disabled}
                                onClick={() => onEdit(issue.target)}
                            />
                        </li>
                    ))}
                </ul>
            ) : null}
            <details>
                <summary>O que conferir no conteúdo?</summary>
                <ul>
                    <li>Descreva a informação da imagem, incluindo textos importantes de cartazes.</li>
                    <li>No banner com texto, a imagem de fundo é decorativa; a informação deve estar nos campos de texto.</li>
                    <li>O logo usa o nome do site como identificação, sem repetir a leitura da imagem.</li>
                    <li>Nos textos, comece os subtítulos pelo nível 3 e dê título e cabeçalhos às tabelas.</li>
                    <li>Use as cores da seção: cores aplicadas dentro do texto não passam pela verificação de contraste.</li>
                    <li>Abra Ver site e confira teclado, ampliação, leitor de tela e a clareza das descrições.</li>
                </ul>
                <p>
                    As verificações automáticas ajudam a prevenir barreiras, mas não avaliam
                    sozinhas a qualidade das descrições nem comprovam conformidade integral.
                </p>
            </details>
        </section>
    );
}
