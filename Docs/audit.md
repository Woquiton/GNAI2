# Auditoria

O histórico de alterações registra toda criação, alteração, exclusão e restauração dos registros de negócio do Gnai. A consulta fica no item **Auditoria** do grupo **Sistema** da sidebar (`/auditoria`), protegida pela permissão `audit.index`. Administradores têm acesso por padrão; para outros cargos, conceda a permissão depois de sincronizar o catálogo com `php artisan permissions:sync`.

O registro usa o autor autenticado, o administrador que representa outro perfil e o contexto da operação. A ajuda de uso está em [Auditoria](../resources/help/auditoria.md).

## Como funciona

- O middleware `StartAuditOperation`, no grupo `web`, abre uma operação por requisição e guarda rota, método, URL (sem query string), IP e navegador para o log técnico.
- Models que implementam `Auditable` e usam a trait `AuditsChanges` são observados pelo `AuditObserver` (`created`, `updated`, `deleting`/`deleted`, `restored`).
- `RecordAuditChangeAction` grava em `audit_records` dentro da mesma transação da operação: se ela for desfeita, o registro vai junto. Várias gravações do mesmo registro na mesma requisição viram uma linha só; campo que volta ao valor inicial sai do registro.
- O autor é o usuário autenticado no momento da gravação. No "entrar como", o administrador original fica em `impersonator_*` e a frase mostra "Admin em nome de Maria". Sem usuário (comandos agendados), o autor é "Sistema".
- Nomes de chaves estrangeiras e de listas de ids são gravados no momento da mudança (`referenced_names`), então o histórico mostra o nome que valia mesmo após renomear ou excluir o registro apontado. Quando o nome mora em outra tabela, use o caminho pela relação, como `person.name`.
- A tela apresenta cada registro em linguagem simples e alterna para o log técnico cru, sem nova requisição.

## Autenticação, inspeção e operações sem campos

`RecordAuditActivityAction` grava eventos sem mudanças de campos: login com senha,
logout, desbloqueio de uma sessão travada, início e fim da inspeção e consultas GET durante a inspeção de perfis.
O desbloqueio usa `session_unlocked` somente após persistir a transição de uma sessão travada para ativa, sem registrar a senha. Sessões expiradas, senha inválida e sessão já ativa não geram esse evento.
Os dados de identidade são capturados antes de a sessão ser encerrada ou trocada.
A frase de início identifica quem inspecionou e qual perfil foi acessado; ações
seguintes mostram "Administrador em nome de Usuário". O contexto marca segurança
`elevated` e o modo de personificação. O filtro de autor encontra ambos.

O middleware também registra como `processed` requisições autenticadas de escrita,
com rota nomeada e sem auditoria detalhada na operação, quando não há resposta ou
flash de erro. Isso comprova o processamento da requisição, sem afirmar quais
campos mudaram. Rota e status ficam no contexto técnico; a apresentação usa os
nomes das áreas da navegação, inclusive para registros antigos de operações.

GETs normais e atualizações automáticas `session.activity` e `session.status`
não geram esse registro complementar. Login por link do professor não deve ser
presumido coberto pelo evento de login com senha. Os campos `social_links` e
`sections` da configuração do site também são auditados.

## Tornar um model auditável

1. `implements Auditable` e `use AuditsChanges;` (`app/Domains/Domain/Contracts/Audit` e `app/Domains/Infrastructure/Eloquent/Audit`).
2. `auditType()`: apelido estável em snake_case. Nunca mude depois de publicado, pois os registros antigos dependem dele.
3. `auditLabel()`: nome do tipo em pt-BR, usado no filtro.
4. `auditedFields()`: lista branca de colunas com rótulo e formato (`AuditedField::text`, `richText`, `number`, `money`, `date`, `dateTime`, `time`, `boolean`, `enum`, `reference`, `list`, `file`, `secret`). Senhas e tokens usam `secret`: o valor nunca é gravado.
5. `unauditedFields()`: colunas deliberadamente fora, além de `id` e timestamps. Toda coluna nova precisa entrar em uma das duas listas.
6. `auditDescription()`: como o registro aparece na frase, com artigo ("o aluno Maria Souza").
7. Registre a classe em `AuditableEntities` no provider responsável pelos models (AuthServiceProvider, BackupServiceProvider, ResourceServiceProvider, WebsiteServiceProvider). Sem o registro, o tipo não aparece no filtro e os rótulos não são resolvidos.

## Atividades recentes do painel

O feed do painel lê o mesmo histórico, filtrado aos documentos do AEE listados em `ActivityFeedSource` (`app/Domains/Domain/Enums/Dashboard`): Estudo de Caso, PAEE, adaptação curricular do PEI, avaliação individual AEE e atendimento pedagógico. A frase é a mesma da tela de Auditoria. O item vira link quando o documento ainda existe e o usuário tem a permissão de visualizá-lo. Professores veem só os documentos dos alunos com quem têm PEI vigente.

Para incluir um documento no feed, torne o model auditável e acrescente um caso ao enum com permissão, rota e vínculo com o aluno.

## Escritas fora dos eventos do Eloquent

`sync()`, `attach()` e `detach()` em pivôs sem classe própria, `query()->update()`, `insert` e `DB::table()` não disparam eventos. Nesses casos:

- Declare o campo como `AuditedField::list(..., model: X::class)` e devolva os ids atuais em `auditExtraValues()`, para que entrem nas fotos de criação e exclusão.
- Leia os ids antes, faça a escrita e chame `$model->recordAuditFieldChange('campo', $antes, $depois)`. A mudança é fundida com o registro do model na mesma operação: "criou o cargo X" já traz as permissões.
- Prefira `save()` por registro a escritas em massa quando o volume for pequeno.

## Fora de escopo

- Auditoria de leituras fora da inspeção e de falhas de autenticação.
- Retenção ou expurgo automático e exportação do histórico.
- Histórico de um registro a partir da tela dele.
