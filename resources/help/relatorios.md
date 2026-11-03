---
titulo: Relatórios: gerador de relatórios e consultas
resumo: Como montar um relatório escolhendo o assunto, as informações e os critérios de busca, conferir a prévia, copiar a tabela e exportar em PDF.
categoria: Gestão do núcleo
palavras-chave: relatório, relatórios, gerador de relatórios, construtor de relatórios, consulta, consultas, montar relatório, gerar relatório, exportar, exportação, pdf, imprimir, copiar tabela, planilha, excel, colar no excel, assunto do relatório, fonte, módulo, colunas, campos, informações principais, informações complementares, vínculo, relacionamento, filtro, filtros, critério de busca, prévia, estatística, levantamento, quantitativo, listagem personalizada, tutorial, tour
ordem: 10
permissoes: report.index
---

O gerador de relatórios permite montar consultas sob medida sobre os dados do Gnai, como alunos, atendimentos, PEIs, itens, empréstimos, barreiras, equipe e outros cadastros, escolhendo quais informações aparecem e quais registros entram. O resultado aparece em uma prévia na própria tela e pode ser copiado para uma planilha ou aberto em PDF. A tela fica em **Gestão do núcleo → Relatórios**, com o título **Gerador de Relatórios e Consultas**.

## Conhecer o gerador com o tutorial

