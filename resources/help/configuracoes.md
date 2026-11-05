---
titulo: Configurações
resumo: Como configurar o envio e os avisos automáticos por e-mail, backups, acesso de professores, PDFs e os prazos das sessões.
categoria: Sistema
palavras-chave: configurações, configuracoes, ajustes, preferências do sistema, e-mail, email, smtp, servidor de e-mail, porta, 587, 465, starttls, ssl, tls, gmail, chave de app, chave de aplicativo, outlook, hotmail, microsoft 365, yahoo, zoho, hostinger, locaweb, remetente, e-mail de envio, testar e-mail, e-mail de teste, e-mails não chegam, recuperação de senha, backup automático, horário do backup, retenção, quantos backups manter, apagar backups antigos, tutorial, tour, segurança, sessões, inatividade, bloqueio, lock screen, logout automático
ordem: 10
permissoes: setting.view
---

Em **Sistema → Configurações** ficam os ajustes gerais da instalação do Gnai, organizados em abas: **E-mail**, **E-mails automáticos**, **Backups**, **Acesso dos professores**, **PDFs** e **Segurança e sessões**. Quem só tem permissão de consulta vê os valores atuais, mas não pode alterá-los.

## Conhecer as configurações com o tutorial

As abas **E-mail**, **E-mails automáticos**, **Backups**, **Acesso dos professores**, **PDFs** e **Segurança e sessões** têm um tutorial na própria tela. Clique no botão com o ícone de informação, na barra do topo, para abrir. Ele mostra as abas de configuração, cada seção do formulário da aba aberta e os botões do rodapé. Veja como navegar pelo tutorial em [Conhecer a tela com o tutorial](/ajuda/primeiros-passos#conhecer-a-tela-com-o-tutorial).

## Para que serve a configuração de e-mail?

A conta configurada em **E-mail** é usada em todos os e-mails que o Gnai envia, como o link de redefinição de senha, o link de acesso dos professores e os avisos de agendamentos enviados aos alunos e ao profissional. Enquanto nada for salvo nesta tela, o sistema usa a configuração definida na instalação do servidor.

## Escolher os e-mails automáticos

1. Abra **Sistema → Configurações → E-mails automáticos**.
2. Ative ou desative cada evento:
   - **Agendamentos**: criação, atualização, cancelamento e exclusão;
   - **Empréstimos**: confirmação de empréstimo e confirmação de devolução;
   - **Fila de espera**: inscrição e disponibilidade de item.
3. Clique em **Salvar**. O sistema mostra "Configurações de e-mails automáticos salvas com sucesso.".

A escolha vale para todas as próximas operações daquele evento. Não há mais
escolha individual de e-mail ao salvar, cancelar ou excluir um agendamento.
O cadastro de agendamentos com data passada continua sem aviso de criação.
A confirmação de devolução continua sendo enviada somente para alunos.

Na primeira configuração, os avisos de agendamentos começam desativados. Os
avisos de empréstimos e fila de espera começam ativados, mantendo o padrão
anterior. Desativar um evento não cancela mensagens já preparadas nem remove
seu histórico. Ativar um evento não envia avisos de operações antigas.

Os avisos são enviados em segundo plano, com até três tentativas. Uma falha no
envio, uma configuração incompleta ou a ausência de endereço válido não impede
salvar o agendamento, o empréstimo ou a solicitação. Consulte a situação e as
falhas na [Inbox](/ajuda/central-de-emails). Um evento desativado não cria
registro de envio.

As opções não desativam a recuperação de senha, os links de acesso dos
professores, as mensagens escritas na Inbox ou o teste de envio. A conta de
envio continua sendo definida na aba **E-mail**.

## Configurar o envio de e-mails

1. Acesse **Sistema → Configurações** e abra a aba **E-mail**.
2. Em **Servidor de envio**, escolha o **Tipo de envio**:
   - **SMTP**: envia as mensagens de verdade, usando uma conta de e-mail;
   - **Registro em log (sem envio real)**: apenas registra as mensagens, para testes.
3. Com SMTP, preencha:

| Campo | Observação |
| --- | --- |
| **Servidor SMTP** | Escolha o provedor (Gmail / Google Workspace, Outlook.com / Hotmail, Microsoft 365, Yahoo Mail, Zoho Mail, Hostinger ou Locaweb) para preencher servidor, porta e segurança automaticamente. Para outro serviço, escolha **Outro servidor** e informe o **Endereço do servidor SMTP**. Obrigatório no SMTP. |
| **Porta** | 587 (STARTTLS), 465 (SSL/TLS), 25 ou 2525. Em **Outra porta**, informe o **Número da porta** (de 1 a 65535). Obrigatória no SMTP. |
| **Segurança da conexão** | **STARTTLS** (geralmente porta 587), **SSL/TLS** (geralmente porta 465) ou **Sem criptografia**. Obrigatório. |
| **Usuário de autenticação** | Conta usada pelo Gnai para entrar no servidor SMTP. Normalmente, é o endereço completo da caixa de e-mail. Obrigatório no SMTP. |
| **Chave de aplicativo** | Chave criada nas configurações de segurança da conta. É obrigatória no primeiro cadastro, fica armazenada de forma criptografada e nunca é exibida novamente. Depois de salva, deixe o campo em branco para manter a chave atual. |

4. Em **Remetente**, preencha:
   - **E-mail de envio** (obrigatório): endereço que as pessoas verão como remetente. Pode ser diferente do usuário de autenticação somente quando o provedor permitir o uso desse endereço ou alias;
   - **Nome do remetente** (obrigatório): por exemplo, o nome do núcleo ou da instituição.
5. Clique em **Salvar**. O sistema mostra "Configurações de e-mail salvas com sucesso. Os próximos envios usarão estes dados.".

> **Importante:** no Gmail e no Yahoo, use uma chave de app criada nas configurações de segurança da conta (no Gmail, ela exige a verificação em duas etapas ativa). No Microsoft 365, o administrador da conta precisa autorizar o envio por aplicativos.

No início da tela, o quadro identifica a conta, o remetente e se a chave de aplicativo está cadastrada, sem mostrar a chave. A situação aparece como **Envio ainda não verificado**, **Envio confirmado no último teste** ou **Falha no último teste**, com a data e a hora da tentativa. O resultado corresponde ao último teste realizado.

## Monitorar rejeições do Gmail

Esta configuração vale para toda a instalação do Gnai e pode ser alterada por
quem tem permissão para editar as configurações. Cada instituição usa a sua
própria conta de envio.

1. Em **Sistema → Configurações → E-mail**, escolha **SMTP** e o servidor
   **Gmail / Google Workspace**. Preencha a conta completa em **Usuário de
   autenticação** e sua **Chave de aplicativo**. A conta precisa permitir leitura
   por IMAP com essa chave. No Google Workspace, confira a autorização com o
   administrador da conta.
2. Na seção **Rejeições do Gmail**, marque **Monitorar rejeições do Gmail**.
3. Em **Pasta dos avisos de rejeição**, mantenha **INBOX** para ler a caixa de
   entrada. Se um filtro move os avisos para outra pasta, informe essa pasta.
4. Clique em **Salvar**. Para interromper a leitura, desmarque a opção e salve.

O monitoramento usa a mesma conta e chave de aplicativo do envio, sem exigir
outra senha. O Gnai consulta os avisos a cada cinco minutos, sem apagá-los ou
marcá-los como lidos. Quando identifica uma rejeição definitiva associada ao
envio original, o status muda para **E-mail não entregue**. Confira os resultados
na [Inbox](/ajuda/central-de-emails), usando **Atualizar**.

Salvar a opção não verifica a conexão com a caixa do Gmail. O teste abaixo
verifica o envio, não a leitura das rejeições. O responsável pela instalação
precisa manter o agendador do sistema ativo e a extensão PHP IMAP disponível;
se essa extensão faltar, a tela avisa e impede a ativação. Contas que exigem
exclusivamente OAuth não são atendidas por este monitoramento.

## Receber respostas do Gmail na Inbox

Na seção **Respostas do Gmail**, marque **Importar respostas do Gmail** e informe
**Pasta das respostas recebidas**. O padrão **INBOX** corresponde à caixa de
entrada. Salve para ativar. A leitura usa a mesma conta Gmail e chave de
aplicativo do envio, com acesso IMAP, sem exigir outra senha.

O sistema consulta a cada minuto e importa as respostas vinculadas aos e-mails
enviados pelo Gnai, dos últimos 30 dias. As mensagens ficam disponíveis aos
usuários com permissão de consulta da Inbox. Outras mensagens da conta não são
importadas. A leitura não altera pastas nem estado de leitura no Gmail.

Para consultar agora, abra **Sistema → Inbox** e clique em **Buscar respostas**.
Confira [o recebimento e seus limites](/ajuda/central-de-emails#receber-as-respostas-dos-alunos).
**Monitorar rejeições do Gmail** continua independente: uma opção acompanha
falhas de entrega; a outra importa respostas. Salvar ou enviar um teste SMTP não
verifica a leitura IMAP.

## Sincronizar pastas com o Gmail

Na seção **Pastas do Gmail**, marque **Sincronizar pastas com o Gmail** e salve.
A integração usa a conta Gmail e a chave de aplicativo já configuradas para envio.
O servidor precisa de PHP cURL com suporte a IMAPS. As pastas especiais são
identificadas automaticamente, sem precisar informar seus nomes ou idioma.

Com a opção ativa, **Arquivar**, **Mover para spam**, **Mover para a lixeira** e
**Restaurar** também alteram o Gmail. As pastas das mensagens vinculadas passam
a ser compartilhadas por todos os usuários da instalação. Essas ações exigem a
permissão de envio de e-mails; estrelas, leitura e marcadores continuam pessoais.
Mensagens ainda não enviadas e rascunhos mantêm a organização local.

Mudanças feitas diretamente no Gmail são consultadas a cada minuto, em lotes.
Na Inbox, **Sincronizar pastas** consulta um lote agora. Uma falha não é mostrada
como sincronização concluída. O Gnai mantém o histórico quando a mensagem não é
mais encontrada na conta. Veja [como organizar as mensagens](/ajuda/central-de-emails#organizar-as-mensagens).

Essa opção é independente de **Importar respostas do Gmail** e **Monitorar
rejeições do Gmail**. Desativá-la interrompe a sincronização e volta à organização
pessoal no Gnai, sem desfazer operações já confirmadas no Gmail. Ativar a opção
consulta a situação atual da conta; não reaplica movimentos pessoais antigos.

## Enviar um e-mail de teste

1. Salve a configuração antes de testar. O teste fica bloqueado enquanto houver alterações não salvas.
2. Em **Enviar e-mail de teste**, informe o **E-mail de destino**.
3. Clique em **Enviar teste**.

Se der certo, o sistema mostra "E-mail de teste enviado para ... Confira a caixa de entrada e a pasta de spam.". Com **Registro em log (sem envio real)**, a mensagem é apenas registrada e nenhum e-mail chega.

O teste usa o mesmo serviço dos demais e-mails, mas aguarda o resultado para
mostrar o diagnóstico na tela. A mensagem tem cabeçalho grafite e card branco,
no mesmo padrão dos avisos de agendamentos e de acesso ao sistema.

## Definir os horários e a retenção dos backups automáticos

1. Acesse **Sistema → Configurações** e abra a aba **Backups**.
2. Em **Backup automático**, informe de 1 a 6 horários diários (**Horário 1**, **Horário 2**...). Use **Adicionar horário** para incluir outro e o botão ao lado do campo para removê-lo. Os horários seguem o fuso indicado na dica da seção e não podem se repetir.
3. Em **Retenção**, escolha **Como manter os backups**:
   - **Manter os backups mais recentes (quantidade)**: informe a **Quantidade de backups mantidos**;
   - **Manter backups por um período (dias)**: informe os **Dias de retenção**. A cópia mais recente é sempre mantida.
4. O valor vai de 1 a 365.
5. Clique em **Salvar**. O sistema mostra "Configurações de backup salvas com sucesso.".

Sem configuração salva, o Gnai faz um backup por dia às 12:05 e mantém os 30 mais recentes. Os backups que ultrapassam a retenção são apagados automaticamente, com os arquivos. Veja [Backups](/ajuda/backups).

## Dúvidas comuns

- **"E-mail de teste não enviado: o servidor recusou o usuário ou a chave de aplicativo..."**: confira o usuário e gere uma nova chave de app.
- **"E-mail de teste não enviado: não foi possível conectar ao servidor SMTP..."**: confira o servidor e a porta.
- **"E-mail de teste não enviado: falha na conexão segura..."**: combine a segurança com a porta (587 com STARTTLS ou 465 com SSL/TLS).
- **"E-mail de teste não enviado: o servidor recusou o remetente ou o destinatário..."**: confira o **E-mail de envio**; muitos provedores só aceitam o endereço da própria conta.
- **"Informe o servidor SMTP."** ou **"Informe a porta do servidor SMTP."**: esses campos são obrigatórios quando o tipo de envio é SMTP.
- **"Este horário está repetido."**: cada horário de backup deve ser diferente.
- **Não consigo alterar os campos**: sua permissão permite apenas consultar as configurações.

## Configurar os domínios de e-mail dos professores

1. Acesse **Sistema → Configurações → Acesso dos professores**.
2. Use **Domínio** para adicionar os domínios aceitos, um por linha. Informe somente o domínio, por exemplo `escola.edu.br` ou `educacao.municipio.gov.br`. O arroba inicial é opcional; letras maiúsculas são convertidas para minúsculas.
3. Clique em **Salvar**.

Com a lista vazia, qualquer domínio é aceito, desde que o e-mail esteja cadastrado como professor. Para liberar todos os domínios, remova todas as linhas e salve. Uma linha adicionada precisa ser preenchida ou removida.

A restrição vale para novos pedidos de link de acesso do professor, sem alterar o login com senha ou a recuperação de senha. A tela de acesso mostra os domínios configurados abaixo do campo de e-mail. Cada domínio é comparado por inteiro: `escola.edu.br` não inclui `campus.escola.edu.br`; cadastre cada um separadamente. Não são aceitos curingas como `*.edu.br`.

## Personalizar o cabeçalho dos PDFs

1. Acesse **Sistema → Configurações → PDFs**.
2. Em **Identificação**, selecione o **Logotipo da instituição**, escolha o **Formato do logotipo** (quadrada, cantos arredondados ou redonda) e preencha **Nome da instituição** (obrigatório).
3. Se desejar, preencha **Núcleo ou setor emissor** e **Texto complementar**, com endereço, CNPJ, telefone ou outras informações. Em todos esses campos, pressione Enter para quebrar a linha no PDF.
4. Confira a **Prévia do cabeçalho** e clique em **Salvar**.

O logotipo deve estar em JPG ou PNG, com até 4 MB e até 4000 pixels de largura e altura. Os formatos redondo e com cantos arredondados ficam melhores com imagens quadradas. **Remover** deixa o cabeçalho sem logotipo após salvar; selecionar outra imagem substitui a anterior.

O modelo coloca o logotipo à esquerda, os textos da instituição ao lado e, separado por uma linha vertical, o título específico de cada documento. Vale para os próximos PDFs de alunos, solicitações de atendimento, PEIs, atendimentos, publicações, itens, empréstimos, barreiras, fila de espera e relatórios. Arquivos já baixados permanecem como foram emitidos.

Enquanto a configuração não for salva, os documentos usam o logotipo redondo do Gnai e o nome do sistema. A prévia representa o cabeçalho; a paginação final varia conforme o documento e a quantidade de texto informada.

## Configurar o bloqueio e o encerramento das sessões

1. Acesse **Sistema → Configurações → Segurança e sessões**.
2. Em **Inatividade da sessão**, preencha os dois campos obrigatórios:

| Campo | Regra |
| --- | --- |
| **Bloquear tela após (minutos)** | Número inteiro, de pelo menos 1 minuto. Vale para contas com senha própria. |
| **Encerrar sessão após (minutos)** | Número inteiro, de pelo menos 2 minutos e maior que o prazo de bloqueio. Vale para todas as contas. |

3. Clique em **Salvar**. Aparece **Configurações de segurança e sessões salvas com sucesso.**.

Use os ícones de informação ao lado do título da seção e dos nomes dos campos
para consultar as orientações sobre os prazos.

Ambos os prazos contam desde a última atividade. Por exemplo, com bloqueio em
15 minutos e encerramento em 60 minutos, a pessoa terá mais 45 minutos na tela
bloqueada antes de precisar entrar novamente. Consultas automáticas e interações
na tela bloqueada não reiniciam essa contagem.

As mudanças alcançam as sessões já abertas na próxima verificação. Reduzir os
prazos pode bloquear ou encerrar sessões que já estavam inativas. Aumentar um prazo
não desbloqueia uma sessão que já foi bloqueada e não reabre uma sessão encerrada.

Professores sem senha própria não passam pela tela de senha; depois do
encerramento, precisam solicitar outro link de acesso. Veja
[Bloquear a tela ao se afastar](/ajuda/acesso-ao-sistema#bloquear-a-tela-ao-se-afastar).

Se aparecer **O prazo de encerramento deve ser maior que o de bloqueio.**, aumente
o prazo de encerramento ou diminua o prazo de bloqueio e salve novamente.
