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

## Acompanhar a fila

A listagem mostra **Item**, **Beneficiário**, **Data da Solicitação**, **Status** e **Usuário**. Pelo seletor de colunas é possível exibir **Tipo do item**, **Patrimônio / Tombamento**, **Matrícula do aluno** e **Observações**. Os filtros são **Item**, **Aluno**, **Profissional** e **Status**.

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
