# Auditoria do menu de acessibilidade público e da página Sobre

Data: 2026-11-10. Páginas verificadas: `/sobre-nos` e `/site`, no ambiente local.
A auditoria usou Chromium com Playwright em contexto isolado e axe-core. O perfil
pessoal do navegador não foi usado e nenhum servidor de produção foi acessado.

## Problema reproduzido

Ao aumentar gradualmente de 100% até 200%, os botões do Sobre cresciam de forma
acumulada. Um botão com fonte natural de 13,12 px chegava a 86,1 px. O resultado
correto é 26,24 px. A causa era a leitura de `getComputedStyle` enquanto a fonte
voltava ao tamanho natural por uma transição `all`; o tamanho intermediário era
usado como base da próxima ampliação.

A restauração e a medição agora suspendem as transições, resolvem o layout e só
então as reativam. O mesmo cuidado vale ao desfazer o ajuste. Redimensionar a
janela, trocar a fonte, alternar a entrelinha e restaurar o padrão não acumulam
novas ampliações.

## Correções aplicadas

- Entrelinha, alinhamento e contraste apresentam todas as opções em seletores
  nativos, com rótulos associados. Não é necessário percorrer estados por cliques.
- O painel respeita a largura e a altura disponíveis; seu conteúdo tem rolagem.
  Os controles de aumentar e diminuir possuem área de toque de 44 × 44 px.
- O Sobre reorganiza as grades, quebra textos longos e tira o acesso ao sistema
  da posição fixa durante a ampliação. Em telas pequenas, o botão mantém o texto.
- Títulos, links, nomes, e-mails e textos dos cards não ultrapassam suas regiões
  nos cenários verificados. O título principal permanece legível no celular.
- Os textos secundários do Sobre e o cabeçalho do painel tiveram o contraste
  corrigido. Nas paletas de contraste, links em texto corrido mantêm sublinhado.
- A fonte simples também alcança as variáveis tipográficas do site e do Sobre.
  Os ícones mantêm suas fontes próprias.
- Pausar animações também revela os cards que aguardavam a animação de entrada
  do Sobre. Tons de cinza alcançam o link de acesso, além do conteúdo principal.
- A lista de estrutura usa chaves estáveis e exclui títulos de tópicos ocultos.

## Matriz funcional

Cada ferramenta foi exercitada no Sobre e no site público. Todos os cenários abaixo
passaram nas larguras de 1280 × 800, 375 × 812 e 320 × 640 px.

| Ferramenta | Verificação |
| --- | --- |
| Tamanho do texto | 100%, 125%, 150%, 175% e 200%; ampliação proporcional, sem acumulação; retorno à medida natural |
| Espaçamento entre linhas | Seleção direta de padrão, 1,3×, 1,6× e 2×; combinação com texto em 200% |
| Alinhamento | Padrão, esquerda, centro e direita; conferência do alinhamento computado |
| Fonte simples | Família Arial aplicada e revertida; combinação com ampliação e entrelinha |
| Contraste | Padrão, escuro, claro e alto contraste; escolha direta, retorno ao padrão e análise automática |
| Tons de cinza | Filtro visual aplicado e removido |
| Máscara de leitura | Camada aparece ao fechar o painel; não intercepta ações do conteúdo |
| Ocultar imagens | Opacidade das imagens é alterada e restaurada, preservando o espaço e os textos alternativos |
| Pausar animações | Animações suspensas; conteúdo do Sobre não fica invisível aguardando entrada |
| Destacar links | Estado ativado/desativado aplicado e revertido |
| Destacar foco | Estado ativado/desativado aplicado e revertido |
| Estrutura da página | Lista de títulos visíveis, volta às ferramentas e foco no título escolhido |
| Restaurar configurações | Restaura os valores e os tamanhos naturais, inclusive após ajustes combinados e redimensionamento |

## Verificações adicionais

- Viewport de 640 × 400 px para reflow e preferência de movimento reduzido.
- Preferências mantidas ao recarregar a página em 200%.
- 36 avanços de Tab por painel, sem o foco escapar do diálogo.
- Esc fecha e devolve o foco ao lançador; escolher um título move o foco ao destino.
- Quatro modos de contraste analisados no conteúdo, além do painel aberto.
- Filtro de tópicos em 200%: três cards de Planos e acompanhamento visíveis;
  a estrutura inclui PAEEs e exclui o título Alunos, que está oculto nesse filtro.
- Nenhuma violação axe-core detectada nos cenários executados, com regras WCAG
  2 A/AA, 2.1 AA e 2.2 AA. Não houve erros JavaScript nas navegações verificadas.
- TypeScript, build de produção e ESLint dos arquivos alterados passaram.
  O ESLint foi executado com Node 24 local: o Node 20 do serviço Docker não
  oferece `node:module.registerHooks`, exigido pela configuração atual do projeto.

O escopo executado foi Chromium, inspeção visual das capturas e verificações de
DOM/teclado. Não foi realizado ensaio com leitor de tela nem auditoria de todas
as páginas ou dos conteúdos futuros cadastrados no site. A matriz cobre ajustes
individuais e a combinação de tamanho máximo, entrelinha máxima, fonte simples e
alto contraste; não é uma enumeração de todas as combinações possíveis.
