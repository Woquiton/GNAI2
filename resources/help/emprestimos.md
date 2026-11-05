---
titulo: Empréstimos de itens
resumo: Como registrar um empréstimo, acompanhar prazos e atrasos, registrar a devolução e como os empréstimos se ligam à fila de espera.
categoria: Recursos e acessibilidade
palavras-chave: empréstimo, emprestar, emprestimos, devolução, devolver, registrar devolução, atraso, atrasado, prazo, previsão de devolução, avaria, danificado, beneficiário, aluno, estudante, profissional, fila de espera, estoque, item, tecnologia assistiva, material pedagógico, comprovante, pdf, tutorial, tour
ordem: 20
permissoes: loan.index
---

O módulo de empréstimos controla a saída e a devolução dos [itens](/ajuda/itens) do acervo para alunos e profissionais. Cada empréstimo baixa uma unidade do estoque do item e a devolve ao ser finalizado. A tela fica em **Recursos e acessibilidade → Empréstimos**.


> **Importante:** alunos em **Em acolhimento** não podem receber novos registros neste módulo. Durante essa etapa, cadastre somente [Solicitações de Atendimento](/ajuda/solicitacoes-de-atendimento). A liberação depende da alteração manual da situação do aluno; concluir uma solicitação não o torna ativo.

## Conhecer as telas com o tutorial

