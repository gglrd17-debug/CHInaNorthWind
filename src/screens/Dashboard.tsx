import { AlertTriangle, ArrowRight, CalendarCheck, FileWarning, Package, Truck, Wallet } from 'lucide-react';
import { EVENTS, ORDERS, ROUTE, rub } from '../data';
import { Btn, Card, CardHead, PageHead, Progress, StatusBadge, useApp } from '../ui';

const dot = { amber: 'bg-warn', green: 'bg-success', blue: 'bg-primary', red: 'bg-danger', gray: 'bg-muted' } as const;

export default function Dashboard() {
  const { go } = useApp();
  const kpis = [
    { icon: Wallet, label: 'Сумма заказов', value: rub(3170000), sub: '+12% к сентябрю', tone: 'text-ptext' },
    { icon: Truck, label: 'Активные доставки', value: '5', sub: '1 с задержкой', tone: 'text-ptext' },
    { icon: CalendarCheck, label: 'Ближайшее прибытие', value: '19 окт', sub: 'CF-24065, Москва', tone: 'text-success' },
    { icon: Package, label: 'К оплате', value: rub(1054900), sub: '2 счёта до 20 окт', tone: 'text-danger' },
  ];
  const recent = ORDERS.slice(0, 4);

  return (
    <>
      <PageHead
        title="Доброе утро, Егор"
        sub="Среда, 14 октября · ООО «Вектор Трейд»"
        actions={<Btn onClick={() => go('calc')}>Новый расчёт</Btn>}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {kpis.map((k) => (
          <Card key={k.label} className="p-4 lg:p-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted">
              <k.icon size={16} className="text-ptext" /> {k.label}
            </div>
            <p className="num mt-3 text-xl font-extrabold text-brand lg:text-2xl">{k.value}</p>
            <p className={`mt-1 text-xs font-medium ${k.tone}`}>{k.sub}</p>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHead title="Маршрут CF-24071" sub="Светодиодные панели · Шэньчжэнь → Москва" action={<Btn variant="ghost" className="h-8 px-2" onClick={() => go('order', 'CF-24071')}>Подробнее <ArrowRight size={14} /></Btn>} />
          <div className="px-5 pb-6">
            <div className="relative mt-3 grid grid-cols-4 gap-2">
              <div className="absolute left-[12.5%] right-[12.5%] top-[11px] h-0.5 bg-line" />
              <div className="absolute left-[12.5%] top-[11px] h-0.5 bg-primary" style={{ width: '37.5%' }} />
              {ROUTE.map((r) => (
                <div key={r.name} className="relative text-center">
                  <div className={`mx-auto grid size-6 place-items-center rounded-full border-2 ${r.done ? 'border-primary bg-primary' : r.current ? 'border-primary bg-surface ring-4 ring-primary/20' : 'border-line bg-surface'}`}>
                    {r.done && <span className="size-1.5 rounded-full bg-white" />}
                  </div>
                  <p className="mt-2 text-xs font-bold text-ink sm:text-sm">{r.name}</p>
                  <p className="hidden text-xs text-muted sm:block">{r.sub}</p>
                  <p className="num text-xs font-semibold text-ptext">{r.date}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3">
              <Progress value={58} />
              <span className="num text-xs font-bold text-brand">58%</span>
            </div>
          </div>
        </Card>

        <Card>
          <CardHead title="Требует внимания" />
          <ul className="space-y-2 px-5 pb-5">
            <li className="flex gap-3 rounded-md bg-danger-soft p-3">
              <AlertTriangle size={18} className="mt-0.5 shrink-0 text-danger" />
              <div className="text-sm"><b className="text-ink">CF-24068 задерживается</b><p className="text-muted">Срок сдвинут на 6 дней из-за досмотра.</p></div>
            </li>
            <li className="flex gap-3 rounded-md bg-warn-soft p-3">
              <Wallet size={18} className="mt-0.5 shrink-0 text-warn" />
              <div className="text-sm"><b className="text-ink">Оплатите счёт №2231</b><p className="text-muted">{rub(738900)} до 17 октября.</p></div>
            </li>
            <li className="flex gap-3 rounded-md bg-soft p-3">
              <FileWarning size={18} className="mt-0.5 shrink-0 text-ptext" />
              <div className="text-sm"><b className="text-ink">Нужен сертификат</b><p className="text-muted">Для CF-24059 загрузите документ.</p></div>
            </li>
          </ul>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHead title="Последние заказы" action={<Btn variant="ghost" className="h-8 px-2" onClick={() => go('orders')}>Все заказы <ArrowRight size={14} /></Btn>} />
          <ul className="divide-y divide-line">
            {recent.map((o) => (
              <li key={o.id}>
                <button onClick={() => go('order', o.id)} className="flex w-full items-center gap-4 px-5 py-3 text-left hover:bg-soft/60">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink">{o.title}</p>
                    <p className="num text-xs text-muted">{o.id} · {o.city} · прибытие {o.eta}</p>
                  </div>
                  <div className="hidden w-28 sm:block"><Progress value={o.progress} tone={o.status === 'delayed' ? 'danger' : o.status === 'delivered' ? 'success' : 'primary'} /></div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="num text-sm font-bold text-brand">{rub(o.total)}</span>
                    <StatusBadge s={o.status} />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHead title="Последние события" />
          <ol className="space-y-4 px-5 pb-5">
            {EVENTS.map((e, i) => (
              <li key={i} className="flex gap-3">
                <span className={`mt-1.5 size-2 shrink-0 rounded-full ${dot[e.tone]}`} />
                <div className="text-sm">
                  <p className="text-ink">{e.text}</p>
                  <p className="num text-xs text-muted">{e.d}, {e.t}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </>
  );
}
