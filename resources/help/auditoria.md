---
titulo: Auditoria
resumo: Como consultar o histórico de alterações do sistema: quem criou, alterou, excluiu ou restaurou cada registro, quando e o que mudou.
categoria: Sistema
palavras-chave: auditoria, histórico de alterações, histórico, log, logs, rastreabilidade, quem alterou, quem excluiu, quem apagou, quem criou, o que mudou, antes e depois, alterações, registro de atividades, trilha de auditoria, log técnico, acessar como, entrar como, em nome de, personificação, sistema sem usuário, filtrar por usuário, filtrar por data, tutorial, tour
ordem: 20
permissoes: audit.index
---

A **Auditoria** guarda o histórico de alterações de todo o sistema. Cada criação, alteração, exclusão ou restauração de um registro (alunos, atendimentos, planos, itens, empréstimos, publicações, usuários, backups, site e demais cadastros) fica registrada com o autor, a data e os campos que mudaram.

## Conhecer a tela com o tutorial

O **Histórico de Alterações** tem um tutorial na própria tela. Clique no botão com o ícone de informação, na barra do topo, para abrir. Ele mostra os filtros, as colunas e a tabela, a paginação e o botão que abre os detalhes de cada operação. Veja como navegar pelo tutorial em [Conhecer a tela com o tutorial](/ajuda/primeiros-passos#conhecer-a-tela-com-o-tutorial).

## Consultar o histórico de alterações

1. Acesse **Sistema → Auditoria**.
2. A tela **Histórico de Alterações** lista as operações das mais recentes para as mais antigas, com as colunas:

| Coluna | Significado |
| --- | --- |
| **Registro** | Frase em linguagem simples, como "Maria alterou o aluno João". |
| **Ação** | **Criação**, **Alteração**, **Exclusão** ou **Restauração**. |
| **Tipo** | O tipo do registro, como Aluno, PEI, Empréstimo ou Publicação. |
| **Quem fez** | O usuário que fez a operação, ou **Sistema** quando ela veio de uma rotina automática. |
| **Quando** | Data e hora da operação. |

## Filtrar o histórico

Use os filtros acima da tabela e combine-os como precisar:

- **O que você procura?**: busca pelo nome do registro alterado ou pelo nome de quem fez a operação (por exemplo, o nome do aluno ou "sessão #12").
- **De** e **Até**: período da operação. A data final não pode ser anterior à inicial.
- **Quem fez**: um usuário que aparece no histórico ou **Sistema (sem usuário)**, para as operações feitas por rotinas automáticas, como o backup automático.
- **Tipo de registro**: por exemplo, Aluno, Agendamento, Empréstimo ou Usuário.
- **Ação**: Criação, Alteração, Exclusão ou Restauração.

## Ver o que mudou em uma operação

1. Na linha da operação, clique em **Visualizar**.
2. A janela mostra cada campo com os valores **Antes** e **Depois**. Em campos com vários valores, como permissões ou disciplinas, aparece o que foi adicionado e o que foi removido. Nas exclusões, a coluna mostra o **Valor ao excluir**.
3. Alterne entre **Formatado** (linguagem simples) e **Log técnico** (os dados gravados, com detalhes da requisição, como endereço e origem) e clique em **Fechar** para sair.

Senhas nunca são gravadas: o histórico registra apenas que a senha foi alterada, com o valor oculto.

## Como aparecem as ações feitas com "acessar como"?

Quando um administrador usa o acesso em nome de outro usuário, as operações aparecem em **Quem fez** como "Administrador em nome de Usuário". A busca por **O que você procura?** encontra essas operações tanto pelo nome do administrador quanto pelo nome do usuário representado.

## Dúvidas comuns

- **"Nenhuma alteração registrada ainda."**: o histórico ainda está vazio.
- **"Nenhum registro com esses filtros."**: nenhuma operação corresponde aos filtros; limpe ou amplie a busca.
- **O autor aparece como "Sistema"**: a operação foi feita por uma rotina automática, sem usuário conectado.
- **O histórico pode ser apagado ou editado?**: não. A tela é somente de consulta.
