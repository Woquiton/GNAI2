---
titulo: Responsáveis, perfis de atendimento e documentos do aluno
resumo: Como adicionar responsáveis, vincular perfis de atendimento e enviar documentos como laudos pelo prontuário do aluno.
categoria: Atendimento
palavras-chave: responsável, responsáveis, pai, mãe, avô, avó, responsável legal, família, parentesco, vínculo, contato, whatsapp, perfil de atendimento, deficiência, deficiências, necessidade específica, severidade, leve, moderada, severa, documento, documentos, laudo, laudo médico, relatório, avaliação, histórico escolar, plano aee, anexo, anexar, upload, enviar arquivo, baixar documento, visualizar documento
ordem: 15
permissoes: student.view
---

Responsáveis, perfis de atendimento e documentos são cadastrados dentro do prontuário do aluno, cada um em sua própria aba. Para abrir o prontuário, acesse **Atendimento → Alunos** e visualize o aluno. Veja também [Alunos e prontuário](/ajuda/alunos).

> **Importante:** só é possível adicionar ou alterar esses registros para alunos ativos. Se o status do aluno for **Trancado**, **Concluído** ou **Desistente**, o sistema mostra "O aluno ... não está ativo e não pode realizar esta ação.".

## Adicionar um responsável

1. No prontuário, abra a aba **Responsáveis** e clique em **Cadastrar**.
2. Preencha **Dados Pessoais** e **Contato e Vínculo**. Se quiser, adicione a **Foto do Responsável**.
3. Clique em **Salvar**. O sistema volta ao prontuário e mostra "Responsável vinculado com sucesso.".

| Campo | Observação |
| --- | --- |
| **Nome Completo** (obrigatório) | Entre 3 e 255 caracteres. |
| **CPF** | Opcional. Precisa ser válido e não pode estar cadastrado para outra pessoa. |
| **Data de Nascimento** (obrigatório) | Deve ser anterior à data atual. |
| **Gênero** (obrigatório) | Masculino, Feminino, Outro ou Não informado. |
| **E-mail** | Opcional. |
| **Telefone / WhatsApp** (obrigatório) | Com DDD (10 ou 11 dígitos). |
| **Parentesco / Vínculo** (obrigatório) | Pai, Mãe, Avô, Avó, Responsável Legal ou Outro. |
| **Endereço Completo** | Opcional, até 500 caracteres. |
| **Foto do Responsável** | JPG, PNG ou WEBP, até 2 MB. |

Os responsáveis cadastrados aparecem nos registros de atendimento AEE e pedagógico, onde é possível indicar quem participou do atendimento.

## Editar ou excluir um responsável

1. Na aba **Responsáveis**, visualize o responsável.
2. Clique em **Editar**, altere os dados e clique em **Salvar**. O sistema mostra "Dados do responsável atualizados com sucesso.".
3. Para remover, clique em **Excluir** (no rodapé da visualização ou na linha da tabela) e confirme em **Excluir Responsável**. O sistema mostra "Responsável removido.".

## Vincular um perfil de atendimento ao aluno

Os perfis de atendimento (deficiências e outras necessidades específicas) são mantidos em **Gestão do núcleo → Cadastros → Perfis de Atendimento**. No prontuário, eles são vinculados ao aluno.

1. No prontuário, abra a aba **Perfis de atendimento** e clique em **Cadastrar**.
2. Escolha o **Perfil** (obrigatório).
3. Escolha a **Severidade**: Leve, Moderada ou Severa.
4. Se quiser, registre **Observações** (até 1000 caracteres).
5. Clique em **Salvar**. O sistema volta ao prontuário e mostra "Deficiência vinculada com sucesso.".

Os perfis vinculados aparecem na identificação do prontuário e podem ser usados no filtro **Perfil de atendimento** da listagem de alunos.

## Editar ou remover um perfil de atendimento do aluno

1. Na aba **Perfis de atendimento**, visualize o perfil.
2. Clique em **Editar** para alterar **Severidade** e **Observações**. O perfil em si não pode ser trocado; para isso, remova o vínculo e cadastre outro. Ao salvar, o sistema mostra "Informações da deficiência atualizadas.".
3. Clique em **Excluir** e confirme em **Excluir Perfil de Atendimento** para remover o vínculo. O sistema mostra "Vínculo removido com sucesso.".

## Enviar um documento do aluno

1. No prontuário, abra a aba **Documentos** e clique em **Cadastrar**.
2. Informe o **Título do Documento** (obrigatório), por exemplo "Laudo Médico Psicológico 2024".
3. Escolha o **Tipo de Documento** (obrigatório): Histórico Escolar, Laudo, Relatório, Avaliação, Plano AEE ou Outro.
4. Em **Selecionar Arquivo**, escolha o arquivo (obrigatório): PDF, DOC, DOCX, JPG, JPEG ou PNG, com até 10 MB.
5. Clique em **Realizar Upload**. O sistema volta ao prontuário e mostra "Documento enviado com sucesso.".

O campo **Semestre Atual** é preenchido automaticamente com o semestre atual do sistema. Documentos do tipo **Laudo** marcam a etapa **Laudo** da lateral **Status do atendimento** como anexada.

## Visualizar, baixar, editar ou excluir um documento

Na aba **Documentos**, cada linha tem as ações:

- **Visualizar**: abre o arquivo no navegador.
- **Baixar**: faz o download do arquivo.
- **Editar**: permite alterar título e tipo e, em **Substituir Arquivo**, enviar outro arquivo. Deixe em branco para manter o arquivo atual. Ao salvar, o sistema mostra "Documento atualizado com sucesso.".
- **Excluir**: pede a confirmação "Excluir permanentemente o documento ...?" e mostra "Documento removido com sucesso.".

## Dúvidas comuns

**Aparece "Este aluno já possui o perfil de atendimento selecionado."**
Cada perfil só pode ser vinculado uma vez ao mesmo aluno. Edite o vínculo existente.

**Aparece "Este perfil está desativado e não pode ser vinculado a um aluno."**
O perfil foi desativado em **Gestão do núcleo → Cadastros → Perfis de Atendimento**.

**Aparece "Não existe semestre atual configurado no sistema."**
O documento precisa de um semestre atual. Peça a quem administra os cadastros que defina o semestre atual em **Gestão do núcleo → Cadastros → Semestres**.

**Aparece "O arquivo não pode ultrapassar 10 MB." ou "O arquivo deve estar no formato PDF, DOC, DOCX, JPG, JPEG ou PNG."**
Reduza o arquivo ou converta-o para um dos formatos aceitos e tente novamente.

**Aparece "Este CPF já está cadastrado para outra pessoa." ao cadastrar um responsável**
O CPF já pertence a outra pessoa no sistema. Confira o número digitado.
