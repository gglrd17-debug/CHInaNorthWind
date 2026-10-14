import { useMemo, useState } from 'react';
import { ArrowUpDown, ChevronRight, Search } from 'lucide-react';
import { ORDERS, STATUS, rub, type Status } from '../data';
import { Card, Empty, PageHead, StatusBadge, inputCls, useApp, Btn } from '../ui';

export default function Orders() {
  const { go } = useApp();
  const [q, setQ] = useState('');
  const [st, setSt] = useState<'all' | Status>('all');
  const [sort, setSort] = useState('date');

  const list = useMemo(() => {
    const r = ORDERS.filter((o) => (st === 'all' || o.status === st) && (o.title + o.id + o.city).toLowerCase().includes(q.toLowerCase()));
    if (sort === 'sum') r.sort((a, b) => b.total - a.total);
    if (sort === 'progress') r.sort((a, b) => b.progress - a.progress);
    return r;
  }, [q, st, sort]);

  return (
    <>
      <PageHead title="Мои заказы" sub={`${ORDERS.length} заказов · 5 активных`} actions={<Btn onClick={() => go('calc')}>Новый расчёт</Btn>} />
      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
          <div className="relative min-w-52 flex-1">
            <Search size={16} className="absolute left-3 top-3 text-muted" />
            <input className={`${inputCls} pl-9`} placeholder="Поиск по названию, номеру, городу" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Поиск" />
          </div>
          <select className={`${inputCls} w-auto`} value={st} onChange={(e) => setSt(e.target.value as 'all' | Status)} aria-label="Статус">
            <option value="all">Все статусы</option>
            {(Object.keys(STATUS) as Status[]).map((s) => <option key={s} value={s}>{STATUS[s].label}</option>)}
          </select>
          <div className="relative">
            <ArrowUpDown size={14} className="pointer-events-none absolute left-3 top-3.5 text-muted" />
            <select className={`${inputCls} w-auto pl-8`} value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Сортировка">
              <option value="date">По дате</option>
              <option value="sum">По сумме</option>
              <option value="progress">По прогрессу</option>
            </select>
          </div>
        </div>

        {list.length === 0 && <Empty title="Ничего не найдено" text="Измените запрос или сбросьте фильтры." />}

        <table className="hidden w-full text-sm md:table">
          <thead className={list.length ? '' : 'hidden'}>
            <tr className="border-b border-line text-left text-xs font-semibold text-muted">
              <th className="px-5 py-3">Заказ</th><th>Маршрут</th><th>Статус</th><th className="text-right">Сумма</th><th className="text-right">Остаток</th><th className="pr-5 text-right">Прибытие</th><th />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {list.map((o) => (
              <tr key={o.id} onClick={() => go('order', o.id)} className="cursor-pointer hover:bg-soft/60">
                <td className="px-5 py-3.5"><p className="font-bold text-ink">{o.title}</p><p className="num text-xs text-muted">{o.id} · {o.created}</p></td>
                <td className="text-muted">{o.city} → Москва</td>
                <td><StatusBadge s={o.status} /></td>
                <td className="num text-right font-semibold text-brand">{rub(o.total)}</td>
                <td className={`num text-right ${o.total - o.paid > 0 ? 'font-semibold text-danger' : 'text-muted'}`}>{rub(o.total - o.paid)}</td>
                <td className="num pr-5 text-right text-ink">{o.eta}</td>
                <td className="pr-4 text-muted"><ChevronRight size={16} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <ul className="space-y-3 p-4 md:hidden">
          {list.map((o) => (
            <li key={o.id}>
              <button onClick={() => go('order', o.id)} className="w-full rounded-lg border border-line p-4 text-left active:bg-soft">
                <div className="flex items-start justify-between gap-2"><p className="font-bold text-ink">{o.title}</p><StatusBadge s={o.status} /></div>
                <p className="num mt-1 text-xs text-muted">{o.id} · {o.city} → Москва</p>
                <div className="mt-3 flex justify-between text-sm">
                  <span className="num font-bold text-brand">{rub(o.total)}</span>
                  <span className="text-muted">Прибытие {o.eta}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
