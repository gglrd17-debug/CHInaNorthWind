import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Bell, Calculator, CheckCircle2, FolderOpen, LayoutDashboard, LifeBuoy, MessageSquare,
  MoreHorizontal, Moon, Package, Settings as Cog, ShieldCheck, Sun, Wallet, type LucideIcon,
} from 'lucide-react';
import { AppCtx, Modal, StateGate, type DemoState, type ScreenKey } from './ui';
import Dashboard from './screens/Dashboard';
import Calc from './screens/Calc';
import Orders from './screens/Orders';
import OrderDetail from './screens/OrderDetail';
import Finance from './screens/Finance';
import Docs from './screens/Docs';
import Messages from './screens/Messages';
import Support from './screens/Support';
import Settings from './screens/Settings';
import Manager from './screens/Manager';

const NAV: { key: ScreenKey; label: string; icon: LucideIcon; badge?: number }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'calc', label: 'Новый расчет', icon: Calculator },
  { key: 'orders', label: 'Мои заказы', icon: Package },
  { key: 'finance', label: 'Финансы', icon: Wallet },
  { key: 'docs', label: 'Документы', icon: FolderOpen },
  { key: 'messages', label: 'Сообщения', icon: MessageSquare, badge: 3 },
  { key: 'support', label: 'Поддержка', icon: LifeBuoy },
  { key: 'settings', label: 'Настройки', icon: Cog },
];
const MANAGER: (typeof NAV)[number] = { key: 'manager', label: 'Менеджер', icon: ShieldCheck };
const MOBILE_MAIN: ScreenKey[] = ['dashboard', 'calc', 'orders', 'messages'];

const DEMOS: [DemoState, string][] = [
  ['normal', 'Обычное'], ['loading', 'Загрузка'], ['empty', 'Пусто'], ['error', 'Ошибка'],
  ['delayed', 'Задержка данных'], ['success', 'Успех'], ['denied', 'Нет доступа'],
];

