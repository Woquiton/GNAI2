# Itens: listagem, catálogo e capas

Referência técnica do recurso unificado em `/itens`. Para uso das telas, consulte [Itens](../../resources/help/itens.md).

## Listagem e catálogo de itens

Em `/itens`, os modos **Listagem** e **Catálogo** usam o mesmo paginador,
os filtros e as permissões existentes. O catálogo segue a composição dos produtos
do Ubold, com animação de entrada e reposicionamento dos cards e respeito a
`prefers-reduced-motion`. A tabela permanece montada ao alternar os modos.
O seletor usa `UI/SegmentedControl`, compartilhado com a prévia Computador/Celular
do builder e com a visualização Formatado/Log técnico da auditoria.
O modo escolhido é salvo em `user_table_preferences.settings.view_mode`, na chave
da rota e para o usuário autenticado, pelo mesmo mecanismo de colunas e tamanho
de página. O endpoint `PUT /autenticacao/preferencias/tabelas/visualizacao` aceita
`list` ou `catalog`. A escolha volta em `tablePreferences.viewMode`, inclusive em
outros navegadores e sessões; durante personificação, vale só para a visita. A
gravação mescla as configurações sob bloqueio para preservar alterações paralelas.
O catálogo reutiliza o Isotope original do tema, com transições de 750 ms ao
filtrar pelo campo Tipo da barra principal (`item_type`), preservando a busca,
os demais critérios e a paginação do servidor. Cards ocultos
saem do foco e da árvore de acessibilidade. O carregamento respeita as capas com
`loading="lazy"`, sem esperar imagens fora da área visível para iniciar o layout.
A instância do Isotope é mantida durante as respostas dos filtros: os cards
existentes conservam seus modelos e transições, enquanto novos cards entram pelo
próprio plugin. O layout acompanha a largura do container com `ResizeObserver`.
O tipo aplicado à animação acompanha o resultado do servidor, sem esconder os
cards da página anterior enquanto o filtro ainda aguarda a resposta. O catálogo
usa lotes de 12, 24, 48 ou 96 registros, por `TableListFooter.pageSizeOptions`,
para preencher linhas nas páginas completas. Esses tamanhos são aceitos e salvos
pelo mesmo mecanismo de preferências; as opções padrão das tabelas são mantidas.
O tutorial compõe os passos compartilhados da tabela com os do catálogo e usa
uma ponte para alternar apenas a visão local. As ações do card ficam visíveis no
seu destaque; sair do passo restaura a visão escolhida, sem gravar preferências
ou recarregar a quantidade por página durante a demonstração.

A tabela `items` já é criada com `cover_evidence_id`, uma referência opcional à
imagem favorita de uma vistoria. A seleção requer `item.update` e `item.inspection.show`, valida o vínculo
da evidência com o item e usa transação, bloqueio e conferência da capa anterior.
`SetItemCoverAction` coordena os bloqueios e a persistência; `Item::setCover`
concentra as regras de vínculo, formato de imagem e conferência da capa anterior.
A troca passa pela auditoria existente e a confirmação mostra as duas imagens.
Nas vistorias, a escolha fica na estrela sobre cada imagem do Owl, sem outra
grade de miniaturas. `OwlCarousel.onAction` encaminha os cliques dos slides
montados pelo plugin, e preserva a posição ao atualizar a favorita. Com seleção
habilitada, não há rotação automática nem clones de slides interativos.
Todos que podem consultar a listagem podem ver a capa, conforme regra do módulo;
as demais evidências mantêm suas permissões. Sem favorita, a consulta usa a
primeira imagem da vistoria mais recente com fotos. O carregamento é adiantado e
limitado por item, sem enviar os dados das vistorias na listagem.
