---
titulo: Solicitações de Atendimento
resumo: Como registrar uma demanda inicial, anexar documentos opcionais, analisar e registrar os encaminhamentos da equipe.
categoria: Atendimento
palavras-chave: solicitação de atendimento, formulário, demanda inicial, acolhimento, solicitante, napne, diagnóstico, anexos, encaminhamento, tutorial, tour
ordem: 15
permissoes: support-request.view
---

A solicitação registra a demanda apresentada ao núcleo antes ou durante o acompanhamento do aluno. Ela reúne o relato inicial, os apoios solicitados e as providências da equipe. A tela fica em **Atendimento → Solicitações de Atendimento**.

## Conhecer as telas com o tutorial

A listagem, o registro, a edição e a visualização da solicitação têm um tutorial na própria tela. Clique no botão com o ícone de informação, na barra do topo, para abrir. Ele mostra os filtros e a tabela da listagem, cada seção do formulário e os botões do rodapé. Veja como navegar pelo tutorial em [Conhecer a tela com o tutorial](/ajuda/primeiros-passos#conhecer-a-tela-com-o-tutorial).

## O que preciso antes de registrar?

O aluno precisa estar cadastrado em **Atendimento → Alunos**. A solicitação usa esse cadastro, sem criar outro aluno. Não exige curso vigente, diagnóstico, laudo, Estudo de Caso, PAEE ou PEI.

Você precisa de permissão para consultar e cadastrar solicitações. A edição e a exclusão dependem de permissões próprias. O formulário é preenchido pela equipe autenticada, com as informações recebidas do solicitante.

## Registrar uma solicitação

1. Acesse **Atendimento → Solicitações de Atendimento** e clique em **Cadastrar**. Você também pode abrir a aba **Solicitações**, ao final do prontuário, e clicar em **Cadastrar** acima da tabela.
2. Preencha **Identificação**, selecionando o aluno e informando a data e quem apresentou a demanda.
3. Em **Solicitação**, descreva o motivo e, se houver, as dificuldades e os apoios solicitados.
4. Em **Documentos**, adicione os anexos opcionais.
5. Clique em **Salvar**. O sistema abre a visualização e mostra "Solicitação de atendimento registrada com sucesso.".

| Campo | Orientação |
| --- | --- |
| **Aluno** (obrigatório) | Selecione um aluno já cadastrado. Não pode ser alterado depois de salvar. |
| **Data da solicitação** (obrigatório) | Não pode estar no futuro. |
| **Curso** | Opcional. Selecione um dos cursos ativos cadastrados em **Gestão do núcleo → Cadastros → Cursos**. Na edição, o curso já selecionado continua disponível mesmo se tiver sido desativado. O nome é preservado no registro caso o curso seja excluído. |
| **Nome do solicitante** (obrigatório) | Quem apresentou a demanda, até 255 caracteres. |
| **Vínculo com o aluno** (obrigatório) | Estudante, familiar ou responsável, docente, coordenação ou outro setor. Em **Outro**, o campo **Informe o vínculo** é obrigatório. |
| **Contato do solicitante** | Telefone, e-mail ou outro contato informado, até 255 caracteres. |
| **Motivo da solicitação** (obrigatório) | Escolha **Perfil de atendimento** ou **Outro**. |
| **Perfis de atendimento** | Aparecem ao escolher **Perfil de atendimento**. Marque ao menos um perfil cadastrado. |
| **Descrição do motivo** | Texto de até 10.000 caracteres. Opcional em **Perfil de atendimento** e obrigatório em **Outro**. |
| **Dificuldades no contexto escolar** | Opcional, até 10.000 caracteres. |
| **Situação diagnóstica informada** | Registra apenas a informação relatada; o padrão é **Não informado**. |
| **Datas ou observações sobre a investigação** | Opcional, até 5.000 caracteres. |
| **Apoios solicitados** | Podem ser selecionados vários. Ao selecionar **Outro**, descreva em **Outro apoio solicitado**, se necessário. |

> **Importante:** diagnóstico e laudo são opcionais. A solicitação registra o relato recebido e não substitui uma avaliação clínica ou o Estudo de Caso.

Informações de curso e turma digitadas em solicitações anteriores continuam preservadas. Ao editar uma delas, o seletor apresenta uma dica com o texto anterior para você identificar o curso correspondente. O sistema tem cadastro de cursos, ano letivo e semestre do aluno; não há um cadastro próprio de turmas.

As orientações de **Solicitação**, **Análise e encaminhamentos** e **Documentos** ficam no ícone de informação ao lado do título da seção. O campo **Situação diagnóstica informada** também tem um ícone de informação junto ao rótulo. Passe o ponteiro ou use o teclado para consultar as orientações.

## Escolher o motivo da solicitação

Em **Perfil de atendimento**, selecione os perfis relacionados à demanda usando as caixas de seleção. É possível complementar com **Descrição do motivo**. A lista usa os perfis ativos cadastrados em **Gestão do núcleo → Cadastros → Perfis de Atendimento**. Na edição, os perfis já selecionados continuam disponíveis mesmo se forem desativados.

Em **Outro**, os perfis ficam ocultos e você deve descrever brevemente o motivo. Alterar para **Outro** remove as seleções de perfis da solicitação ao salvar, mantendo o texto da descrição.

Os perfis ficam vinculados a esta solicitação. Essa seleção não vincula nem remove perfis automaticamente no prontuário do aluno. A visualização e o PDF mostram o motivo, os perfis selecionados e a descrição informada. Solicitações anteriores com motivo somente em texto passam a apresentar **Outro**, preservando a descrição.

## Adicionar ou remover documentos

Use **Adicionar documentos** para selecionar arquivos em PDF, DOC, DOCX, ODT, JPG ou PNG. Cada solicitação aceita até 10 anexos, com no máximo 10 MB por arquivo.

Na edição, o botão de remover marca um anexo para exclusão. É possível desfazer a marcação antes de salvar. Os arquivos novos e as remoções só são confirmados ao clicar em **Salvar**. Os anexos ficam privados e o download exige acesso à solicitação.

Os anexos permanecem vinculados à solicitação. Eles não são copiados automaticamente para a aba de documentos do aluno nem alteram os pré-requisitos dos planos.

## Distinguir as situações do aluno e da solicitação

- **Situação do aluno**: escolhida no cadastro ou na edição do aluno. **Em acolhimento** registra a etapa inicial da demanda; a mudança para **Ativo** é manual e exige definir o tipo de acompanhamento.
- **Situação da solicitação**: **Recebida**, **Em análise**, **Encaminhada** ou **Concluída**. No cadastro, aparece **Recebida** em somente leitura; na edição, a equipe pode alterá-la em **Análise e encaminhamentos**.
- **Situação diagnóstica informada**: é o relato sobre diagnóstico ou investigação, sem definir o andamento da solicitação ou a situação do aluno.

Enquanto o aluno estiver **Em acolhimento**, somente solicitações de atendimento podem ser cadastradas para ele. Novos empréstimos, vínculos, agendamentos, atendimentos e planos ficam bloqueados. A solicitação continua podendo receber seus anexos e análise. Abrir ou concluir uma solicitação não ativa, inativa nem conclui automaticamente o cadastro do aluno.

## Analisar e registrar encaminhamentos

1. Abra a solicitação e clique em **Editar**.
2. Em **Análise e encaminhamentos**, escolha a **Situação da solicitação**, registre a **Análise inicial da equipe** e as **Providências e encaminhamentos realizados**.
3. Clique em **Salvar**. O sistema mostra "Solicitação de atendimento atualizada com sucesso.".

| Situação | Uso |
| --- | --- |
| **Recebida** | Situação inicial de toda nova solicitação. |
| **Em análise** | A equipe está avaliando a demanda. |
| **Encaminhada** | A equipe registrou as providências e os encaminhamentos. |
| **Concluída** | A análise da solicitação foi encerrada. Isso não encerra automaticamente o acompanhamento do aluno. |

A alteração da situação é manual. A solicitação não entra em fila de espera e não cria automaticamente Estudo de Caso, PAEE, PEI ou agendamento. Continue o acompanhamento nos módulos correspondentes conforme a avaliação da equipe. Veja [Fluxo de acompanhamento do aluno](/ajuda/fluxo-de-acompanhamento).

## Encontrar registros e gerar o PDF

Na listagem, filtre por **Buscar**, **Situação** ou **Aluno**. A busca localiza nome do aluno, nome do solicitante ou número do protocolo. O seletor de colunas permite mostrar matrícula, vínculo do solicitante, responsável pelo registro e última atualização.

A aba **Solicitações**, ao final do prontuário, reúne todos os registros daquele aluno e oferece filtros por protocolo, solicitante e situação. Os fluxos abertos por ela preservam o retorno à aba. Na lateral **Status do atendimento**, **Solicitação de atendimento** informa apenas **Registrada** ou **Não registrada**, sem usar o andamento da solicitação e sem criar uma pendência obrigatória.

Use **PDF** na visualização para abrir o documento em uma nova aba. Ele inclui os dados da solicitação, a análise, os encaminhamentos e os nomes dos anexos, com o cabeçalho institucional definido em **Sistema → Configurações → PDFs**. Os arquivos anexos devem ser baixados separadamente.

## Excluir uma solicitação

Use **Excluir** na listagem ou na visualização e confirme em **Confirmar exclusão**. A exclusão remove a solicitação e os anexos. O sistema mostra "Solicitação de atendimento excluída com sucesso.".

## Dúvidas comuns

**Aparece "Uma solicitação pode ter no máximo 10 anexos."**
A contagem considera os anexos já salvos que serão mantidos e os arquivos novos. Remova os excedentes antes de salvar.

**Aparece "A data da solicitação não pode estar no futuro."**
Informe a data em que a demanda foi recebida, até o dia atual.

**Preciso cadastrar uma solicitação para criar um plano ou atendimento?**
Não. O registro organiza a demanda inicial, mas não acrescenta bloqueios aos fluxos existentes.
