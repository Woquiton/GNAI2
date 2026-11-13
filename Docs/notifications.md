# E-mails, fila e integração IMAP

Detalhes de implementação e operação. Para configurar e usar as telas, consulte os artigos de [configurações](../resources/help/configuracoes.md) e [central de e-mails](../resources/help/central-de-emails.md). O deploy e os serviços estão descritos no [guia de operação](../docs/operations/README.md).

## Processar rejeições de e-mail do Gmail

O Gnai pode ler os avisos técnicos de falha do Gmail por IMAP e atualizar o
histórico para **E-mail não entregue**. O aceite SMTP aparece como **Aceito pelo
servidor de envio** e não confirma a entrega ou leitura. O processamento não
reenvia a mensagem, não apaga avisos e não os marca como lidos.

1. Na conta remetente, use verificação em duas etapas e uma **senha de app**.
   A conta precisa permitir autenticação IMAP com essa senha. Em Google
   Workspace, confira as políticas com o administrador. Contas que exigem
   exclusivamente OAuth não são atendidas por esta integração.
2. Em **Sistema → Configurações → E-mail**, selecione **SMTP**, o servidor
   **Gmail / Google Workspace** e cadastre a conta remetente e sua chave de
   aplicativo. Na seção **Rejeições do Gmail**, marque **Monitorar rejeições do
   Gmail** e salve. A ativação vale para a instalação e respeita as permissões
   existentes das configurações. Não depende de variáveis extras no `.env`.
   A leitura usa a mesma conta e senha criptografada do envio.
3. A **Pasta dos avisos de rejeição** é **INBOX** por padrão. Mantenha os avisos
   nessa pasta ou cadastre a pasta IMAP usada pelos seus filtros. O servidor é fixo:
   `imap.gmail.com:993`, com TLS e validação de certificado.
4. Antes da ativação, reconstrua a imagem PHP e recrie os serviços com `make deploy`, escolhendo o ambiente correto. O Dockerfile inclui a extensão IMAP; fora do Docker,
   instale essa extensão no PHP que executa o agendador. Recarregue também o
   cache de configuração caso seja usado no ambiente. A tela impede a ativação
   se o PHP da aplicação não tiver IMAP. O PHP do agendador também precisa dessa
   extensão. Depois da preparação, cada instalação configura o monitoramento
   pela interface, sem alterar arquivos do servidor.
5. Com o agendador ativo, a consulta ocorre a cada cinco minutos. Para executar
   uma consulta manual no ambiente, use `make art ARGS="emails:process-gmail-bounces"`.

Para desativar, desmarque **Monitorar rejeições do Gmail** e salve. Salvar as
configurações não testa a conexão IMAP. O botão **Enviar teste** verifica apenas
o envio SMTP; homologue a leitura com um aviso real e o comando acima.

O processamento consulta avisos estruturados `multipart/report` do subsistema de
entrega do Gmail, dos últimos 30 dias, em lotes de até 100 avisos por execução.
O cursor é separado por conta, pasta e UIDVALIDITY; perder o cache pode repetir
a leitura, mas não o envio. Apenas rejeições definitivas (`Action: failed`,
status `5.x.x`) são registradas. Avisos de atraso não são tratados como falha
definitiva. A associação exige o `Message-ID` original e o destinatário do
registro; mensagens sem essa correspondência são ignoradas. Isso também permite
associar avisos anteriores à integração quando o identificador já foi registrado.
O corpo original e o diagnóstico livre do aviso não são persistidos; somente o
código técnico da rejeição fica no histórico. Não é confirmação de entrega.

Na homologação manual, confira um envio válido e um endereço inexistente, espere
o retorno do Gmail e execute a consulta. O segundo registro deve passar para
**E-mail não entregue**, com o código da rejeição nos detalhes. Execute novamente
para conferir que o resultado se mantém e nenhum e-mail é reenviado. Na Central,
use **Atualizar** para consultar uma rejeição que chegou depois do aceite.

## Receber respostas aos e-mails do Gnai

