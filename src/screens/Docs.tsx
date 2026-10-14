import { useState } from 'react';
import { Download, Eye, FileText, Search } from 'lucide-react';
import { DOCS } from '../data';
import { Badge, Card, Empty, Modal, PageHead, inputCls, useApp } from '../ui';

export default function Docs() {
  const { toast } = useApp();
  const [q, setQ] = useState('');
  const [type, setType] = useState('Все');
  const [view, setView] = useState<(typeof DOCS)[number] | null>(null);
  const types = ['Все', ...Array.from(new Set(DOCS.map((d) => d.type)))];
  const list = DOCS.filter((d) => (type === 'Все' || d.type === type) && (d.name + d.order).toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHead title="Документы" sub={`${DOCS.length} файлов по заказам и компании`} />
      <Card>
        <div className="space-y-3 border-b border-line p-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-muted" />
            <input className={`${inputCls} pl-9`} placeholder="Поиск по названию или номеру заказа" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Поиск документов" />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {types.map((t) => (
              <button key={t} onClick={() => setType(t)} aria-pressed={type === t}
                className={`h-8 shrink-0 rounded-md border px-3 text-xs font-semibold ${type === t ? 'border-primary bg-primary text-white' : 'border-line text-muted hover:bg-soft'}`}>{t}</button>
            ))}
          </div>
        </div>
        {list.length === 0 && <Empty title="Документы не найдены" text="Попробуйте другой тип или запрос." />}
        <ul className="divide-y divide-line">
          {list.map((d) => (
            <li key={d.id} className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
              <div className="grid size-10 shrink-0 place-items-center rounded-md bg-soft text-ptext"><FileText size={18} /></div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-ink">{d.name}</p>
                <p className="num text-xs text-muted">{d.date} · {d.size} · {d.order}</p>
              </div>
              <span className="hidden sm:block"><Badge tone="blue">{d.type}</Badge></span>
              <button aria-label="Просмотр" onClick={() => setView(d)} className="rounded-md p-2 text-muted hover:bg-soft"><Eye size={18} /></button>
              <button aria-label="Скачать" onClick={() => toast(`Загрузка: ${d.name}`)} className="rounded-md p-2 text-muted hover:bg-soft"><Download size={18} /></button>
            </li>
          ))}
        </ul>
      </Card>
      <Modal open={!!view} onClose={() => setView(null)} title={view?.name ?? ''}>
        <div className="space-y-2 rounded-lg border border-line bg-bg p-5">
          <div className="skeleton h-3 w-1/3" /><div className="h-2 w-full rounded bg-line" /><div className="h-2 w-5/6 rounded bg-line" /><div className="h-2 w-4/6 rounded bg-line" />
          <div className="h-16" /><div className="h-2 w-full rounded bg-line" /><div className="h-2 w-3/6 rounded bg-line" />
        </div>
        <p className="mt-3 text-xs text-muted">Предпросмотр · {view?.type} · {view?.size}</p>
        <button onClick={() => toast('Загрузка началась')} className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-white"><Download size={16} />Скачать</button>
      </Modal>
    </>
  );
}
