---
titulo: Fila de Espera
resumo: Como colocar um aluno ou profissional na fila de um item indisponível para empréstimo, acompanhar a solicitação, cancelá-la ou excluí-la.
categoria: Atendimento
palavras-chave: fila de espera, fila, lista de espera, espera, aguardar item, reservar item, reserva, solicitação, solicitar recurso, item indisponível, sem estoque, tecnologia assistiva, material pedagógico acessível, beneficiário, aluno, profissional, notificado, atendido, em espera, cancelar solicitação, excluir solicitação, próximo da fila, pdf da solicitação, tutorial, tour
ordem: 50
permissoes: waitlist.index
---

A fila de espera registra quem precisa de um item do acervo que não pode ser emprestado no momento. Cada solicitação é de um único beneficiário (aluno ou profissional) para um item específico, e a ordem de chegada define quem é chamado primeiro quando o item volta a ficar disponível. A tela fica em **Atendimento → Fila de Espera**.


> **Importante:** alunos em **Em acolhimento** não podem receber novos registros neste módulo. Durante essa etapa, cadastre somente [Solicitações de Atendimento](/ajuda/solicitacoes-de-atendimento). A liberação depende da alteração manual da situação do aluno; concluir uma solicitação não o torna ativo.

## Conhecer as telas com o tutorial

