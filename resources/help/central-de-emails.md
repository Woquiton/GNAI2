---
titulo: Inbox: e-mails do Gnai
resumo: Como escrever mensagens, receber respostas dos alunos e organizar os e-mails do Gnai.
categoria: Sistema
palavras-chave: inbox, e-mail, email, central de e-mails, caixa de saída, escrever, compose, destinatário, enviado, rascunho, estrela, favorito, marcador, lixeira, arquivo, spam, resposta, encaminhar, anexo, falha
ordem: 15
permissoes: email.view
---

A **Inbox**, no grupo **Sistema**, reúne os e-mails registrados pelo Gnai e as
respostas recebidas, quando a importação está ativa. Ela permite escrever novas
mensagens pela conta de envio da instituição. A consulta exige
permissão de visualização de e-mails; escrever, salvar rascunhos e enviar exigem
também a permissão de envio.

## Escolher quais avisos são enviados automaticamente

Os avisos de agendamentos, empréstimos e fila de espera seguem as opções de
[Configurações → E-mails automáticos](/ajuda/configuracoes#escolher-os-e-mails-automaticos).
Quando um evento está desativado, a operação é salva sem preparar mensagem e
sem criar registro na Inbox. Quando está ativado, o envio ocorre em segundo
plano e suas tentativas e falhas ficam no histórico. Uma falha não desfaz a
operação de origem. Mensagens escritas na Inbox e links de acesso não dependem
dessas opções.

## Consultar os e-mails

1. Abra **Sistema → Inbox**.
2. Escolha uma pasta na lateral: **Principal**, **Caixa de entrada**, **Com estrela**, **Rascunhos**,
   **Caixa de saída**, **Enviados**, **Arquivo**, **Spam** ou **Lixeira**.
3. Pesquise pelo **Assunto** e selecione a **Origem**. Em **Mais filtros**, use o
   **Status** e o período de registro.
4. Clique no correspondente ou no assunto para abrir a conversa. Um rascunho abre
   o editor quando você tem permissão de envio.

As linhas mostram seleção, estrela, indicador de envio, destinatário, assunto,
prévia, presença de anexos e data. O seletor de colunas oferece também o status,
a origem, a finalidade, as tentativas e a data de envio. A paginação, quantidade
por página e escolhas de colunas continuam disponíveis.

**Atualizar** consulta os registros novamente. Resultados pendentes exibidos são
atualizados automaticamente a cada cinco segundos, enquanto a aba está visível.
As contagens das pastas representam sua caixa; os filtros restringem a listagem.
**Enviados** reúne mensagens aceitas pelo servidor, inclusive as rejeitadas
posteriormente. **Caixa de saída** reúne as pendentes, com falha ou sem confirmação
de envio. **Principal** reúne as mensagens e seus rascunhos fora de arquivo, spam
e lixeira.

## Receber as respostas dos alunos

1. Em **Sistema → Configurações → E-mail**, ative **Importar respostas do Gmail**.
2. Em **Pasta das respostas recebidas**, mantenha **INBOX**, ou informe a pasta
   para a qual os filtros do Gmail movem essas respostas. Salve as configurações.
3. Na Inbox, clique em **Buscar respostas** para consultar agora, ou aguarde a
   consulta automática, que ocorre a cada minuto.
4. Abra **Caixa de entrada**. Uma resposta importada mostra **Resposta recebida**,
   o remetente e um link **Em resposta a** para a mensagem anterior.

O Gnai associa pelo identificador da mensagem original, não somente pelo assunto.
Na primeira consulta, considera respostas dos últimos 30 dias, em lotes de até
50 candidatos. Consultas seguintes continuam de onde pararam, sem duplicar
mensagens. Mensagens sem vínculo com um envio registrado no Gnai não são importadas.
Respostas diretas a avisos de autenticação também ficam fora da importação para preservar
os links pessoais de acesso omitidos pelo histórico.

A consulta não move, apaga nem marca mensagens como lidas no Gmail. Imagens
remotas não são carregadas. Até cinco anexos de até 5 MB são importados; conteúdo
que ultrapasse os limites permanece no Gmail e a leitura mostra um aviso. Os
usuários com permissão de consulta da Inbox podem ler as respostas importadas.

Com o recebimento ativo, a listagem consulta os registros locais a cada 30
segundos. **Atualizar** consulta esses registros; **Buscar respostas** faz uma
nova consulta ao Gmail. A pasta escolhida precisa conter as respostas: mensagens
movidas para outra pasta, spam ou lixeira no Gmail não são lidas nessa consulta.

## Escrever e enviar

1. Clique em **Escrever**.
2. Confira o remetente. Ele usa a conta cadastrada em **Configurações → E-mail**.
3. Em **Para**, digite o endereço e use **+ E-mail** para acrescentar outro
   destinatário. Cada endereço fica em uma linha, com botão de remoção, no mesmo
   padrão dos participantes de publicações. Você também pode colar vários endereços
   separados por vírgula, ponto e vírgula ou quebra de linha. Use **Cc** para cópias
   e **Cco** para cópias ocultas, com o mesmo funcionamento. Cada campo aceita até
   50 endereços; o provedor também pode impor limites ao envio.
4. Preencha **Assunto** e **Mensagem**. O editor permite formatação, listas,
   links e tabelas.
5. Se necessário, anexe até cinco arquivos de até 5 MB cada.
6. Clique em **Enviar** e consulte o resultado na tela da mensagem.

Cco não aparece nos cabeçalhos entregues aos outros destinatários. Na consulta
do Gnai, a lista de Cco fica disponível somente ao autor da mensagem.

Enviar inicia o processamento; o aceite pelo servidor não confirma a entrega.
Se houver falha de validação ou conexão, o formulário preserva o texto para
correção. O mesmo formulário não cria outro envio após duplo clique ou repetição
da requisição. Para enviar novamente de propósito, escreva uma nova mensagem.

## Salvar um rascunho

Clique em **Salvar rascunho** para guardar o texto e os anexos sem enviar. Para
retomar, abra **Rascunhos** e clique na mensagem. Os rascunhos são privados ao
autor. É possível salvá-los sem destinatário, assunto ou texto; endereços
preenchidos precisam ser válidos.

Para remover um anexo existente, use **Remover anexo** e salve. **Cancelar** pede
confirmação antes de sair sem salvar as últimas alterações. Um rascunho já salvo
continua preservado. Não há salvamento automático durante a digitação.

## Organizar as mensagens

- Use a **estrela** da linha para adicionar ou remover favoritos.
- Selecione uma ou mais mensagens, ou use **Selecionar todas** para selecionar a
  página atual. A seleção não abrange outras páginas.
- Use **Arquivar**, **Mover para spam**, **Mover para a lixeira** ou o menu
  **Mover para pasta**.
- Em **Aplicar marcador**, escolha uma etiqueta ativa do módulo **Inbox** ou
  remova o marcador atual. A cor ao lado do nome é a definida no cadastro de etiquetas.
- Em **Mais**, altere a leitura e os favoritos. Marcar como lida ou não lida é
  uma organização da sua caixa, não uma confirmação de leitura do destinatário.

Com **Sincronizar pastas com o Gmail** ativo em **Configurações → E-mail**,
**Arquivar**, **Mover para spam**, **Mover para a lixeira** e **Restaurar** também
alteram a conta Gmail da instituição. As pastas das mensagens vinculadas ficam
compartilhadas entre os usuários desta instalação. Essas ações exigem a permissão
de envio de e-mails. Estrelas, marcadores e estado de leitura continuam individuais.

Os marcadores vêm de **Gestão do núcleo → Cadastros → Etiquetas**, com **Módulo**
igual a **Inbox**. **Importante**, **Trabalho** e **Pessoal** já vêm cadastradas.
Quem possui permissão de cadastro pode criar outras, escolher a cor na paleta,
editar seus nomes ou desativá-las. Etiquetas do módulo Publicações não aparecem
nessa lista. Uma etiqueta inativa já aplicada continua visível e pode ser removida,
mas fica fora das novas aplicações. Veja [como manter as etiquetas](/ajuda/cadastros-do-radar#etiquetas).

O Gnai só mostra uma mudança de pasta como sincronizada depois da confirmação do
Gmail. Uma mensagem não encontrada na conta ou uma falha de conexão produz um erro,
sem marcar a alteração como concluída. Em lotes, o retorno informa quantas mensagens
foram sincronizadas, quantas foram alteradas somente no Gnai e quantas falharam.
Se houver resultado parcial, selecione as mensagens restantes para continuar.

Mensagens ainda não enviadas, inclusive rascunhos, ficam somente no Gnai. A
sincronização não cancela a fila de envio. Com a opção desativada, as pastas voltam
a usar a organização pessoal local. As posições pessoais anteriores são preservadas;
ativar a opção não envia automaticamente essas posições antigas para o Gmail.

O sistema consulta também as mudanças feitas diretamente no Gmail, a cada minuto,
em lotes de até 20 registros. Clique em **Sincronizar pastas** para consultar um lote
agora; **Atualizar** recarrega os registros já consultados. O histórico inteiro pode
exigir vários lotes. A consulta não importa outras mensagens pessoais da conta.

No Gmail, arquivar remove a mensagem da caixa de entrada e preserva as demais
classificações. Mensagens enviadas continuam classificadas como enviadas no Gmail,
mesmo quando arquivadas no Gnai. Restaurar uma resposta recebida devolve-a à caixa de entrada;
restaurar um envio retira-o de Spam ou Lixeira, preservando seu histórico de enviado.

A lixeira pede confirmação e preserva o histórico no Gnai. Com a sincronização
ativa, a confirmação informa que a ação também afeta a conta Gmail compartilhada.
O Gmail aplica suas próprias regras de retenção à lixeira. Para desfazer, abra
**Lixeira**, selecione as mensagens e use **Restaurar**. Mover uma mensagem para
arquivo, spam ou lixeira não cancela um envio já iniciado e não a exclui da caixa
dos destinatários. Não há exclusão definitiva do histórico nessa tela.

## Consultar um envio

Abra o assunto para ver o fio da conversa. A listagem mantém uma linha para cada
mensagem, e a visualização reúne o envio original e as respostas vinculadas,
da mais antiga para a mais recente. A mensagem aberta pela listagem aparece
como **Mensagem selecionada**, e a página rola automaticamente até ela ao abrir.
Rascunhos ficam fora do fio até o envio.

Cada mensagem preserva seu remetente, destinatários, texto, anexos e resultado.
As pastas, a leitura das mensagens e o quadro de resposta ficam em um painel
contínuo, com divisórias entre as partes da conversa.
Clique no nome de um anexo para baixá-lo. Clique em **Detalhes e resultado do envio**
para abrir ou recolher o painel de informações e
consulte origem, finalidade, tentativas, datas e código de rejeição, quando existir.
Nas mensagens recebidas, o painel se chama **Detalhes da resposta recebida**.
Pastas e marcadores são aplicados à mensagem selecionada, sem alterar
as demais mensagens da conversa no Gnai. O fio usa o vínculo das respostas; mensagens com
o mesmo assunto não são reunidas somente por esse motivo.

Mensagens anteriores a este recurso podem não ter o remetente registrado.
Os links de acesso e redefinição de senha continuam omitidos por serem restritos
aos destinatários. Eles também são omitidos ao encaminhar esses avisos.

## Responder e encaminhar

Ao abrir uma conversa, o quadro de resposta usa a mensagem mais recente e indica
seu número. Confira o campo **Para**: em uma mensagem enviada, a resposta vai aos
destinatários; em uma mensagem recebida, vai ao remetente ou ao endereço de resposta
informado no e-mail. Use **Responder a esta mensagem**, junto de uma mensagem
anterior, para responder especificamente a ela no editor completo.

Use **Editor completo** para alterar endereços ou anexar arquivos. A resposta pode
ser salva como rascunho e entra no mesmo fio quando enviada. As mensagens consultadas
podem ser atualizadas recarregando a página; o texto em edição não é substituído
por uma nova resposta recebida.

**Encaminhar**, junto de cada mensagem, abre o editor com o assunto e o conteúdo
consultável somente daquela mensagem.
Informe os novos destinatários e confira o conteúdo antes de enviar. Os anexos
da mensagem são copiados para o encaminhamento e podem ser removidos antes de
salvar, sem alterar os arquivos da mensagem original.

## Entender os status

| Status | Significado |
| --- | --- |
| **Rascunho** | Guardado sem envio. |
| **Resposta recebida** | Resposta importada do Gmail e vinculada a um e-mail do Gnai. |
| **E-mail na fila** | Aguarda processamento ou uma nova tentativa. |
| **Enviando e-mail** | O serviço está processando a mensagem. |
| **Aceito pelo servidor de envio** | O serviço aceitou a mensagem, sem confirmar entrega ou leitura. |
| **E-mail não entregue** | Foi processada uma rejeição definitiva do Gmail para pelo menos um destinatário. Não há reenvio automático. |
| **Falha no envio do e-mail** | As tentativas se esgotaram ou houve falha ao colocar o envio na fila. |
| **Beneficiário sem e-mail válido** | O destinatário não tinha um endereço válido no registro. |
| **E-mail não enviado** | O envio real estava desativado ou a mensagem foi interrompida. |
| **Resultado do envio não confirmado** | O processamento foi interrompido sem confirmação; não há reenvio automático para evitar duplicidade. |

O código **5.1.1**, por exemplo, indica endereço inexistente. Uma mensagem com
vários destinatários pode ter sido entregue a alguns e rejeitada para outros.
A rejeição não afirma que todas as cópias falharam.
Os detalhes listam os endereços com rejeições confirmadas. Endereços em Cco
continuam restritos ao autor, inclusive nessa lista.

## Como as rejeições do Gmail são identificadas?

Ative **Monitorar rejeições do Gmail** em **Sistema → Configurações → E-mail**.
Veja [como configurar](/ajuda/configuracoes#monitorar-rejeicoes-do-gmail).

Quando ativo, o Gnai consulta os avisos técnicos a cada cinco minutos e os
associa ao envio original. Não apaga mensagens nem as marca como lidas. Avisos
apagados, fora da pasta configurada ou com mais de 30 dias não são processados.
Uma rejeição pode chegar depois do aceite inicial; use **Atualizar** para
consultar o resultado mais recente.

## Conhecer a tela com o tutorial

O ícone de informação da barra do topo oferece tutoriais da listagem, escrita e
leitura, incluindo pastas, filtros, seleção, anexos e resultado do envio.

## Dúvidas comuns

**A Inbox mostra os e-mails recebidos na minha conta Gmail?**
Quando **Importar respostas do Gmail** está ativo, a Inbox traz as respostas
vinculadas aos envios registrados no Gnai. Outras mensagens pessoais da conta
não são importadas. A leitura de respostas é independente do monitoramento de
rejeições.

**Não aparece o botão Escrever.**
Solicite ao responsável pelas permissões a autorização de envio de e-mails.

**Não encontro um e-mail antigo.**
Só aparecem envios registrados pelo serviço compartilhado. Mensagens anteriores
ao rastreamento não são importadas nem reenviadas automaticamente.