A tabela `email_deliveries` já inclui data de recebimento, vínculo com a mensagem
anterior e índice de Message-ID. Em **Configurações → E-mail → Respostas do Gmail**, ative
**Importar respostas do Gmail** e configure **Pasta das respostas recebidas**
(padrão `INBOX`). Não há novas credenciais ou variáveis de ambiente.

O agendador executa `emails:sync-gmail-replies` a cada minuto. O mesmo processamento
pode ser iniciado por **Buscar respostas** na Inbox. Usa IMAP somente para
leitura, com certificados verificados, e considera os últimos 30 dias, em lotes
de até 50 candidatos. Só persiste respostas cujos cabeçalhos In-Reply-To ou
References correspondam a envios rastreados do Gnai; não usa assunto como chave.
Respostas diretas a avisos de autenticação são ignoradas para preservar links pessoais.
O cursor é separado por conta, pasta e UIDVALIDITY; a chave de deduplicação por
conta e Message-ID evita repetir importações caso o cursor seja perdido.

Corpo e anexos são processados com limites em `config/email_inbox.php`. HTML
recebido é sanitizado, imagens remotas não são carregadas, e anexos ficam no
disco privado. Conteúdo omitido por limite gera aviso na leitura. Favoritos,
marcadores e leitura continuam individuais no Gnai. As pastas podem ser
sincronizadas conforme a opção abaixo. Homologue com uma resposta real a um envio rastreado, confira o
vínculo com a mensagem original, repita a busca para verificar deduplicação e
confira que a resposta enviada pelo Gnai se destina ao remetente correto.

## Sincronizar pastas com o Gmail

A tabela `email_deliveries` já inclui o vínculo por conta e X-GM-MSGID, a pasta
compartilhada e a data da última consulta.
Ative **Sincronizar pastas com o Gmail** em **Configurações → E-mail → Pastas do Gmail**.
A opção é por instalação, inicialmente desativada, e independe do recebimento de
respostas e do monitoramento de rejeições.

