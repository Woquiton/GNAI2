# Auditoria de notificações operacionais

Data: 10/11/2026. Levantamento do código, sem executar rotinas de envio, migrations
ou homologação em runtime.

## Resultado

O módulo já fornece notificações individuais persistidas no banco, sino,
histórico, link para o registro e marcação de leitura. Não é necessário criar
outra central. Antes desta alteração, só pendências, fila de espera e empréstimos
vencidos alimentavam essa central. Os avisos de agendamento usam e-mail e não
aparecem nela.

Foram implementados o acompanhamento das adaptações do PEI, a notificação de
reatribuição de pendências e a correção dos destinatários e das duplicações de
empréstimos vencidos. Os demais pontos abaixo são recomendações, ainda não
implementadas. Ter acesso a uma listagem não torna alguém automaticamente
responsável por todos os registros dela.

## Fluxos implementados

| Evento | Destinatário | Frequência e encerramento |
| --- | --- | --- |
| Professor responsável começa a preencher uma adaptação | Criador da adaptação, se for outra pessoa e mantiver acesso | Uma notificação na primeira alteração do professor com conteúdo real; link para a adaptação |
| Professor altera novamente o planejamento | Mesmo criador | Uma por salvamento com mudança efetiva; salvar valores iguais não avisa |
| Adaptação sem conteúdo real | Criador com acesso | Primeira verificação após cinco dias de calendário; novo intervalo de cinco dias após cada lembrete, retomada ou troca de professor; rotina diária às 8h da Bahia |
| Responsável por pendência é trocado | Novo profissional responsável com conta e acesso a pendências | Apenas na troca, sem avisar o próprio autor da operação |
| Empréstimo ativo vencido | Operador que registrou o empréstimo e administradores autorizados a visualizá-lo | Verificação diária às 12h05 da Bahia; no máximo um por empréstimo/destinatário/dia; para ao devolver ou excluir |

O PEI reutiliza `hasPlanningContent()`: qualquer campo com texto real significa
preenchimento iniciado. Campos vazios e o marcador `A preencher.` não contam.
Conteúdo inserido pela equipe também interrompe lembretes; isso não significa
que todos os campos obrigatórios estejam concluídos. As regras de finalização
do PEI não foram alteradas.

Na visualização da adaptação, **Lembretes de preenchimento** mostra o estado e
oferece **Encerrar lembretes** e **Retomar lembretes**, com confirmação, ao criador
ou administrador com permissão de edição. Encerrar não exclui nem bloqueia a
adaptação. A decisão fica auditada, com data e usuário; a retomada é auditada pela
remoção desse estado. Marcar um aviso como lido não encerra lembretes.

Lembretes deixam de ser elegíveis com conteúdo, encerramento manual, PEI
finalizado ou sem vigência, aluno não ativo, exclusão da adaptação ou perda de
acesso do criador. Trocar o professor respeita um encerramento manual anterior.
Se o planejamento voltar a ficar vazio, as verificações podem voltar a enviar
lembretes, respeitando o intervalo e o encerramento manual. Retomar inicia um
novo intervalo; não dispara aviso imediato.

O primeiro preenchimento é identificado pelas revisões automáticas existentes
do professor responsável. Mudanças feitas pela equipe não são atribuídas ao
professor. A revisão e o aviso são gravados na mesma transação. O acesso pelo
Portal do Professor e a edição interna usam a mesma Action e recebem o mesmo
tratamento. Revisões manuais descritivas não são tratadas como mudança do
planejamento.

A rotina revalida a elegibilidade sob bloqueio de PEI/adaptação e atualiza seu
marcador de intervalo na mesma transação do aviso. Execuções simultâneas ou
repetidas não acumulam cobranças do mesmo intervalo. Uma execução após dias
sem scheduler envia apenas um lembrete, sem reproduzir todos os intervalos
perdidos. O mesmo princípio de bloqueio e deduplicação diária vale para empréstimos.

## Outros pontos recomendados

Prioridades indicam a ordem sugerida de implantação, não rotinas já ativas.

