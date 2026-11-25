import type { ReactNode } from 'react';

export const policySources = {
    law: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm',
    agents: 'https://www.gov.br/anpd/pt-br/assuntos/noticias/nova-versao-do-guia-dos-agentes-de-tratamento',
    rights: 'https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados/direito-dos-titulares',
    children: 'https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-divulga-enunciado-sobre-o-tratamento-de-dados-pessoais-de-criancas-e-adolescentes',
    incidents: 'https://www.gov.br/anpd/pt-br/canais_atendimento/agente-de-tratamento/comunicado-de-incidente-de-seguranca-cis',
    cookies: 'https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia_orientativo_cookies_e_protecao_de_dados_pessoais',
};

const dataCategories = [
    [
        'Identificação e contato',
        'Nome, documento, nascimento, gênero, e-mail, telefone, endereço e foto de alunos, responsáveis, professores e profissionais.',
        'Identificar pessoas, manter vínculos e viabilizar a comunicação institucional.',
    ],
    [
        'Vida acadêmica e atendimento',
        'Matrícula, curso, disciplinas, semestre, responsáveis, agendamentos, presenças, empréstimos e histórico de acompanhamento.',
        'Organizar o trabalho do núcleo e acompanhar as ações de inclusão.',
    ],
    [
        'Dados sensíveis e documentos',
        'Informações de saúde e deficiência, laudos, avaliações, estudos de caso, registros pedagógicos e especializados, PAEE, PEI e anexos.',
        'Planejar e registrar o apoio educacional, com acesso restrito às pessoas autorizadas.',
    ],
    [
        'Contas e segurança',
        'Nome e e-mail de acesso, senha protegida por hash, perfis, permissões, tokens de acesso e recuperação, sessão e registros técnicos de acesso.',
        'Autenticar usuários, controlar acessos e investigar falhas ou uso indevido.',
    ],
    [
        'Auditoria e comunicação',
        'Autor das operações, alterações de registros, contexto técnico, notificações, destinatários, conteúdo e estado de entrega de e-mails e respostas recebidas.',
        'Rastrear operações e apoiar a comunicação e a gestão institucional.',
    ],
    [
        'Site e recursos do núcleo',
        'Publicações, imagens, equipe divulgada, localização de instituições, barreiras, vistorias, evidências e informações de itens.',
        'Informar o público e organizar recursos e condições de acessibilidade.',
    ],
    [
        'Preferências e cópias',
        'Preferências de interface e acessibilidade, arquivos exportados, relatórios e cópias de segurança dos dados da instalação.',
        'Personalizar a leitura, produzir documentos institucionais e permitir recuperação de dados.',
    ],
];

