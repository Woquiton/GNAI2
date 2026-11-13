# Autenticação e segurança de sessões

A configuração de infraestrutura fica no [guia de operação](../docs/operations/README.md). Os fluxos de uso estão nos artigos de [acesso](../resources/help/acesso-ao-sistema.md) e [perfis e permissões](../resources/help/perfis-e-permissoes.md).

## Bloqueio e encerramento por inatividade

Os limites são gerenciados em **Sistema → Configurações → Segurança e sessões**,
em minutos, com as permissões existentes de consulta e alteração de configurações.
Os valores salvos na tabela de configurações prevalecem sobre o `.env` e alcançam
as sessões abertas na próxima verificação. Enquanto nada for salvo, o `.env`
fornece os valores iniciais:

```env
SESSION_LOCK_AFTER=15
SESSION_LOGOUT_AFTER=60
```

O primeiro limite bloqueia a tela de contas com senha própria; o segundo encerra
completamente a sessão, contado desde a última atividade, inclusive enquanto a
tela está bloqueada. O formulário exige encerramento maior que o bloqueio. Os valores iniciais
inválidos do ambiente são ajustados para um minuto acima do bloqueio. O middleware
de configurações garante que o tempo de vida da sessão Laravel seja pelo menos
o prazo de encerramento salvo, antes de a sessão ser carregada.
Depois de alterar as variáveis, atualize o cache de configuração se ele estiver em uso.

Requisições automáticas não contam como atividade. O estado é compartilhado entre
as abas da mesma sessão, usando o cache Laravel e seus locks atômicos. Use um
cache persistente e compartilhado pelos processos da aplicação, como o `database`
já configurado no projeto. Limpar esse cache encerra as sessões no próximo acesso,
para impedir que a perda do estado remova um bloqueio. A tela bloqueada exige a
senha para retomar o acesso.
Professores que só acessam por link não passam pela tela de senha, mas também são
desconectados por inatividade e precisam solicitar outro link. O acesso por link
não mantém mais um cookie de login permanente.

A migration `2026_11_10_000037_create_users_table.php` registra se
uma conta de professor tem senha própria. Para contas antigas, não é possível
inferir isso pelo hash, pois o acesso por link também gerava uma senha aleatória.
Um login bem-sucedido com senha, a definição no perfil ou a redefinição de senha
confirma essa condição. Cadastros novos com senha também são identificados.
Sessões antigas passam a contar a inatividade a partir do primeiro acesso após
a atualização. Durante a personificação, aplica-se o encerramento automático;
o bloqueio por senha fica disponível ao retornar à própria conta.
