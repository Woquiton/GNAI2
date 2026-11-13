# Documentação do Gnai

O [README principal](../README.md) apresenta o projeto e o caminho para executar
em desenvolvimento ou publicar em produção. Este índice distingue instruções
atuais, referências técnicas, requisitos e relatórios históricos.

## Instalação e operação

- [Instalação, Docker, deploy, Apache e manutenção](operations/README.md).
- [Backup e restauração](../Docs/backup_spatie_docker_guia.md).
- [Frontend e ferramentas React](../resources/js/README.md).
- [Central de Ajuda](../resources/help/): uso das telas, permissões, mensagens e tutoriais.

## Referências de implementação

- [Arquitetura e regras do repositório](../AGENTS.md).
- [Convenções de frontend](ai-conventions/frontend/architecture.md), com links
  para formulários, listagens, detalhes, identidade, feedback, acessibilidade e tours.
- [Testes de backend](ai-conventions/backend/tests.md).
- [Artigos da Central de Ajuda](ai-conventions/content/help-articles.md).
- [Auditoria](../Docs/audit.md).
- [Autenticação e sessões](../Docs/authentication.md).
- [E-mails, fila e IMAP](../Docs/notifications.md).
- [Itens: catálogo, preferências e capas](../Docs/inclusive-radar/items.md).
- [Composição institucional do site](../Docs/website/public-home.md).
- [Fluxo de acompanhamento](../Docs/student-follow-up.md).

## Requisitos de domínio

Os arquivos em `Docs/inclusive-radar/`, exceto a referência técnica de Itens,
registram requisitos funcionais e regras de domínio. Nomes de entidades e itens
propostos podem refletir a modelagem original. Eles não comprovam que todas as
funcionalidades estejam implementadas; confira os contratos atuais, a Central de
Ajuda e o código antes de usá-los como descrição de uma tela.

- [Requisitos gerais](../Docs/inclusive-radar/general.md).
- [Itens assistivos](../Docs/inclusive-radar/assistive-technologies.md) e
  [materiais educacionais](../Docs/inclusive-radar/accessible-educational-materials.md),
  hoje reunidos no recurso Itens.
- [Empréstimos](../Docs/inclusive-radar/loans.md) e [fila de espera](../Docs/inclusive-radar/waitlists.md).
- [Barreiras](../Docs/inclusive-radar/barriers.md), [categorias](../Docs/inclusive-radar/barrier-categories.md)
  e [vistorias](../Docs/inclusive-radar/inspections.md).
- [Instituições](../Docs/inclusive-radar/institutions.md), [locais](../Docs/inclusive-radar/locations.md)
  e [OpenStreetMap](../Docs/inclusive-radar/openstreetmap.md).
- [Recursos de acessibilidade](../Docs/inclusive-radar/accessibility-features.md)
  e [treinamentos](../Docs/inclusive-radar/trainings.md).
- [Fluxograma acadêmico](../Docs/fluxograma-gnai.html): material de apoio, não contrato de API.

## Relatórios históricos

Os documentos abaixo registram observações e decisões na data indicada. Podem
citar caminhos, migrations, problemas e propostas que mudaram desde então.
Não são instruções de deploy nem comprovação do estado atual ou de homologação.

- [Auditoria React, 2026-11-01](audits/frontend-react-2026-11-01.md).
- [Solicitação de atendimento, 2026-11-02](audits/solicitacao-atendimento-napne-2026-11-02.md).
- [Estrutura acadêmica, 2026-11-02](../Docs/academic-structure-audit.md).
- [Semestres e histórico, 2026-11-03](../Docs/semester-history-audit.md).
- [Estudo do módulo de semestres](auditorias/auditoria-modulo-semestres.md).
- [Notificações operacionais, 2026-11-10](auditorias/notificacoes-operacionais.md).
- [Acessibilidade do site e Sobre, 2026-11-10](auditorias/acessibilidade-site-e-sobre.md).
- [Conversão e restauração do backup de 2026-11-06](operations/restaurar-backup-2026-11-06.md).

O script `scripts/backup/validate-restored-database.php` pertence ao último
procedimento e depende de seu manifesto. Ele não é uma migration nem uma etapa
do deploy normal.

## Onde atualizar

`docs/ai-conventions/` contém convenções; `docs/operations/` contém procedimentos
operacionais; `Docs/` reúne referências de domínio e implementação;
`resources/help/` contém a ajuda voltada aos usuários. Atualize o documento
correspondente ao alterar uma funcionalidade. Relatórios datados preservam a
observação original, com indicação de seu caráter histórico.
