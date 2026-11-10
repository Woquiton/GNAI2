---
titulo: Professores: cadastro, disciplinas e acesso ao Portal do Professor
resumo: Como cadastrar professores, atribuir as disciplinas de cada curso, dar acesso ao Portal do Professor com senha ou link por e-mail.
categoria: Gestão do núcleo
palavras-chave: professor, professores, semestre do professor, copiar vínculos, copiar do semestre anterior, virada de semestre, docente, docentes, corpo docente, cadastrar professor, novo professor, matrícula, disciplinas do professor, gerenciar disciplinas, matriz curricular, atribuir disciplina, vincular disciplina, disciplina por curso, curso, portal do professor, acesso do professor, link de acesso, e-mail institucional, senha do professor, adaptação do pei, excluir professor, foto, tutorial, tour
ordem: 30
permissoes: teacher.view
---

Os **Professores** são os docentes que recebem as adaptações dos PEIs dos alunos. Cada professor tem uma **matriz curricular**, com as disciplinas que leciona em cada curso, e uma conta de acesso ao **Portal do Professor**, onde consulta seus alunos e preenche as adaptações. A tela fica em **Gestão do núcleo → Professores**.

## Conhecer as telas com o tutorial

A listagem, o cadastro, a edição, a visualização do professor e a tela **Gerenciar Disciplinas** têm um tutorial na própria tela. Clique no botão com o ícone de informação, na barra do topo, para abrir. Ele mostra os filtros e a tabela da listagem, cada seção do formulário, a escolha do semestre e das disciplinas por curso e os botões do rodapé. Veja como navegar pelo tutorial em [Conhecer a tela com o tutorial](/ajuda/primeiros-passos#conhecer-a-tela-com-o-tutorial).

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

As disciplinas são atribuídas por curso e por semestre letivo, porque o mesmo professor pode lecionar disciplinas diferentes em cada curso e mudar de disciplina a cada semestre.

1. Abra o professor na listagem e clique em **Gerenciar Disciplinas**.
2. Em **Semestre dos vínculos**, confira o semestre. A tela abre no semestre atual; ao trocar de semestre, as alterações não salvas são descartadas.
3. Cada curso aparece em um bloco com as suas disciplinas. Marque as que o professor leciona naquele curso no semestre escolhido, ou use **Selecionar todas**.
4. Clique em **Salvar**. O sistema mostra "Matriz curricular atualizada com sucesso!".

Só aparecem cursos ativos e, em cada um, as disciplinas ativas que fazem parte da matriz curricular do curso. Vínculos com cursos ou disciplinas que foram inativados não aparecem na tela e são mantidos ao salvar. Se a tela mostrar "Nenhum curso ou disciplina disponível para atribuição.", cadastre ou ative cursos e disciplinas em **Gestão do núcleo → Cadastros** e inclua as disciplinas no curso. Veja [Cursos](/ajuda/cadastros-do-atendimento#cursos) e [Disciplinas](/ajuda/cadastros-do-atendimento#disciplinas).

As atribuições aparecem na visualização do professor, agrupadas por semestre e curso, do semestre mais recente para o mais antigo.

## Copiar os vínculos do semestre anterior

Na virada de semestre, não é preciso marcar tudo de novo.

- **De todos os professores**: na listagem de **Professores**, clique em **Copiar vínculos de** seguido do semestre anterior e confirme. As disciplinas que cada professor tinha no semestre anterior mais recente com vínculos são copiadas para o semestre atual.
- **De um professor**: em **Gerenciar Disciplinas**, com o semestre de destino escolhido, clique em **Copiar vínculos de** seguido do semestre anterior e confirme.

A cópia mantém os vínculos que já existem no semestre de destino e não copia vínculos com cursos ou disciplinas inativos, nem com disciplinas que saíram da matriz do curso. Depois de copiar, ajuste em **Gerenciar Disciplinas** apenas o que mudou. O botão só aparece quando existe um semestre anterior com vínculos.

### Para que serve a matriz do professor?

Ao cadastrar as adaptações curriculares de um PEI, cada disciplina só aceita como responsável um professor que tenha essa disciplina atribuída no curso do PEI, no mesmo semestre do PEI. Disciplinas sem professor nesse semestre mostram o aviso "Nenhum professor vinculado a esta disciplina neste curso no semestre do PEI." Veja [PEI](/ajuda/pei#cadastrar-as-adaptacoes-por-disciplina).

Professores que entram no Gnai veem na listagem de alunos somente os alunos matriculados hoje nos cursos em que lecionam no semestre atual. Nos PEIs, veem apenas os PEIs em que são responsáveis por alguma adaptação.

## Como o professor acessa o Gnai?

O cadastro do professor é necessário tanto para o acesso com senha quanto para solicitar o link por e-mail. O próprio professor solicita esse link na tela de login; a equipe não precisa gerar o token manualmente. Não existe uma matriz de permissões globais para professores.

Professores usam o **Portal do Professor**, uma área própria, sem o menu lateral, que mostra os alunos com PEI vigente vinculado a ele e permite editar as suas adaptações. Há duas formas de entrar:

- **Com senha**: pela tela de login, com o **E-mail de Acesso** e a senha definida no cadastro ou pelo link recebido por e-mail.
- **Sem senha**: na tela de login, o professor clica em **Sou professor(a): entrar com e-mail**, informa o e-mail e clica em **Enviar link**. O link chega por e-mail, vale por 24 horas e só pode ser usado uma vez; ao abri-lo, o professor clica em **Confirmar e acessar**.

Mais detalhes em [Portal do Professor](/ajuda/portal-do-professor).

> **Importante:** o professor só vê no portal os alunos cujo PEI vigente tem uma disciplina atribuída a ele. Cadastrar o professor e a matriz curricular não basta; é preciso vinculá-lo às disciplinas do PEI.

## Editar ou excluir um professor

- **Editar**: abra o professor, clique em **Editar**, altere os dados e clique em **Salvar**. O sistema mostra "Professor atualizado com sucesso." Alterar o e-mail muda também o login do professor.
- **Excluir**: clique em **Excluir** na listagem ou na visualização e confirme. O sistema mostra "Professor removido com sucesso." A exclusão remove a matriz curricular e a conta de acesso do professor, exceto quando a conta é compartilhada com a Equipe. Nesse caso, o acesso da equipe permanece. A pessoa e sua foto ficam preservadas no [cadastro central de pessoas](/ajuda/pessoas).

A exclusão é bloqueada quando o professor já tem adaptações registradas em algum PEI ou quando a conta dele é autora de PEI, PAEE ou estudo de caso. Esses registros guardam quem os criou e não podem perder essa informação.

## Dúvidas comuns

- **"Este e-mail já está cadastrado para outra pessoa."**: O e-mail já pertence a outro professor, profissional, aluno ou responsável. Cada conta precisa de um e-mail próprio.
- **"Esta matrícula já está em uso."**: Outro professor já tem essa matrícula.
- **"Não é possível excluir este professor pois ele possui registros de acompanhamento em Planos Educacionais Individualizados (PEI)."**: O professor já tem adaptações em PEIs e o cadastro precisa ser mantido.
- **"Não é possível excluir este professor pois o usuário dele é autor de registros de PEI, PAEE ou estudo de caso."**: A conta do professor criou registros pedagógicos e o cadastro precisa ser mantido.
- **"O professor selecionado não está vinculado à disciplina neste curso no semestre do PEI."**: Ao montar o PEI, atribua antes a disciplina ao professor no curso do aluno e no semestre do PEI, em **Gerenciar Disciplinas**, ou copie os vínculos do semestre anterior.
- **"Não há vínculos de professores em semestres anteriores a ... para copiar."**: Ainda não existe semestre anterior com vínculos. Atribua as disciplinas em **Gerenciar Disciplinas**.
- **"Uma ou mais disciplinas informadas não pertencem ao curso ... ou estão inativas."**: A matriz do curso ou o status da disciplina mudou enquanto você editava. Abra **Gerenciar Disciplinas** novamente.
- **"Este link de acesso é inválido, já foi usado ou expirou."**: O professor deve pedir um novo link pela opção **Sou professor(a): entrar com e-mail**.
- **O professor não vê um aluno no portal**: Confira se o PEI do aluno é o vigente e se tem uma disciplina atribuída a esse professor.

## Filtrar pelo período de cadastro

Nas listagens, abra **Mais filtros** e use **Cadastrado a partir de** e **Cadastrado até** para consultar registros pelo dia em que foram cadastrados. Você pode preencher só uma das datas ou as duas; os dias informados entram no resultado. Esses campos podem ser combinados com os demais filtros.

A lista se atualiza automaticamente. O número ao lado de **Mais filtros** indica quantos filtros estão preenchidos nessa área. Use a borracha para limpar todos os filtros. No celular, abra **Filtros** para encontrar **Mais filtros**.

### Filtros de professores

Em **Mais filtros**, pesquise por curso ou disciplina vinculada ao professor. Os vínculos de qualquer semestre entram nessa pesquisa. Combine esses critérios com os demais campos da listagem. Campos de texto aceitam parte do valor.
