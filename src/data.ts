export type Status = 'transit' | 'customs' | 'delivered' | 'delayed' | 'payment' | 'processing';

export const STATUS: Record<Status, { label: string; tone: 'blue' | 'green' | 'red' | 'amber' | 'gray' }> = {
  transit: { label: 'В пути', tone: 'blue' },
  customs: { label: 'Таможня', tone: 'amber' },
  delivered: { label: 'Доставлен', tone: 'green' },
  delayed: { label: 'Задержка', tone: 'red' },
  payment: { label: 'Ожидает оплаты', tone: 'amber' },
  processing: { label: 'Обработка', tone: 'gray' },
};

export interface Order {
  id: string;
  title: string;
  supplier: string;
  city: string;
  status: Status;
  total: number;
  paid: number;
  weight: number;
  qty: number;
  method: 'Эконом' | 'Стандарт' | 'Быстрый';
  eta: string;
  created: string;
  progress: number;
  manager: string;
}

export const ORDERS: Order[] = [
  { id: 'CF-24071', title: 'Светодиодные панели 600×600', supplier: 'Shenzhen Lumi Tech', city: 'Шэньчжэнь', status: 'transit', total: 482600, paid: 482600, weight: 640, qty: 400, method: 'Стандарт', eta: '28 окт', created: '02 окт', progress: 58, manager: 'Алина Воронцова' },
  { id: 'CF-24068', title: 'Электросамокаты Xiaomi Pro 4', supplier: 'Guangzhou MiMobility', city: 'Гуанчжоу', status: 'delayed', total: 1264000, paid: 632000, weight: 1850, qty: 120, method: 'Эконом', eta: '09 ноя', created: '24 сен', progress: 44, manager: 'Алина Воронцова' },
  { id: 'CF-24065', title: 'Чехлы для смартфонов, силикон', supplier: 'Yiwu Case Factory', city: 'Иу', status: 'customs', total: 156400, paid: 156400, weight: 210, qty: 5000, method: 'Быстрый', eta: '19 окт', created: '28 сен', progress: 82, manager: 'Игорь Савельев' },
  { id: 'CF-24059', title: 'Кофемашины автоматические', supplier: 'Foshan Brewmate', city: 'Фошань', status: 'payment', total: 738900, paid: 0, weight: 980, qty: 60, method: 'Стандарт', eta: '14 ноя', created: '10 окт', progress: 5, manager: 'Игорь Савельев' },
  { id: 'CF-24052', title: 'Рюкзаки городские, водостойкие', supplier: 'Ningbo Urban Gear', city: 'Нинбо', status: 'delivered', total: 214300, paid: 214300, weight: 360, qty: 800, method: 'Стандарт', eta: '30 сен', created: '29 авг', progress: 100, manager: 'Алина Воронцова' },
  { id: 'CF-24047', title: 'Запчасти для 3D-принтеров', supplier: 'Dongguan Print3D', city: 'Дунгуань', status: 'processing', total: 97800, paid: 48900, weight: 85, qty: 300, method: 'Быстрый', eta: '24 окт', created: '12 окт', progress: 12, manager: 'Игорь Савельев' },
  { id: 'CF-24040', title: 'Умные часы, партия 200 шт.', supplier: 'Shenzhen Wearables', city: 'Шэньчжэнь', status: 'delivered', total: 389000, paid: 389000, weight: 120, qty: 200, method: 'Быстрый', eta: '12 сен', created: '25 авг', progress: 100, manager: 'Алина Воронцова' },
];

export const rub = (n: number) => new Intl.NumberFormat('ru-RU').format(Math.round(n)) + ' ₽';

export const ROUTE = [
  { name: 'Шэньчжэнь', sub: 'Склад поставщика', date: '04 окт', done: true },
  { name: 'Гуанчжоу', sub: 'Консолидация', date: '07 окт', done: true },
  { name: 'Маньчжурия', sub: 'Граница КНР—РФ', date: '17 окт', done: false, current: true },
  { name: 'Москва', sub: 'Склад получателя', date: '28 окт', done: false },
];

export const EVENTS = [
  { t: '10:42', d: 'Сегодня', text: 'CF-24065 передан на таможенное оформление', tone: 'amber' },
  { t: '09:15', d: 'Сегодня', text: 'Платёж 316 000 ₽ по CF-24068 зачислен', tone: 'green' },
  { t: '18:03', d: 'Вчера', text: 'CF-24071 прошёл сортировочный центр в Урумчи', tone: 'blue' },
  { t: '14:30', d: 'Вчера', text: 'Для CF-24068 изменён срок: +6 дней', tone: 'red' },
  { t: '11:20', d: '12 окт', text: 'Создан заказ CF-24047', tone: 'gray' },
] as const;

