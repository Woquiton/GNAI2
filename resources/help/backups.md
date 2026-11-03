---
titulo: Backups
resumo: Como gerar, baixar, importar, restaurar e excluir cópias de segurança do Gnai, e como funcionam o backup automático e a retenção.
categoria: Sistema
palavras-chave: backup, backups, cópia de segurança, copia de seguranca, salvar dados, gerar backup, fazer backup, baixar backup, download do backup, importar backup, enviar backup, upload, zip, restaurar, restauração, voltar versão, recuperar dados, desfazer, excluir backup, backup automático, agendar backup, retenção, backups antigos, banco de dados, arquivos de mídia, tutorial, tour
ordem: 30
permissoes: backup.index
---

Os backups são cópias de segurança do Gnai em arquivo ZIP, com o banco de dados e os arquivos enviados ao sistema (fotos, documentos, imagens do site e demais anexos). Eles podem ser gerados manualmente, feitos automaticamente nos horários configurados, baixados, importados e usados para restaurar o sistema.

## Conhecer as telas com o tutorial

A listagem e os detalhes do backup têm um tutorial na própria tela. Clique no botão com o ícone de informação, na barra do topo, para abrir. Ele explica os botões **Gerar Novo** e **Importar Backup**, os filtros, a tabela, as ações de cada linha, o aviso **Política de Armazenamento** e os botões dos detalhes. O tutorial só explica esses botões; ele não gera, restaura nem exclui nenhum backup. Veja como navegar pelo tutorial em [Conhecer a tela com o tutorial](/ajuda/primeiros-passos#conhecer-a-tela-com-o-tutorial).

## Consultar os backups

1. Acesse **Sistema → Backups**.
2. A tela **Gerenciamento de Backups** lista as cópias com **Arquivo ZIP**, **Status**, **Tamanho**, **Criado em** e **Responsável**.
3. Filtre por **Arquivo ZIP** (parte do nome), **Status** e **Responsável**.

| Status | Significado |
| --- | --- |
| **Sucesso** | Backup concluído; pode ser restaurado. |
| **Falha** | Backup com problema; não pode ser restaurado. |
| **Arquivado** | Backup guardado apenas para consulta; não pode ser restaurado. |

Ao abrir a tela, o Gnai confere a pasta de backups do servidor: arquivos ZIP encontrados sem registro passam a aparecer na lista, e registros cujo arquivo não existe mais são removidos.

## Gerar um backup agora

1. Em **Sistema → Backups**, clique em **Gerar Novo**.
2. Aguarde o processamento; os botões ficam indisponíveis até o fim.

Ao concluir, o sistema mostra "Backup realizado com sucesso!" e a nova cópia aparece na lista com você como **Responsável**.

## Backup automático

O Gnai gera backups automaticamente todos os dias, nos horários definidos em **Sistema → Configurações → Backups**. Sem configuração salva, o backup automático roda uma vez por dia, às 12:05. Os backups automáticos aparecem com o responsável **Sistema**. Veja [Configurações](/ajuda/configuracoes#definir-os-horarios-e-a-retencao-dos-backups-automaticos).

## Quantos backups ficam guardados?

A retenção segue a regra de **Sistema → Configurações → Backups**: manter uma quantidade de cópias mais recentes ou manter as cópias por um número de dias. Sem configuração salva, o Gnai mantém os 30 backups mais recentes. As cópias que ultrapassam a regra são apagadas automaticamente, com os arquivos, depois de gerar, importar ou listar backups.

> **Importante:** o aviso **Política de Armazenamento** da listagem e o campo **Regra de Retenção** dos detalhes mencionam sempre 30 registros; a regra que vale é a definida em Configurações.

## Baixar um backup

1. Na linha do backup, clique no botão de download (**Baixar**), ou abra os detalhes e clique em **Baixar Backup**.
2. O arquivo ZIP é baixado pelo navegador.

Guarde uma cópia fora do servidor para se proteger de falhas do próprio servidor.

## Importar um backup

1. Em **Sistema → Backups**, clique em **Importar Backup**.
2. Selecione um arquivo ZIP de até 100 MB.

O sistema mostra "Backup importado com sucesso!" e a cópia entra na lista com status **Sucesso**, pronta para ser restaurada.

## Restaurar o sistema a partir de um backup

1. Na linha do backup, clique no botão de restaurar (**Restaurar**). Ele só aparece para backups com status **Sucesso**.
2. Leia o aviso: o backup substitui o banco de dados e os arquivos de mídia, sobrescrevendo o ambiente atual.
3. Em **Confirme sua senha**, digite a sua senha de acesso.
4. Clique em **Confirmar restauração**.

Ao concluir, o sistema mostra "Sistema restaurado com sucesso para a versão selecionada!".

> **Importante:** a restauração é irreversível. Tudo o que foi registrado depois da data do backup é perdido. Se tiver dúvida, gere um backup novo antes de restaurar.

## Ver os detalhes ou excluir um backup

1. Na linha do backup, clique em **Visualizar** para ver **Arquivo ZIP**, **Caminho no Servidor**, **Tamanho do Arquivo**, **Data de Geração**, **Responsável** e **Status do Backup**.
2. Para excluir, clique em **Excluir** (nos detalhes ou no ícone da linha) e confirme em **Confirmar exclusão**.

A exclusão apaga o arquivo do servidor e remove o registro do histórico. O sistema mostra "Registro e arquivo removidos permanentemente.".

## Dúvidas comuns

- **"Senha incorreta. A restauração não foi executada."**: digite novamente a sua senha de acesso ao Gnai.
- **"Informe sua senha para confirmar a restauração."**: a senha é obrigatória para restaurar.
- **"Apenas backups concluídos com sucesso podem ser restaurados."**: escolha um backup com status **Sucesso**.
- **"O backup deve ser um arquivo ZIP."** ou **"O backup deve possuir no máximo 100 MB."**: confira o formato e o tamanho do arquivo importado.
- **"O arquivo físico não existe no servidor."**: o arquivo ZIP foi removido da pasta de backups; o registro some da lista na próxima vez que a tela for aberta.
- **"Falha ao restaurar backup."** ou **"Falha ao gerar arquivo de backup."**: a operação não foi concluída. Tente novamente e, se o erro continuar, acione o suporte técnico.
