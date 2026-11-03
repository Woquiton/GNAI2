---
titulo: Cadastros do atendimento: perfis de atendimento, cargos, semestres, disciplinas e cursos
resumo: Para que servem os cadastros de apoio do atendimento, onde são usados, como criá-los, ativá-los ou desativá-los e por que a exclusão pode ser bloqueada.
categoria: Gestão do núcleo
palavras-chave: cadastros, cadastros de apoio, tabelas auxiliares, perfil de atendimento, perfis de atendimento, deficiência, deficiências, cid, código cid, tea, tdah, altas habilidades, cargo, cargos, função, permissões do cargo, semestre, semestres, semestre atual, período letivo, ano letivo, disciplina, disciplinas, matéria, curso, cursos, séries, matriz curricular, grade curricular, período do curso, período da disciplina, nome repetido, virada de semestre, avançar alunos, novo semestre, retido, promover alunos, ativar, desativar, inativar, excluir cadastro, não pode ser excluído, tutorial, tour
ordem: 40
permissoes: deficiency.view, position.view, semester.view, discipline.view, course.view
---

Os cadastros de apoio do atendimento ficam em **Gestão do núcleo → Cadastros** e alimentam as listas usadas nos alunos, nos PEIs, na equipe e nos professores. Cada cadastro só aparece no menu para quem tem a permissão de visualizá-lo; editar, ativar ou desativar e excluir dependem de permissões próprias. Esta página trata de **Perfis de Atendimento**, **Cargos**, **Semestres**, **Disciplinas** e **Cursos**; os cadastros do Radar (recursos de acessibilidade, etiquetas, categorias de barreiras, instituições e localizações) têm artigo próprio, [Cadastros do Radar](/ajuda/cadastros-do-radar).

Em todos eles, os cadastros que já estão em uso não podem ser excluídos. Quando o cadastro tiver a opção, desative-o em vez de excluir: ele deixa de ser oferecido em novos vínculos, mas o histórico é preservado.

## Conhecer os cadastros com o tutorial

