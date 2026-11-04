---
titulo: Central de E-mails
resumo: Como consultar os e-mails preparados pelo Gnai, seus destinatários e o resultado de cada envio.
categoria: Sistema
palavras-chave: e-mail, email, central de e-mails, caixa de saída, inbox, destinatário, enviado, falha, pendente, fila de envio, mensagem, tentativas
ordem: 15
permissoes: email.view
---

A **Central de E-mails**, no grupo **Sistema**, reúne os avisos registrados pelo
serviço de envio do Gnai. É necessário ter permissão de consulta. O histórico
inclui mensagens enviadas, pendentes e que não puderam ser enviadas.

## Consultar os envios

1. Abra **Sistema → Central de E-mails**.
2. Escolha um status na lateral **Envios**, ou mantenha **Todos os envios**.
3. Pesquise pelo **Assunto** ou selecione a **Origem**.
4. Em **Mais filtros**, você também pode escolher o **Status** e o período em que
   as mensagens foram registradas.

As contagens da lateral consideram o assunto, a origem e o período selecionados.
Cada linha mostra o destinatário, seu e-mail quando disponível, o assunto, o
status e a data de registro. O seletor de colunas permite consultar também a
origem, a finalidade, a quantidade de tentativas e a data de envio.

Clique em **Atualizar** para consultar os resultados novamente. Enquanto houver
envios pendentes nas linhas exibidas, o sistema atualiza os indicadores a cada
cinco segundos. As consultas ficam suspensas quando a aba do navegador está oculta.

## Entender os status

| Status | Significado |
| --- | --- |
| **E-mail na fila** | Aguarda processamento ou uma nova tentativa. |
| **Enviando e-mail** | O serviço está processando a mensagem. |
| **E-mail enviado** | O serviço aceitou a mensagem. Isso não confirma a chegada à caixa de entrada nem a leitura. |
| **Falha no envio do e-mail** | As tentativas se esgotaram ou houve falha ao colocar o envio na fila. |
| **Beneficiário sem e-mail válido** | O destinatário não tinha um endereço válido no momento do registro. |
| **E-mail não enviado** | O envio real estava desativado ou a mensagem foi interrompida. |
| **Resultado do envio não confirmado** | O processamento foi interrompido sem confirmação. Não há reenvio automático, para evitar duplicidade. |

## Consultar um envio

Abra o assunto da mensagem ou clique em **Visualizar**. Você pode consultar o
destinatário, a origem, a finalidade, as tentativas, as datas e o texto registrado
para o aviso. Os links de acesso e de redefinição de senha são omitidos desta
consulta e continuam restritos ao e-mail do destinatário.

Os resultados pendentes também são atualizados automaticamente nessa tela.
Clique em **Voltar** para retornar à Central de E-mails.

## Conhecer a tela com o tutorial

Clique no ícone de informação da barra do topo. O tutorial apresenta os filtros,
a lateral de status, as colunas e os detalhes de uma mensagem.

## Dúvidas comuns

**Não encontro um e-mail antigo.**
Só aparecem os envios registrados pelo serviço compartilhado. Mensagens anteriores
à implantação desse rastreamento não são importadas nem reenviadas automaticamente.

**Posso escrever, reenviar ou excluir uma mensagem nesta tela?**
A Central de E-mails é uma consulta do histórico. Os avisos continuam sendo
preparados pelas operações de empréstimos, fila de espera, agendamentos,
autenticação e teste das configurações.