export default function App() {
  const [screen, setScreen] = useState<ScreenKey>('dashboard');
  const [orderId, setOrderId] = useState('CF-24071');
  const [dark, setDark] = useState(false);
  const [role, setRole] = useState<'client' | 'manager'>('client');
  const [demo, setDemo] = useState<DemoState>('normal');
  const [more, setMore] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => { document.documentElement.classList.toggle('dark', dark); }, [dark]);
  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(''), 2800);
    return () => clearTimeout(t);
  }, [toastMsg]);

  const go = useCallback((s: ScreenKey, id?: string) => {
    if (id) setOrderId(id);
    setScreen(s);
    setDemo('normal');
    setMore(false);
    window.scrollTo({ top: 0 });
  }, []);

  const ctx = useMemo(
    () => ({ go, toast: setToastMsg, orderId, role, dark, setDark, demo, setDemo }),
    [go, orderId, role, dark, demo],
  );

  const items = [...NAV, MANAGER];
  const active = screen === 'order' ? 'orders' : screen;
  const blocked = screen === 'manager' && role === 'client';

  const view = (() => {
    switch (screen) {
      case 'dashboard': return <Dashboard />;
      case 'calc': return <Calc />;
      case 'orders': return <Orders />;
      case 'order': return <OrderDetail />;
      case 'finance': return <Finance />;
      case 'docs': return <Docs />;
      case 'messages': return <Messages />;
      case 'support': return <Support />;
      case 'settings': return <Settings />;
      case 'manager': return <Manager />;
    }
  })();

  const body = blocked ? (
    <AppCtx.Provider value={{ ...ctx, demo: 'denied', setDemo: () => go('dashboard') }}>
      <StateGate>{null}</StateGate>
    </AppCtx.Provider>
  ) : (
    <StateGate>{view}</StateGate>
  );

  return (
    <AppCtx.Provider value={ctx}>
      <div className="min-h-screen bg-bg font-sans text-ink">
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-[72px] flex-col bg-side px-3 py-5 md:flex lg:w-64 lg:px-4">
          <button onClick={() => go('dashboard')} className="mb-8 flex items-center gap-3 px-1.5 text-left">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-white"><Package size={18} /></span>
            <span className="hidden text-lg font-extrabold tracking-tight text-white lg:block">NorthWind</span>
          </button>
          <nav className="flex flex-1 flex-col gap-1" aria-label="Основная навигация">
            {items.map((n) => {
              const on = active === n.key;
              return (
                <button key={n.key} onClick={() => go(n.key)} title={n.label} aria-current={on ? 'page' : undefined}
                  className={`relative flex h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold transition-colors ${on ? 'bg-white/14 text-white' : 'text-white/65 hover:bg-white/8 hover:text-white'}`}>
                  {on && <span className="absolute -left-3 h-6 w-1 rounded-r bg-primary lg:-left-4" />}
                  <n.icon size={19} className="shrink-0" />
                  <span className="hidden flex-1 text-left lg:block">{n.label}</span>
                  {n.badge && <span className="num hidden rounded-full bg-primary px-1.5 text-[11px] font-bold text-white lg:block">{n.badge}</span>}
                </button>
              );
            })}
          </nav>
          <div className="hidden items-center gap-3 rounded-lg bg-white/8 p-3 lg:flex">
            <div className="grid size-9 place-items-center rounded-full bg-primary text-xs font-bold text-white">ЕТ</div>
            <div className="min-w-0 text-sm"><p className="truncate font-bold text-white">Егор Тихов</p><p className="truncate text-xs text-white/60">Вектор Трейд</p></div>
          </div>
        </aside>

        <div className="md:pl-[72px] lg:pl-64">
          <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-line bg-surface/90 px-4 backdrop-blur md:px-8">
            <span className="mr-auto flex items-center gap-2 md:hidden">
              <span className="grid size-8 place-items-center rounded-md bg-primary text-white"><Package size={16} /></span>
              <b className="text-brand">NorthWind</b>
            </span>
            <div className="mr-auto hidden items-center gap-2 text-xs text-muted md:flex">
              <span className="rounded-md bg-soft px-2 py-1 font-semibold text-ptext">Курс 1 ¥ = 12,38 ₽</span>
            </div>
            <label className="sr-only" htmlFor="demo">Состояние экрана</label>
            <select id="demo" value={demo} onChange={(e) => setDemo(e.target.value as DemoState)}
              className="h-9 max-w-[7.5rem] rounded-md border border-line bg-surface px-2 text-xs font-semibold text-ink md:max-w-none" title="Демонстрация состояний">
              {DEMOS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
            <div className="hidden rounded-md border border-line p-0.5 sm:flex" role="radiogroup" aria-label="Роль">
              {(['client', 'manager'] as const).map((r) => (
                <button key={r} role="radio" aria-checked={role === r} onClick={() => setRole(r)}
                  className={`h-8 rounded px-3 text-xs font-semibold ${role === r ? 'bg-brand text-bg' : 'text-muted hover:bg-soft'}`}>{r === 'client' ? 'Клиент' : 'Менеджер'}</button>
              ))}
            </div>
            <button aria-label={dark ? 'Светлая тема' : 'Тёмная тема'} onClick={() => setDark(!dark)} className="grid size-9 place-items-center rounded-md border border-line text-ink hover:bg-soft">
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button aria-label="Уведомления" onClick={() => setToastMsg('Новых уведомлений: 3')} className="relative grid size-9 place-items-center rounded-md border border-line text-ink hover:bg-soft">
              <Bell size={17} /><span className="absolute right-2 top-2 size-2 rounded-full bg-danger" />
            </button>
          </header>

          <main className="mx-auto max-w-[1180px] px-4 pb-28 pt-6 md:px-8 md:pb-12 md:pt-8">
            <div key={screen + orderId} className="rise">{body}</div>
          </main>
        </div>

        <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-surface md:hidden" aria-label="Мобильная навигация">
          {[...MOBILE_MAIN.map((k) => NAV.find((n) => n.key === k)!), { key: 'more' as const, label: 'Ещё', icon: MoreHorizontal }].map((n) => {
            const on = n.key === 'more' ? !MOBILE_MAIN.includes(active) : active === n.key;
            return (
              <button key={n.key} onClick={() => (n.key === 'more' ? setMore(true) : go(n.key))} aria-current={on ? 'page' : undefined}
                className={`relative flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold ${on ? 'text-ptext' : 'text-muted'}`}>
                <n.icon size={20} />{n.label.replace('Новый расчет', 'Расчёт').replace('Мои заказы', 'Заказы')}
                {'badge' in n && n.badge && <span className="absolute right-[26%] top-2 size-2 rounded-full bg-danger" />}
              </button>
            );
          })}
        </nav>

        <Modal open={more} onClose={() => setMore(false)} title="Разделы">
          <div className="grid grid-cols-2 gap-2">
            {items.filter((n) => !MOBILE_MAIN.includes(n.key)).map((n) => (
              <button key={n.key} onClick={() => go(n.key)} className="flex items-center gap-3 rounded-md border border-line p-3 text-sm font-semibold text-ink hover:bg-soft">
                <n.icon size={18} className="text-ptext" />{n.label}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-md bg-soft p-3 text-sm sm:hidden">
            <span className="font-semibold text-ink">Роль</span>
            <button onClick={() => setRole(role === 'client' ? 'manager' : 'client')} className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white">{role === 'client' ? 'Клиент' : 'Менеджер'}</button>
          </div>
        </Modal>

        {toastMsg && (
          <div role="status" className="rise fixed bottom-24 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-bg shadow-xl md:bottom-8">
            <CheckCircle2 size={16} />{toastMsg}
          </div>
        )}
      </div>
    </AppCtx.Provider>
  );
}
