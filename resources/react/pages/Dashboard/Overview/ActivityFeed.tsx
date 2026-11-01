import { useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import SelectField from '@/components/Forms/SelectField/SelectField';
import Button from '@/components/UI/Button/Button';
import CardBox from '@/components/UI/CardBox/CardBox';
import { notify } from '@/components/UI/NotificationToast/notify';
import type { ActivityFeedItem, ActivityFeedPage, ActivityFeedProps } from './Overview.types';

const feedUrl = '/autenticacao/painel/atividades';

const periodOptions = [
  { value: 'today', label: 'Hoje' },
  { value: '7days', label: 'Últimos 7 dias' },
  { value: '30days', label: 'Últimos 30 dias' },
];

/**
 * Atividades recentes dos documentos do AEE, lidas da auditoria de acesso e
 * já filtradas pelo vínculo do usuário. Filtros e "Carregar mais" consultam
 * o endpoint JSON do dashboard sem recarregar a página.
 */
export default function ActivityFeed({ feed }: { feed: ActivityFeedProps }): React.JSX.Element {
  const [items, setItems] = useState<ActivityFeedItem[]>(feed.items);
  const [nextPage, setNextPage] = useState<number | null>(feed.nextPage);
  const [filters, setFilters] = useState({ model: '', period: '' });
  const [loading, setLoading] = useState(false);
  const request = useRef<AbortController | null>(null);

  function load(page: number, nextFilters: typeof filters, append: boolean): void {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    const url = new URL(feedUrl, window.location.origin);
    url.searchParams.set('page', String(page));
    url.searchParams.set('model', nextFilters.model);
    url.searchParams.set('period', nextFilters.period);
    setLoading(true);

    void fetch(url.toString(), {
      headers: { Accept: 'application/json' },
      credentials: 'same-origin',
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<ActivityFeedPage>;
      })
      .then((data) => {
        setItems((current) => (append ? [...current, ...data.items] : data.items));
        setNextPage(data.nextPage);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        notify({
          tone: 'error',
          title: 'Não foi possível carregar',
          text: 'Erro ao buscar as atividades recentes. Tente novamente.',
        });
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
  }

  function changeFilter(key: keyof typeof filters, value: string): void {
    const nextFilters = { ...filters, [key]: value };
    setFilters(nextFilters);
    load(1, nextFilters, false);
  }

  return (
    <CardBox className="gnaiDashboard__feed">
      <div className="gnaiDashboard__feedHeader">
        <h2 className="header-title">Atividades recentes</h2>
        <div className="gnaiDashboard__feedFilters">
          <SelectField
            id="activity-feed-model"
            name="model"
            label="Tipo de documento"
            placeholder="Todos os tipos"
            options={feed.modelOptions}
            value={filters.model}
            onChange={(event) => changeFilter('model', event.target.value)}
          />
          <SelectField
            id="activity-feed-period"
            name="period"
            label="Período"
            placeholder="Qualquer período"
            options={periodOptions}
            value={filters.period}
            onChange={(event) => changeFilter('period', event.target.value)}
          />
        </div>
      </div>
      <div aria-live="polite" aria-busy={loading}>
        {items.length ? (
          <ul className="gnaiDashboard__feedList">
            {items.map((item) => (
              <li key={item.id}>
                <i className="fa fa-history" aria-hidden="true" />
                <div>
                  {item.href ? <Link href={item.href}>{item.sentence}</Link> : item.sentence}
                  <small>{item.createdAt}</small>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="gnaiDashboard__feedEmpty">
            {loading ? 'Carregando atividades...' : 'Nenhuma atividade registrada ainda.'}
          </p>
        )}
      </div>
      {nextPage ? (
        <div className="gnaiDashboard__feedMore">
          <Button
            type="button"
            tone="white"
            size="sm"
            label={loading ? 'Carregando...' : 'Carregar mais'}
            title="Carregar mais atividades"
            aria-label="Carregar mais atividades"
            disabled={loading}
            onClick={() => load(nextPage, filters, true)}
          />
        </div>
      ) : null}
    </CardBox>
  );
}
