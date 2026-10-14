import { useState } from 'react';
import { ChevronDown, Mail, MessageCircle, Paperclip, Phone } from 'lucide-react';
import { FAQ } from '../data';
import { Badge, Btn, Card, CardHead, Field, PageHead, inputCls, useApp } from '../ui';

export default function Support() {
  const { toast } = useApp();
  const [open, setOpen] = useState(0);
  const [prio, setPrio] = useState('Обычный');
  const [topic, setTopic] = useState('Доставка и сроки');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState('');

  return (
    <>
      <PageHead title="Поддержка" sub="Среднее время ответа — 12 минут в рабочие часы" />
      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <Card>
            <CardHead title="Новое обращение" />
            <form className="grid gap-4 px-5 pb-5 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); toast('Заявка #4822 создана'); setDesc(''); setFile(''); }}>
              <Field label="Тема">
                <select className={inputCls} value={topic} onChange={(e) => setTopic(e.target.value)}>
                  {['Доставка и сроки', 'Оплата и счета', 'Документы и таможня', 'Технический вопрос'].map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <div>
                <span className="mb-1.5 block text-xs font-semibold text-muted">Приоритет</span>
                <div className="flex gap-1 rounded-md border border-line p-1" role="radiogroup">
                  {['Низкий', 'Обычный', 'Срочный'].map((p) => (
                    <button type="button" role="radio" aria-checked={prio === p} key={p} onClick={() => setPrio(p)}
                      className={`h-8 flex-1 rounded text-xs font-semibold ${prio === p ? 'bg-primary text-white' : 'text-muted hover:bg-soft'}`}>{p}</button>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2"><Field label="Описание"><textarea required rows={5} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Опишите, что произошло, и укажите номер заказа" className={`${inputCls} h-auto resize-none py-2.5`} /></Field></div>
              <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
                <button type="button" onClick={() => setFile('screenshot-24068.png')} className="inline-flex items-center gap-2 text-sm font-semibold text-ptext"><Paperclip size={16} />{file || 'Прикрепить файл'}</button>
                <Btn type="submit">Отправить</Btn>
              </div>
            </form>
          </Card>

          <Card>
            <CardHead title="Частые вопросы" />
            <ul className="divide-y divide-line border-t border-line">
              {FAQ.map((f, i) => (
                <li key={f.q}>
                  <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-bold text-ink hover:bg-soft/60">
                    {f.q}<ChevronDown size={16} className={`shrink-0 text-muted transition-transform ${open === i ? 'rotate-180' : ''}`} />
                  </button>
                  {open === i && <p className="rise px-5 pb-4 text-sm text-muted">{f.a}</p>}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHead title="Ваши заявки" />
            <ul className="divide-y divide-line">
              {[['#4821', 'Сертификат для CF-24068', 'Решена', 'green'], ['#4809', 'Изменить адрес склада', 'В работе', 'blue'], ['#4790', 'Ошибка в инвойсе', 'Ждём ответа', 'amber']].map(([id, t, s, tone]) => (
                <li key={id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                  <div className="min-w-0"><p className="truncate font-semibold text-ink">{t}</p><p className="num text-xs text-muted">{id}</p></div>
                  <Badge tone={tone as 'green'}>{s}</Badge>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <CardHead title="Контакты" />
            <ul className="space-y-3 px-5 pb-5 text-sm">
              <li className="flex items-center gap-3"><Phone size={16} className="text-ptext" /><span className="num text-ink">+7 495 120-45-18</span></li>
              <li className="flex items-center gap-3"><Mail size={16} className="text-ptext" /><span className="text-ink">support@northwind.ru</span></li>
              <li className="flex items-center gap-3"><MessageCircle size={16} className="text-ptext" /><span className="text-ink">Telegram @northwind_help</span></li>
              <li className="text-xs text-muted">Пн–Пт 09:00–20:00 МСК, Сб 10:00–16:00</li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
