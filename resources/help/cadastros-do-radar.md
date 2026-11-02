---
titulo: Cadastros de apoio de recursos e acessibilidade
resumo: Para que servem e como manter Recursos de Acessibilidade, Etiquetas, Categorias de Barreiras, Instituições e Localizações, e quando a exclusão é bloqueada.
categoria: Recursos e acessibilidade
palavras-chave: cadastros, cadastros do radar, radar inclusivo, recursos de acessibilidade, recurso de acessibilidade, braille, libras, etiqueta, etiquetas, marcador, tag, publicações, categoria de barreira, categorias de barreiras, bloquear mapa, instituição, instituição base, campus, sede, unidade, zoom, latitude, longitude, coordenadas, localização, localizações, ponto de referência, local, prédio, bloco, sala, mapa
ordem: 40
permissoes: accessibility-feature.index, tag.index, barrier-category.index, institution.index, location.index
---

Estes cadastros alimentam as listas de opções de [Itens](/ajuda/itens), [Barreiras](/ajuda/barreiras) e Publicações. Todos ficam em **Gestão do núcleo → Cadastros** e seguem o mesmo padrão: botão de cadastro na listagem, filtros por nome e status, página de detalhes com **Editar** e **Excluir**, e confirmação em **Confirmar exclusão** antes de remover. Cadastros inativos continuam guardados, mas deixam de ser oferecidos nos formulários de novos registros.

## Recursos de Acessibilidade

Descrevem características de acessibilidade presentes nos itens do acervo, como intérprete de Libras, piso podotátil, áudio ou Braille. Eles aparecem no campo **Recursos presentes no item** do cadastro de itens e no filtro **Recurso de acessibilidade** da listagem de itens. A página de detalhes mostra os **Itens Vinculados**.

Para cadastrar:

1. Acesse **Gestão do núcleo → Cadastros → Recursos de Acessibilidade** e clique em **Cadastrar recurso de acessibilidade**.
2. Preencha **Nome do Recurso** (obrigatório e sem repetir outro já cadastrado) e, se quiser, **Descrição Detalhada** (até 1000 caracteres).
3. Deixe **Recurso Ativo** marcado para que ele apareça no cadastro de itens.
4. Clique em **Cadastrar**.

A exclusão não tem bloqueio. Se o recurso ainda descreve itens existentes, prefira desmarcar **Recurso Ativo**.

## Etiquetas

Classificam as publicações (antiga agenda institucional), por exemplo "Acessibilidade", "Eventos" ou "Editais". Elas aparecem para seleção no cadastro de publicações. A página de detalhes mostra as **Publicações Vinculadas**.

Para cadastrar:

1. Acesse **Gestão do núcleo → Cadastros → Etiquetas** e clique em **Cadastrar etiqueta**.
2. Preencha **Nome da Etiqueta** (obrigatório, até 100 caracteres e sem repetir outra já cadastrada).
3. Deixe **Etiqueta Ativa** marcada para que ela fique disponível para seleção.
4. Clique em **Cadastrar**.

A exclusão não tem bloqueio. Para deixar de usar uma etiqueta sem apagá-la, desmarque **Etiqueta Ativa**.

## Categorias de Barreiras

Classificam os obstáculos relatados, por exemplo arquitetônica, atitudinal ou comunicacional. A categoria é obrigatória no relato de barreiras e também é um filtro da listagem de barreiras. A página de detalhes mostra as **Barreiras Vinculadas**.

Para cadastrar:

1. Acesse **Gestão do núcleo → Cadastros → Categorias de Barreiras** e clique em **Cadastrar categoria de barreira**.
2. Preencha **Nome da Categoria** (obrigatório, até 150 caracteres e sem repetir outra) e, se quiser, **Descrição Detalhada**.
3. Marque **Ativar no Sistema** para que a categoria apareça no cadastro de novas barreiras.
4. Marque **Bloquear Mapa** quando barreiras dessa categoria não tiverem um ponto no mapa. Nesse caso, a marcação no mapa fica desativada no relato da barreira.
5. Clique em **Salvar**.

