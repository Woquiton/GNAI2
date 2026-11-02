---
titulo: Agendamentos
resumo: Como agendar atendimentos AEE e pedagógicos, consultar a agenda em calendário ou lista, editar, cancelar e excluir agendamentos e registrar o atendimento realizado.
categoria: Atendimento
palavras-chave: agendamento, agendamentos, agendar, agenda, sessão, sessões, marcar atendimento, horário, calendário, listagem, meus agendamentos, todos agendamentos, central de agendamentos, disponibilidade, conflito de agenda, horário ocupado, cancelar agendamento, desmarcar, remarcar, reagendar, alterar horário, excluir agendamento, e-mail aos participantes, aviso por e-mail, notificação, atendimento individual, atendimento em grupo, aee, pedagógico, registrar atendimento, presença, agendada, realizada, cancelada
ordem: 20
permissoes: session.view-all, session.view-own
---

Os agendamentos organizam os atendimentos do núcleo: cada um reúne o tipo de atendimento, o profissional, os alunos, a data, o horário, o local e o objetivo. Depois que o atendimento acontece, o profissional responsável registra o que foi feito a partir do próprio agendamento. A tela fica em **Atendimento → Agendamentos**.

## Meus agendamentos e central de agendamentos

Há duas agendas:

- **Agendamentos** (central): mostra os agendamentos de todos os profissionais. Aparece para quem pode ver todos os agendamentos.
- **Meus Agendamentos**: mostra apenas os agendamentos em que você é o profissional responsável. Exige que seu usuário esteja vinculado a um profissional da equipe.

O item **Atendimento → Agendamentos** abre a central para quem pode vê-la e **Meus Agendamentos** para os demais. No cabeçalho, os botões **Meus agendamentos** e **Todos Agendamentos** alternam entre as duas agendas, quando você tem acesso a ambas.

## Consultar a agenda em calendário ou listagem

Cada agenda tem duas abas:

- **Calendário**: abre na visão da semana. Clique em um agendamento para abri-lo, ou clique em um dia para ver em uma janela todos os agendamentos daquela data, com alunos, professor e situação do registro.
- **Listagem**: tabela com **Aluno**, **Profissional**, **Data**, **Tipo** e **Status**, com paginação.

Os filtros valem para as duas abas: **Dia de referência**, **Aluno**, **Professor** (somente na central), **Tipo** e **Status**.

| Status | Significado |
| --- | --- |
| **Agendada** | Atendimento marcado, ainda sem registro. Pode ser editado e cancelado. |
| **Realizada** | O profissional já registrou o atendimento. |
| **Cancelada** | O agendamento foi cancelado, com o motivo informado. |

## Cadastrar um agendamento

1. Acesse **Atendimento → Agendamentos** e clique em **Cadastrar**.
2. Em **Participantes e Horário**, escolha o **Tipo de Atendimento**: Atendimento Educacional Especializado ou Atendimento Pedagógico.
3. Escolha o **Formato**: Individual ou Grupo. No atendimento pedagógico o formato é sempre Individual.
4. Escolha o **Profissional** e o aluno em **Alunos Participantes**. No formato Grupo, use **Adicionar outro Aluno** para incluir mais alunos e **Remover** para retirar uma linha.
5. Informe a **Data do Agendamento**, o horário de **Início** e, se quiser, o de **Fim**.
6. Confira a seção **Disponibilidade do Dia** (veja abaixo).
7. Em **Detalhes do Atendimento**, informe o **Local** e o **Objetivo do Agendamento**.
8. Clique em **Salvar**. Para datas de hoje em diante, o sistema pergunta "Deseja enviar um e-mail aos participantes sobre este agendamento?": escolha **Salvar e Enviar E-mail**, **Salvar sem E-mail** ou **Voltar** para continuar editando.
9. O sistema abre o agendamento e mostra "Agendamento criado com sucesso.".

| Campo | Observação |
| --- | --- |
| **Tipo de Atendimento** (obrigatório) | Define se o registro posterior será um Atendimento AEE ou um Atendimento Pedagógico. |
| **Formato** (obrigatório) | Individual ou Grupo. |
| **Profissional** (obrigatório) | Precisa estar ativo e ter permissão para registrar o tipo de atendimento escolhido. |
| **Alunos Participantes** (obrigatório) | Ao menos um aluno; no atendimento pedagógico, exatamente um. |
| **Data do Agendamento** (obrigatório) | Datas passadas são aceitas e salvas sem a pergunta sobre o e-mail. |
| **Início** (obrigatório) | Horários de 30 em 30 minutos, das 08:00 às 11:30 e das 14:00 às 16:30. |
| **Fim** | Se ficar em branco, o sistema considera uma hora após o início. |
| **Local** (obrigatório) | Até 255 caracteres. |
| **Objetivo do Agendamento** (obrigatório) | Texto livre com formatação. |

O e-mail é enviado aos alunos e ao profissional que tenham e-mail cadastrado.

