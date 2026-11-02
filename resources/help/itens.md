---
titulo: Itens: tecnologias assistivas e materiais pedagógicos acessíveis
resumo: Como cadastrar, clonar, editar e excluir itens do acervo, controlar estoque e status e registrar vistorias.
categoria: Recursos e acessibilidade
palavras-chave: item, itens, acervo, tecnologia assistiva, ta, material pedagógico acessível, mpa, recurso físico, recurso digital, clonar, clonar item, duplicar, copiar item, cópia, patrimônio, tombamento, estoque, quantidade, esgotado, vistoria, inspeção, evidência, foto, estado de conservação, status do recurso, em manutenção, danificado, público-alvo, recursos de acessibilidade, pdf
ordem: 10
permissoes: item.index
---

Itens são os recursos do acervo do núcleo que podem ser usados ou emprestados aos alunos e profissionais: **Tecnologias Assistivas (TA)** e **Materiais Pedagógicos Acessíveis (MPA)**. Cada item guarda sua identificação, o público-alvo, o estoque, o status e o histórico de vistorias e empréstimos. A tela fica em **Recursos e acessibilidade → Itens**.

## Cadastrar um item

1. Acesse **Recursos e acessibilidade → Itens** e clique em **Cadastrar item**.
2. Preencha as seções **Identificação**, **Gestão** e **Vistoria Inicial** (veja as tabelas abaixo).
3. Clique em **Salvar**. O sistema volta para a listagem e mostra "Item criado com sucesso!".

Ao salvar, o Gnai registra automaticamente a primeira vistoria do item com o estado de conservação informado.

### Identificação

