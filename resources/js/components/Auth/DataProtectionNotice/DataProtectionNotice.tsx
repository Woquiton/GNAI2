import InlineAlert from '@/components/UI/InlineAlert/InlineAlert';
import '@styles/components/Auth/DataProtectionNotice/DataProtectionNotice.css';

export default function DataProtectionNotice(): React.JSX.Element {
    return (
        <section aria-labelledby="data-protection-notice-title">
            <InlineAlert variant="info" className="dataProtectionNotice">
                <h4 id="data-protection-notice-title">
                    <i className="fa fa-shield" aria-hidden="true" /> Aviso de responsabilidade
                    e proteção de dados
                </h4>
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
            </InlineAlert>
        </section>
    );
}