A listagem, o cadastro, a edição e a visualização do empréstimo têm um tutorial na própria tela. Clique no botão com o ícone de informação, na barra do topo, para abrir. Ele mostra os filtros e a tabela da listagem, as partes do formulário, os avisos de atraso e os botões do rodapé, como **Devolver**. Veja como navegar pelo tutorial em [Conhecer a tela com o tutorial](/ajuda/primeiros-passos#conhecer-a-tela-com-o-tutorial).

## Registrar um empréstimo

1. Acesse **Recursos e acessibilidade → Empréstimos** e clique em **Cadastrar empréstimo**.
2. Escolha o **Tipo do Item** (Tecnologia Assistiva ou Material Pedagógico Acessível). O campo **Item Específico** só é liberado depois disso.
3. Escolha o **Item Específico**. Itens físicos mostram o patrimônio e quantas unidades estão disponíveis; itens digitais aparecem com "(Digital)".
4. Informe o beneficiário: **Estudante (Beneficiário)** ou **Profissional (Beneficiário)**, apenas um dos dois. Ao selecionar um, o outro campo fica desabilitado. Para trocar o tipo de beneficiário, limpe a seleção atual.
5. Confira a **Data de Saída** e o **Horário**, que vêm preenchidos com o momento atual.
6. Informe a **Previsão de Devolução**, o prazo limite para a entrega do item.
7. Se quiser, registre **Observações / Estado do Item**.
8. Clique em **Cadastrar**. O sistema volta para a listagem e mostra "Empréstimo realizado com sucesso!".

O campo **Usuário Autenticado (Responsável)** mostra quem está registrando o empréstimo e não pode ser alterado.

| Campo | Observação |
| --- | --- |
| **Tipo do Item** (obrigatório) | Filtra os itens disponíveis. |
| **Item Específico** (obrigatório) | Só aparecem itens que podem ser emprestados agora. |
| **Estudante** ou **Profissional** (um deles é obrigatório) | Não é permitido informar os dois ao mesmo tempo. |
| **Data de Saída** e **Horário** (obrigatórios) | Momento da retirada do item. |
| **Previsão de Devolução** (obrigatório) | Não pode ser anterior à data de saída. |
| **Observações / Estado do Item** | Texto livre. |

## Receber a confirmação por e-mail

Quando a confirmação de empréstimo está ativada em
[E-mails automáticos](/ajuda/configuracoes#escolher-os-e-mails-automaticos),
após a gravação do empréstimo, o Gnai prepara uma confirmação para o e-mail do
beneficiário, aluno ou profissional, informado no cadastro de pessoa. A mensagem
contém o número do empréstimo, beneficiário, item, tipo, patrimônio quando houver,
data de saída, responsável pelo registro e previsão de devolução.

Com o evento desativado, não é criado registro de envio para a operação.
O envio ocorre em segundo plano. Se o beneficiário não tiver um e-mail válido ou
houver falha no envio, o empréstimo continua registrado, com a baixa de estoque e
o atendimento da fila de espera preservados. Não cadastre o mesmo empréstimo
novamente apenas porque a confirmação não chegou.

Se o e-mail recebido apresentar dados que você não reconhece, procure a equipe do
núcleo. A confirmação se refere ao registro original; editar observações ou
registrar a devolução não envia outra confirmação de criação. Para alunos, a devolução gera uma confirmação própria.

### Consultar o indicador de e-mail

Na faixa de ícones à esquerda, sem título visível, passe o mouse ou use o teclado
para focar o indicador. A dica explica a situação. Enquanto houver envio na fila
ou em processamento nas linhas exibidas, a listagem consulta o resultado a cada
cinco segundos.

O primeiro ícone acompanha a confirmação do empréstimo. Quando a devolução de um
aluno é registrada, um segundo ícone aparece ao lado para a confirmação de
devolução. Cada um mantém seu próprio histórico: se o primeiro não tem registro,
ele continua com a interrogação mesmo quando o e-mail de devolução foi enviado.
A dica identifica a qual confirmação o ícone se refere.

| Situação | Significado |
| --- | --- |
| **E-mail na fila** | A confirmação aguarda processamento ou uma nova tentativa. |
| **Enviando e-mail** | O serviço está processando a entrega. |
| **Aceito pelo servidor de envio** | O serviço de envio aceitou a mensagem. A dica inclui a data e hora. Isso não confirma a chegada à caixa de entrada ou a leitura. |
| **E-mail não entregue** | Uma rejeição definitiva do Gmail foi processada. Confira o endereço do destinatário. Não há reenvio automático. |
| **Falha no envio do e-mail** | Não foi possível colocar a confirmação na fila ou as tentativas de entrega se esgotaram. |
| **Beneficiário sem e-mail válido** | O cadastro não tinha um endereço válido no momento do registro. |
| **E-mail não enviado** | O envio real estava desativado, em modo de registro em log, ou a mensagem foi interrompida. |
| **Resultado do envio não confirmado** | O processamento foi interrompido sem confirmação. Não há reenvio automático, para evitar mensagens duplicadas. |
| **Sem registro de envio** | Não há um resultado registrado, como nos empréstimos anteriores à implantação da confirmação. |

Esses indicadores não alteram a situação do empréstimo ou do estoque. Não há envio
automático retroativo para os registros antigos.
Se houver falha ao registrar o resultado de um envio concluído, o sistema tenta
recuperar essa informação automaticamente, sem enviar a mesma mensagem de novo.

## Quais itens podem ser emprestados?

A lista de **Item Específico** mostra apenas itens que estão ativos, com **Permitir Empréstimos** marcado, com status **Disponível** ou **Em uso** e, se forem físicos, com pelo menos uma unidade disponível. Itens digitais não têm limite de estoque.

Ao salvar, o Gnai confere novamente as regras. O empréstimo é recusado quando:

- o item está inativo ou não permite empréstimos;
- o status do item é Em manutenção, Danificado ou Indisponível;
- o estado de conservação de um item físico é Ruim (Danificado);
- não há unidades disponíveis;
- o mesmo beneficiário já tem um empréstimo ativo do mesmo item.

Quando a última unidade de um item físico é emprestada, o status do item passa automaticamente para **Em uso**.

## Acompanhar empréstimos e atrasos

A listagem reserva a primeira coluna, sem título visível, para os indicadores de e-mail, à esquerda. As ações ficam à direita. Também mostra **Item**, **Beneficiário**, **Prazo**, **Status** e **Usuário**. Use os filtros **Item**, **Estudante**, **Profissional** e **Status**. Outras colunas, como patrimônio, matrícula do beneficiário, saída, devolução e observações, podem ser exibidas pelo seletor de colunas.

| Status | Significado |
| --- | --- |
| Ativo (Com o Beneficiário) | O item ainda não foi devolvido. |
| Devolvido (No prazo) | Devolução registrada até a previsão de devolução. |
| Devolvido (Com atraso) | Devolução registrada depois da previsão de devolução. |
| Devolvido (Com avaria) | Devolução registrada com a opção de avaria marcada. |

Um empréstimo ativo cuja previsão de devolução já passou é considerado atrasado:

- na listagem, o **Prazo** aparece destacado;
- na visualização e na edição aparece o aviso "Este item está com a devolução atrasada.";
- uma vez por dia, o Gnai envia aos usuários a notificação **Empréstimo Atrasado**, com o item, o beneficiário e há quantos dias está atrasado. A notificação leva direto ao empréstimo.

## Registrar uma devolução

1. Abra o empréstimo na listagem (ação **Visualizar**).
2. No rodapé, clique em **Devolver**. O botão só aparece para empréstimos ativos.
3. Na janela **Confirmar Devolução**, marque **Item devolvido com avarias ou danos** se for o caso.
4. Clique em **Confirmar devolução**. A mensagem "Devolução registrada com sucesso!" confirma a operação.

A data da devolução é o momento do registro. O Gnai define o status do empréstimo (no prazo, com atraso ou com avaria) e devolve a unidade ao estoque:

- devolução normal: o item volta ao status **Disponível**;
- devolução com avaria: o item passa ao status **Danificado** e fica bloqueado para novos empréstimos até ser revisado na [edição do item](/ajuda/itens#editar-um-item-e-registrar-uma-nova-vistoria).

### Receber a confirmação de devolução por e-mail

Quando a confirmação de devolução está ativada em **Configurações → E-mails automáticos**
e o beneficiário é um aluno, após a devolução ser gravada o Gnai prepara um
e-mail para o endereço informado no cadastro de pessoa. A mensagem usa o mesmo
modelo visual da confirmação de empréstimo e mostra o número do empréstimo, item,
patrimônio quando houver, datas de saída, prazo e devolução, situação da devolução
e quem a registrou. Vale para devoluções no prazo, com atraso ou com avaria.

O envio ocorre em segundo plano e tem rastreamento separado da confirmação de
retirada. Falta de endereço válido ou falha no envio não desfaz a devolução,
a atualização do estoque ou a chamada da fila de espera. Não registre a devolução
novamente apenas porque o e-mail não chegou. A confirmação de devolução não é
enviada novamente ao editar observações.

## Empréstimos e fila de espera

Quando não há unidades disponíveis de um item físico, o beneficiário pode entrar na [Fila de Espera](/ajuda/fila-de-espera).

- **Ao registrar uma devolução sem avaria** (ou ao excluir um empréstimo ativo), o Gnai marca como **Notificado** o primeiro beneficiário em espera daquele item e envia a quem registrou a operação a notificação **Próximo da fila disponível**. Ao abri-la, o cadastro de empréstimo vem com o item e o beneficiário já selecionados.
- **Ao registrar o empréstimo** para um beneficiário que estava na fila daquele item, a solicitação passa automaticamente para **Atendido**.
- Devoluções com avaria não chamam o próximo da fila, porque o item fica Danificado.

## Editar um empréstimo

Na visualização, clique em **Editar**. Somente o campo **Observações / Estado do Item** pode ser alterado; item, beneficiário e datas não mudam depois do registro. Clique em **Salvar observações**. Em empréstimos já finalizados, o aviso "Este empréstimo já foi finalizado." lembra que só as observações podem ser atualizadas.

## Excluir um empréstimo

Clique em **Excluir** na listagem ou na visualização e confirme em **Confirmar exclusão**. Se o empréstimo ainda estava ativo, a unidade volta ao estoque, o item volta a **Disponível** e o próximo da fila de espera é avisado. Use a exclusão apenas para registros feitos por engano; para a entrega do item, use **Devolver**.

## Gerar o comprovante em PDF

Na visualização do empréstimo, clique em **PDF** para abrir o documento do empréstimo em uma nova aba.

## Dúvidas comuns

- **"É necessário informar um aluno ou um profissional."** Escolha o beneficiário em um dos dois campos.
- **"Não é permitido informar aluno e profissional ao mesmo tempo."** Deixe preenchido apenas um dos campos.
- **"A data de entrega não pode ser anterior à data do empréstimo."** Ajuste a **Previsão de Devolução**.
- **"Este beneficiário já possui um empréstimo ativo deste recurso."** Registre a devolução do empréstimo anterior antes de um novo.
- **"Não há unidades disponíveis para empréstimo."** Todas as unidades estão emprestadas; cadastre o beneficiário na [Fila de Espera](/ajuda/fila-de-espera).
- **"O recurso está com status '...', que bloqueia empréstimos."** ou **"O estado 'Ruim (Danificado)' bloqueia empréstimos."** Revise o status ou a conservação na edição do item.
- **"Este recurso não está disponível para empréstimo."** O item está inativo ou não permite empréstimos.
- **O item não aparece na lista.** Confira se o **Tipo do Item** escolhido é o mesmo do item e veja [Quais itens podem ser emprestados?](/ajuda/emprestimos#quais-itens-podem-ser-emprestados)

## Consultar por semestre

Em **Mais filtros**, escolha **Semestre** e a opção de **Consultar no semestre**:

- **Semestre de origem:** vínculo preservado desde o registro.
- **Iniciados no período:** operações cuja data inicial está no calendário escolhido.
- **Em uso durante o período:** inclui operações que começaram antes e continuaram naquele semestre.
- **Encerrados no período:** operações finalizadas no semestre escolhido.

A opção **Sem vínculo: revisar calendário** encontra registros sem origem identificada. Complete as datas do semestre em **Gestão do núcleo → Cadastros → Semestres** e salve para vincular as operações com correspondência única. A troca do semestre atual preserva os registros e a continuidade entre períodos.

O status da linha representa a situação atual, mesmo quando o filtro consulta um semestre passado. As datas de movimentação podem ser usadas também nos relatórios. Registros antigos sem data conhecida de encerramento não entram como encerrados nem como continuidade comprovada naquele período.

Empréstimos que atenderam uma solicitação da fila de espera são preservados e não podem ser excluídos. Registre a devolução para encerrá-los.