export const policySections: { id: string; title: string; content: ReactNode }[] = [
    {
        id: 'sobre-esta-politica',
        title: 'Sobre esta política',
        content: (
            <>
                <p className="policies__dropCap">
                    O Gnai é um sistema de apoio aos Núcleos de Acessibilidade e Inclusão,
                    originado em projeto acadêmico desenvolvido por dois estudantes sob orientação
                    docente. Sua adoção pela instituição é voluntária. Esta política explica os
                    recursos que podem tratar dados pessoais e os cuidados necessários em seu uso.
                </p>
                <p>
                    Abrange a área administrativa, o Portal do Professor, o site público e os
                    documentos produzidos pelo sistema. Os dados efetivamente utilizados dependem
                    dos cadastros, recursos habilitados e decisões da instituição responsável.
                </p>
                <blockquote cite={policySources.law}>
                    <p>“O tratamento de dados pessoais sensíveis somente poderá ocorrer nas seguintes hipóteses”</p>
                    <footer><cite><a href={policySources.law}>LGPD, art. 11</a></cite>. As hipóteses legais devem ser avaliadas pela instituição.</footer>
                </blockquote>
                <p>
                    Ler esta política ou clicar em “Ciente e continuar” no login não constitui
                    consentimento genérico para coletar, divulgar ou reutilizar dados pessoais.
                </p>
            </>
        ),
    },
    {
        id: 'responsabilidades',
        title: 'Quem responde pelo tratamento',
        content: (
            <>
                <dl className="policies__definitions">
                    <div>
                        <dt>Instituição controladora</dt>
                        <dd>
                            A instituição que define as finalidades e as decisões essenciais
                            sobre os dados deve identificar seu papel de controladora. Cabe a
                            ela organizar a governança, autorizar os acessos e orientar sua
                            equipe.
                        </dd>
                    </div>
                    <div>
                        <dt>Equipe do núcleo</dt>
                        <dd>
                            Profissionais e professores devem atuar dentro das atribuições e
                            instruções institucionais. Uma permissão técnica de acesso não
                            autoriza qualquer utilização dos dados.
                        </dd>
                    </div>
                    <div>
                        <dt>Operadores e suporte</dt>
                        <dd>
                            Prestadores que tratem dados em nome da instituição devem seguir
                            instruções documentadas, com escopo, sigilo, segurança e
                            responsabilidades definidos.
                        </dd>
                    </div>
                    <div>
                        <dt>Desenvolvedores e orientação</dt>
                        <dd>
                            A autoria do software e a orientação acadêmica, isoladamente, não
                            definem quem controla os dados. Se houver hospedagem, manutenção ou
                            acesso a dados reais, o papel de cada participante deve ser avaliado
                            conforme sua atuação efetiva.
                        </dd>
                    </div>
                </dl>
                <p>
                    Se uma instalação atender mais de uma instituição, os papéis devem ser
                    definidos para cada operação. Cadastrar uma escola, campus ou localização no
                    Gnai não atribui automaticamente a essa unidade a condição de controladora.
                </p>
                <p className="policies__emphasis">
                    A origem acadêmica, a gratuidade ou a adoção voluntária não afastam deveres
                    legais. Esta página não concede imunidade aos desenvolvedores, à instituição,
                    aos usuários ou a prestadores por seus próprios atos e omissões.
                </p>
                <p><a href={policySources.agents}>Referência: orientações da ANPD sobre agentes de tratamento.</a></p>
            </>
        ),
    },
    {
        id: 'dados-e-finalidades',
        title: 'Dados e finalidades',
        content: (
            <>
                <p>
                    O inventário abaixo descreve categorias encontradas nos recursos do Gnai.
                    Não significa que todos esses dados sejam obrigatórios para todas as pessoas.
                    Informações podem ser fornecidas pelo titular, por seu responsável ou pela
                    equipe autorizada, a partir dos registros institucionais.
                </p>
                <div className="policies__tableScroll" role="region" aria-label="Inventário de dados e finalidades, role horizontalmente se necessário" tabIndex={0}>
                    <table>
                        <caption>O que o sistema pode armazenar e para quê</caption>
                        <thead>
                            <tr>
                                <th scope="col">Categoria</th>
                                <th scope="col">Exemplos de dados</th>
                                <th scope="col">Finalidade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataCategories.map(([category, data, purpose]) => (
                                <tr key={category}>
                                    <th scope="row">{category}</th>
                                    <td>{data}</td>
                                    <td>{purpose}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p>
                    Campos livres, fotos e anexos também podem revelar informações sensíveis.
                    Registre somente o necessário ao atendimento; evite cópias integrais de
                    documentos quando a finalidade puder ser atendida com menos informações.
                </p>
            </>
        ),
    },
    {
        id: 'bases-legais',
        title: 'Bases legais e proteção especial',
        content: (
            <>
                <p>
                    A instituição deve definir e documentar a base legal de cada finalidade.
                    Obrigações legais e execução de políticas públicas podem ser aplicáveis,
                    conforme a natureza da instituição e da atividade. Dados sensíveis exigem
                    enquadramento próprio no art. 11; legítimo interesse não é base para eles.
                </p>
                <h3>Consentimento com finalidade específica</h3>
                <p>
                    Quando necessário, o consentimento deve ser específico, informado e passível
                    de revogação. O aviso do login não substitui sua obtenção nem seu registro.
                    Publicar uma foto ou reutilizar um laudo exige avaliação própria da finalidade.
                </p>
                <h3>Crianças e adolescentes</h3>
                <p>
                    O melhor interesse deve prevalecer. Conforme o Enunciado CD/ANPD nº 1/2023,
                    podem ser utilizadas as bases legais adequadas dos arts. 7º ou 11 da LGPD.
                    Quando a base for consentimento de criança, observe a participação do responsável
                    legal exigida pela lei e forneça explicações claras e acessíveis.
                </p>
                <p><a href={policySources.law}>LGPD, arts. 7º, 11 e 14</a> · <a href={policySources.children}>Orientação da ANPD sobre crianças e adolescentes</a>.</p>
            </>
        ),
    },
    {
        id: 'compartilhamento',
        title: 'Acessos, compartilhamento e exportações',
        content: (
            <>
                <p>
                    O Gnai possui autenticação, permissões e vínculos de acesso. O Portal do
                    Professor disponibiliza informações relacionadas à atuação do professor,
                    incluindo documentos autorizados para esse portal. A instituição deve revisar
                    os acessos e a necessidade de cada compartilhamento.
                </p>
                <h3>Ao gerar um PDF, baixar um anexo ou exportar um backup</h3>
                <ol>
                    <li>Confirme a finalidade institucional e quem está autorizado a receber o arquivo.</li>
                    <li>Selecione apenas os dados necessários e oculte identificadores dispensáveis.</li>
                    <li>Use um canal institucional seguro e controle as cópias, os destinatários e a guarda.</li>
                    <li>
                        Descarte cópias quando não forem mais necessárias, respeitando
                        obrigações de conservação.
                    </li>
                </ol>
                <p className="policies__emphasis">
                    O dever de sigilo continua fora do sistema. A instituição e quem realiza o
                    compartilhamento devem responder por sua atuação. A autorização de download
                    não equivale à autorização de divulgação pública.
                </p>
                <p>
                    O software não controla automaticamente o destino de uma cópia já baixada.
                    Isso não elimina eventual responsabilidade legal por falhas próprias de
                    segurança, tratamento irregular ou outras condutas de qualquer envolvido.
                </p>
                <p>
                    Hospedagem, e-mail, mapas, fontes e armazenamento externo dependem da
                    configuração. A instituição deve identificar fornecedores, destinos e eventual
                    transferência internacional antes de utilizá-los com dados pessoais.
                </p>
            </>
        ),
    },
    {
        id: 'guarda-e-seguranca',
        title: 'Guarda, segurança e incidentes',
        content: (
            <>
                <h3>Onde e por quanto tempo</h3>
                <p>
                    Cadastros ficam no banco de dados da instalação; arquivos e cópias ficam nos
                    destinos configurados. Documentos de alunos e anexos de solicitações usam
                    armazenamento privado no código. Fotos e determinadas evidências usam
                    armazenamento público e exigem cuidado especial antes do envio.
                </p>
                <p>
                    Não há um prazo único de retenção para todos os módulos. A instituição deve
                    estabelecer sua tabela de temporalidade por finalidade e obrigação aplicável,
                    incluindo auditoria, e-mails e backups. Excluir um cadastro não garante remoção
                    imediata de todas as cópias ou registros históricos. A restauração de um backup
                    exige conferir e reaplicar exclusões pertinentes.
                </p>
                <h3>Cuidados permanentes</h3>
                <ul>
                    <li>Manter HTTPS, atualizações, permissões mínimas e revisão de contas ativas.</li>
                    <li>Proteger dispositivos, senhas, arquivos exportados e acesso à infraestrutura.</li>
                    <li>Restringir o suporte técnico ao necessário e evitar dados reais em demonstrações.</li>
                </ul>
                <h3>Suspeita de acesso indevido ou vazamento</h3>
                <p>
                    Avise imediatamente o canal institucional de proteção de dados, preserve
                    evidências e evite ampliar a exposição. O controlador deve avaliar o risco e
                    realizar as comunicações à ANPD e aos titulares quando exigidas, observando
                    os prazos e condições da regulamentação vigente. Não há garantia de risco zero.
                </p>
                <p><a href={policySources.incidents}>Procedimento oficial da ANPD para comunicação de incidentes</a>.</p>
            </>
        ),
    },
    {
        id: 'seus-direitos',
        title: 'Seus direitos e como solicitar',
        content: (
            <>
                <ul>
                    <li>Confirmar o tratamento, acessar seus dados e corrigir informações.</li>
                    <li>Solicitar anonimização, bloqueio ou eliminação de dados excessivos ou irregulares.</li>
                    <li>Saber com quem houve compartilhamento e obter informações sobre consentimento.</li>
                    <li>
                        Revogar consentimento e pedir eliminação dos dados tratados nessa base,
                        ressalvadas as hipóteses legais de conservação.
                    </li>
                    <li>
                        Solicitar portabilidade nos termos da regulamentação e revisão de
                        decisões exclusivamente automatizadas que afetem seus interesses, quando
                        houver.
                    </li>
                </ul>
                <p>
                    Use o <a href="#contato">canal de proteção de dados desta instalação</a>.
                    Informe a relação com a instituição e o pedido, sem enviar laudos ou documentos
                    sensíveis desnecessários. A identidade pode ser verificada de forma proporcional.
                    A solicitação é gratuita e pode ser apresentada por representante legal.
                </p>
                <p>
                    Para confirmação ou acesso, a LGPD prevê resposta simplificada imediata ou
                    declaração completa em até 15 dias. Outros pedidos seguem os prazos e condições
                    aplicáveis. A instituição deve explicar eventuais impedimentos legais e orientar
                    o titular. Se a demanda não for resolvida, é possível recorrer à ANPD.
                </p>
                <p><a href={policySources.rights}>Conheça os direitos e canais oficiais na ANPD</a>.</p>
            </>
        ),
    },
    {
        id: 'cookies',
        title: 'Cookies e tecnologias semelhantes',
        content: (
            <>
                <dl className="policies__definitions">
                    <div>
                        <dt>Sessão e segurança</dt>
                        <dd>
                            Cookies mantêm a sessão e apoiam a proteção contra requisições
                            indevidas. Nome, duração e atributos dependem da configuração da
                            instalação. A opção de lembrar o acesso, quando utilizada, também
                            pode manter um identificador no navegador.
                        </dd>
                    </div>
                    <div>
                        <dt>Preferências locais</dt>
                        <dd>
                            O navegador guarda preferências de acessibilidade e leitura no
                            armazenamento local. Algumas preferências de interface também ficam
                            associadas à conta no servidor.
                        </dd>
                    </div>
                    <div>
                        <dt>Recursos externos</dt>
                        <dd>
                            Fontes externas e mapas, quando carregados, podem transmitir IP e
                            informações técnicas ao fornecedor. Links externos levam a serviços
                            com políticas próprias.
                        </dd>
                    </div>
                </dl>
                <p>
                    Na revisão do código desta versão não foram identificados mecanismos próprios
                    de publicidade comportamental. Recursos adicionados à instalação devem ser
                    avaliados separadamente. A instituição deve informar tecnologias adicionais e
                    oferecer escolhas quando necessárias, antes de ativar usos não essenciais.
                </p>
                <p>
                    É possível limpar cookies e armazenamento nas configurações do navegador;
                    isso pode encerrar a sessão e restaurar preferências. Esta página não oferece
                    um gerenciador de consentimento ou um bloqueio automático de serviços externos.
                </p>
                <p><a href={policySources.cookies}>Guia da ANPD sobre cookies e proteção de dados pessoais</a>.</p>
            </>
        ),
    },
    {
        id: 'uso-responsavel',
        title: 'Compromissos de uso responsável',
        content: (
            <>
                <p>
                    A instituição adota o Gnai por decisão própria e deve avaliar sua adequação,
                    organizar o atendimento e instruir as pessoas autorizadas. O sistema apoia o
                    trabalho do núcleo; as decisões educacionais e profissionais continuam sob
                    responsabilidade de quem possui atribuição para tomá-las.
                </p>
                <h3>Condutas que a equipe deve evitar</h3>
                <ul>
                    <li>
                        Consultar prontuários por curiosidade ou acessar registros sem
                        necessidade funcional.
                    </li>
                    <li>Compartilhar senhas, deixar sessões abertas ou ceder acesso a terceiros.</li>
                    <li>
                        Enviar laudos, planilhas e backups para contas pessoais, grupos abertos
                        ou destinatários sem autorização.
                    </li>
                    <li>
                        Publicar nomes, imagens, diagnósticos ou capturas de prontuários sem
                        avaliação e autorização institucional adequadas.
                    </li>
                    <li>
                        Usar informações para discriminação, exposição, vantagem pessoal ou
                        finalidade incompatível com o atendimento.
                    </li>
                    <li>
                        Inserir dados reais em testes, apresentações acadêmicas ou serviços
                        externos sem avaliação institucional e proteção apropriadas.
                    </li>
                </ul>
                <p>
                    A instituição deve orientar o tratamento de irregularidades e a preservação dos
                    direitos dos titulares. Este documento apresenta orientações de uso e não registra
                    aceite contratual versionado nem substitui instrumentos institucionais próprios.
                </p>
            </>
        ),
    },
    {
        id: 'direitos-autorais',
        title: 'Conteúdo e direitos autorais',
        content: (
            <>
                <p>
                    Publique somente textos, imagens e arquivos que a instituição esteja autorizada
                    a utilizar. Respeite a autoria e as licenças dos materiais, inclusive componentes
                    de terceiros. A inclusão de um arquivo no sistema não transfere automaticamente
                    os direitos sobre ele nem concede autorização para sua divulgação.
                </p>
                <p>
                    A origem acadêmica do Gnai não significa que o software, o tema ou todos os
                    seus materiais tenham licença livre. As condições de uso e distribuição devem
                    observar as licenças e autorizações aplicáveis. Para apontar conteúdo indevido,
                    identifique o material e procure o canal institucional indicado nesta página.
                </p>
            </>
        ),
    },
    {
        id: 'acessibilidade',
        title: 'Acessibilidade e leitura',
        content: (
            <>
                <p>
                    A proteção de dados deve ser compreensível e acessível. As páginas de políticas
                    oferecem navegação entre documentos, títulos hierárquicos, links descritivos e
                    acesso por teclado.
                    O texto acompanha a ampliação do navegador e as preferências gerais de
                    acessibilidade já salvas no Gnai.
                </p>
                <p>
                    O sistema também disponibiliza ferramentas de acessibilidade em suas áreas de
                    navegação. Esses recursos não representam certificação integral de conformidade.
                    Caso encontre uma barreira, informe a página, a dificuldade e, se possível, a
                    tecnologia assistiva utilizada ao canal institucional, evitando dados de alunos.
                </p>
            </>
        ),
    },
];
