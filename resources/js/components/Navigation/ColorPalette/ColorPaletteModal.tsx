import { useForm } from '@inertiajs/react';
import { useEffect, useId, useLayoutEffect, useRef } from 'react';
import ChoiceControl from '@/components/Forms/ChoiceControl/ChoiceControl';
import FieldError from '@/components/Forms/FormField/FieldError';
import { fieldErrorId } from '@/components/Forms/FormField/fieldDescription';
import { useFormSubmission } from '@/components/Forms/FormLayout/useFormSubmission';
import { useAccessibilityPreferences } from '@/hooks/useAccessibilityPreferences';
import Button from '@/components/UI/Button/Button';
import InlineAlert from '@/components/UI/InlineAlert/InlineAlert';
import Modal, { useModalClose } from '@/components/UI/Modal/Modal';
import { applyColorPalette, type ColorPalette } from '@/utils/colorPalette';
import '@styles/components/Navigation/ColorPalette/ColorPaletteModal.css';

const PALETTES: { value: ColorPalette; label: string; color: string }[] = [
    { value: 'lilac', label: 'Lilás', color: '#6c63ff' },
    { value: 'purple', label: 'Roxo escuro', color: '#322b75' },
];

function PaletteFooter({ processing, onSave }: { processing: boolean; onSave: () => void }) {
    const close = useModalClose();

    return (
        <>
            <Button
                tone="cancel"
                title="Cancelar"
                leftIconClass="fa fa-times"
                disabled={processing}
                onClick={() => close?.()}
            >
                Cancelar
            </Button>
            <Button
                tone="save"
                title={processing ? 'Salvando paleta' : 'Salvar paleta'}
                leftIconClass={processing ? 'fa fa-spinner fa-spin' : 'fa fa-check'}
                disabled={processing}
                onClick={onSave}
            >
                {processing ? 'Salvando...' : 'Salvar'}
            </Button>
        </>
    );
}

export default function ColorPaletteModal({
    palette,
    onClose,
}: {
    palette: ColorPalette;
    onClose: () => void;
}): React.JSX.Element {
    const id = useId();
    const form = useForm<{ palette: ColorPalette }>({ palette });
    const { formRef, submit } = useFormSubmission(form);
    const { preferences } = useAccessibilityPreferences();
    const savedPalette = useRef(palette);
    const lowContrast = form.data.palette === 'lilac';
    const contrastText = lowContrast
        ? 'Atenção ao contraste: o lilás com texto branco tem relação de 4,32:1, abaixo do mínimo de 4,5:1 da WCAG AA para textos de tamanho normal. Textos brancos pequenos podem ficar mais difíceis de ler. Para maior contraste, escolha Roxo escuro.'
        : 'Maior contraste: o roxo escuro com texto branco tem relação de 12,08:1 e atende ao mínimo de 4,5:1 da WCAG AA para textos de tamanho normal. Esta avaliação considera apenas texto branco sobre a cor primária.';

    useLayoutEffect(() => {
        applyColorPalette(form.data.palette);
    }, [form.data.palette]);

    useEffect(() => {
        return () => applyColorPalette(savedPalette.current);
    }, []);

    function save(): void {
        submit({
            url: '/autenticacao/preferencias/paleta-de-cor',
            method: 'put',
            failureText: 'Não foi possível salvar sua paleta de cor. Tente novamente.',
            options: {
                onError: () => applyColorPalette(form.data.palette),
                onSuccess: () => {
                    savedPalette.current = form.data.palette;
                    applyColorPalette(form.data.palette);
                    onClose();
                },
            },
        });
    }

    const errorDescription = form.errors.palette ? fieldErrorId(id) : undefined;

    return (
        <Modal
            open
            title="Paleta de cor"
            effect="fadein"
            onClose={onClose}
            closeDisabled={form.processing}
            closeOnBackdrop={!form.processing}
            initialFocus="input:checked"
            footer={<PaletteFooter processing={form.processing} onSave={save} />}
        >
            <form
                ref={formRef}
                className="colorPalette"
                aria-busy={form.processing}
                onSubmit={(event) => {
                    event.preventDefault();
                    save();
                }}
            >
                <p>
                    Experimente a cor da barra do topo, do menu selecionado e das ações
                    institucionais. A prévia aparece na interface; só Salvar grava a escolha
                    para a sua conta.
                </p>
                <fieldset disabled={form.processing} className="colorPalette__options">
                    <legend>Escolha a cor primária</legend>
                    {PALETTES.map((option) => (
                        <div
                            key={option.value}
                            className={`colorPalette__option colorPalette__option--${option.value}`}
                        >
                            <ChoiceControl
                                type="radio"
                                id={`${id}-${option.value}`}
                                name={`${id}-palette`}
                                value={option.value}
                                label={`${option.label} (${option.color})`}
                                checked={form.data.palette === option.value}
                                invalid={Boolean(form.errors.palette)}
                                describedBy={errorDescription}
                                onChange={() => {
                                    form.clearErrors('palette');
                                    form.setData('palette', option.value);
                                }}
                            />
                            <div className="colorPalette__sample" aria-hidden="true">
                                <span>Texto branco sobre a cor primária</span>
                            </div>
                        </div>
                    ))}
                </fieldset>
                <FieldError id={id} error={form.errors.palette} />
                <div role="status" aria-live="polite" aria-atomic="true">
                    {preferences.highContrast ? (
                        <p>
                            O alto contraste está ativo e tem prioridade sobre a paleta. Você
                            pode salvar sua escolha; a prévia e as cores escolhidas aparecem ao
                            desativar Alto contraste no botão de acessibilidade da barra superior.
                            O aviso abaixo considera as cores com alto contraste desativado.
                        </p>
                    ) : null}
                    <InlineAlert variant={lowContrast ? 'warning' : 'info'}>
                        <i
                            className={lowContrast ? 'fa fa-exclamation-triangle' : 'fa fa-info-circle'}
                            aria-hidden="true"
                        />{' '}
                        {contrastText}
                    </InlineAlert>
                </div>
                <p>Cancelar ou fechar restaura a paleta salva. As outras cores permanecem iguais.</p>
            </form>
        </Modal>
    );
}
