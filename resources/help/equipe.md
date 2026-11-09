---
titulo: Equipe: profissionais e tutores de pares
resumo: Como cadastrar profissionais da equipe, vincular o cargo que define suas permissões, criar o acesso ao sistema, enviar foto, inativar e excluir.
categoria: Gestão do núcleo
palavras-chave: equipe, profissional, profissionais, tutor de pares, tutores, servidor, funcionário, colaborador, cadastrar profissional, novo profissional, cargo, função, matrícula, data de ingresso, admissão, foto, senha, senha inicial, link de definição de senha, acesso ao sistema, criar usuário, conta, login do profissional, administrador, administrador interno, aparece no site, página de equipe, inativar profissional, desativar, status, excluir profissional, entrar como, tutorial, tour
ordem: 20
permissoes: professional.view
---

A **Equipe** reúne os profissionais do núcleo e também os tutores de pares, que usam o mesmo cadastro. Cada profissional tem um **cargo**, e é o cargo que define o que ele pode ver e fazer no Gnai. Ao cadastrar um profissional, o sistema já cria a conta de acesso dele. A tela fica em **Gestão do núcleo → Equipe**, com o título **Profissionais**.

## Conhecer as telas com o tutorial

A listagem, o cadastro, a edição e o perfil do profissional têm um tutorial na própria tela. Clique no botão com o ícone de informação, na barra do topo, para abrir. Ele mostra os filtros e a tabela da listagem, cada seção do formulário, a criação do acesso ao sistema e os botões do rodapé. Veja como navegar pelo tutorial em [Conhecer a tela com o tutorial](/ajuda/primeiros-passos#conhecer-a-tela-com-o-tutorial).

## O que preciso antes de cadastrar um profissional?

- **Um cargo ativo** em **Gestão do núcleo → Cadastros → Cargos**, com as permissões que o profissional deve ter. Só cargos ativos aparecem no formulário. Veja [Cargos](/ajuda/cadastros-do-atendimento#cargos).
- **Um e-mail que ainda não esteja em uso** por outra pessoa ou outro usuário do sistema. Esse e-mail será o login do profissional.

## Cadastrar um profissional

1. Acesse **Gestão do núcleo → Equipe** e clique em **Cadastrar profissional**.
2. Preencha as seções **Dados da Pessoa**, **Dados do Profissional** e **Acesso ao Sistema** (veja as tabelas abaixo).
3. Clique em **Salvar**.

O sistema volta para a listagem com uma destas mensagens:

- Sem senha informada: "Profissional cadastrado com sucesso. O link para definição da senha foi enviado por e-mail."
- Com senha informada: "Profissional cadastrado com sucesso. O acesso já pode ser feito com a senha definida."

### Dados da Pessoa

| Campo | Observação |
| --- | --- |
| **Foto do Profissional** | Clique, arraste a imagem ou use a câmera. JPG ou PNG, até 2 MB. |
| **Nome** (obrigatório) | De 3 a 255 caracteres. |
| **E-mail** (obrigatório) | Também é o login. Não pode repetir o de outra pessoa ou usuário. |
| **CPF** | Opcional, mas, se informado, precisa ser válido e não pode estar cadastrado para outra pessoa. |
| **Nascimento** (obrigatório) | Não pode ser uma data futura. |
| **Gênero** (obrigatório) | Masculino, Feminino, Outro ou Não informado. |
| **Telefone** | 10 ou 11 dígitos, com DDD. |
| **Endereço** | Texto com formatação, até 500 caracteres. |

### Dados do Profissional

| Campo | Observação |
| --- | --- |
| **Cargo** (obrigatório) | Define as permissões do profissional no sistema. |
| **Matrícula** (obrigatório) | Até 50 caracteres; não pode repetir a de outro profissional. |
| **Data de Ingresso** (obrigatório) | Não pode ser anterior à data de nascimento. |
| **Aparece no site** | Exibe o profissional, com foto, nome e cargo, na página de equipe do site. Profissionais inativos não aparecem. |
| **Definir este profissional como administrador interno da unidade** | Só aparece para o administrador superior do Gnai. Veja [Perfis e permissões](/ajuda/perfis-e-permissoes). |

### Acesso ao Sistema

| Campo | Observação |
| --- | --- |
| **Senha de acesso** | Opcional. Mínimo de 8 caracteres, com letras e números. |
| **Confirmar senha** | Repita a senha informada. |

Deixe a senha em branco para que o profissional receba por e-mail um link para criar a própria senha. Essa seção só existe no cadastro; depois, o profissional troca a senha pelo [próprio perfil](/ajuda/minha-conta#trocar-minha-senha) ou pela opção de recuperar senha da tela de login.

## Editar um profissional

1. Na listagem, abra o profissional e clique em **Editar**.
2. Altere os dados e clique em **Salvar**. O sistema mostra "Profissional atualizado com sucesso."

Na edição aparece também o campo **Status** (obrigatório), com as opções **Ativo** e **Inativo**. Ao trocar o **Cargo**, as permissões do profissional passam a ser as do novo cargo. Alterar o **E-mail** muda também o login do profissional.

Para trocar a foto, envie outra imagem; para retirá-la, use a opção de remover no próprio campo da foto e salve.

## Inativar um profissional

Edite o profissional, mude o **Status** para **Inativo** e salve. A inativação é bloqueada quando o profissional:

- tem pendências em aberto atribuídas a ele;
- tem atendimentos registrados.

Profissionais inativos deixam de aparecer na página de equipe do site.

## Excluir um profissional

1. Na listagem ou na visualização do profissional, clique em **Excluir**.
2. Confirme na janela **Excluir Profissional**. O sistema mostra "Profissional removido com sucesso."

A pessoa e sua foto permanecem no [cadastro central de pessoas](/ajuda/pessoas). A exclusão remove também a conta de acesso do profissional, exceto quando ela é compartilhada com o papel de Professor. Nesse caso, o acesso de professor permanece, sem os privilégios administrativos da equipe. Ela é bloqueada quando o profissional tem atendimentos, pendências atribuídas, empréstimos, registros na fila de espera, barreiras em que aparece como afetado, documentos de alunos enviados por ele ou quando a conta dele é autora de PEI, PAEE, estudo de caso, contribuições, revisões ou adaptações. Nesses casos, prefira inativá-lo. Ninguém pode excluir o próprio registro de profissional.

## Encontrar um profissional

Use os filtros da listagem: **Nome do profissional**, **E-mail**, **Matrícula**, **Cargo** e **Status**. A visualização mostra os dados pessoais, o cargo, a matrícula, o status, se aparece no site, a data de admissão e o tempo de instituição.

## Dúvidas comuns

- **"Este e-mail já está cadastrado para outro usuário."**: O e-mail já pertence a outra pessoa, profissional ou professor. Cada conta precisa de um e-mail próprio.
- **"Esta matrícula já está cadastrada para outro profissional."**: Confira a matrícula; ela não pode se repetir.
- **"Este cargo está desativado e não pode ser vinculado a um profissional."**: Ative o cargo em **Cadastros → Cargos** ou escolha outro.
- **"O profissional ... possui pendências em aberto e não pode ser inativado."**: Conclua ou reatribua as pendências antes de inativar.
- **"O profissional ... possui atendimentos registrados e não pode ser inativado."**: Profissionais com atendimentos registrados não podem ser inativados.
- **"Este profissional possui registros de atendimento ou acompanhamento vinculados e não pode ser excluído."**: Há registros ligados ao profissional; mantenha o cadastro.
- **"Você não pode excluir seu próprio registro de profissional."**: Peça a outro usuário com permissão.
- **"Somente o administrador superior do Gnai pode desativar ou remover um administrador."**: Profissionais administradores só podem ser inativados ou excluídos pelo administrador superior.
- **O profissional não recebeu o link de senha**: Ele pode pedir um novo link pela opção **Esqueceu sua senha?** na tela de login. Veja [Acesso ao sistema](/ajuda/acesso-ao-sistema).