export const DOCS = [
  { id: 1, name: 'Инвойс CF-24071.pdf', type: 'Инвойс', order: 'CF-24071', date: '03 окт 2026', size: '412 КБ' },
  { id: 2, name: 'Packing list CF-24071.xlsx', type: 'Упаковочный лист', order: 'CF-24071', date: '03 окт 2026', size: '86 КБ' },
  { id: 3, name: 'Договор поставки №118.pdf', type: 'Договор', order: '—', date: '15 сен 2026', size: '1,2 МБ' },
  { id: 4, name: 'Декларация CF-24065.pdf', type: 'Таможня', order: 'CF-24065', date: '16 окт 2026', size: '640 КБ' },
  { id: 5, name: 'Акт приёмки CF-24052.pdf', type: 'Акт', order: 'CF-24052', date: '30 сен 2026', size: '230 КБ' },
  { id: 6, name: 'Сертификат соответствия.pdf', type: 'Сертификат', order: 'CF-24068', date: '25 сен 2026', size: '980 КБ' },
  { id: 7, name: 'Счёт на оплату №2231.pdf', type: 'Счёт', order: 'CF-24059', date: '10 окт 2026', size: '120 КБ' },
  { id: 8, name: 'Инвойс CF-24068.pdf', type: 'Инвойс', order: 'CF-24068', date: '24 сен 2026', size: '390 КБ' },
];

export const PAYMENTS = [
  { id: 'PAY-9912', date: '14 окт', order: 'CF-24068', note: 'Доплата 50%', amount: 316000, ok: true },
  { id: 'PAY-9876', date: '08 окт', order: 'CF-24047', note: 'Предоплата 50%', amount: 48900, ok: true },
  { id: 'PAY-9841', date: '02 окт', order: 'CF-24071', note: 'Полная оплата', amount: 482600, ok: true },
  { id: 'PAY-9803', date: '28 сен', order: 'CF-24065', note: 'Полная оплата', amount: 156400, ok: true },
  { id: 'PAY-9790', date: '24 сен', order: 'CF-24068', note: 'Предоплата 50%', amount: 316000, ok: false },
];

export const INVOICES = [
  { id: '№2231', order: 'CF-24059', due: '17 окт', amount: 738900, state: 'open' },
  { id: '№2227', order: 'CF-24068', due: '20 окт', amount: 316000, state: 'open' },
  { id: '№2204', order: 'CF-24071', due: '02 окт', amount: 482600, state: 'paid' },
  { id: '№2190', order: 'CF-24065', due: '28 сен', amount: 156400, state: 'paid' },
];

export const SPEND = [
  { name: 'Стоимость товаров', v: 2290000, c: 'var(--primary)' },
  { name: 'Доставка', v: 548000, c: 'var(--brand)' },
  { name: 'Таможенные платежи', v: 214000, c: 'var(--success)' },
  { name: 'Комиссия и страховка', v: 118000, c: 'var(--muted)' },
];

export const DIALOGS = [
  { id: 1, name: 'Алина Воронцова', role: 'Ваш менеджер', last: 'Отправила обновлённый инвойс', time: '10:48', unread: 2, online: true },
  { id: 2, name: 'Игорь Савельев', role: 'Менеджер по таможне', last: 'Декларацию подали, ждём выпуск', time: '09:12', unread: 1, online: true },
  { id: 3, name: 'Склад Иу', role: 'Склад в Китае', last: 'Фото упаковки CF-24065 готовы', time: 'Вчера', unread: 0, online: false },
  { id: 4, name: 'Поддержка NorthWind', role: 'Заявка #4821', last: 'Заявка решена, оцените ответ', time: '12 окт', unread: 0, online: false },
];

export const FAQ = [
  { q: 'Как рассчитывается стоимость доставки?', a: 'Тариф зависит от веса, объёма и способа доставки. В калькуляторе вы видите детализацию: товар, комиссию, логистику, страховку и сборы склада.' },
  { q: 'Сколько занимает таможенное оформление?', a: 'Обычно 2–4 рабочих дня. Если нужна дополнительная проверка документов, менеджер предупредит вас заранее.' },
  { q: 'Что делать, если груз задерживается?', a: 'Откройте карточку заказа и напишите менеджеру. В разделе «Требует внимания» мы показываем задержки и причины.' },
  { q: 'Можно ли оплатить заказ частями?', a: 'Да, доступны предоплата 50% и доплата до выпуска со склада. Счета и график платежей находятся в разделе «Финансы».' },
];