| Campo | Observação |
| --- | --- |
| **Tipo do Item** (obrigatório) | Tecnologia Assistiva ou Material Pedagógico Acessível. |
| **Descrição do Item** (obrigatório) | Nome do item, por exemplo "Cadeira de Rodas Motorizada" ou "Livro em Braille". |
| **Natureza do Recurso** (obrigatório) | **Recurso Físico** ou **Recurso Digital**. |
| **Patrimônio / Tombamento** | Só aparece para recursos físicos. Até 50 caracteres e não pode repetir o de outro item. |
| **Descrição Detalhada** | Texto livre com formatação. |
| **Recursos presentes no item** | Marque os recursos de acessibilidade do item (por exemplo, áudio, Braille). A lista vem do cadastro de [Recursos de Acessibilidade](/ajuda/cadastros-do-radar#recursos-de-acessibilidade). |
| **Público Alvo** (obrigatório) | Marque ao menos um perfil de atendimento a que o item se destina. |

### Gestão

| Campo | Observação |
| --- | --- |
| **Quantidade Total** | Obrigatória para recursos físicos, no mínimo 1. Recursos digitais não têm estoque e aparecem como "Ilimitado". |
| **Status do Recurso** (obrigatório) | Veja a tabela de status abaixo. No cadastro já vem como **Disponível**. |
| **Permitir Empréstimos** | Marque se o item pode ser emprestado. |
| **Ativar no Sistema** | Item ativo fica disponível para visualização e empréstimos. |

### Vistoria Inicial

| Campo | Observação |
| --- | --- |
| **Tipo de Inspeção** (obrigatório) | Vem como **Vistoria Inicial**. |
| **Data da Inspeção** (obrigatório) | Não pode ser uma data futura. |
| **Estado de Conservação** (obrigatório) | Novo, Bom (Sinais de uso), Regular (Avarias leves), Ruim (Danificado) ou Não se aplica. |
| **Evidências** | Fotos e documentos da vistoria: até 10 arquivos de até 20 MB cada (JPG, PNG, WebP, PDF, DOC, DOCX, PPT, PPTX, ODP, ODT, ODS, XLS, XLSX, CSV ou TXT). |
| **Parecer Técnico** | Observações de quem fez a vistoria. |

> **Importante:** o item não tem um campo de foto próprio. Para guardar imagens do item, anexe-as como **Evidências** da vistoria.

## Clonar um item

Clonar serve para cadastrar rapidamente outro exemplar igual ou parecido com um item que já existe, como mais uma unidade de um equipamento com outro número de patrimônio. Em vez de preencher tudo de novo, o Gnai abre o formulário de cadastro já preenchido com os dados do item original.

1. Abra o item em **Recursos e acessibilidade → Itens** e clique em **Visualizar**.
2. No rodapé da página de detalhes, clique em **Clonar**.
3. A tela **Clonar Item** abre com os dados copiados. Revise e complete o que faltar.
4. Clique em **Salvar**. Um novo item é criado; o item original não é alterado.

O que é copiado e o que precisa ser preenchido de novo:

| Copiado do item original | Fica em branco para preencher |
| --- | --- |
| Tipo do Item, Descrição do Item, Natureza do Recurso, Descrição Detalhada, Recursos presentes no item, Público Alvo, Quantidade Total, Status do Recurso, Permitir Empréstimos e Ativar no Sistema | **Patrimônio / Tombamento**, **Estado de Conservação** e toda a **Vistoria Inicial** (Tipo de Inspeção, Data da Inspeção, Evidências e Parecer Técnico) |

O patrimônio e o estado de conservação pertencem a cada exemplar físico, por isso não são copiados. O histórico de vistorias e de empréstimos também não passa para o novo item: ele começa com a própria vistoria inicial. O botão **Clonar** aparece para quem tem permissão de cadastrar itens.

## Encontrar um item na listagem

A listagem mostra **Descrição**, **Tipo**, **Natureza**, **Estoque** (disponíveis / total, ou "Ilimitado" para digitais) e **Status** (Ativo ou Inativo). Um item físico sem unidades disponíveis aparece como **Esgotado**. Outras colunas, como patrimônio, conservação e público-alvo, podem ser exibidas pelo seletor de colunas.

Use os filtros **Descrição**, **Tipo**, **Natureza** e **Recurso de acessibilidade**; em mais filtros há **Status** (Ativo/Inativo) e **Disponibilidade** (com ou sem unidades disponíveis).

## Ver os detalhes, as vistorias e os empréstimos de um item

Clique em **Visualizar** na listagem. A página de detalhes mostra a identificação, a gestão (quantidade total e disponível, status do recurso, se permite empréstimos e se está ativo), o **Histórico de Empréstimos** e o **Histórico de Vistorias**. Em cada vistoria, a ação de visualizar abre o tipo, a data, o estado, o parecer e as evidências anexadas.

No rodapé ficam **Voltar**, **Clonar**, **Editar**, **Excluir** e **PDF**, conforme as permissões do usuário. O **PDF** gera a ficha do item.

## Editar um item e registrar uma nova vistoria

1. Na página de detalhes, clique em **Editar**.
2. Altere os campos necessários. A última seção passa a se chamar **Nova Vistoria** e vem com o tipo **Vistoria Periódica**; também é possível escolher **Retorno de Empréstimo** ou **Manutenção**.
3. Clique em **Salvar**. A mensagem "Item atualizado com sucesso!" confirma a alteração.

Uma nova vistoria só é registrada no histórico quando o **Estado de Conservação** muda ou quando você preenche o **Parecer Técnico** ou anexa **Evidências**. Se nada disso mudar, apenas os dados do item são atualizados.

Regras da edição:

- Com empréstimos em andamento, o formulário avisa quantas unidades estão em uso. A **Quantidade Total** não pode ficar abaixo desse número.
- O **Status do Recurso** não pode ser alterado enquanto houver empréstimos ativos do item.

## Status do recurso e estado de conservação

| Status do Recurso | Significado | Permite empréstimo? |
| --- | --- | --- |
| Disponível | Pronto para uso. | Sim |
| Em uso | Em utilização. O Gnai aplica este status quando a última unidade é emprestada. | Sim, se houver unidade disponível |
| Em manutenção | Em reparo. | Não |
| Danificado | Com avaria. O Gnai aplica este status quando uma devolução é registrada com avaria. | Não |
| Indisponível | Fora de circulação por outro motivo. | Não |

O **Estado de Conservação** Ruim (Danificado) também bloqueia empréstimos de recursos físicos. Para um item aparecer no cadastro de empréstimos ele precisa estar ativo, com **Permitir Empréstimos** marcado, com status que permita empréstimo e, se for físico, com unidade disponível. Veja [Empréstimos](/ajuda/emprestimos).

## Excluir um item

Clique em **Excluir** na listagem ou na página de detalhes e confirme em **Confirmar exclusão**. Um item com empréstimos ativos não pode ser excluído: registre a devolução antes.

## Dúvidas comuns

- **"O código patrimonial já está em uso."** Outro item já tem esse patrimônio/tombamento. Confira o número; ao clonar, informe o patrimônio do novo exemplar.
- **"Para recursos físicos, a quantidade deve ser no mínimo 1."** Informe a quantidade total de unidades ou mude a natureza para **Recurso Digital**.
- **"Selecione pelo menos um público-alvo."** Marque ao menos uma opção em **Público Alvo**.
- **"A data da inspeção não pode ser no futuro."** Use a data em que a vistoria foi feita.
- **"Impossível reduzir estoque: existem N unidades emprestadas."** A nova quantidade total é menor que o número de unidades emprestadas.
- **"Não é possível alterar o status do item enquanto houver empréstimos ativos."** Registre as devoluções antes de mudar o status.
- **"Não é possível excluir um item com empréstimos ativos."** Registre a devolução dos empréstimos em andamento.
- **Por que o item não aparece para empréstimo?** Confira se está ativo, se permite empréstimos, se o status é Disponível ou Em uso, se o estado de conservação não é Ruim e se há unidades disponíveis. Quando não houver unidades, use a [Fila de Espera](/ajuda/fila-de-espera).
