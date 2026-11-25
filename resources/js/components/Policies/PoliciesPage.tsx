import { Head } from '@inertiajs/react';
import SkipLinks from '@/components/Navigation/SkipLinks/SkipLinks';
import PolicyLinks from '@/components/Navigation/PolicyLinks/PolicyLinks';
import { policySections, policySources } from './Policies.content';
import { policyDocuments, separatePolicySections } from './Policies.constants';
import type { PolicyPageProps } from './Policies.types';
import '@styles/components/Policies/PoliciesPage.css';

export default function PoliciesPage({
    policyKey = 'privacy',
    controllerName,
    officerName,
    contactEmail,
    contactUrl,
}: PolicyPageProps): React.JSX.Element {
    const email = contactEmail?.trim();
    const url = contactUrl?.trim();
    const safeEmail = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
    const safeUrl = url && /^https?:\/\//i.test(url) ? url : null;
    const contactMissing = !controllerName || !officerName || (!safeEmail && !safeUrl);

    const document = policyDocuments.find((item) => item.key === policyKey) ?? policyDocuments[0];
    const sections = policySections.filter(({ id }) => {
        if (policyKey === 'privacy') {
            return !Object.values(separatePolicySections).some((sectionId) => sectionId === id);
        }

        return id === separatePolicySections[policyKey];
    });

    return (
        <div className="policies" id="inicio">
            <Head title={`${document.title} | Gnai`}>
                <meta
                    name="description"
                    content="Saiba quais dados o Gnai pode armazenar, como devem ser utilizados e como exercer seus direitos de proteção de dados."
                />
            </Head>
            <SkipLinks
                items={[
                    { label: 'Conteúdo', accessKey: '1', targetId: 'politicas-conteudo' },
                    { label: 'Políticas', accessKey: '2', targetId: 'politicas-navegacao' },
                    { label: 'Contato', accessKey: '3', targetId: 'contato' },
                    { label: 'Rodapé', accessKey: '4', targetId: 'politicas-rodape' },
                ]}
            />
            <header className="policies__header">
                <div className="policies__topbar">
                    <a href="/sobre-nos" className="policies__brand" aria-label="Gnai, sobre o sistema">
                        <span className="policies__brandMark">
                            <img src="/images/logo.png" alt="" />
                        </span>
                        <strong>Gnai</strong>
                    </a>
                    <a href="/autenticacao/entrar">Acessar o sistema</a>
                </div>
                <div className="policies__navigation">
                    <PolicyLinks variant="navigation" activePolicy={document.key} />
                </div>
            </header>
            <main id="politicas-conteudo" tabIndex={-1}>
                <header className="policies__hero">
                    <h1 id="politica-titulo">{document.title}</h1>
                </header>
                <article className="policies__document" aria-labelledby="politica-titulo">
                    <p className="policies__version">
                        Atualizada em <time dateTime="2026-11-25">25 de novembro de 2026</time>
                        {' · Versão para revisão institucional'}
                    </p>
                    <p className="policies__review">
                        A instituição deve validar este documento, as bases legais, os fornecedores,
                        os prazos de guarda e os canais de atendimento antes da adoção oficial.
                    </p>
                    {sections.map(({ id, title, content }) => (
                        <section className="policies__section" key={id}>
                            <h2 id={id} tabIndex={-1}>
                                {title}
                            </h2>
                            {content}
                        </section>
                    ))}
                    <section className="policies__section">
                        <h2 id="contato" tabIndex={-1}>
                            Contato e fontes oficiais
                        </h2>
                        <h3>Responsável por esta instalação</h3>
                        <dl className="policies__definitions">
                            <div>
                                <dt>Instituição</dt>
                                <dd>
                                    {controllerName ||
                                        'Identificação pública ainda não informada pela instituição.'}
                                </dd>
                            </div>
                            <div>
                                <dt>Encarregado ou setor</dt>
                                <dd>
                                    {officerName || 'Identificação pública ainda não informada.'}
                                </dd>
                            </div>
                            <div>
                                <dt>Proteção de dados</dt>
                                <dd>
                                    {safeEmail ? (
                                        <p>
                                            <a href={`mailto:${safeEmail}`}>{safeEmail}</a>
                                        </p>
                                    ) : null}
                                    {safeUrl ? (
                                        <p>
                                            <a href={safeUrl}>
                                                Canal institucional de proteção de dados
                                            </a>
                                        </p>
                                    ) : null}
                                    {contactMissing ? (
                                        <p>
                                            A identificação do controlador, do encarregado e
                                            de seu canal público precisam ser completados.
                                            Enquanto isso, procure a secretaria ou a
                                            administração da instituição responsável pelo
                                            seu atendimento para obter o contato do encarregado.
                                        </p>
                                    ) : null}
                                </dd>
                            </div>
                        </dl>
                        <h3>Legislação e orientações</h3>
                        <ul>
                            <li>
                                <a href={policySources.law}>
                                    Lei Geral de Proteção de Dados Pessoais, Lei nº 13.709/2018
                                </a>
                            </li>
                            <li>
                                <a href={policySources.agents}>
                                    ANPD: agentes de tratamento e encarregado
                                </a>
                            </li>
                            <li>
                                <a href={policySources.rights}>ANPD: direitos dos titulares</a>
                            </li>
                            <li>
                                <a href={policySources.children}>
                                    ANPD: tratamento de dados de crianças e adolescentes
                                </a>
                            </li>
                            <li>
                                <a href={policySources.cookies}>
                                    ANPD: cookies e proteção de dados pessoais
                                </a>
                            </li>
                            <li>
                                <a href={policySources.incidents}>
                                    ANPD: comunicação de incidentes de segurança
                                </a>
                            </li>
                        </ul>
                        <p>
                            Alterações devem ser publicadas com nova data e comunicadas de forma
                            compatível com seu impacto. Mudanças de finalidade ou de consentimento
                            exigem avaliação própria; a atualização deste texto não as autoriza.
                        </p>
                        <a href="#inicio" className="policies__back">
                            Voltar ao início
                        </a>
                    </section>
                </article>
            </main>
            <footer id="politicas-rodape" className="policies__footer" tabIndex={-1}>
                <p>
                    <strong>Gnai</strong> · Gestor de Núcleos de Acessibilidade e Inclusão
                </p>
                <a href="/sobre-nos">Sobre o sistema</a>
                <PolicyLinks activePolicy={document.key} />
            </footer>
        </div>
    );
}