> **Importante:** uma categoria com barreiras ativas (status diferente de Resolvida ou Não Aplicável) não pode ser excluída.

## Instituições

A instituição base é o campus ou a sede onde o Radar Inclusivo opera. Ela define o centro e o zoom inicial do mapa de barreiras e agrupa os pontos de referência. No relato de barreiras, ela aparece no campo **Campus / Unidade**. O Gnai permite cadastrar uma única instituição; para mudar seus dados, edite a existente.

Para cadastrar:

1. Acesse **Gestão do núcleo → Cadastros → Instituições** e clique em **Cadastrar instituição**.
2. Preencha **Nome da Instituição**, **Cidade** e **Estado** (obrigatórios) e, se quiser, **Sigla / Nome Curto**, **Bairro / Distrito** e **Rua / Logradouro**.
3. Localize a sede no mapa: ao digitar o endereço, o mapa tenta posicionar o marcador automaticamente; ao clicar no mapa, as coordenadas são gravadas e o endereço encontrado é preenchido.
4. Confira **Latitude Sede** e **Longitude Sede** (obrigatórias) e ajuste o **Zoom Padrão**, usado ao abrir o mapa das barreiras.
5. Deixe **Instituição Ativa** marcada para que ela apareça nos relatos de barreiras e no cadastro de pontos de referência.
6. Clique em **Cadastrar**.

Bloqueios:

- Não é possível desativar a instituição enquanto houver barreiras não resolvidas.
- Não é possível excluí-la enquanto houver barreiras ativas. Ao excluir a instituição, os seus pontos de referência também são excluídos.

## Localizações

As localizações, chamadas na tela de **Pontos de Referência**, são prédios, blocos, salas e outras áreas dentro da instituição. No relato de barreiras, aparecem no campo **Local / Ponto de Referência**, posicionam o marcador no mapa e podem ser exibidas em cinza com a opção **Exibir Locais (Cinza)**.

Para cadastrar:

1. Acesse **Gestão do núcleo → Cadastros → Localizações** e clique em **Cadastrar ponto de referência**.
2. Escolha a **Instituição Base** (obrigatória). O mapa vai para a sede; sem instituição, ele não aceita marcação.
3. Preencha **Nome do Local** (obrigatório), por exemplo "Bloco Acadêmico II", e, se quiser, **Tipo de Local** e **Descrição/Observações**.
4. Clique no mapa para marcar o local. **Latitude** e **Longitude** (obrigatórias) são preenchidas pelo mapa e também podem ser digitadas.
5. Deixe **Ponto Ativo no Sistema** marcado para que o local apareça nos relatos de barreiras.
6. Clique em **Cadastrar**.

Bloqueios:

- Não é possível desativar um ponto de referência com barreiras não resolvidas vinculadas a ele.
- Não é possível excluí-lo enquanto ele tiver barreiras ativas.

## Dúvidas comuns

- **"Esse recurso já existe."** / **"Essa etiqueta já existe."** / **"O nome da categoria já está em uso."** Já há um cadastro com esse nome; procure-o na listagem, inclusive entre os inativos.
- **"Já existe uma instituição cadastrada."** O Gnai trabalha com uma instituição base. Edite a existente.
- **"Existem barreiras não resolvidas. Resolva-as antes de desativar a instituição."** Atualize o status das barreiras para Resolvida ou Não Aplicável antes de desativar.
- **"Não é possível excluir esta instituição pois ela possui barreiras ativas."** Resolva as barreiras ligadas à instituição antes.
- **"Existem barreiras não resolvidas vinculadas a este local. Resolva-as antes de desativá-lo."** ou **"Não é possível excluir este ponto de referência pois ele possui barreiras ativas."** Resolva as barreiras desse local antes.
- **"Esta categoria não pode ser excluída pois possui barreiras ativas."** Resolva as barreiras da categoria ou desative-a desmarcando **Ativar no Sistema**.
- **"A latitude deve estar entre -90 e 90."** / **"A longitude deve estar entre -180 e 180."** Marque o ponto pelo mapa ou corrija o valor digitado.
- **"Selecione a instituição"** ao clicar no mapa de um ponto de referência: escolha a **Instituição Base** primeiro.
