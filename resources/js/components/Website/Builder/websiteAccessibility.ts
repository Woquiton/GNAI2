import {
    IDENTITY_ID,
    type BuilderEditTarget,
    type BuilderFormData,
} from './websiteBuilder';

export interface BuilderAccessibilityIssue {
    key: string;
    label: string;
    message: string;
    target: BuilderEditTarget;
}

/** Mapeia a chave de validação do servidor para o mesmo campo usado pela prévia. */
export function accessibilityIssueTarget(
    key: string,
    data: BuilderFormData,
): BuilderEditTarget {
    const match = /^sections\.(\d+)\.(.+)$/.exec(key);
    if (!match) return { sectionId: IDENTITY_ID, field: key };
    const section = data.sections[Number(match[1])];
    const field = match[2].replace(/^items\.(\d+)\./, 'item-$1-').replaceAll('.', '-');
    const slide = /^slides\.(\d+)\.(.+)$/.exec(match[2]);
    return {
        sectionId: section?.id ?? IDENTITY_ID,
        field: slide && section?.slides[Number(slide[1])]
            ? `slide-${section.slides[Number(slide[1])].id}-${slide[2]}`
            : field,
    };
}

/** Ajuda durante a autoria; o servidor faz a validação definitiva, inclusive de cores. */
export function builderAccessibilityIssues(
    data: BuilderFormData,
    errors: Record<string, string | undefined>,
): BuilderAccessibilityIssue[] {
    const issues = new Map<string, string>();
    const blank = (value: string) => !value.replace(/[\s\u200B\uFEFF]/gu, '');
    data.sections.forEach((section, index) => {
        if (!section.enabled) return;
        const prefix = `sections.${index}`;
        if (blank(section.title)) {
            issues.set(`${prefix}.title`, 'Informe um título que identifique esta seção.');
        }
        if (
            section.type === 'about' &&
            (section.image || (section.image_url && !section.remove_image)) &&
            blank(section.image_alt)
        ) {
            issues.set(`${prefix}.image_alt`, 'Descreva o conteúdo da imagem.');
        }
        const customAction = !['team', 'events', 'publications'].includes(section.type)
            && !(section.type === 'hero' && section.hero?.mode === 'banners');
        if (customAction && section.button_url.trim() && blank(section.button_label)) {
            issues.set(`${prefix}.button_label`, 'Informe o texto que identifica esta ação.');
        }
        if (customAction && section.button_label.trim() && !section.button_url.trim()) {
            issues.set(`${prefix}.button_url`, 'Informe o destino desta ação.');
        }
        section.items.forEach((item, itemIndex) => {
            const itemPrefix = `${prefix}.items.${itemIndex}`;
            if (blank(item.title)) issues.set(`${itemPrefix}.title`, 'Dê um título ao item.');
            if (section.type === 'faq' && blank(item.text)) {
                issues.set(`${itemPrefix}.text`, 'Preencha a resposta desta pergunta.');
            }
            if (section.type === 'resources' && !item.url?.trim()) {
                issues.set(`${itemPrefix}.url`, 'Informe o endereço do material.');
            }
        });
        section.slides.forEach((slide, slideIndex) => {
            if (blank(slide.alt)) {
                issues.set(`${prefix}.slides.${slideIndex}.alt`, 'Descreva esta imagem do banner.');
            }
        });
        if (section.type === 'about' && section.body) {
            const body = new DOMParser().parseFromString(section.body, 'text/html');
            const missingAlt = Array.from(body.images).some((image) => blank(image.alt));
            if (missingAlt) {
                issues.set(`${prefix}.body`, 'Descreva as imagens inseridas no texto da seção.');
            }
        }
    });
    Object.entries(errors).forEach(([key, message]) => {
        if (message) issues.set(key, message);
    });
    return Array.from(issues, ([key, message]) => {
        const target = accessibilityIssueTarget(key, data);
        const section = data.sections.find((item) => item.id === target.sectionId);
        return {
            key,
            message,
            target,
            label: section?.title.trim() || (section ? 'Seção sem título' : 'Identidade'),
        };
    });
}
