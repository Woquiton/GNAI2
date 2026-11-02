---
titulo: Professores: cadastro, disciplinas e acesso ao Portal do Professor
resumo: Como cadastrar professores, atribuir as disciplinas de cada curso, dar acesso ao Portal do Professor e definir as permissões globais dos professores.
categoria: Gestão do núcleo
palavras-chave: professor, professores, docente, docentes, corpo docente, cadastrar professor, novo professor, matrícula, disciplinas do professor, gerenciar disciplinas, matriz curricular, atribuir disciplina, vincular disciplina, disciplina por curso, curso, portal do professor, acesso do professor, link de acesso, e-mail institucional, senha do professor, permissões globais, permissões dos professores, adaptação do pei, excluir professor, foto
ordem: 30
permissoes: teacher.view
---

Os **Professores** são os docentes que recebem as adaptações dos PEIs dos alunos. Cada professor tem uma **matriz curricular**, com as disciplinas que leciona em cada curso, e uma conta de acesso ao **Portal do Professor**, onde consulta seus alunos e preenche as adaptações. A tela fica em **Gestão do núcleo → Professores**.

## Cadastrar um professor

1. Acesse **Gestão do núcleo → Professores** e clique em **Cadastrar professor**.
2. Preencha as seções **Dados Pessoais**, **Dados Docentes** e **Acesso ao Sistema** (veja a tabela abaixo).
3. Clique em **Salvar**.

O sistema volta para a listagem com uma destas mensagens:

- Sem senha informada: "Professor cadastrado com sucesso. O link para definição da senha foi enviado por e-mail."
- Com senha informada: "Professor cadastrado com sucesso. O acesso já pode ser feito com a senha definida."

Depois do cadastro, atribua as disciplinas do professor (veja a próxima seção).

| Campo | Observação |
| --- | --- |
| **Foto do Professor** | Clique, arraste a imagem ou use a câmera. JPG ou PNG, até 2 MB. |
| **Nome Completo** (obrigatório) | Até 255 caracteres. |
| **E-mail de Acesso** (obrigatório) | É o login do professor e o endereço que recebe os links de acesso. Use o e-mail institucional. Não pode repetir o de outra pessoa ou usuário. |
| **CPF** | Opcional; se informado, precisa ser válido e não pode estar cadastrado para outra pessoa. |
| **Data de Nascimento** (obrigatório) | |
| **Gênero** (obrigatório) | Masculino, Feminino, Outro ou Não informado. |
| **Telefone** | Opcional. |
| **Endereço Residencial** | Opcional, com formatação. |
| **Número de Matrícula** (obrigatório) | Até 50 caracteres; não pode repetir a de outro professor. |
| **Senha de acesso** e **Confirmar senha** | Opcionais. Mínimo de 8 caracteres, com letras e números. Em branco, o professor recebe por e-mail o link para criar a senha. |

## Atribuir disciplinas ao professor

As disciplinas são atribuídas por curso, porque o mesmo professor pode lecionar disciplinas diferentes em cada curso.

1. Abra o professor na listagem e clique em **Gerenciar Disciplinas**.
2. Na tela **Matriz curricular**, cada curso aparece em um bloco com as suas disciplinas. Marque as que o professor leciona naquele curso, ou use **Selecionar todas**.
3. Clique em **Salvar**. O sistema mostra "Matriz curricular atualizada com sucesso!".

Só aparecem cursos ativos e, em cada um, as disciplinas ativas que fazem parte da matriz curricular do curso. Se a tela mostrar "Nenhum curso ou disciplina disponível para atribuição.", cadastre ou ative cursos e disciplinas em **Gestão do núcleo → Cadastros** e inclua as disciplinas no curso. Veja [Cursos](/ajuda/cadastros-do-atendimento#cursos) e [Disciplinas](/ajuda/cadastros-do-atendimento#disciplinas).

As atribuições aparecem na visualização do professor, agrupadas por curso.

### Para que serve a matriz do professor?

Ao cadastrar as adaptações curriculares de um PEI, cada disciplina só aceita como responsável um professor que tenha essa disciplina atribuída no curso do PEI. Disciplinas sem professor na matriz mostram o aviso "Nenhum professor vinculado a esta disciplina na matriz curricular." Veja [PEI](/ajuda/pei#cadastrar-as-adaptacoes-por-disciplina).

## Como o professor acessa o Gnai?

Professores usam o **Portal do Professor**, uma área própria, sem o menu lateral, que mostra os alunos com PEI vigente vinculado a ele e permite editar as suas adaptações. Há duas formas de entrar:

- **Com senha**: pela tela de login, com o **E-mail de Acesso** e a senha definida no cadastro ou pelo link recebido por e-mail.
- **Sem senha**: na tela de login, o professor clica em **Sou professor(a): entrar com e-mail institucional**, informa o e-mail e clica em **Enviar link**. O link chega por e-mail, vale por 24 horas e só pode ser usado uma vez; ao abri-lo, o professor clica em **Confirmar e acessar**.

Mais detalhes em [Portal do Professor](/ajuda/portal-do-professor).

> **Importante:** o professor só vê no portal os alunos cujo PEI vigente tem uma disciplina atribuída a ele. Cadastrar o professor e a matriz curricular não basta; é preciso vinculá-lo às disciplinas do PEI.

## Definir as permissões globais dos professores

Além do portal, os professores podem receber permissões do sistema. Elas são **globais**: valem para todas as contas de professor ao mesmo tempo, sem distinção.

1. Em **Gestão do núcleo → Professores**, clique em **Permissões**, no cabeçalho da listagem.
2. Na tela **Permissões globais de professores**, marque as permissões em cada grupo, ou use **Selecionar todas**.
3. Clique em **Salvar**. O sistema mostra "Permissões globais de professores atualizadas!".

Os botões **Permissões** e **Gerenciar Disciplinas** só aparecem para quem pode editar professores.

## Editar ou excluir um professor

- **Editar**: abra o professor, clique em **Editar**, altere os dados e clique em **Salvar**. O sistema mostra "Professor atualizado com sucesso." Alterar o e-mail muda também o login do professor.
- **Excluir**: clique em **Excluir** na listagem ou na visualização e confirme. O sistema mostra "Professor removido com sucesso." A exclusão remove também a conta de acesso e a matriz curricular do professor.

A exclusão é bloqueada quando o professor já tem adaptações registradas em algum PEI.

## Dúvidas comuns

- **"Este e-mail já está cadastrado para outra pessoa."**: O e-mail já pertence a outro professor, profissional, aluno ou responsável. Cada conta precisa de um e-mail próprio.
- **"Esta matrícula já está em uso."**: Outro professor já tem essa matrícula.
- **"Não é possível excluir este professor pois ele possui registros de acompanhamento em Planos Educacionais Individualizados (PEI)."**: O professor já tem adaptações em PEIs e o cadastro precisa ser mantido.
- **"O professor selecionado não está vinculado à disciplina neste curso."**: Ao montar o PEI, atribua antes a disciplina ao professor no curso do aluno, em **Gerenciar Disciplinas**.
- **"Uma ou mais disciplinas informadas não pertencem ao curso ... ou estão inativas."**: A matriz do curso ou o status da disciplina mudou enquanto você editava. Abra **Gerenciar Disciplinas** novamente.
- **"Este link de acesso é inválido, já foi usado ou expirou."**: O professor deve pedir um novo link pela opção **Sou professor(a): entrar com e-mail institucional**.
- **O professor não vê um aluno no portal**: Confira se o PEI do aluno é o vigente e se tem uma disciplina atribuída a esse professor.
