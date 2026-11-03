---
titulo: Configurações
resumo: Como configurar o envio de e-mails do Gnai, testar a conta de envio definir os horários e a retenção dos backups automáticos e configurar os domínios aceitos no acesso de professores e personalizar o cabeçalho dos PDFs.
categoria: Sistema
palavras-chave: configurações, configuracoes, ajustes, preferências do sistema, e-mail, email, smtp, servidor de e-mail, porta, 587, 465, starttls, ssl, tls, gmail, chave de app, chave de aplicativo, outlook, hotmail, microsoft 365, yahoo, zoho, hostinger, locaweb, remetente, e-mail de envio, testar e-mail, e-mail de teste, e-mails não chegam, recuperação de senha, backup automático, horário do backup, retenção, quantos backups manter, apagar backups antigos, tutorial, tour
ordem: 10
permissoes: setting.view
---

Em **Sistema → Configurações** ficam os ajustes gerais da instalação do Gnai, organizados em abas: **E-mail**, **Backups**, **Acesso dos professores** e **PDFs**. Quem só tem permissão de consulta vê os valores atuais, mas não pode alterá-los.

## Conhecer as configurações com o tutorial

As abas **E-mail**, **Backups**, **Acesso dos professores** e **PDFs** têm um tutorial na própria tela. Clique no botão com o ícone de informação, na barra do topo, para abrir. Ele mostra as abas de configuração, cada seção do formulário da aba aberta e os botões do rodapé. Veja como navegar pelo tutorial em [Conhecer a tela com o tutorial](/ajuda/primeiros-passos#conhecer-a-tela-com-o-tutorial).

## Para que serve a configuração de e-mail?

A conta configurada em **E-mail** é usada em todos os e-mails que o Gnai envia, como o link de redefinição de senha, o link de acesso dos professores e os avisos de agendamentos enviados aos alunos e ao profissional. Enquanto nada for salvo nesta tela, o sistema usa a configuração definida na instalação do servidor.

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

## Enviar um e-mail de teste

1. Salve a configuração antes de testar. O teste fica bloqueado enquanto houver alterações não salvas.
2. Em **Enviar e-mail de teste**, informe o **E-mail de destino**.
3. Clique em **Enviar teste**.

Se der certo, o sistema mostra "E-mail de teste enviado para ... Confira a caixa de entrada e a pasta de spam.". Com **Registro em log (sem envio real)**, a mensagem é apenas registrada e nenhum e-mail chega.

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
