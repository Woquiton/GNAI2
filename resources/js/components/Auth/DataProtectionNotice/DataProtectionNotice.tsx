import Modal from '@/components/UI/Modal/Modal';
import Button from '@/components/UI/Button/Button';
import '@styles/components/Auth/DataProtectionNotice/DataProtectionNotice.css';

export default function DataProtectionNotice({
    open,
    onAcknowledge,
}: {
    open: boolean;
    onAcknowledge: () => void;
}): React.JSX.Element {
    return (
        <Modal
            open={open}
            title={
                <span className="dataProtectionNotice__title">
                    <i className="fa fa-shield" aria-hidden="true" />
                    <span>Aviso de responsabilidade e proteção de dados</span>
                </span>
            }
            effect="fadein"
            className="dataProtectionNoticeDialog"
            contentClassName="dataProtectionNotice"
            closeDisabled
            closeOnBackdrop={false}
            onClose={() => {}}
            initialFocus="#data-protection-notice-content"
            footer={
                <Button
                    type="button"
                    tone="primary"
                    leftIconClass="fa fa-check"
                    label="Ciente e continuar"
                    title="Ciente e continuar o login"
                    onClick={onAcknowledge}
                />
            }
        >
            <div
                id="data-protection-notice-content"
                className="dataProtectionNotice__content"
                tabIndex={-1}
            >
                <p>
                    Este sistema poderá conter dados pessoais e sensíveis, inclusive informações
                    de saúde, deficiência e dados de crianças e adolescentes.
                </p>
                <p>
                    O usuário é responsável pelo acesso, registro, utilização e compartilhamento
                    dessas informações, devendo preservar seu sigilo e utilizá-las exclusivamente
                    para finalidades institucionais autorizadas.
                </p>
                <p>
                    O uso do sistema deve observar a legislação vigente, especialmente a{' '}
                    <strong>LGPD (Lei nº 13.709/2018)</strong>, o{' '}
                    <strong>ECA (Lei nº 8.069/1990)</strong>, o{' '}
                    <strong>ECA Digital (Lei nº 15.211/2025)</strong> e a{' '}
                    <strong>Lei Brasileira de Inclusão (Lei nº 13.146/2015)</strong>.
                </p>
                <p>
                    O uso indevido das informações poderá acarretar responsabilização individual,
                    nos termos da legislação aplicável.
                </p>
                <p>
                    Consulte a{' '}<a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer">
                        Política de privacidade e uso responsável (abre em nova aba)
                    </a>. A ciência deste aviso não substitui uma base legal para tratar dados.
                </p>
            </div>
        </Modal>
    );
}
