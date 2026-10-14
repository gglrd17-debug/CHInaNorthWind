import { useState } from 'react';
import { CheckCircle2, CreditCard, Landmark, Receipt } from 'lucide-react';
import { INVOICES, PAYMENTS, SPEND, rub } from '../data';
import { Badge, Btn, Card, CardHead, Field, Modal, PageHead, inputCls, useApp } from '../ui';

export default function Finance() {
  const { toast } = useApp();
  const [open, setOpen] = useState(false);
  const [inv, setInv] = useState(INVOICES[0]);
  const [method, setMethod] = useState('card');
  const [done, setDone] = useState(false);
  const total = SPEND.reduce((a, b) => a + b.v, 0);

  const pay = (i: (typeof INVOICES)[number]) => { setInv(i); setDone(false); setOpen(true); };
  const close = () => setOpen(false);

  const kpis = [
    { label: 'Общий баланс', value: rub(184500), sub: 'Доступно для оплаты', c: 'text-brand' },
    { label: 'Оплачено', value: rub(2115000), sub: 'За 2026 год', c: 'text-success' },
    { label: 'К оплате', value: rub(1054900), sub: '2 открытых счёта', c: 'text-danger' },
  ];

  return (
    <>
      <PageHead title="Финансы" sub="Прозрачные расходы по каждому заказу" actions={<Btn onClick={() => pay(INVOICES[0])}>Пополнить / оплатить</Btn>} />
      <div className="grid gap-3 sm:grid-cols-3 lg:gap-4">
        {kpis.map((k) => (
          <Card key={k.label} className="p-5">
            <p className="text-xs font-semibold text-muted">{k.label}</p>
            <p className={`num mt-2 text-2xl font-extrabold ${k.c}`}>{k.value}</p>
            <p className="mt-1 text-xs text-muted">{k.sub}</p>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHead title="Расходы по категориям" sub={`Всего ${rub(total)}`} />
          <div className="px-5 pb-5">
            <div className="flex h-3 overflow-hidden rounded-full bg-soft">
              {SPEND.map((s) => <div key={s.name} style={{ width: `${(s.v / total) * 100}%`, background: s.c }} title={s.name} />)}
            </div>
            <ul className="mt-5 space-y-3">
              {SPEND.map((s) => (
                <li key={s.name} className="flex items-center gap-3 text-sm">
                  <span className="size-2.5 rounded-sm" style={{ background: s.c }} />
                  <span className="flex-1 text-ink">{s.name}</span>
                  <span className="num font-semibold text-brand">{rub(s.v)}</span>
                  <span className="num w-10 text-right text-xs text-muted">{Math.round((s.v / total) * 100)}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <CardHead title="Счета" />
          <ul className="divide-y divide-line">
            {INVOICES.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5 text-sm">
                <Receipt size={18} className="text-ptext" />
                <div className="min-w-0 flex-1"><p className="font-bold text-ink">Счёт {i.id}</p><p className="num text-xs text-muted">{i.order} · срок до {i.due}</p></div>
                <span className="num font-bold text-brand">{rub(i.amount)}</span>
                {i.state === 'paid' ? <Badge tone="green">Оплачен</Badge> : <Btn className="h-8" onClick={() => pay(i)}>Оплатить</Btn>}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHead title="История платежей" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead><tr className="border-y border-line text-left text-xs font-semibold text-muted"><th className="px-5 py-2.5">Дата</th><th>Платёж</th><th>Заказ</th><th>Статус</th><th className="pr-5 text-right">Сумма</th></tr></thead>
            <tbody className="divide-y divide-line">
              {PAYMENTS.map((p) => (
                <tr key={p.id}>
                  <td className="num px-5 py-3 text-muted">{p.date}</td>
                  <td><span className="font-semibold text-ink">{p.note}</span><span className="num block text-xs text-muted">{p.id}</span></td>
                  <td className="num text-ink">{p.order}</td>
                  <td>{p.ok ? <Badge tone="green">Проведён</Badge> : <Badge tone="red">Отклонён</Badge>}</td>
                  <td className={`num pr-5 text-right font-semibold ${p.ok ? 'text-brand' : 'text-muted line-through'}`}>{rub(p.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={open} onClose={close} title={done ? 'Платёж отправлен' : `Оплата счёта ${inv.id}`}>
        {done ? (
          <div className="py-4 text-center">
            <CheckCircle2 size={44} className="mx-auto text-success" />
            <p className="mt-3 font-bold text-ink">{rub(inv.amount)} принято в обработку</p>
            <p className="mt-1 text-sm text-muted">Зачисление займёт до 15 минут. Квитанция появится в документах.</p>
            <Btn className="mt-5 w-full" onClick={close}>Готово</Btn>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg bg-soft p-4">
              <p className="text-xs text-muted">К оплате · заказ {inv.order}</p>
              <p className="num text-2xl font-extrabold text-brand">{rub(inv.amount)}</p>
            </div>
            <fieldset className="space-y-2">
              <legend className="mb-1 text-xs font-semibold text-muted">Способ оплаты</legend>
              {[['card', 'Банковская карта', CreditCard], ['bank', 'Расчётный счёт', Landmark]].map(([k, l, Ico]) => {
                const I = Ico as typeof CreditCard;
                return (
                  <label key={k as string} className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm ${method === k ? 'border-primary bg-soft' : 'border-line'}`}>
                    <input type="radio" name="m" className="accent-[#2563eb]" checked={method === k} onChange={() => setMethod(k as string)} />
                    <I size={18} className="text-ptext" /><span className="font-semibold text-ink">{l as string}</span>
                  </label>
                );
              })}
            </fieldset>
            {method === 'card' && <Field label="Номер карты"><input className={`${inputCls} num`} placeholder="0000 0000 0000 0000" /></Field>}
            <Btn className="w-full" onClick={() => { setDone(true); toast('Платёж отправлен'); }}>Оплатить {rub(inv.amount)}</Btn>
          </div>
        )}
      </Modal>
    </>
  );
}
