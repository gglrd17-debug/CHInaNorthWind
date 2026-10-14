import { ArrowLeft, Check, Download, FileText, MessageSquare, Phone, Repeat, Wallet } from 'lucide-react';
import { DOCS, ORDERS, ROUTE, rub } from '../data';
import { Btn, Card, CardHead, Progress, StatusBadge, useApp } from '../ui';

export default function OrderDetail() {
  const { orderId, go, toast } = useApp();
  const o = ORDERS.find((x) => x.id === orderId) ?? ORDERS[0];
  const rest = o.total - o.paid;
  const delayed = o.status === 'delayed';
  const docs = DOCS.filter((d) => d.order === o.id);
  const timeline = [
    { t: 'Заказ создан', d: o.created, done: true },
    { t: 'Оплата подтверждена', d: o.paid > 0 ? o.created : '—', done: o.paid > 0 },
    { t: 'Выкуп и отправка со склада', d: '04 окт', done: o.progress > 20 },
    { t: 'Пересечение границы', d: '17 окт', done: o.progress > 60 },
    { t: 'Таможенное оформление', d: '—', done: o.progress > 80 },
    { t: 'Доставка на склад в Москве', d: o.eta, done: o.progress === 100 },
  ];
  const stats = [
    ['Стоимость', rub(o.total), 'text-brand'],
    ['Оплачено', rub(o.paid), 'text-success'],
    ['Остаток', rub(rest), rest > 0 ? 'text-danger' : 'text-muted'],
  ];

  return (
    <>
      <button onClick={() => go('orders')} className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-ptext"><ArrowLeft size={16} /> Мои заказы</button>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-brand md:text-[28px]">{o.title}</h1>
            <StatusBadge s={o.status} />
          </div>
          <p className="num mt-1 text-sm text-muted">{o.id} · {o.supplier} · {o.qty} шт. · {o.weight} кг · тариф {o.method}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Btn variant="secondary" onClick={() => toast('Заказ добавлен в повторный расчёт')}><Repeat size={16} />Повторить</Btn>
          <Btn variant="secondary" onClick={() => go('messages')}><MessageSquare size={16} />Написать</Btn>
          {rest > 0 && <Btn onClick={() => go('finance')}><Wallet size={16} />Оплатить {rub(rest)}</Btn>}
        </div>
      </div>

      {delayed && (
        <div className="mb-4 rounded-lg bg-danger-soft px-4 py-3 text-sm"><b className="text-danger">Задержка 6 дней.</b> <span className="text-muted">Груз на дополнительном досмотре в Маньчжурии. Новая дата прибытия — {o.eta}.</span></div>
      )}

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Card>
            <CardHead title="Маршрут Китай — Россия" sub={`${o.city} → Москва · ${o.progress}% пути`} />
            <div className="px-5 pb-5">
              <div className="grid grid-cols-4 gap-2 text-center">
                {ROUTE.map((r, i) => (
                  <div key={r.name}>
                    <div className={`h-1.5 rounded-full ${r.done ? (delayed && r.current ? 'bg-danger' : 'bg-primary') : r.current ? 'bg-primary/50' : 'bg-line'}`} />
                    <p className="mt-2 text-xs font-bold text-ink sm:text-sm">{r.name}</p>
                    <p className="num text-xs text-muted">{i === 3 ? o.eta : r.date}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5"><Progress value={o.progress} tone={delayed ? 'danger' : o.status === 'delivered' ? 'success' : 'primary'} /></div>
            </div>
          </Card>

          <Card>
            <CardHead title="История статусов" />
            <ol className="px-5 pb-5">
              {timeline.map((s, i) => (
                <li key={s.t} className="relative flex gap-4 pb-5 last:pb-0">
                  {i < timeline.length - 1 && <span className={`absolute left-[11px] top-6 h-full w-0.5 ${s.done ? 'bg-primary' : 'bg-line'}`} />}
                  <span className={`z-10 grid size-6 shrink-0 place-items-center rounded-full border-2 ${s.done ? 'border-primary bg-primary text-white' : 'border-line bg-surface'}`}>{s.done && <Check size={12} />}</span>
                  <div className="flex flex-1 justify-between gap-3 text-sm"><span className={s.done ? 'font-semibold text-ink' : 'text-muted'}>{s.t}</span><span className="num text-muted">{s.d}</span></div>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHead title="Стоимость" />
            <div className="space-y-3 px-5 pb-5">
              {stats.map(([k, v, c]) => (
                <div key={k} className="flex justify-between text-sm"><span className="text-muted">{k}</span><span className={`num font-bold ${c}`}>{v}</span></div>
              ))}
              <Progress value={Math.round((o.paid / o.total) * 100)} tone="success" />
              <div className="flex justify-between border-t border-line pt-3 text-sm"><span className="text-muted">Срок доставки</span><span className="num font-bold text-ink">до {o.eta}</span></div>
            </div>
          </Card>

          <Card>
            <CardHead title="Менеджер" />
            <div className="flex items-center gap-3 px-5 pb-3">
              <div className="grid size-11 place-items-center rounded-full bg-brand text-sm font-bold text-bg">{o.manager.split(' ').map((w) => w[0]).join('')}</div>
              <div><p className="text-sm font-bold text-ink">{o.manager}</p><p className="text-xs text-muted">Отвечает в течение 15 минут</p></div>
            </div>
            <div className="flex gap-2 px-5 pb-5">
              <Btn variant="secondary" className="flex-1" onClick={() => go('messages')}><MessageSquare size={16} />Чат</Btn>
              <Btn variant="secondary" className="flex-1" onClick={() => toast('Звонок: +7 495 120-45-18')}><Phone size={16} />Звонок</Btn>
            </div>
          </Card>

          <Card>
            <CardHead title="Документы" />
            <ul className="divide-y divide-line px-5 pb-2">
              {(docs.length ? docs : DOCS.slice(0, 2)).map((d) => (
                <li key={d.id} className="flex items-center gap-3 py-3 text-sm">
                  <FileText size={18} className="shrink-0 text-ptext" />
                  <span className="min-w-0 flex-1 truncate text-ink">{d.name}</span>
                  <button aria-label="Скачать" onClick={() => toast(`Загрузка: ${d.name}`)} className="rounded-md p-1.5 text-muted hover:bg-soft"><Download size={16} /></button>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
