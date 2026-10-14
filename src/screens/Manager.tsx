import { useState } from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { ORDERS, rub } from '../data';
import { Badge, Btn, Card, CardHead, PageHead, StatusBadge, useApp } from '../ui';

const REQUESTS = [
  { id: 'R-318', client: 'ООО «Вектор Трейд»', text: 'Расчёт быстрого тарифа для остатка CF-24068', prio: 'Срочно', tone: 'red' },
  { id: 'R-317', client: 'ИП Громов А. С.', text: 'Подтвердить оплату по счёту №2229', prio: 'Обычно', tone: 'blue' },
  { id: 'R-315', client: 'ООО «Север-Моторс»', text: 'Запрос сертификата для партии подшипников', prio: 'Обычно', tone: 'blue' },
  { id: 'R-312', client: 'ООО «Ритм»', text: 'Изменить адрес доставки до выпуска', prio: 'Низкий', tone: 'gray' },
] as const;

const RISKS = [
  { t: 'Досмотр на границе, Маньчжурия', n: 3, tone: 'red', d: 'Среднее ожидание 4,2 дня' },
  { t: 'Неоплаченные счета > 5 дней', n: 2, tone: 'amber', d: 'На сумму 1 054 900 ₽' },
  { t: 'Отсутствуют сертификаты', n: 4, tone: 'amber', d: 'Блокируют таможню' },
] as const;

const LOG = [
  ['10:51', 'А. Воронцова', 'Отправила инвойс v2 клиенту по CF-24068'],
  ['10:20', 'И. Савельев', 'Подал декларацию по CF-24065'],
  ['09:44', 'Система', 'Автоматически отмечена задержка CF-24068'],
  ['09:02', 'А. Воронцова', 'Назначен менеджер на CF-24047'],
  ['Вчера', 'И. Савельев', 'Закрыта заявка R-309'],
];

export default function Manager() {
  const { toast } = useApp();
  const [done, setDone] = useState<string[]>([]);
  const problem = ORDERS.filter((o) => o.status === 'delayed' || o.status === 'customs' || o.status === 'payment');
  const kpi = [['Новых заявок', '12', 'text-brand'], ['Рисков', '9', 'text-danger'], ['Проблемных грузов', String(problem.length), 'text-warn'], ['SLA ответа', '96%', 'text-success']];

  return (
    <>
      <PageHead title="Панель менеджера" sub="Очередь заявок, риски и проблемные грузы" actions={<Badge tone="blue">Роль: менеджер</Badge>} />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {kpi.map(([l, v, c]) => <Card key={l} className="p-4"><p className="text-xs font-semibold text-muted">{l}</p><p className={`num mt-2 text-2xl font-extrabold ${c}`}>{v}</p></Card>)}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHead title="Заявки клиентов" />
          <ul className="divide-y divide-line">
            {REQUESTS.map((r) => (
              <li key={r.id} className={`flex flex-wrap items-center gap-3 px-5 py-3.5 ${done.includes(r.id) ? 'opacity-50' : ''}`}>
                <div className="min-w-0 flex-1"><p className="text-sm font-bold text-ink">{r.text}</p><p className="num text-xs text-muted">{r.id} · {r.client}</p></div>
                <Badge tone={r.tone}>{r.prio}</Badge>
                <Btn variant="secondary" className="h-8" disabled={done.includes(r.id)} onClick={() => { setDone([...done, r.id]); toast(`Заявка ${r.id} взята в работу`); }}>{done.includes(r.id) ? 'В работе' : 'Взять'}</Btn>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHead title="Риски" />
          <ul className="space-y-2 px-5 pb-5">
            {RISKS.map((r) => (
              <li key={r.t} className={`flex gap-3 rounded-md p-3 ${r.tone === 'red' ? 'bg-danger-soft' : 'bg-warn-soft'}`}>
                {r.tone === 'red' ? <ShieldAlert size={18} className="mt-0.5 shrink-0 text-danger" /> : <AlertTriangle size={18} className="mt-0.5 shrink-0 text-warn" />}
                <div className="text-sm"><p className="font-bold text-ink">{r.t} <span className="num text-muted">· {r.n}</span></p><p className="text-xs text-muted">{r.d}</p></div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHead title="Проблемные грузы" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead><tr className="border-y border-line text-left text-xs font-semibold text-muted"><th className="px-5 py-2.5">Груз</th><th>Статус</th><th>Прибытие</th><th className="pr-5 text-right">Сумма</th></tr></thead>
              <tbody className="divide-y divide-line">
                {problem.map((o) => (
                  <tr key={o.id}><td className="px-5 py-3"><p className="font-bold text-ink">{o.title}</p><p className="num text-xs text-muted">{o.id} · {o.manager}</p></td><td><StatusBadge s={o.status} /></td><td className="num text-ink">{o.eta}</td><td className="num pr-5 text-right font-semibold text-brand">{rub(o.total)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card>
          <CardHead title="Журнал действий" />
          <ol className="space-y-3 px-5 pb-5">
            {LOG.map(([t, who, a]) => (
              <li key={a} className="text-sm"><p className="text-ink">{a}</p><p className="num text-xs text-muted">{t} · {who}</p></li>
            ))}
          </ol>
        </Card>
      </div>
    </>
  );
}
