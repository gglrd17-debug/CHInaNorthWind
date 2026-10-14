import { useState } from 'react';
import { Check, Clock, Link2, Plane, Train, Truck } from 'lucide-react';
import { rub } from '../data';
import { Btn, Card, CardHead, Field, PageHead, inputCls, useApp } from '../ui';

const CNY = 12.38;
const TARIFFS = [
  { key: 'Эконом', icon: Truck, perKg: 420, days: '28–35 дней', note: 'Авто, консолидация' },
  { key: 'Стандарт', icon: Train, perKg: 560, days: '18–24 дня', note: 'ЖД, фикс. выход' },
  { key: 'Быстрый', icon: Plane, perKg: 890, days: '9–12 дней', note: 'Авиа + курьер' },
] as const;

export default function Calc() {
  const { go, toast } = useApp();
  const [title, setTitle] = useState('Светодиодные панели 600×600');
  const [url, setUrl] = useState('https://detail.1688.com/offer/7731');
  const [price, setPrice] = useState('86');
  const [qty, setQty] = useState('400');
  const [weight, setWeight] = useState('640');
  const [tariff, setTariff] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const p = Number(price) || 0;
  const q = Number(qty) || 0;
  const w = Number(weight) || 0;
  const t = TARIFFS[tariff];
  const goods = p * q * CNY;
  const fee = goods * 0.05;
  const delivery = w * t.perKg;
  const insurance = goods * 0.01;
  const warehouse = 3500;
  const total = goods + fee + delivery + insurance + warehouse;
  const invalid = p <= 0 || q <= 0 || w <= 0;

  const rows = [
    ['Стоимость товара', `${p} ¥ × ${q} × ${CNY}`, goods],
    ['Комиссия за выкуп, 5%', '', fee],
    [`Доставка · ${t.key}`, `${w} кг × ${t.perKg} ₽`, delivery],
    ['Страховка, 1%', '', insurance],
    ['Склад и упаковка', '', warehouse],
  ] as const;

  return (
    <>
      <PageHead title="Новый расчёт" sub={`Курс ЦБ + 0,5%: 1 ¥ = ${CNY} ₽ · обновлён сегодня в 09:00`} />
      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <Card>
            <CardHead title="1. Товар" />
            <div className="grid gap-4 px-5 pb-5 sm:grid-cols-2">
              <div className="sm:col-span-2"><Field label="Название товара"><input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} /></Field></div>
              <div className="sm:col-span-2">
                <Field label="Ссылка на товар">
                  <div className="relative"><Link2 size={16} className="absolute left-3 top-3 text-muted" /><input className={`${inputCls} pl-9`} value={url} onChange={(e) => setUrl(e.target.value)} /></div>
                </Field>
              </div>
              <Field label="Цена за единицу, CNY"><input className={`${inputCls} num`} inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} aria-invalid={p <= 0} /></Field>
              <Field label="Количество, шт."><input className={`${inputCls} num`} inputMode="numeric" value={qty} onChange={(e) => setQty(e.target.value)} /></Field>
              <Field label="Общий вес, кг" hint="Вес брутто с упаковкой"><input className={`${inputCls} num`} inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} /></Field>
              <Field label="Способ доставки">
                <select className={inputCls} value={tariff} onChange={(e) => setTariff(Number(e.target.value))}>
                  {TARIFFS.map((x, i) => <option key={x.key} value={i}>{x.key}</option>)}
                </select>
              </Field>
            </div>
            {invalid && <p className="px-5 pb-4 text-xs font-semibold text-danger">Укажите цену, количество и вес больше нуля.</p>}
          </Card>

          <Card>
            <CardHead title="2. Тариф" />
            <div className="grid gap-3 px-5 pb-5 md:grid-cols-3">
              {TARIFFS.map((x, i) => {
                const on = i === tariff;
                return (
                  <button key={x.key} onClick={() => setTariff(i)} aria-pressed={on}
                    className={`relative rounded-lg border p-4 text-left transition-colors ${on ? 'border-primary bg-soft' : 'border-line hover:border-primary/50'}`}>
                    {on && <Check size={16} className="absolute right-3 top-3 text-ptext" />}
                    <x.icon size={20} className="text-ptext" />
                    <p className="mt-3 font-bold text-brand">{x.key}</p>
                    <p className="text-xs text-muted">{x.note}</p>
                    <p className="num mt-3 text-sm font-bold text-ink">{rub(w * x.perKg)}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted"><Clock size={12} />{x.days}</p>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <Card className="h-fit xl:sticky xl:top-24">
          <CardHead title="Детализация" sub={title || 'Без названия'} />
          <dl className="space-y-3 px-5 pb-4">
            {rows.map(([k, s, v]) => (
              <div key={k} className="flex items-start justify-between gap-3 text-sm">
                <dt><span className="text-ink">{k}</span>{s && <span className="num block text-xs text-muted">{s}</span>}</dt>
                <dd className="num font-semibold text-ink">{rub(v)}</dd>
              </div>
            ))}
          </dl>
          <div className="mx-5 border-t border-dashed border-line pt-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-muted">Итого</span>
              <span className="num text-2xl font-extrabold text-brand">{rub(total)}</span>
            </div>
            <p className="num mt-1 text-right text-xs text-muted">≈ {rub(q ? total / q : 0)} за единицу · прибытие {t.days}</p>
          </div>
          <div className="space-y-2 p-5">
            <Btn className="w-full" disabled={invalid} onClick={() => { setSubmitted(true); toast('Заказ CF-24072 оформлен и отправлен менеджеру'); }}>Оформить заказ</Btn>
            <Btn variant="secondary" className="w-full" onClick={() => toast('Расчёт сохранён в черновики')}>Сохранить расчёт</Btn>
            {submitted && <Btn variant="ghost" className="w-full" onClick={() => go('orders')}>Перейти к заказам</Btn>}
          </div>
        </Card>
      </div>
    </>
  );
}
