# Artigos da Central de Ajuda

A Central de Ajuda (`/ajuda`, item **Ajuda** do grupo **Sistema** da sidebar) apresenta artigos em Markdown versionados em `resources/help/`. O domínio `app/Domains/Help` lê os arquivos, pesquisa pelos termos digitados e converte o conteúdo em HTML; as telas ficam em `resources/js/pages/Help/` e `resources/js/components/Help/`. Esta convenção define como escrever e organizar os artigos.

## Arquivo e endereço

- Um arquivo por funcionalidade ou fluxo: `resources/help/<slug>.md`. O slug usa só letras minúsculas sem acento, números e hífen (`pei.md`, `fila-de-espera.md`) e vira o endereço `/ajuda/<slug>`. Arquivos com outro formato de nome são ignorados.
- Não crie artigos vazios nem um arquivo por campo. Agrupe as tarefas do mesmo módulo no mesmo artigo, uma seção para cada tarefa.

## Cabeçalho

Todo artigo começa com um cabeçalho entre `---`, uma chave por linha:

```markdown
---
titulo: PEI: Plano Educacional Individualizado
resumo: Como criar o PEI do aluno, o que ele exige antes e como as adaptações chegam aos professores.
categoria: Planos e acompanhamento
palavras-chave: pei, plano educacional, adaptação curricular, disciplina, professor, finalizar pei
ordem: 30
permissoes: pei.view
---
```

| Chave | Obrigatória | Uso |
| --- | --- | --- |
| `titulo` | Sim | Nome do artigo nos resultados e no título da página. |
| `resumo` | Sim | Uma frase sobre o que o artigo resolve. Aparece abaixo do título nos resultados. |
| `categoria` | Sim | Uma das categorias da tabela abaixo; cada uma vira uma aba dos resultados. |
| `palavras-chave` | Sim | Termos separados por vírgula: sinônimos, siglas, nomes antigos e as perguntas que o operador digitaria ("clonar", "duplicar", "copiar item"). Pesam mais que o texto na busca. |
| `ordem` | Não | Ordem dentro da categoria quando não há busca; padrão 100. |
| `permissoes` | Não | Habilidades separadas por vírgula (as mesmas de `can:*` nas rotas). O artigo só aparece para quem tiver ao menos uma; sem a chave, aparece para todo usuário autenticado. |

Categorias, na ordem das abas: `Primeiros passos`, `Atendimento`, `Planos e acompanhamento`, `Recursos e acessibilidade`, `Gestão do núcleo`, `Comunicação` e `Sistema`. Elas acompanham os grupos da sidebar (`app/Shared/Infrastructure/Navigation/AppNavigation.php`). Uma categoria nova exige incluí-la em `HelpCategory` no domínio.

## Corpo

- Comece com um parágrafo curto explicando para que serve a funcionalidade, sem repetir o título.
- Cada tarefa é uma seção `##` com título em forma de ação ou pergunta, como `## Cadastrar um item`, `## Clonar um item` ou `## O que preciso antes de criar um PEI?`. Cada seção `##` vira um tópico pesquisável: a busca leva direto a ela pelo âncora gerado do título (`#clonar-um-item`). Use `###` para subdivisões.
- Passos numerados em lista ordenada; nomes de menus, botões e campos em **negrito**, exatamente como aparecem na tela (`**Gestão do núcleo → Cadastros → Cursos**`, botão **Cadastrar**).
- Dependências e pré-requisitos ficam explícitos, em uma seção própria quando forem relevantes. Avisos importantes usam citação (`> **Importante:** ...`).
- Tabelas para campos e significados de situações (status). Marque com "obrigatório" os campos exigidos pelo backend.
- Feche com `## Dúvidas comuns` quando houver mensagens de erro ou bloqueios frequentes, citando a mensagem real do sistema.
- Links para outros artigos usam o endereço da ajuda: `[PAEE](/ajuda/paee)` ou `[Clonar](/ajuda/itens#clonar-um-item)`.
- Não use HTML: ele é exibido como texto. Imagens não são suportadas.

## Conteúdo fiel ao sistema

- Escreva a partir do código atual: rotas e permissões (`routes/modules/*.php`), controllers, `Application/Data` e `Application/Rules` (campos obrigatórios e mensagens), Actions (regras e bloqueios), telas React (rótulos, botões e mensagens). Não descreva campos, botões ou fluxos que não existam.
- Linguagem simples, em pt-BR, voltada ao operador do núcleo, não ao desenvolvedor. Não cite classes, tabelas ou nomes técnicos de rotas.
- Não use travessões (—). Em títulos e listas de mensagens, use dois-pontos; no meio de frases, use vírgulas ou divida a frase.
- A marca é **Gnai**. Os módulos de Atendimento Educacional Especializado e Radar Inclusivo aparecem para o usuário pelos grupos da sidebar.
- Ao alterar uma funcionalidade documentada, atualize o artigo correspondente no mesmo trabalho.