`GmailImapClient` usa PHP cURL com suporte a `imaps`, TLS e certificado verificado,
com host fixo `imap.gmail.com:993` e as mesmas credenciais do SMTP. Isso permite
usar os comandos IMAP4 que a pesquisa IMAP2 da extensão PHP não expõe. Não requer
OAuth, dependências Composer adicionais ou novas credenciais. Pastas são
descobertas por Special-Use, sem nomes traduzidos fixos. A associação começa pelo
Message-ID e passa a usar X-GM-MSGID, estável entre pastas. Consulte as
[extensões oficiais do Gmail](https://developers.google.com/workspace/gmail/imap/imap-extensions).

Spam, Lixeira, Arquivar e Restaurar alteram somente marcadores de pasta da mensagem
selecionada, preservando seus outros marcadores. Não há EXPUNGE ou exclusão
definitiva. O estado local compartilhado só muda após a confirmação remota.
A conferência combina os marcadores retornados e a presença na pasta selecionada,
pois o Gmail pode omitir de X-GM-LABELS o marcador dessa própria pasta. Essa presença
também é considerada ao remover Spam ou Lixeira para arquivar ou restaurar.
`email.send`, além de `email.view`, é exigida para essas ações quando a integração
está ativa. Estrelas, leitura e marcadores pessoais não são enviados ao Gmail.
Mensagens sem envio real continuam locais; mensagens rastreadas não encontradas
no Gmail geram falha na ação. Lotes podem terminar parcialmente e informam seus
resultados sem anunciar conclusão integral.

O comando `emails:sync-gmail-folders`, agendado a cada minuto, consulta até 20
registros por lote, com prioridade para os consultados há mais tempo. O botão
**Sincronizar pastas** executa a mesma consulta. A consulta só lê metadados de
mensagens já registradas, inclusive em Todas as mensagens, Spam e Lixeira. Não
reaplica organização pessoal antiga ao Gmail nem remove o histórico caso uma
mensagem tenha sido apagada externamente. Mensagens de contas anteriores não são
alteradas na conta atual. Homologue Spam, Lixeira, Arquivar e Restaurar nos dois
sentidos e confira os resultados de falha e os efeitos em outro usuário da instalação.


## Motor compartilhado de e-mails transacionais

Os módulos usam `Notifications/Application/Actions/Email/QueueEmailAction` com um
`EmailMessageDTO`: destinatário, assunto, views, dados e vínculo com a operação.
O motor registra a solicitação em `email_deliveries` depois do commit e só então
enfileira `SendEmailDelivery`. Uma chave de deduplicação fornecida pelo módulo
impede repetir o mesmo aviso. Destinatário e conteúdo são criptografados no banco.

O empréstimo, a confirmação de devolução para alunos, a confirmação de entrada
na fila de espera e o aviso de disponibilidade da fila já consomem esse motor. A inscrição e a disponibilidade
usam finalidades e chaves de deduplicação diferentes, preservando os dois avisos.
O modelo visual `emails.notifications.summary` segue o `billing.html` do
Ubold e pode ser usado pelos demais módulos. O motor também aceita outras views.
Falhas de preparação, enfileiramento ou envio não revertem a operação de origem.

Os avisos de agendamento (criação, atualização, cancelamento e exclusão), o link
de acesso do professor e a recuperação de senha também usam esse motor e a fila.
Os agendamentos guardam os destinatários e o conteúdo do aviso, sem depender de
consultar o registro durante o envio. Pedidos diferentes de acesso ou mudanças
no agendamento geram avisos próprios; as tentativas do mesmo aviso reutilizam o
registro central. Validade, uso único e limitação de pedidos dos links continuam
sob as regras de autenticação.

Esses fluxos e o teste de Configurações usam `emails.notifications.alert` e sua
versão de texto, baseados no `alert.html` do Ubold: cabeçalho grafite, card branco
e botão de ação opcional no roxo institucional `#322b75`. Sessões mantêm seus
detalhes e os e-mails de autenticação incluem o endereço alternativo do botão.
As classes e views específicas substituídas foram removidas. O histórico antigo
em `sent_emails` não recebe novas gravações nem é usado como confirmação de envio.

O teste de Configurações usa `SendEmailNowAction`: registra por
`RegisterEmailAction` e executa o mesmo `SendEmailAction` da fila, de forma
síncrona, para preservar o diagnóstico imediato, o modo de log e os erros de SMTP.
Os demais consumidores usam `QueueEmailAction`, que compartilha esse registro.

### Parâmetros de envio automático e conexão da fila

Em **Configurações → E-mails automáticos** (`/configuracoes/emails-automaticos`),
quem possui `setting.update` escolhe os eventos que geram avisos para todas as
próximas operações. A leitura exige `setting.view`. Os valores ficam na categoria
`automatic_emails` da tabela `settings`, sem nova migration. Criação, atualização,
cancelamento e exclusão de agendamentos começam desativados; confirmações de
empréstimo/devolução e inscrição/disponibilidade na fila de espera mantêm o padrão
ativado. Os campos `send_notification` foram removidos dos contratos de agendamentos.

`EmailQueueHandler` consulta o parâmetro depois do commit, antes de registrar a
mensagem. Eventos desativados não criam entrega. A configuração vale no momento
da preparação; mudanças não cancelam jobs existentes nem geram avisos retroativos.
Recuperação de senha, acesso do professor, mensagens manuais e o teste de envio
não dependem desses parâmetros. As restrições de destinatários e de datas dos
módulos continuam valendo.

`SendEmailDelivery` usa `queue.email_connection`, definido por
`MAIL_QUEUE_CONNECTION=database` por padrão, independentemente de `QUEUE_CONNECTION`.
São aceitos os drivers persistentes `database`, `redis`, `beanstalkd` e `sqs`.
Conexões síncronas, descartáveis ou com fallback para execução local são rejeitadas;
a falha é rastreada sem executar SMTP na requisição e sem reverter a operação.
Os Compose de desenvolvimento e produção já possuem o serviço `queue`; seu
entrypoint consome essa mesma conexão. Em instalações fora do Compose, use
`php artisan queue:work database --sleep=3 --tries=3` ou substitua `database` pela
conexão configurada em `MAIL_QUEUE_CONNECTION`. Após publicar, atualize o cache
de configuração em uso e reinicie o worker. O teste de envio das Configurações
continua síncrono para apresentar o diagnóstico imediato.

Aplique a migration `2026_11_10_000007_create_email_deliveries_table.php` e mantenha
o worker da fila atualizado após publicar mudanças no código. Não é necessário
adicionar colunas de e-mail em cada tabela de negócio. Os estados, tentativas,
última tentativa, identificação da mensagem e aceite pelo serviço ficam no
registro central. SMTP aceito não significa mensagem lida ou entregue na caixa
de entrada; o modo de registro em log não é classificado como envio real.

O resultado do transporte também é guardado temporariamente em
`storage/app/private/email-delivery-receipts`, sem destinatário nem conteúdo.
Se a atualização final no banco falhar, a tarefa agendada
`email-deliveries:recover-results` recupera o resultado a cada minuto, sem reenviar
a mensagem. Mantenha o agendador Laravel ativo e esse diretório persistente;
em instalações com vários servidores, o worker e o agendador precisam acessar
o mesmo volume. O comprovante é removido depois da gravação no banco.
Processamentos interrompidos por mais de cinco minutos sem comprovante recebem
o estado `unconfirmed`, sem reenvio automático nem consulta periódica permanente.

Envios anteriores sem rastreamento continuam sem registro; o sistema não presume
que foram enviados nem os reenvia automaticamente. A ausência da estrutura de
rastreamento é registrada nos logs e impede um novo envio sem registro.

Os indicadores das listagens reutilizam `UI/EmailDeliveryIndicator` e o hook
`useEmailDeliveryPolling`. Empréstimos e fila de espera usam uma primeira coluna
sem título visual, preservando o nome acessível, com os metadados fornecidos pelo
`EmailDeliveryPresenter` comum. A consulta periódica funciona apenas enquanto as
linhas exibidas têm confirmações pendentes e recarrega somente a coleção da tela.
A atualização usa o transporte comum `useTableListVisit`, preserva filtros e
paginação e é suspensa enquanto a aba está oculta ou uma visita do usuário está
em andamento. Uma nova visita cancela a consulta em segundo plano.

## Inbox

O módulo em `/emails` reúne os registros reais de `email_deliveries`, com a
composição do Inbox do Ubold: pastas, listagem, leitura em conversa e composição
de mensagens. O menu fica em **Sistema → Inbox**. As rotas de consulta exigem `auth` e
`can:email.view`; administradores têm acesso pelo mecanismo existente de Gates.
Para delegar a consulta a um cargo, sincronize as permissões e conceda
**Visualizar Central de E-mails** no cadastro de cargos:

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml exec app php artisan permissions:sync
```

Em produção, use `.env.prod` e `docker-compose.prod.yml`. A tabela
`email_deliveries` já é criada com índices para consultas por data, status e origem.

O módulo permite pesquisar assunto e filtrar origem, status e período de
registro, com contagens por status e paginação. O destinatário é descriptografado
somente nos registros exibidos; a busca por assunto não consulta os campos
criptografados do destinatário. As listagens não carregam o payload da mensagem.
A visualização retorna somente os campos de conteúdo necessários à leitura,
sem URLs de autenticação, tokens, payload bruto ou detalhes técnicos de exceções.
Os registros pendentes são atualizados pelo transporte compartilhado de listagens;
a Inbox também consulta novas respostas periodicamente. Cada mensagem ocupa uma
linha e a leitura reúne seu fio, posicionando a página na mensagem selecionada.
Com `email.send`, o módulo permite escrever, salvar rascunhos, responder e
encaminhar, com destinatários, cópias, cópias ocultas e anexos privados.
A organização inclui favoritos, leitura, marcadores e pastas, com a integração
opcional ao Gmail descrita acima. Não há exclusão definitiva nem reenvio automático
de mensagens sem confirmação. O artigo da Central de Ajuda fica em
`resources/help/central-de-emails.md`.

As Actions coordenam as operações; Data e Rules validam as entradas, Policies
verificam o acesso e Handlers tratam os anexos. Operações da caixa usam enum,
resultados usam DTO e Presenters preparam conteúdo e mensagens para a interface.
Os adaptadores IMAP e o armazenamento privado ficam em Infrastructure.
