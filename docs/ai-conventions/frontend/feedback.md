# Feedback de operações

Feedback é requisito de paridade: login/logout, CRUD, ativação, upload, importação, configurações, modais e operações assíncronas. Preserve a mensagem específica do Gnai; falhas não podem ficar só no console, na aba Network ou numa Promise. Não documente como existente um feedback ainda não implementado.

## Transporte

- Controllers fazem redirect com mensagens de sessão. `app/Shared/Infrastructure/Http/Middleware/HandleInertiaRequests.php` compartilha `flash.success`, `error`, `warning` e `status`. Erros de `withErrors` e validações chegam por `props.errors`/`useForm().errors`. Endpoints JSON mantêm seu contrato.
- O toast Blade legado também aceitava `info`, chave que o middleware não compartilha; confira se a funcionalidade depende dela.
- `UI/FlashNotifications/FlashNotifications.tsx` é o único consumidor: `Navigation/AppLayout` o monta nas telas autenticadas e `Navigation/AccountLayout` na autenticação. Ele converte flash, erros de validação e avisos do cliente em toast. Não monte outro consumidor em páginas, wrappers ou `BusinessPage`.
- `UI/NotificationToast/notify` mantém uma fila curta durante trocas de layout e descarta repetições idênticas simultâneas. `flash.response_id` identifica cada resposta já consumida, inclusive na restauração do histórico; o objeto de página é só fallback. Não transporte mensagens por eventos efêmeros nem dependa da identidade de `flash`/`errors`.
- Falhas fora de formulários usam `notifyOperationFailure`/`notifyConnectionFailure` de `UI/NotificationToast/operationFeedback`.

## Apresentação

- Toasts no canto superior direito, entram e saem pela direita, fundo claro, borda na cor semântica e barra de 5 segundos. Sucesso verde, erro vermelho (inclusive o resumo de validação), aviso roxo institucional. Hover ou foco pausa o tempo. Mantenha as três variantes só no componente compartilhado.
- Resultado, confirmação, aviso e falha geral usam sempre o toast, nunca card ou `InlineAlert` na página. `InlineAlert` fica para contexto persistente do conteúdo.
- Falha de validação: um único toast orientando a conferir o formulário; cada mensagem fica junto do campo, com associação acessível, borda vermelha e texto discreto no padrão uBold.

## Processamento

- Indique a operação, desabilite o submit e impeça envios duplicados; após falha, permita corrigir e tentar de novo. `Forms/LoginForm` e `Forms/ForgotPasswordForm` usam `form.processing`, texto de processamento e `aria-busy`.
- `UI/AppLoader`, montado uma vez em `main.tsx`, acompanha as trocas de página do Inertia com o preloader preservado do tema, sobre uma camada cinza translúcida (`--ui-color-loading-overlay`), no mesmo tom e opacidade do modal de confirmação. A página permanece visível ao fundo durante o carregamento. Ele não substitui o estado de processamento de formulários e operações.