A listagem, o cadastro, a edição e a visualização da solicitação têm um tutorial na própria tela. Clique no botão com o ícone de informação, na barra do topo, para abrir. Ele mostra os filtros e a tabela da listagem, os campos do formulário e os botões do rodapé. Veja como navegar pelo tutorial em [Conhecer a tela com o tutorial](/ajuda/primeiros-passos#conhecer-a-tela-com-o-tutorial).

## Quais itens podem entrar na fila?

Só aparecem no cadastro os itens físicos, ativos e emprestáveis que estão sem unidades disponíveis ou com um status que impede o empréstimo (por exemplo, **Em manutenção** ou **Danificado**). Itens digitais nunca entram na fila, porque não têm estoque físico. Se o item ainda tiver unidades disponíveis, registre um [empréstimo](/ajuda/emprestimos) em vez de uma solicitação na fila.

## Cadastrar uma solicitação na fila

1. Acesse **Atendimento → Fila de Espera** e clique em **Cadastrar**.
2. Escolha o **Tipo do Item**: Tecnologia Assistiva ou Material Pedagógico Acessível. O campo **Item Específico** só é liberado depois disso.
3. Escolha o **Item Específico**.
4. Informe o beneficiário em **Aluno (Beneficiário)** ou **Profissional (Beneficiário)**, um dos dois, nunca ambos. Ao escolher um, o outro fica bloqueado.
5. Se quiser, registre **Observações**.
6. Clique em **Cadastrar**. O sistema volta para a listagem e mostra "Solicitação de fila criada com sucesso!".

O campo **Usuário Responsável pelo Registro** mostra quem está registrando a solicitação e não pode ser alterado. A solicitação começa com o status **Em Espera**.

| Campo | Observação |
| --- | --- |
| **Tipo do Item** (obrigatório) | Filtra os itens do campo seguinte. |
| **Item Específico** (obrigatório) | Somente itens indisponíveis para empréstimo. |
| **Aluno** ou **Profissional** (um deles é obrigatório) | O mesmo beneficiário não pode ter duas solicitações ativas para o mesmo item. |
| **Observações** | Texto livre com formatação. |

## Receber a confirmação de entrada na fila

Após cadastrar a solicitação, o Gnai prepara uma confirmação para o e-mail do
beneficiário, aluno ou profissional, informado no cadastro de pessoa. A mensagem
usa o mesmo modelo visual do comprovante por e-mail de empréstimo e apresenta:

- número da solicitação e nome do beneficiário;
- item solicitado, tipo e patrimônio, quando houver;
- data da solicitação e responsável pelo registro;
- situação no momento do cadastro.

A mensagem confirma somente a entrada na fila. Ela não significa que um empréstimo
foi realizado e não promete uma data de retirada. O aviso de disponibilidade é
outro e-mail, enviado quando a pessoa for chamada para o item disponível.

O envio ocorre depois da gravação, em segundo plano, com até três tentativas.
Sem e-mail válido ou em caso de falha, a solicitação continua cadastrada. Não
repita o cadastro porque a confirmação não chegou. Editar a solicitação não envia
outra confirmação de entrada.

### Consultar o envio da confirmação

Na primeira coluna da tabela, sem título visível, passe o mouse ou use o teclado
para focar o ícone. A dica explica a situação do e-mail de confirmação do cadastro:

- **E-mail na fila** ou **Enviando e-mail**: o envio está pendente ou em processamento.
- **E-mail enviado**: o serviço aceitou a mensagem; a dica mostra a data e hora. Isso não confirma a chegada à caixa de entrada ou a leitura.
- **Falha no envio do e-mail**: houve falha no enfileiramento ou as tentativas se esgotaram.
- **Beneficiário sem e-mail válido**: o cadastro não tinha um endereço válido.
- **E-mail não enviado**: o envio real estava desativado ou a mensagem foi interrompida.
- **Resultado do envio não confirmado**: o processamento foi interrompido sem confirmação. A mensagem não é reenviada automaticamente, para evitar duplicidade.
- **Sem registro de envio**: não há rastreamento, como nas solicitações anteriores à implantação da confirmação.

Enquanto houver envio pendente nas linhas exibidas, o indicador é atualizado a
cada cinco segundos. O ícone acompanha a confirmação de entrada na fila; não
representa o aviso posterior de disponibilidade e não muda a situação da solicitação.
Se houver falha ao registrar o resultado de um envio concluído, o sistema tenta
recuperar essa informação automaticamente, sem enviar a mesma mensagem de novo.

## Acompanhar a fila

A listagem começa com uma faixa de ícones sem título, à esquerda, para o envio da confirmação de entrada na fila. As ações continuam à direita. Também mostra **Item**, **Beneficiário**, **Data da Solicitação**, **Status** e **Usuário**. Pelo seletor de colunas é possível exibir **Tipo do item**, **Patrimônio / Tombamento**, **Matrícula do aluno** e **Observações**. Os filtros são **Item**, **Aluno**, **Profissional** e **Status**.

| Status | Significado |
| --- | --- |
| **Em Espera** | Aguardando o item ficar disponível. |
| **Notificado** | O item voltou a ficar disponível e este beneficiário é o próximo da fila. |
| **Atendido** | O empréstimo do item já foi registrado para o beneficiário. |
| **Cancelado** | A solicitação foi cancelada. |

## Como a fila anda

A fila é atualizada pelos [empréstimos](/ajuda/emprestimos#emprestimos-e-fila-de-espera):

- Quando uma devolução sem avaria é registrada, ou um empréstimo ativo é excluído, a solicitação **Em Espera** mais antiga daquele item passa para **Notificado**. Quem registrou a operação recebe a notificação **Próximo da fila disponível**, com o atalho para registrar o empréstimo.
- Quando o empréstimo é registrado para um beneficiário que estava na fila daquele item, a solicitação passa automaticamente para **Atendido**.

## Ver, editar e gerar o PDF de uma solicitação

1. Na listagem, use a ação de visualizar da solicitação. A visualização mostra o item, o beneficiário, o usuário responsável, a data, o status e as observações.
2. Clique em **Editar** para alterar as **Observações**. Item, beneficiário e status aparecem apenas para consulta. Clique em **Salvar**; o sistema mostra "Fila atualizada com sucesso!".
3. Clique em **PDF** para exportar a solicitação.

## Cancelar uma solicitação

Use o cancelamento quando o beneficiário não precisar mais do item e você quiser manter o registro.

1. Na visualização da solicitação, clique em **Cancelar solicitação**. O botão só aparece para solicitações **Em Espera**.
2. Confirme em **Confirmar cancelamento**. A solicitação passa para **Cancelado** e o sistema mostra "Solicitação cancelada com sucesso!".

## Excluir uma solicitação

1. Clique em **Excluir** na visualização ou use a ação de excluir na listagem.
2. Confirme em **Excluir Solicitação**. O sistema mostra "Solicitação removida com sucesso!".

Solicitações já **Atendidas** não podem ser excluídas.

## Dúvidas comuns

**Aparece "Este recurso ainda possui unidades disponíveis e pode ser emprestado, portanto não é possível criar uma fila de espera."**
O item tem estoque disponível. Registre o empréstimo diretamente.

**Aparece "Recursos digitais não entram em fila de espera porque não possuem estoque físico."**
Itens digitais podem ser emprestados a qualquer momento, sem fila.

**Aparece "Este beneficiário já possui uma solicitação ativa para este recurso."**
Já existe uma solicitação **Em Espera** ou **Notificado** para o mesmo beneficiário e item.

**Aparece "Este beneficiário já possui um empréstimo ativo deste recurso."**
O beneficiário já está com o item emprestado.

**Aparece "Não é permitido informar aluno e profissional ao mesmo tempo." ou "É necessário informar um aluno ou um profissional."**
Informe exatamente um beneficiário.

**Aparece "Apenas solicitações em espera podem ser canceladas." ou "Solicitações já atendidas não podem ser removidas."**
A solicitação já mudou de status. Solicitações atendidas ficam no histórico.

## Consultar por semestre

Em **Mais filtros**, escolha **Semestre** e a opção de **Consultar no semestre**:

- **Semestre de origem:** vínculo preservado desde o registro.
- **Iniciados no período:** operações cuja data inicial está no calendário escolhido.
- **Em espera durante o período:** inclui operações que começaram antes e continuaram naquele semestre.
- **Encerrados no período:** operações finalizadas no semestre escolhido.

A opção **Sem vínculo: revisar calendário** encontra registros sem origem identificada. Complete as datas do semestre em **Gestão do núcleo → Cadastros → Semestres** e salve para vincular as operações com correspondência única. A troca do semestre atual preserva os registros e a continuidade entre períodos.

O status da linha representa a situação atual, mesmo quando o filtro consulta um semestre passado. As datas de movimentação podem ser usadas também nos relatórios. Registros antigos sem data conhecida de encerramento não entram como encerrados nem como continuidade comprovada naquele período.

## Saber quando a solicitação mudou de situação

A visualização e as colunas complementares da lista mostram **Notificado em**, **Atendido em** e **Cancelado em**. O atendimento automático registra também o número do empréstimo correspondente. Uma data não disponível aparece como **Não informado**, sem usar a última edição como se fosse a data da mudança. As movimentações registradas a partir desta atualização podem ser consultadas pela relação **Histórico de movimentações** nos relatórios.

## Receber o aviso de disponibilidade por e-mail

Quando um item volta a ficar disponível e a primeira pessoa da fila é chamada,
o Gnai prepara um e-mail para o beneficiário, usando o endereço do cadastro de
pessoa. A mensagem identifica o item e orienta a procurar a equipe do núcleo.
O aviso não registra um empréstimo nem garante a retirada.

O envio ocorre depois da gravação, pelo mesmo serviço de e-mail usado nos
empréstimos, com até três tentativas. A falta de e-mail válido ou uma falha de
envio não desfaz a devolução, a atualização do estoque ou a chamada na fila.
A notificação interna ao responsável pela operação continua disponível.