Os alunos precisam estar na situação **Ativo** e ter um **Tipo de acompanhamento** que permita a modalidade escolhida. Essa configuração fica no cadastro do aluno e também é verificada ao editar um agendamento. Alterar o acompanhamento não cancela agendamentos nem modifica atendimentos já registrados.

### Disponibilidade do dia

Depois de escolher alunos, profissional e data, a seção **Disponibilidade do Dia** mostra os horários do dia como livres ou ocupados, indicando quem está ocupado. Clique em um horário livre para usá-lo como início. Se a grade não aparecer, a mensagem "Selecione aluno(s), profissional e data para ver a disponibilidade." indica o que falta preencher.

## Editar ou remarcar um agendamento

Somente quem criou o agendamento pode editá-lo, e apenas enquanto o status for **Agendada**.

1. Abra o agendamento e clique em **Editar** no rodapé.
2. Os participantes, o tipo de atendimento e o formato aparecem apenas para consulta. Altere a data, o horário, o local ou o objetivo.
3. Clique em **Salvar** e responda se deseja avisar os participantes por e-mail sobre as alterações.
4. O sistema mostra "Agendamento atualizado com sucesso.".

Para trocar o profissional, os alunos ou o tipo de atendimento, cancele o agendamento e crie outro.

## Cancelar um agendamento

O cancelamento mantém o agendamento na agenda com o status **Cancelada** e o motivo registrado. Só quem criou o agendamento pode cancelá-lo, e somente para datas futuras.

1. Abra o agendamento e clique em **Cancelar Agendamento**.
2. Informe o **Motivo do Cancelamento** (obrigatório, com ao menos 5 caracteres).
3. Se quiser, marque **Enviar e-mail de aviso aos participantes**.
4. Clique em **Confirmar cancelamento**. O sistema mostra "Agendamento cancelado com sucesso." ou "Agendamento cancelado e participantes notificados.".

## Excluir um agendamento

Somente quem criou o agendamento pode excluí-lo. A ação está no rodapé do agendamento, na listagem e na janela do dia do calendário.

1. Clique em **Excluir**. A janela **Excluir Agendamento** pergunta "Mover este agendamento para a lixeira?".
2. Se o agendamento ainda estiver **Agendada**, é possível marcar **Enviar e-mail de aviso aos participantes**; nesse caso ele é cancelado automaticamente antes da exclusão.
3. Clique em **Confirmar exclusão**. O agendamento sai da agenda e o sistema mostra "Agendamento removido com sucesso.".

## Registrar o atendimento a partir do agendamento

Quando a data do atendimento chega, o profissional responsável abre o agendamento e usa o botão do rodapé:

- **Criar Atendimento AEE**, para agendamentos de Atendimento Educacional Especializado. Veja [Atendimentos Especializados](/ajuda/atendimentos-especializados).
- **Criar Registro Pedagógico**, para agendamentos de Atendimento Pedagógico. Veja [Atendimentos Pedagógicos](/ajuda/atendimentos-pedagogicos).

O botão só aparece para o profissional do agendamento, com status **Agendada** e a partir do dia marcado. Ao salvar o registro, o agendamento passa para **Realizada** e o botão vira **Ver Atendimento AEE** ou **Ver Atendimento Pedagógico**. Nos atendimentos pedagógicos registrados aparece também o botão **PDF Pedagógico**.

## Dúvidas comuns

**Aparece "Conflito de agenda para: ..." ou "O profissional já possui um agendamento neste horário."**
Algum aluno ou o profissional já tem atendimento nesse horário. Consulte a **Disponibilidade do Dia** e escolha um horário livre.

**Aparece "Não é possível agendar ou editar agendamento para aluno inativo: ..."**
O aluno está **Trancado**, **Concluído** ou **Desistente**. Altere a situação no cadastro do aluno, se for o caso.

**Aparece "O tipo de acompanhamento de ... não permite agendamentos do tipo ..."**
O acompanhamento do aluno está incompatível com a modalidade escolhida ou não foi informado. Confira **Tipo de acompanhamento** em [Alunos](/ajuda/alunos#o-que-significa-o-tipo-de-acompanhamento). **Somente AEE** aceita AEE, **Somente pedagógico** aceita atendimentos pedagógicos e **AEE e pedagógico** aceita ambos.

**Aparece "Atendimentos pedagógicos devem possuir exatamente um aluno."**
O atendimento pedagógico é sempre individual. Para atender vários alunos juntos, use o Atendimento Educacional Especializado no formato Grupo.

**Aparece "Não é possível criar agendamento para um profissional que não possui permissão para criar registros de agendamento."**
O profissional escolhido não pode registrar o tipo de atendimento selecionado. Escolha outro profissional ou peça o ajuste das permissões do cargo.

**Aparece "Apenas quem criou o agendamento pode editá-la." (ou cancelá-la, excluí-la)**
Edição, cancelamento e exclusão são exclusivos de quem criou o agendamento.

**Aparece "Apenas agendamentos de datas futuras podem ser cancelados."**
Agendamentos de hoje ou de datas passadas não podem ser cancelados.

**Não vejo o botão para registrar o atendimento.**
Confira se você é o profissional do agendamento, se o status é **Agendada** e se a data já chegou.