| Prioridade | Ponto e lacuna atual | Evento e destinatário propostos | Controle de frequência e parada |
| --- | --- | --- | --- |
| Alta | Solicitações de atendimento: criação e mudança de status não avisam na central | Nova solicitação para a equipe de triagem; mudança real para Em análise, Encaminhada ou Concluída avisa o criador com acesso | Um por evento; excluir o ator; definir explicitamente a equipe de triagem antes de difundir |
| Alta | Agendamentos: criação, alteração e cancelamento usam apenas e-mail | Aviso interno para o profissional agendado com conta; mudanças de data, horário, local e cancelamento também para o criador, quando outra pessoa | Um por mudança relevante; não avisar por salvamento idêntico; preservar os e-mails existentes; exclusão exige link para agenda/listagem |
| Alta | PAEE já possui `next_review_date`, mas sem lembrete | Revisão chegando e revisão vencida para o criador do PAEE vigente e autorizado | Aviso sete dias antes, no dia e a cada cinco dias vencido; parar ao rever, alterar a data, perder vigência ou encerrar acompanhamento do aluno |
| Alta | Pendências têm vencimento, mas sem lembrete de prazo | Vence hoje para o responsável; vencida para responsável e criador | Um no vencimento; depois a cada cinco dias; parar ao concluir, excluir ou trocar o vencimento; deduplicar quando ambos forem a mesma pessoa |
| Alta | Falhas de backup ficam em logs/exceções | Falha do backup automático ou da retenção para administradores com acesso a backups | Um aviso por incidente, com reaviso diário enquanto persistir; recuperação encerra o incidente; sem incluir caminhos internos ou exceções no texto |
| Média | Estudo de Caso aceita contribuições sem avisar o criador | Nova contribuição de outra pessoa para o criador com acesso; conclusão para participantes definidos no fluxo | Um por contribuição/conclusão; sem copiar conteúdo sensível para a mensagem; não notificar a equipe toda |
| Média | Fila de espera avisa o operador da devolução, mas pode envolver outro operador | Item disponível também para quem registrou a entrada na fila, quando outra pessoa e com acesso | Uma vez por transição para Notificado; deduplicar com o operador já avisado; parar ao atender ou cancelar |
| Média | Barreiras têm prioridade e inspeções, mas não um responsável por resolução | Barreira urgente ou agravamento para equipe responsável pelo campus; resolução para o relator identificado | Definir destinatários por unidade antes de implementar; um por mudança relevante; preservar anonimato e parar ao resolver/inativar |
| Média | Inspeções podem registrar piora do estado de conservação | Recurso indisponível ou deteriorado para a equipe que gerencia os recursos | Avisar quando houver mudança de condição; não a cada evidência anexada; definir equipe responsável antes de implementar |
| Média | Central de e-mails registra respostas, falhas e rejeições sem passar pelo sino | Resposta recebida e falha definitiva para quem iniciou a conversa com acesso | Deduplicar pelo identificador de mensagem/entrega; ignorar retentativas intermediárias e respostas automáticas |

As propostas de sete dias antes e de repetição dos outros módulos são critérios
para uma próxima implementação. O intervalo de cinco dias das adaptações já está
implementado conforme o pedido. Nenhum prazo ou campo novo foi criado para o
operador preencher.

Não há uma assinatura de equipe/grupo destinatário na central atual. Para avisos
coletivos, é necessário definir os usuários responsáveis pela operação e gravar
um aviso individual por usuário autorizado. Permissão de visualizar é uma
condição de acesso, não uma definição suficiente de equipe de triagem, gestão
de barreiras ou manutenção. Cadastros comuns, PDFs, filtros e cada alteração de
campo ficam na auditoria; não justificam uma notificação por si só.

## Referências no código

- Central: `Application/Actions/Notifications/`,
  `UI/Controllers/Notifications/NotificationController.php` e
  `Infrastructure/Notifications/` em `app/Domains/`.
- Adaptações: `Application/Actions/PeiDisciplines/`,
  `UI/Controllers/Teachers/TeacherPortalController.php`,
  `UI/Controllers/Peis/PeiController.php` e
  `Domain/Models/PeiDisciplines/PeiDiscipline.php`.
- Pendências e empréstimos: `Application/Actions/Pendencies/UpdatePendencyAction.php`,
  `Application/Actions/Loans/NotifyOverdueLoansAction.php`.
- Agendamentos: `Application/Services/Sessions/SessionNotificationSender.php`.
- Revisões: `Domain/Models/Paees/Paee.php` e
  `Application/Actions/Paees/AddPaeeReviewAction.php`.
- Solicitações e estudos: `Application/Actions/SupportRequests/` e
  `Application/Actions/CaseStudies/`.
- Recursos: `Application/Actions/Inspections/`, `Application/Actions/Barriers/`,
  `Application/Actions/Waitlists/` e `Infrastructure/Notifications/Waitlists/`.
- Backup e e-mail: `Application/Actions/Backup/GenerateBackupAction.php` e
  `Application/Actions/Notifications/Email/`.
- Rotinas: `routes/console.php` e registro em
  `app/Providers/ResourceServiceProvider.php`.

## Implantação e homologação manual

Aplicar a migration incremental
`2026_11_10_120000_add_reminder_control_to_pei_disciplines` antes de liberar o código
e manter o scheduler em execução. Não é necessário recriar o banco ou rodar seed.
No backup convertido de 06/11, validar primeiro o snapshot e depois aplicar as
migrations novas, conforme `docs/operations/restaurar-backup-2026-11-06.md`.
O ZIP convertido permanece representando seu snapshot original.

Conferir na homologação: professor distinto do criador preenche pelo portal,
edita de novo e salva sem mudanças; avisos com link e destinatário corretos;
adaptação sem conteúdo com cinco/dez dias; reexecução da rotina no mesmo dia;
encerrar e retomar; troca do professor; perda de permissão; PEI antigo ou
finalizado e aluno inativo; empréstimo antes/depois do horário previsto, devolução
e repetição da verificação; reatribuição de pendência com e sem troca efetiva.

Implementado no código; comportamento em runtime deve ser conferido na
homologação manual.
