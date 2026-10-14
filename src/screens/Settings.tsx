import { useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { Btn, Card, CardHead, Field, PageHead, inputCls, useApp } from '../ui';

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? 'bg-primary' : 'bg-line'}`}>
      <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );
}

export default function Settings() {
  const { dark, setDark, toast } = useApp();
  const [n, setN] = useState({ status: true, pay: true, chat: false, mail: true });
  const items: [keyof typeof n, string, string][] = [
    ['status', 'Изменение статуса заказа', 'Push и email при каждом этапе маршрута'],
    ['pay', 'Счета и платежи', 'Напоминания за 2 дня до срока'],
    ['chat', 'Новые сообщения', 'Уведомление о сообщениях менеджера'],
    ['mail', 'Еженедельный отчёт', 'Сводка по расходам и доставкам'],
  ];

  return (
    <>
      <PageHead title="Настройки" sub="Профиль, компания и интерфейс" />
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHead title="Профиль" />
          <div className="grid gap-4 px-5 pb-5 sm:grid-cols-2">
            <Field label="Имя"><input className={inputCls} defaultValue="Егор Тихов" /></Field>
            <Field label="Email"><input className={inputCls} defaultValue="e.tihov@vector-trade.ru" /></Field>
            <Field label="Телефон"><input className={`${inputCls} num`} defaultValue="+7 916 204-18-77" /></Field>
            <Field label="Должность"><input className={inputCls} defaultValue="Руководитель закупок" /></Field>
          </div>
        </Card>
        <Card>
          <CardHead title="Компания" />
          <div className="grid gap-4 px-5 pb-5 sm:grid-cols-2">
            <div className="sm:col-span-2"><Field label="Название"><input className={inputCls} defaultValue="ООО «Вектор Трейд»" /></Field></div>
            <Field label="ИНН"><input className={`${inputCls} num`} defaultValue="7728341905" /></Field>
            <Field label="КПП"><input className={`${inputCls} num`} defaultValue="772801001" /></Field>
            <div className="sm:col-span-2"><Field label="Адрес склада получателя"><input className={inputCls} defaultValue="Москва, Каширское шоссе, 65к2" /></Field></div>
          </div>
        </Card>

        <Card>
          <CardHead title="Уведомления" />
          <ul className="divide-y divide-line px-5 pb-2">
            {items.map(([k, t, s]) => (
              <li key={k} className="flex items-center justify-between gap-4 py-3.5">
                <div><p className="text-sm font-bold text-ink">{t}</p><p className="text-xs text-muted">{s}</p></div>
                <Toggle on={n[k]} onChange={(v) => setN({ ...n, [k]: v })} label={t} />
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHead title="Тема интерфейса" sub="Обе темы используют одинаковую структуру" />
            <div className="grid grid-cols-2 gap-3 px-5 pb-5">
              {[[false, 'Светлая', Sun], [true, 'Тёмная', Moon]].map(([v, l, Ico]) => {
                const I = Ico as typeof Sun;
                const on = dark === v;
                return (
                  <button key={l as string} onClick={() => setDark(v as boolean)} aria-pressed={on}
                    className={`rounded-lg border p-3 text-left ${on ? 'border-primary ring-2 ring-primary/25' : 'border-line hover:border-primary/50'}`}>
                    <div className={`mb-3 flex h-14 gap-1.5 rounded-md p-1.5 ${v ? 'bg-[#0a1522]' : 'bg-[#f6f9fd]'}`}>
                      <div className={`w-4 rounded-sm ${v ? 'bg-[#08111d] ring-1 ring-[#213752]' : 'bg-[#123b66]'}`} />
                      <div className="flex-1 space-y-1"><div className={`h-2 rounded-sm ${v ? 'bg-[#213752]' : 'bg-[#e1e8f0]'}`} /><div className="h-4 rounded-sm bg-[#2563eb]" /></div>
                    </div>
                    <span className="flex items-center gap-2 text-sm font-bold text-ink"><I size={15} />{l as string}</span>
                  </button>
                );
              })}
            </div>
          </Card>
          <Card>
            <CardHead title="Язык и регион" />
            <div className="grid gap-4 px-5 pb-5 sm:grid-cols-2">
              <Field label="Язык"><select className={inputCls} defaultValue="ru"><option value="ru">Русский</option><option value="en">English</option><option value="zh">中文</option></select></Field>
              <Field label="Валюта отчётов"><select className={inputCls}><option>RUB ₽</option><option>CNY ¥</option><option>USD $</option></select></Field>
            </div>
            <div className="flex items-center justify-between border-t border-line px-5 py-4">
              <span className="flex items-center gap-2 text-xs text-muted"><Monitor size={14} />Часовой пояс: Москва (UTC+3)</span>
              <Btn onClick={() => toast('Настройки сохранены')}>Сохранить</Btn>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
