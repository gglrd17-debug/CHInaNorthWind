import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Clock, Inbox, Lock, RefreshCw, X } from 'lucide-react';
import { STATUS, type Status } from './data';

export type ScreenKey =
  | 'dashboard' | 'calc' | 'orders' | 'order' | 'finance'
  | 'docs' | 'messages' | 'support' | 'settings' | 'manager';

export type DemoState = 'normal' | 'loading' | 'empty' | 'error' | 'delayed' | 'success' | 'denied';

interface Ctx {
  go: (s: ScreenKey, orderId?: string) => void;
  toast: (m: string) => void;
  orderId: string;
  role: 'client' | 'manager';
  dark: boolean;
  setDark: (v: boolean) => void;
  demo: DemoState;
  setDemo: (d: DemoState) => void;
}
export const AppCtx = createContext<Ctx>(null as unknown as Ctx);
export const useApp = () => useContext(AppCtx);

type Tone = 'blue' | 'green' | 'red' | 'amber' | 'gray';
const TONES: Record<Tone, string> = {
  blue: 'bg-soft text-ptext',
  green: 'bg-success-soft text-success',
  red: 'bg-danger-soft text-danger',
  amber: 'bg-warn-soft text-warn',
  gray: 'bg-line/60 text-muted',
};

export function Badge({ tone = 'gray', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-semibold ${TONES[tone]}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
export const StatusBadge = ({ s }: { s: Status }) => <Badge tone={STATUS[s].tone}>{STATUS[s].label}</Badge>;

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-lg border border-line bg-surface shadow-card ${className}`}>{children}</section>;
}

export function CardHead({ title, action, sub }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
      <div>
        <h3 className="text-[15px] font-bold text-brand">{title}</h3>
        {sub && <p className="mt-0.5 text-xs text-muted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export function Btn({
  variant = 'primary', children, onClick, className = '', type = 'button', disabled,
}: {
  variant?: BtnVariant; children: ReactNode; onClick?: () => void; className?: string; type?: 'button' | 'submit'; disabled?: boolean;
}) {
  const v = {
    primary: 'bg-primary text-white hover:bg-[#1d4fd0]',
    secondary: 'border border-line bg-surface text-ink hover:bg-soft',
    ghost: 'text-ptext hover:bg-soft',
    danger: 'border border-danger/40 text-danger hover:bg-danger-soft',
  }[variant];
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition-colors disabled:opacity-50 ${v} ${className}`}
    >
      {children}
    </button>
  );
}

export function PageHead({ title, sub, actions }: { title: string; sub?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-brand md:text-[28px]">{title}</h1>
        {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export const inputCls =
  'h-10 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink placeholder:text-muted/80 focus:border-primary focus:outline-none';

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-muted">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Progress({ value, tone = 'primary' }: { value: number; tone?: 'primary' | 'success' | 'danger' }) {
  const c = { primary: 'bg-primary', success: 'bg-success', danger: 'bg-danger' }[tone];
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-soft" role="progressbar" aria-valuenow={value}>
      <div className={`h-full rounded-full ${c}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#0a1522]/60 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}
        className="rise max-h-[92vh] w-full max-w-md overflow-auto rounded-t-lg border border-line bg-surface p-5 shadow-2xl sm:rounded-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand">{title}</h2>
          <button aria-label="Закрыть" onClick={onClose} className="rounded-md p-1.5 text-muted hover:bg-soft"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Banner({ tone, title, text, action }: { tone: 'green' | 'red' | 'amber'; title: string; text: string; action?: ReactNode }) {
  const Icon = tone === 'green' ? CheckCircle2 : tone === 'red' ? AlertTriangle : Clock;
  return (
    <div className={`rise mb-5 flex flex-wrap items-start gap-3 rounded-lg px-4 py-3 ${TONES[tone]}`} role="status">
      <Icon size={18} className="mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1 text-ink">
        <p className="text-sm font-bold">{title}</p>
        <p className="text-sm text-muted">{text}</p>
      </div>
      {action}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Загрузка">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-24" />)}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="skeleton h-72 lg:col-span-2" />
        <div className="skeleton h-72" />
      </div>
      <div className="skeleton h-40" />
    </div>
  );
}

function Notice({ icon: Icon, tone, title, text, children }: { icon: typeof Inbox; tone: string; title: string; text: string; children?: ReactNode }) {
  return (
    <Card className="rise flex flex-col items-center px-6 py-16 text-center">
      <div className={`mb-4 grid size-14 place-items-center rounded-lg ${tone}`}><Icon size={26} /></div>
      <h2 className="text-lg font-bold text-brand">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-muted">{text}</p>
      <div className="mt-5 flex gap-2">{children}</div>
    </Card>
  );
}

export function StateGate({ children }: { children: ReactNode }) {
  const { demo, setDemo, go, toast } = useApp();
  if (demo === 'loading') return <Skeleton />;
  if (demo === 'empty')
    return (
      <Notice icon={Inbox} tone="bg-soft text-ptext" title="Пока здесь пусто" text="Данных для этого раздела ещё нет. Создайте первый расчёт — и заказ появится здесь.">
        <Btn onClick={() => { setDemo('normal'); go('calc'); }}>Новый расчёт</Btn>
      </Notice>
    );
  if (demo === 'error')
    return (
      <Notice icon={AlertTriangle} tone="bg-danger-soft text-danger" title="Не удалось загрузить данные" text="Сервер не ответил за 10 секунд. Проверьте соединение и повторите попытку. Код ошибки: CF-503.">
        <Btn onClick={() => setDemo('normal')}><RefreshCw size={16} />Повторить</Btn>
        <Btn variant="secondary" onClick={() => go('support')}>В поддержку</Btn>
      </Notice>
    );
  if (demo === 'denied')
    return (
      <Notice icon={Lock} tone="bg-warn-soft text-warn" title="Недостаточно прав" text="Этот раздел доступен только менеджерам NorthWind. Запросите доступ у администратора вашей компании.">
        <Btn onClick={() => toast('Запрос доступа отправлен администратору')}>Запросить доступ</Btn>
        <Btn variant="secondary" onClick={() => setDemo('normal')}>Назад</Btn>
      </Notice>
    );
  return (
    <>
      {demo === 'delayed' && (
        <Banner tone="amber" title="Часть данных обновляется с задержкой" text="Статусы перевозчика синхронизируются каждые 30 минут. Последнее обновление: 10:12." action={<Btn variant="secondary" onClick={() => setDemo('normal')} className="h-8">Скрыть</Btn>} />
      )}
      {demo === 'success' && (
        <Banner tone="green" title="Изменения сохранены" text="Все данные синхронизированы, уведомление отправлено менеджеру." action={<Btn variant="secondary" onClick={() => setDemo('normal')} className="h-8">Закрыть</Btn>} />
      )}
      {children}
    </>
  );
}

export function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <Inbox className="mb-2 text-muted" size={28} />
      <p className="text-sm font-bold text-brand">{title}</p>
      <p className="text-xs text-muted">{text}</p>
    </div>
  );
}
