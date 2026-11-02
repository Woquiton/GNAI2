---
titulo: Perfis e permissões: quem vê o quê no Gnai
resumo: Como funciona o controle de acesso do Gnai, como conceder permissões pelos cargos ou pelo acesso de administrador, e por que um item do menu pode não aparecer.
categoria: Gestão do núcleo
palavras-chave: permissão, permissões, perfil de acesso, perfis, acesso, controle de acesso, autorização, quem pode, liberar acesso, dar acesso, conceder permissão, retirar permissão, cargo, permissões do cargo, administrador, administrador interno, administrador superior, admin, professor, portal do professor, menu não aparece, item sumiu do menu, não vejo o menu, botão não aparece, acesso restrito, sem permissão, 403, entrar como, personificar, navegar como outro usuário, somente leitura, visualizar próprios, visualizar todos
ordem: 50
---

No Gnai, o que cada pessoa vê e pode fazer depende do tipo de conta e das permissões concedidas a ela. O menu lateral, os botões das telas (como **Cadastrar**, **Editar** e **Excluir**) e o próprio acesso a cada página seguem essas permissões. Não há uma tela separada de usuários: as contas são criadas junto com o cadastro do profissional ou do professor.

## Quais são os tipos de conta?

| Conta | Como é criada | O que pode fazer |
| --- | --- | --- |
| **Profissional da equipe** | Ao cadastrar o profissional em [Equipe](/ajuda/equipe). | O que as permissões do seu **cargo** permitem. |
| **Professor** | Ao cadastrar o professor em [Professores](/ajuda/professores). | Usa o Portal do Professor para acessar os alunos e as adaptações vinculados a ele. |
| **Administrador interno** | Profissional marcado como administrador da unidade. | Tem acesso a todas as funcionalidades, independentemente do cargo. |
| **Administrador superior** | Criado pela equipe técnica no servidor do Gnai. | Tem acesso total e é o único que concede ou retira o acesso de administrador. |

## Conceder permissões a um profissional

As permissões de um profissional vêm do cargo dele. Para liberar ou retirar algo:

1. Acesse **Gestão do núcleo → Cadastros → Cargos** e abra o cargo do profissional.
2. Clique em **Editar** e, em **Permissões do Cargo**, marque ou desmarque as permissões. Elas estão agrupadas por área e cada grupo tem **Selecionar Todas**.
3. Clique em **Salvar**.

A mudança vale para **todos** os profissionais daquele cargo. Para dar permissões diferentes a uma só pessoa, crie um cargo próprio e troque o **Cargo** dela em [Equipe](/ajuda/equipe#editar-um-profissional). Veja também [Cargos](/ajuda/cadastros-do-atendimento#cargos).

As permissões costumam vir em conjuntos por área: **Visualizar** (abre a listagem e o item do menu), **Criar**, **Editar** e **Excluir**. Algumas áreas têm permissões específicas, como **Gerar PDF**, **Visualizar todos** e **Visualizar próprios**.

> **Importante:** salvar as permissões de um cargo atualiza o acesso na hora. Já a troca do cargo de um profissional pode levar até uma hora para refletir; se precisar que valha imediatamente, salve novamente o cargo de destino.

## Como funciona o acesso dos professores?

Professores acessam o Portal do Professor com senha ou link enviado por e-mail. O portal verifica os vínculos com as disciplinas dos PEIs vigentes para permitir a consulta dos alunos e a edição das próprias adaptações. Não há concessão de permissões globais para contas de professor.

Se a mesma conta também estiver vinculada a um profissional da equipe, suas permissões nas áreas internas continuam sendo definidas pelo cargo desse profissional. Veja [Professores](/ajuda/professores).

## Tornar um profissional administrador

Somente o administrador superior do Gnai vê a opção **Definir este profissional como administrador interno da unidade**, no cadastro ou na edição do profissional. O administrador interno tem acesso a tudo, sem depender do cargo.

Também só o administrador superior pode inativar ou excluir um administrador interno, ou alterar o e-mail de acesso de outro administrador. A conta do administrador superior não é alterada pelas telas do Gnai.

## Por que um item do menu não aparece para mim?

Cada item do menu lateral só aparece quando a conta tem a permissão de visualizar aquela área:

- **Dashboard**, **Notificações** e **Sobre o Sistema** aparecem para todos.
- Os demais itens dependem da permissão **Visualizar** da área, por exemplo **Visualizar Alunos** para **Alunos** ou **Visualizar Relatórios** para **Relatórios**.
- O submenu **Cadastros** só aparece quando a conta pode ver pelo menos um dos cadastros dentro dele.
- O grupo inteiro some do menu quando nenhum de seus itens está liberado.

Se faltar um item, peça a quem administra os cargos que inclua a permissão no seu cargo.

## Por que um botão não aparece ou uma página mostra "Acesso Restrito"?

- Botões como **Cadastrar**, **Editar**, **Excluir**, **Ativar** ou **PDF** dependem das permissões correspondentes (**Criar**, **Editar**, **Excluir**, **Gerar PDF**...). Sem elas, o botão não é exibido.
- Ao abrir diretamente um endereço sem permissão, o Gnai mostra a página **Acesso Restrito**: "Você não tem as permissões necessárias para acessar este recurso."

As permissões são conferidas pelo próprio sistema a cada operação; esconder ou mostrar um botão é só uma consequência dessa regra.

## Ver somente os próprios registros ou todos

Em **Agendamentos**, **Atendimentos Especializados** e **Atendimentos Pedagógicos** existem duas permissões de visualização:

- **Visualizar todos**: o item do menu abre a listagem geral.
- **Visualizar próprios**: o item do menu abre apenas os registros do próprio profissional.

## Conferir o que outro usuário vê

O administrador superior pode usar **Entrar como**, na visualização de um profissional ou professor, para navegar com a conta daquela pessoa e conferir o menu e as permissões dela. Há dois modos:

| Modo | O que permite |
| --- | --- |
| **Somente leitura** | Apenas consulta. Cadastros, edições e exclusões ficam bloqueados. |
| **Acesso completo** | Usar o sistema livremente em nome do usuário. As alterações são auditadas com o nome do administrador. |

Durante o uso, o topo da tela indica a conta em uso e o modo selecionado, tanto na área da equipe quanto no Portal do Professor. Use o ícone de retorno **Voltar para a minha conta** para encerrar.

## Dúvidas comuns

- **"Usuário sem permissão de acesso."**: A conta não está ligada a um profissional ou professor. Procure o administrador.
- **"Somente o administrador superior do Gnai pode conceder ou retirar o acesso de administrador."**: Apenas o administrador superior altera essa opção.
- **"Este cargo está vinculado a um ou mais profissionais e não pode ser removido."**: Troque o cargo dos profissionais antes de excluí-lo.
- **Liberei a permissão e o item ainda não aparece**: Recarregue a página. Se você trocou o cargo do profissional, veja o aviso em [Conceder permissões a um profissional](#conceder-permissoes-a-um-profissional).
