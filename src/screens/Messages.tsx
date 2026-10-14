import { useState } from 'react';
import { ArrowLeft, FileText, Paperclip, Phone, Send } from 'lucide-react';
import { DIALOGS } from '../data';
import { Card, useApp, PageHead } from '../ui';

interface Msg { me: boolean; text?: string; file?: string; time: string }
const seed: Msg[] = [
  { me: false, text: 'Егор, добрый день! По CF-24068 получили подтверждение от перевозчика — досмотр займёт ещё 2–3 дня.', time: '10:31' },
  { me: true, text: 'Спасибо. Можно ускорить через быстрый тариф для остатка партии?', time: '10:36' },
  { me: false, text: 'Да, пересчитаю и пришлю варианты. Пока отправляю обновлённый инвойс.', time: '10:44' },
  { me: false, file: 'Инвойс CF-24068 v2.pdf · 392 КБ', time: '10:48' },
];

export default function Messages() {
  const { toast } = useApp();
  const [active, setActive] = useState(1);
  const [chat, setChat] = useState(false);
  const [msgs, setMsgs] = useState(seed);
  const [text, setText] = useState('');
  const cur = DIALOGS.find((d) => d.id === active)!;

  const send = () => {
    if (!text.trim()) return;
    setMsgs([...msgs, { me: true, text: text.trim(), time: '10:52' }]);
    setText('');
  };

  return (
    <>
      <div className={chat ? 'hidden lg:block' : ''}><PageHead title="Сообщения" sub="3 непрочитанных" /></div>
      <Card className="grid h-[calc(100vh-15rem)] min-h-[480px] overflow-hidden lg:h-[calc(100vh-13rem)] lg:grid-cols-[320px_1fr]">
        <aside className={`overflow-auto border-r border-line ${chat ? 'hidden lg:block' : ''}`}>
          {DIALOGS.map((d) => (
            <button key={d.id} onClick={() => { setActive(d.id); setChat(true); }}
              className={`flex w-full items-center gap-3 border-b border-line px-4 py-3.5 text-left ${d.id === active ? 'bg-soft' : 'hover:bg-soft/60'}`}>
              <div className="relative grid size-10 shrink-0 place-items-center rounded-full bg-brand text-xs font-bold text-bg">
                {d.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                {d.online && <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-surface bg-success" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-2"><p className="truncate text-sm font-bold text-ink">{d.name}</p><span className="num text-xs text-muted">{d.time}</span></div>
                <div className="flex justify-between gap-2"><p className="truncate text-xs text-muted">{d.last}</p>
                  {d.unread > 0 && <span className="num grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-white">{d.unread}</span>}
                </div>
              </div>
            </button>
          ))}
        </aside>

        <div className={`flex min-h-0 flex-col ${chat ? '' : 'hidden lg:flex'}`}>
          <header className="flex items-center gap-3 border-b border-line px-4 py-3">
            <button className="lg:hidden" aria-label="Назад" onClick={() => setChat(false)}><ArrowLeft size={20} /></button>
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-ink">{cur.name}</p><p className="text-xs text-muted">{cur.role}{cur.online ? ' · онлайн' : ''}</p></div>
            <button onClick={() => toast('Быстрый звонок менеджеру: +7 495 120-45-18')} className="inline-flex h-9 items-center gap-2 rounded-md border border-line px-3 text-sm font-semibold text-ptext hover:bg-soft"><Phone size={15} /><span className="hidden sm:inline">Позвонить</span></button>
          </header>
          <div className="flex-1 space-y-3 overflow-auto bg-bg/60 p-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.me ? 'justify-end' : ''}`}>
                <div className={`max-w-[82%] rounded-lg px-3.5 py-2.5 text-sm ${m.me ? 'bg-primary text-white' : 'border border-line bg-surface text-ink'}`}>
                  {m.text}
                  {m.file && <div className="flex items-center gap-2 font-semibold"><FileText size={18} className="text-ptext" />{m.file}</div>}
                  <p className={`num mt-1 text-right text-[11px] ${m.me ? 'text-white/75' : 'text-muted'}`}>{m.time}</p>
                </div>
              </div>
            ))}
          </div>
          <form className="flex items-center gap-2 border-t border-line p-3" onSubmit={(e) => { e.preventDefault(); send(); }}>
            <button type="button" aria-label="Вложение" onClick={() => toast('Файл прикреплён')} className="rounded-md p-2 text-muted hover:bg-soft"><Paperclip size={18} /></button>
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Сообщение менеджеру" className="h-10 flex-1 rounded-md border border-line bg-surface px-3 text-sm text-ink focus:border-primary focus:outline-none" />
            <button type="submit" aria-label="Отправить" className="grid size-10 place-items-center rounded-md bg-primary text-white"><Send size={16} /></button>
          </form>
        </div>
      </Card>
    </>
  );
}
