# Auditoria de privacidade e transparência do Gnai

Data: 25/11/2026. Escopo: revisão estática do código, referência pública do LinkedIn e fontes oficiais. Não foi feita inspeção da instalação em produção, da configuração efetiva dos serviços ou uma certificação de conformidade jurídica ou de segurança.

## Matriz da referência e da implementação

A imagem fornecida apresenta Sobre, Acessibilidade, Acordo do usuário, Privacidade, Cookies, Copyright, Marca, Controles de visitantes, Diretrizes da comunidade e Idioma. A [política consultada do LinkedIn](https://www.linkedin.com/legal/privacy-policy/) organiza coleta, utilização, compartilhamento, escolhas, obrigações e contato. A referência é de organização e transparência; os serviços e tratamentos dessa rede não foram atribuídos ao Gnai.

| Referência | Situação encontrada no Gnai | Entrega neste trabalho / limite |
| --- | --- | --- |
| Sobre | Página pública própria em Blade, preservada | Rodapé recebe a navegação comum das políticas |
| Privacidade | Aviso no login, sem página pública completa | `/politica-de-privacidade`, pública, com leitura contínua e inventário por categoria |
| Acordo do usuário | Ciência no aviso antes do login; sem aceite contratual versionado nesse fluxo | Documento público de Uso responsável; não foi criado contrato ou mecanismo de aceite |
| Cookies | Sessão, proteção XSRF, preferências locais e por conta | Documento público específico; não foi inventado painel de consentimento |
| Copyright | Assets e componentes de terceiros com licenças próprias | Orientações para publicação e respeito às licenças; sem presumir licença livre |
| Acessibilidade | Ferramentas na aplicação, no portal, no site e no Sobre | Documento público, atalhos de teclado e leitura responsiva; sem alegar certificação |
| Política de marca | Identidade definida em convenções internas | Marca preservada; política jurídica autônoma não criada sem requisitos |
| Controles de visitantes | Recursos de leitura; não localizado mecanismo de anúncios comportamentais próprio no escopo revisado | Explicação de preferências e recursos externos; não afirmar ausência de terceiros na instalação |
| Comunidade | O Gnai não oferece a mesma comunidade social da referência | Condutas institucionais tratadas em Uso responsável |
| Idioma | Interface em pt-BR | Mantido; seletor sem traduções não criado |
| Contato e responsável | O autor do software não identifica automaticamente o controlador | Campos de identificação e contato em Identidade, no construtor do site, sem reutilizar o remetente SMTP ou inventar encarregado |

## Evidências do código e tratamentos

| Categoria | Evidências principais | Observação |
| --- | --- | --- |
| Identificação | `app/Domains/Domain/Models/People/Person.php`, `Students/Student.php` | Nome, documento, nascimento, gênero, contatos, endereço, foto, matrícula e acompanhamento |
| Dados sensíveis | `app/Domains/Domain/Models/{StudentDeficiencies,StudentDocuments,CaseStudies,AeeRecords,PedagogicalRecords,Paees,Peis}` | Deficiência, laudos, avaliações, planos e textos livres podem revelar saúde e outras informações sensíveis |
| Solicitações | `app/Domains/Domain/Models/SupportRequests`, `Infrastructure/Storage/SupportRequests/SupportRequestAttachmentStorage.php` | Motivos, diagnóstico, análise, encaminhamentos e anexos; anexos usam disco local privado |
| Documentos | `app/Domains/Infrastructure/Storage/StudentDocuments/StudentDocumentStorage.php` | Disco `local`, privado; modelo tem opção `show_in_teacher_portal` |
| Fotos e evidências | `app/Domains/Infrastructure/Storage/{People,Students,Teachers,Professionals,Guardians,Inspections}` | Uso de disco público. Autenticação na tela não prova proteção da URL do arquivo |
| Contas | `app/Domains/Domain/Models/Auth/{User,TeacherAccessToken,UserTablePreference}.php`, `config/session.php` | Credenciais, tokens, preferências e sessão; duração e atributos dependem do ambiente |
| Auditoria | `app/Domains/Domain/Models/Audit/AuditRecord.php`, `app/Domains/UI/Middleware/Audit/StartAuditOperation.php` | Identidades, personificação, mudanças, IP, user-agent, método e caminho da requisição; não é prova de registro de todo acesso ou exportação |
| Comunicações | `app/Domains/Domain/Models/Notifications`, `config/{mail,email_inbox,email_bounces}.php` | Destinatários, conteúdo, entregas e respostas; fornecedores dependem da configuração |
| Cópias | `config/backup.php`, `app/Domains/Infrastructure/Storage/Backup/BackupArchiveStorage.php` | Arquivos e banco podem integrar cópias e restaurações; política única de retenção de dados não demonstrada |
| Navegador e terceiros | `resources/js/utils/accessibilityPreferences.ts`, `components/Website/SiteAccessibility/useSiteAccessibilityPreferences.ts`, `resources/css/globals.css`, `resources/views/pages/about-us.blade.php`, `config/services.php` | Armazenamento local, Google Fonts e integração de geocodificação; inventário efetivo depende de recursos usados |

Os caminhos abreviados nesta tabela são relativos às camadas indicadas. Não houve leitura de `.env`, credenciais, dados de alunos ou banco de produção.

## Alinhamento normativo

| Tema | Base consultada | Aplicação ao Gnai |
| --- | --- | --- |
| Finalidade, necessidade e transparência | LGPD, arts. 6º e 9º | Inventário público; núcleo deve definir dados necessários e justificar finalidades |
| Base legal | LGPD, arts. 7º, 11 e 23 | A instituição deve enquadrar cada tratamento, considerando dados sensíveis e natureza pública ou privada; não presumir consentimento geral no login |
| Papéis | Guia da ANPD sobre agentes de tratamento | A instituição que decide finalidades tende a ser controladora. A autoria acadêmica não determina sozinha o papel dos desenvolvedores. Operação ou suporte com dados reais exige avaliação e definição de responsabilidades |
| Crianças e adolescentes | LGPD, art. 14; Enunciado CD/ANPD nº 1/2023 | Melhor interesse e base adequada, com cuidados específicos quando houver consentimento de criança |
| Direitos | ANPD, Direitos dos titulares; LGPD, arts. 18 a 20 | Página explica pedidos, limitações legais e canal institucional; não promete um fluxo automatizado inexistente |
| Conservação | LGPD, arts. 15 e 16 | Tabela de temporalidade e gestão de cópias devem ser definidas pela instituição |
| Responsabilidade e segurança | LGPD, arts. 42 a 48 | Não foi incluída exoneração geral. Exportações geram deveres para instituição e usuários, preservando eventual responsabilidade de outros envolvidos por suas condutas |
| Incidentes | Procedimento da ANPD e regulamentação aplicável | Orientar comunicação imediata interna e avaliação pelo controlador; não confundir aviso interno com comunicação obrigatória à ANPD |
| Cookies | Guia orientativo da ANPD | Distinguir sessão, preferências e serviços externos; um aviso informativo não bloqueia tecnologias nem coleta consentimento |

## Pendências para adoção institucional e oportunidades fora do escopo

1. Identificar a pessoa jurídica controladora, seu encarregado ou canal competente e completar os campos de privacidade em **Comunicação → Site → Personalização → Identidade**. O texto permanece fixo no código, sem edição livre pelo construtor. Usar e-mail público institucional ou URL HTTP(S). A página mostra a ausência desses dados, sem sugerir que a identificação já foi concluída.
2. Validar o texto com o encarregado e a assessoria jurídica, conforme os tratamentos reais. A versão está sinalizada para revisão institucional, sem alegar blindagem judicial.
3. Formalizar bases legais, instruções para a equipe e fornecedores, compartilhamentos, transferências internacionais e prazos de retenção. As decisões de governança não foram presumidas. A única mudança de banco é uma coluna JSON de configuração pública do site, autorizada para os novos campos do construtor.
4. Priorizar revisão técnica de fotos e evidências em disco público, incluindo URLs diretas, conteúdo permitido e eventual migração para acesso autorizado. A mera publicação desta política não resolve exposição de arquivos.
5. Definir atendimento aos titulares, verificação proporcional de identidade, gestão de incidentes, exclusões em cópias restauradas e procedimentos de exportação. Não foram criados portais, solicitações automáticas ou controles que o código atual não oferece.
6. Se a instituição exigir aceite contratual com prova, planejar versionamento e registro no servidor em tarefa própria. O modal existente continua sendo aviso de ciência.

## Implementação e homologação

- Entrada Inertia pública própria, sem exigir sessão nem usar o layout administrativo; conteúdo organizado por camadas, com duas barras superiores, marca usada no login (`logo.png`), título da política e corpo contínuo, tabela, listas, descrições horizontais, citação atribuída, letra inicial ampliada e tokens do Gnai. Cada documento tem endereço próprio: `/politica-de-privacidade`, `/uso-responsavel`, `/politica-de-cookies`, `/direitos-autorais` e `/politica-de-acessibilidade`. A navegação destaca o documento atual; o conteúdo não é dividido em cards. A referência tipográfica foi consultada no histórico `f0bad6a2:resources/react/pages/Typography/Typography.sections.tsx`; o catálogo removido não foi reintroduzido.
- Navegação reutilizada em Sobre, autenticação, bloqueio de sessão, aplicação, Portal do Professor, site público e na própria política. A prévia do construtor mantém os links sem navegação.
- Rodapé administrativo passa a ocupar espaço no fluxo, acompanhando a altura dos links e sua quebra em telas pequenas.
- Permissões existentes do construtor preservadas (`website.edit` e `website.update`). Foram estendidos Data, DTO, Action, modelo, auditoria e presenter para quatro campos públicos de identificação/contato, em uma coluna JSON `privacy` de `website_settings`. Uma migration foi criada, sem execução. A política permanece acessível com sessão bloqueada e recebe apenas props públicas, sem dados compartilhados da conta. Não foi alterado o armazenamento de arquivos ou as regras de acesso aos dados de negócio.
- Não foram executados build, typecheck, lint, testes, servidores, navegador ou screenshots, conforme instruções do repositório. Revisão por leitura do código e do diff.
- Homologação manual: abrir sem autenticação; visitar os links em cada área; conferir os endereços próprios de cada documento e suas âncoras de contato; navegar por Tab; ampliar o texto; conferir tela pequena e alto contraste; verificar a prévia do construtor e a altura do rodapé; aplicar a migration no ambiente de homologação; salvar e recarregar os quatro campos no construtor; conferir erros de e-mail/URL; verificar a política com sessão bloqueada; preencher os contatos e validar o conteúdo institucional.
- Implementado no código; comportamento em runtime deve ser conferido na homologação manual. Sem commit ou publicação.

## Fontes

- [Referência do LinkedIn](https://www.linkedin.com/legal/privacy-policy/).
- [LGPD, texto oficial](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm).
- [ANPD: agentes de tratamento](https://www.gov.br/anpd/pt-br/assuntos/noticias/nova-versao-do-guia-dos-agentes-de-tratamento).
- [ANPD: direitos dos titulares](https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados/direito-dos-titulares).
- [ANPD: crianças e adolescentes](https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-divulga-enunciado-sobre-o-tratamento-de-dados-pessoais-de-criancas-e-adolescentes).
- [ANPD: comunicação de incidentes](https://www.gov.br/anpd/pt-br/canais_atendimento/agente-de-tratamento/comunicado-de-incidente-de-seguranca-cis).
- [ANPD: cookies](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia_orientativo_cookies_e_protecao_de_dados_pessoais).