Clique no botão com o ícone de informação, na barra do topo, para abrir o tutorial do gerador de relatórios. Se o formulário estiver vazio, o tutorial monta um relatório de exemplo enquanto explica cada parte: escolhe um assunto, marca algumas informações, adiciona uma informação complementar e um critério de busca e clica em **Gerar prévia**. No fim do tutorial, o formulário volta a ficar vazio. Se você já tiver começado um relatório, o tutorial só explica as partes, sem mexer no que você preencheu. Veja como navegar pelo tutorial em [Conhecer a tela com o tutorial](/ajuda/primeiros-passos#conhecer-a-tela-com-o-tutorial).

## Montar um relatório

1. Acesse **Gestão do núcleo → Relatórios**.
2. Em **Assunto do relatório** (obrigatório), escolha sobre o que será o relatório, por exemplo **Alunos**, **Atendimentos** ou **Empréstimos**.
3. Em **Informações do relatório**, marque as **Informações principais** que devem virar colunas. É preciso marcar pelo menos uma.
4. Se quiser, inclua **Informações complementares** e **Critérios de busca** (veja as seções abaixo).
5. Clique em **Gerar prévia** no rodapé. A tabela aparece em **Prévia do relatório**, com o total de linhas e colunas.

Ao trocar o assunto, a lista de informações e de critérios muda de acordo com o novo assunto. Se você alterar as escolhas depois de gerar a prévia, clique em **Gerar prévia** novamente para atualizar a tabela.

## Quais assuntos posso escolher?

A lista de **Assunto do relatório** reúne os principais cadastros e registros do sistema:

| Área | Assuntos |
| --- | --- |
| Atendimento | Alunos, Responsáveis, Pessoas, Matrículas em cursos, Documentos dos alunos, Atendimentos, Registros AEE, Registros pedagógicos, Listas de espera |
| Planos e acompanhamento | Estudos de Caso, PAEEs, Planos educacionais individualizados, Disciplinas dos PEIs |
| Recursos e acessibilidade | Itens (tecnologias assistivas e materiais pedagógicos), Empréstimos, Barreiras, Vistorias, Evidências de vistorias |
| Gestão do núcleo | Profissionais, Professores, Cargos, Semestres, Disciplinas, Cursos, Deficiências (perfis de atendimento), Recursos de acessibilidade, Etiquetas, Categorias de barreiras, Instituições, Locais |
| Comunicação e sistema | Pendências, Publicações, Usuários, Backups |

> **Importante:** a lista de assuntos é a mesma para todos que usam o gerador. Quem tem acesso aos relatórios consegue consultar dados de qualquer um desses assuntos, mesmo sem acesso à tela do módulo correspondente. Conceda as permissões de relatório com esse cuidado.

## Incluir informações complementares

Informações complementares trazem dados de registros ligados ao assunto escolhido, como os responsáveis de um aluno, os documentos ou os perfis de atendimento.

1. Depois de escolher o assunto, vá até **Informações complementares**.
2. Em **Adicionar informação complementar**, escolha o vínculo desejado e clique em **Adicionar**.
3. No bloco que aparece, marque as informações daquele vínculo que devem entrar no relatório. Alguns vínculos têm também **informações do vínculo**, que pertencem à ligação entre os dois registros.
4. Para retirar um vínculo, use o botão de remover no próprio bloco.

A seção só aparece quando o assunto tem vínculos disponíveis. O campo para adicionar vínculos depende de uma permissão própria; sem ela, a seção não oferece a opção de adicionar.

## Filtrar com critérios de busca

Os critérios são opcionais e servem para limitar os registros, por exemplo só os alunos de um curso ou só os empréstimos de um período.

1. Em **Critérios de busca**, clique em **Adicionar critério de busca**.
2. Preencha as três partes do critério:
   - **Informação**: o dado que será comparado.
   - **Como procurar**: a forma de comparação.
   - **O que procurar**: o valor. Datas usam calendário; situações e tipos aparecem como lista de opções; os demais campos aceitam texto.
3. Adicione quantos critérios precisar e clique em **Gerar prévia**. Para retirar um critério, use o botão de remover ao lado dele.

| Como procurar | Significado |
| --- | --- |
| **É igual a** | O valor precisa ser exatamente o informado. |
| **Diferente de** | Exclui os registros com o valor informado. |
| **Contém** | O texto informado aparece em qualquer parte do valor. |
| **Maior que** / **Menor que** | Valores ou datas acima ou abaixo do informado, sem incluí-lo. |
| **A partir de** / **Até** | Valores ou datas a partir do informado ou até ele, incluindo o próprio valor. |

Critérios com **O que procurar** em branco são ignorados.

### Mostrar somente vínculos correspondentes à busca

Quando o relatório tem informações complementares, marque **Mostrar somente vínculos correspondentes à busca** para que essas colunas exibam apenas os itens que atendem aos critérios aplicados. Sem a opção, o registro principal é filtrado, mas todos os seus vínculos continuam aparecendo.

## Copiar a tabela para uma planilha

1. Gere a prévia.
2. Clique em **Copiar**, abaixo da tabela.
3. Cole o conteúdo em uma planilha ou documento. A tabela é copiada com o cabeçalho.

O sistema confirma com "Tabela copiada para a área de transferência." Se o navegador bloquear a cópia, aparece "Verifique a permissão da área de transferência e tente novamente."

## Exportar o relatório em PDF

1. Escolha o assunto, as informações e, se quiser, os critérios.
2. Clique em **PDF**, no lado esquerdo do rodapé.
3. O relatório abre em uma nova aba do navegador, de onde pode ser salvo ou impresso. O arquivo leva o nome do assunto e páginas numeradas.

O PDF usa as mesmas escolhas da tela; não é preciso gerar a prévia antes. Se o navegador bloquear novas abas, aparece "Permita a abertura de novas abas no navegador e tente novamente."

## Por que não consigo gerar ou exportar?

Cada parte do gerador depende de uma permissão do cargo (veja [Perfis e permissões](/ajuda/perfis-e-permissoes)):

| O que falta | Permissão necessária (nome na tela de cargos) |
| --- | --- |
| Item **Relatórios** na sidebar | Visualizar Relatórios |
| Lista de assuntos e de informações | Listar disponíveis Relatórios e Ver metadados Relatórios |
| Botão **Gerar prévia** | Executar Relatórios |
| Botão **PDF** | Gerar PDF Relatórios |
| Opção de adicionar informações complementares | Usar construtor Relatórios |

Sem as permissões de assuntos e informações, a tela mostra "Você não tem permissão para consultar os assuntos e informações dos relatórios."

## Dúvidas comuns

- **"Escolha o assunto do relatório."**: Selecione um item em **Assunto do relatório** antes de gerar a prévia ou o PDF.
- **"Marque pelo menos uma informação."**: Marque ao menos uma das **Informações principais** ou complementares.
- **"Nenhum resultado encontrado para os filtros aplicados."**: Nenhum registro atende aos critérios. Revise ou remova algum critério.
- **O botão Copiar está desativado**: Ele só fica disponível quando a prévia tem pelo menos uma linha.
- **A lista de assuntos não carregou**: Clique em **Tentar novamente**, ao lado do campo **Assunto do relatório**.