As telas de **Perfis de Atendimento**, **Cargos**, **Semestres**, **Disciplinas** e **Cursos**, inclusive a virada de semestre dos cursos, têm um tutorial na própria tela. Clique no botão com o ícone de informação, na barra do topo, para abrir. Ele mostra os filtros e a tabela das listagens, cada parte dos formulários e os botões do rodapé. Veja como navegar pelo tutorial em [Conhecer a tela com o tutorial](/ajuda/primeiros-passos#conhecer-a-tela-com-o-tutorial).

## Perfis de Atendimento

Registram as condições, características e necessidades educacionais dos estudantes, como deficiência, TEA, TDAH, altas habilidades/superdotação e dificuldades de aprendizagem, para apoiar o acompanhamento e os encaminhamentos.

**Onde são usados:** nos perfis de atendimento de cada aluno, no público-alvo dos itens e nas barreiras. Perfis desativados não podem ser vinculados a alunos.

### Cadastrar um perfil de atendimento

1. Acesse **Gestão do núcleo → Cadastros → Perfis de Atendimento** e clique em **Cadastrar perfil de atendimento**.
2. Preencha os campos e clique em **Salvar**. O sistema mostra "Deficiência criada com sucesso!".

| Campo | Observação |
| --- | --- |
| **Nome do Perfil** (obrigatório) | Por exemplo, "Deficiência Visual". Até 255 caracteres. |
| **Código CID** | Opcional, até 20 caracteres, por exemplo "F84.0". Não pode repetir o de outro perfil. |
| **Descrição / Detalhes** | Texto livre com formatação. |

O controle **Perfil Ativo**, abaixo de **Descrição / Detalhes** na seção **Identificação**, vem ligado no cadastro e pode ser alterado antes de salvar.

### Ativar, desativar ou excluir

Para ativar ou desativar, clique em **Editar**, altere **Perfil Ativo** e clique em **Salvar**. Para excluir, use **Excluir** na visualização do perfil. Perfis vinculados a solicitações de atendimento também não podem ser excluídos, para preservar o registro da demanda. Nesse caso, o sistema mostra "Este perfil está vinculado a solicitações de atendimento e não pode ser excluído." Perfis vinculados a algum aluno não podem ser desativados nem excluídos; o sistema mostra "Este perfil está vinculado a um ou mais alunos e não pode ser desativado."

## Cargos

Cargos descrevem as funções da equipe (por exemplo, Professor AEE ou Psicólogo) e **definem as permissões** de cada profissional: o profissional pode fazer no Gnai exatamente o que as permissões do seu cargo permitem. Veja [Perfis e permissões](/ajuda/perfis-e-permissoes).

**Onde são usados:** no campo **Cargo** do cadastro de profissionais em [Equipe](/ajuda/equipe). Só cargos ativos aparecem nesse campo.

### Cadastrar um cargo e escolher suas permissões

1. Acesse **Gestão do núcleo → Cadastros → Cargos** e clique em **Cadastrar cargo**.
2. Em **Identificação**, preencha **Nome do Cargo** (obrigatório) e, se quiser, a **Descrição**.
3. Em **Permissões do Cargo**, marque as permissões. Use **Selecionar todas as permissões**, no topo, para marcar ou desmarcar todas de uma vez. Elas estão agrupadas por área (Alunos, PEI, Itens, Relatórios...), e cada grupo também tem a opção **Selecionar Todas**. Você pode ajustar cada permissão individualmente depois.
4. Clique em **Salvar**. O sistema mostra "Cargo criado com sucesso!".

O controle **Cargo Ativo**, abaixo de **Descrição**, vem ligado no cadastro e pode ser alterado antes de salvar. Os nomes das permissões combinam a ação e a área, por exemplo **Visualizar Alunos**, **Criar Alunos**, **Editar Alunos**, **Excluir Alunos** ou **Gerar PDF Itens**.

> **Importante:** alterar as permissões de um cargo vale imediatamente para todos os profissionais que têm esse cargo.

### Ativar, desativar ou excluir

Para ativar ou desativar, clique em **Editar**, altere **Cargo Ativo** e clique em **Salvar**. Para excluir, use **Excluir** na visualização do cargo. Cargos vinculados a algum profissional não podem ser desativados nem excluídos; troque antes o cargo desses profissionais. As mensagens são "Este cargo está vinculado a um ou mais profissionais e não pode ser desativado." e "Este cargo está vinculado a um ou mais profissionais e não pode ser removido."

## Semestres

Os semestres organizam os períodos letivos. O **semestre atual** é o período selecionado por padrão nos novos registros do sistema.

**Onde são usados:** nos PEIs e nos documentos dos alunos.

### Cadastrar um semestre

1. Acesse **Gestão do núcleo → Cadastros → Semestres** e clique em **Cadastrar semestre**.
2. Na seção **Identificação**, preencha os campos e clique em **Salvar**. O sistema mostra "Semestre criado com sucesso."

| Campo | Observação |
| --- | --- |
| **Ano Letivo** (obrigatório) | Entre 1901 e 2155. |
| **Período** (obrigatório) | 1 ou 2. Não pode haver dois semestres com o mesmo ano e período. |
| **Data de Início** e **Data de Término** | Opcionais, mas, se uma for informada, a outra também precisa ser. O término não pode ser anterior ao início. |
| **Definir este como o semestre atual do sistema** | Toggle que define este semestre como atual; o atual anterior passa a ser histórico. |

O rótulo do semestre é gerado automaticamente a partir do ano e do período, por exemplo "2026.1".

### Definir o semestre atual

Na listagem, clique no botão **Definir como atual** da linha do semestre. O sistema mostra "Semestre definido como atual." Só existe um semestre atual por vez; os demais aparecem como **Histórico**. Também é possível marcar a opção ao cadastrar ou editar o semestre.

### Excluir um semestre

Use **Excluir** na listagem ou na visualização. A exclusão é bloqueada quando o semestre é o atual ("Não é possível excluir o semestre atual do sistema.") ou quando já tem registros vinculados ("Este semestre possui registros vinculados e não pode ser excluído."). Contam como registros vinculados: PEIs, PAEEs, estudos de caso, documentos de alunos, matrículas, períodos, reprovações, riscos e dependências aprovadas de alunos nesse semestre e vínculos de professores com disciplinas no semestre.

## Disciplinas

O catálogo de disciplinas (matérias) da instituição.

**Onde são usadas:** na matriz curricular dos cursos, na matriz de disciplinas de cada professor, nas adaptações curriculares do PEI e no histórico de cursos dos alunos. Só disciplinas ativas podem ser incluídas em cursos e atribuídas a professores.

### Cadastrar uma disciplina

1. Acesse **Gestão do núcleo → Cadastros → Disciplinas** e clique em **Cadastrar disciplina**.
2. Preencha **Nome da Disciplina** (obrigatório, até 255 caracteres, sem repetir o nome de outra disciplina), **Descrição** e **Disciplina Ativa** (já vem ligado).
3. Clique em **Salvar**. O sistema mostra "Disciplina cadastrada com sucesso."

Para que a disciplina possa ser usada, inclua-a na matriz de um curso (veja [Cursos](#cursos)). A visualização da disciplina mostra os cursos a que ela está vinculada.

### Inativar ou excluir uma disciplina

- **Inativar**: edite a disciplina e desligue **Disciplina Ativa** e clique em **Salvar**. Não é possível inativar uma disciplina que ainda está na matriz de algum curso ou atribuída a professores.
- **Excluir**: use **Excluir** na listagem ou na visualização. A exclusão é bloqueada quando a disciplina tem adaptações em PEIs, tem registros no histórico de cursos de alunos, está atribuída a professores ou está vinculada a cursos.

Para liberar a disciplina, retire-a antes da matriz dos cursos (editando o curso) e das matrizes dos professores (em **Professores → Gerenciar Disciplinas**).

## Cursos

Os cursos (e séries) da instituição, cada um com sua **matriz curricular**, isto é, as disciplinas que fazem parte dele. A tela tem o título **Cursos e Séries**.

**Onde são usados:** nas matrículas dos alunos em cursos, nos PEIs (as adaptações seguem as disciplinas do curso) e na matriz de disciplinas dos professores, que é organizada por curso. Cursos inativos não podem ser vinculados.

### Cadastrar um curso

1. Acesse **Gestão do núcleo → Cadastros → Cursos** e clique em **Cadastrar curso**.
2. Preencha **Nome do Curso** (obrigatório, até 255 caracteres, sem repetir o nome de outro curso) e, se quiser, a **Descrição**.
3. Em **Disciplinas do curso**, marque as disciplinas que compõem a matriz. Use **Buscar disciplina** para filtrar a lista; só aparecem disciplinas ativas.
4. Em **Períodos das Disciplinas**, escolha para cada disciplina marcada o período (semestre ou série) do curso em que ela é cursada, de 1º a 12º. O campo é opcional; sem período, a disciplina fica como **Sem período definido**.
5. Clique em **Salvar**. O sistema mostra "Curso cadastrado com sucesso."

O curso é criado ativo. Na edição aparece também o toggle **Curso Ativo**, e a matriz pode ser alterada a qualquer momento. A visualização do curso lista as disciplinas ordenadas por período.

### Para que serve o período da disciplina?

Quando a matrícula do aluno informa em que período do curso ele está no semestre, o PEI mostra primeiro as disciplinas desse período ao cadastrar as adaptações. Assim a equipe não precisa procurar na lista inteira do curso. Veja [PEI](/ajuda/pei#cadastrar-as-adaptacoes-por-disciplina).

### Fazer a virada de semestre dos alunos

No início de cada semestre, registre de uma vez o período de todos os alunos do curso, em vez de editar matrícula por matrícula.

1. Abra o curso em **Gestão do núcleo → Cadastros → Cursos** e clique em **Virada de semestre** no rodapé. O botão aparece para quem pode editar matrículas de alunos.
2. Em **Registrar os alunos em**, confira o semestre de destino. A tela abre no semestre atual; ao trocar de semestre, as escolhas não salvas são descartadas.
3. A lista mostra os alunos ativos com matrícula vigente no curso e o período de cada um no último semestre anterior. Por padrão, todos avançam um período.
4. Marque só as exceções: **Permanece**, para quem fica no mesmo período, ou **Não registrar**, para quem não deve entrar no semestre, como quem trancou. Use **Todos avançam** ou **Nenhum registrado** para mudar a lista inteira.
5. Para alunos sem período registrado antes, escolha o **Período** no novo semestre.
6. Clique em **Salvar**. O sistema mostra, por exemplo, "32 alunos registrados em 2026.2."

A virada grava o período de cada aluno no semestre e passa a matrícula para esse semestre e o ano dele. Alunos que já tinham período no semestre de destino aparecem como **Não registrar** e com o aviso **Já registrado**; escolha outra opção só se quiser substituir o período. Quem já está no último período aceito, o 12º, aparece como **Permanece**.

Reprovações, riscos e dependências continuam sendo informados na matrícula de cada aluno. Veja [Reprovações, riscos e dependências por semestre](/ajuda/alunos#reprovacoes-riscos-e-dependencias-por-semestre). Para os professores, use também **Copiar vínculos de** na listagem de professores. Veja [Copiar os vínculos do semestre anterior](/ajuda/professores#copiar-os-vinculos-do-semestre-anterior).

### Retirar uma disciplina da matriz

Desmarque a disciplina na edição do curso e salve. Os vínculos de professores com essa disciplina naquele curso são removidos junto. A retirada é bloqueada quando há adaptações de PEI ou registros de reprovação e risco dos alunos do curso nessa disciplina.

### Inativar ou excluir um curso

- **Inativar**: edite o curso e desligue **Curso Ativo** e clique em **Salvar**. Não é possível quando há alunos vinculados ao curso ("Este curso está vinculado a um ou mais alunos e não pode ser desativado.").
- **Excluir**: use **Excluir** na listagem ou na visualização. A exclusão é bloqueada quando há alunos vinculados ao curso ("Este curso está vinculado a um ou mais alunos e não pode ser excluído.") ou PEIs do curso ("Este curso possui PEIs vinculados e não pode ser excluído.").

## Dúvidas comuns

- **"O código CID informado já está cadastrado."**: Já existe um perfil de atendimento com esse CID.
- **"Já existe um semestre cadastrado para este ano e período."**: Edite o semestre existente em vez de criar outro.
- **"Não é possível inativar a disciplina '...' pois ela está vinculada a um ou mais cursos."**: Retire a disciplina da matriz dos cursos antes de inativá-la.
- **"Não é possível inativar a disciplina '...' pois ela está atribuída a professores."**: Retire a disciplina das matrizes dos professores.
- **"Não é possível excluir a disciplina '...' pois ela possui registros no histórico de cursos de alunos."**: A disciplina já tem histórico e não pode ser excluída; mantenha-a cadastrada.
- **"Não é possível excluir a disciplina '...' pois ela possui adaptações em PEIs."**: A disciplina já foi usada em PEIs e precisa ser mantida.
- **"Não é possível retirar da matriz: ..."**: As disciplinas citadas têm adaptações de PEI ou registros de reprovação e risco de alunos do curso. Mantenha-as na matriz.
- **"A lista mudou enquanto você editava: um dos alunos não tem mais matrícula vigente neste curso. Recarregue a página e tente novamente."**: Algum aluno mudou de curso ou de situação durante a virada. Abra a tela de novo.
- **"O aluno já está no último período aceito. Escolha "Permanece" ou "Não registrar"."**: O aluno não pode avançar além do 12º período.
- **"Já existe um curso com esse nome."** ou **"Já existe uma disciplina com esse nome."**: Use o cadastro existente ou escolha outro nome.
- **"Este cargo está desativado e não pode ser vinculado a um profissional."**: Ative o cargo antes de usá-lo no cadastro da equipe.
- **Um cadastro não aparece em um formulário**: Confira se ele está ativo. Perfis, cargos, disciplinas e cursos desativados não são oferecidos em novos vínculos.
