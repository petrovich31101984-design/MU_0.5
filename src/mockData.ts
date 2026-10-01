import { Employee, NomenclatureItem, Arrival, Expense, ReturnOperation, ChatMessage, AuditEntry, Notification } from './types';

const today = new Date();
const fmt = (d: Date) => d.toISOString().split('T')[0];
const fmtDT = (d: Date) => d.toISOString().replace('T', ' ').substring(0, 16);
const daysAgo = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return d; };
const monthStr = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

export const currentMonth = monthStr(today);
export const lastMonth = monthStr(daysAgo(30));

export const employees: Employee[] = [
  { id: 'EMP-001', personalNumber: '001', fullName: 'Иванов Иван Иванович', status: 'Активен', position: 'Врач', hireDate: '2023-01-15', blocked: false, phone: '+7 (900) 123-45-67', lastActivity: fmtDT(daysAgo(0)), note: '' },
  { id: 'EMP-002', personalNumber: '002', fullName: 'Петрова Мария Сергеевна', status: 'Активен', position: 'Фельдшер', hireDate: '2023-02-01', blocked: false, phone: '+7 (900) 234-56-78', lastActivity: fmtDT(daysAgo(1)), note: '' },
  { id: 'EMP-003', personalNumber: '003', fullName: 'Сидоров Алексей Петрович', status: 'Отпуск', position: 'Врач', hireDate: '2022-07-10', blocked: false, phone: '+7 (900) 345-67-89', lastActivity: fmtDT(daysAgo(5)), note: 'Отпуск до 20.01' },
  { id: 'EMP-004', personalNumber: '004', fullName: 'Козлова Елена Дмитриевна', status: 'Активен', position: 'Фельдшер', hireDate: '2023-03-20', blocked: false, phone: '+7 (900) 456-78-90', lastActivity: fmtDT(daysAgo(0)), note: '' },
  { id: 'EMP-005', personalNumber: '005', fullName: 'Морозов Дмитрий Алексеевич', status: 'Активен', position: 'Врач', hireDate: '2022-09-01', blocked: false, phone: '+7 (900) 567-89-01', lastActivity: fmtDT(daysAgo(8)), note: '⚠️ Неактивен 8 дней' },
  { id: 'EMP-006', personalNumber: '006', fullName: 'Волкова Анна Игоревна', status: 'Активен', position: 'Фельдшер', hireDate: '2023-05-15', blocked: false, phone: '+7 (900) 678-90-12', lastActivity: fmtDT(daysAgo(0)), note: '' },
  { id: 'EMP-007', personalNumber: '007', fullName: 'Новиков Сергей Владимирович', status: 'Активен', position: 'Врач', hireDate: '2022-11-01', blocked: false, phone: '+7 (900) 789-01-23', lastActivity: fmtDT(daysAgo(2)), note: '' },
  { id: 'EMP-008', personalNumber: '008', fullName: 'Федорова Ольга Николаевна', status: 'Активен', position: 'Фельдшер', hireDate: '2023-06-10', blocked: false, phone: '+7 (900) 890-12-34', lastActivity: fmtDT(daysAgo(0)), note: '' },
  { id: 'EMP-009', personalNumber: '009', fullName: 'Кузнецов Андрей Михайлович', status: 'Активен', position: 'Врач', hireDate: '2023-01-20', blocked: false, phone: '+7 (900) 901-23-45', lastActivity: fmtDT(daysAgo(1)), note: '' },
  { id: 'EMP-010', personalNumber: '010', fullName: 'Соколова Татьяна Викторовна', status: 'Неактивен', position: 'Фельдшер', hireDate: '2022-04-15', blocked: false, phone: '+7 (900) 012-34-56', lastActivity: fmtDT(daysAgo(14)), note: 'Больничный' },
];

export const nomenclature: NomenclatureItem[] = [
  { id: 'NOM-001', name: 'Адреналин 0.1% 1мл', category: 'Лекарство', unit: 'Ампулы', manufacturer: 'Фармстандарт', active: true, currentPrice: 45.00 },
  { id: 'NOM-002', name: 'Дексаметазон 4мг/мл 2мл', category: 'Лекарство', unit: 'Ампулы', manufacturer: 'Борщаговский ХФЗ', active: true, currentPrice: 32.50 },
  { id: 'NOM-003', name: 'Натрия хлорид 0.9% 400мл', category: 'Лекарство', unit: 'Флаконы', manufacturer: 'Фармстандарт', active: true, currentPrice: 55.00 },
  { id: 'NOM-004', name: 'Анальгин 50% 2мл', category: 'Лекарство', unit: 'Ампулы', manufacturer: 'Борщаговский ХФЗ', active: true, currentPrice: 28.00 },
  { id: 'NOM-005', name: 'Димедрол 1% 1мл', category: 'Лекарство', unit: 'Ампулы', manufacturer: 'Дарница', active: true, currentPrice: 22.00 },
  { id: 'NOM-006', name: 'Преднизолон 30мг/мл 1мл', category: 'Лекарство', unit: 'Ампулы', manufacturer: 'Фармстандарт', active: true, currentPrice: 68.00 },
  { id: 'NOM-007', name: 'Фуросемид 1% 2мл', category: 'Лекарство', unit: 'Ампулы', manufacturer: 'Дарница', active: true, currentPrice: 25.00 },
  { id: 'NOM-008', name: 'Нитроглицерин 0.5мг', category: 'Лекарство', unit: 'Таблетки', manufacturer: 'Фармстандарт', active: true, currentPrice: 5.00 },
  { id: 'NOM-009', name: 'Тонометр Omron M2 Basic', category: 'Оборудование', unit: 'Штуки', manufacturer: 'Omron', active: true, currentPrice: 3200.00 },
  { id: 'NOM-010', name: 'Пульсоксиметр CMS50D', category: 'Оборудование', unit: 'Штуки', manufacturer: 'CMS', active: true, currentPrice: 2800.00 },
  { id: 'NOM-011', name: 'Шприц 5мл', category: 'Расходный материал', unit: 'Штуки', manufacturer: '', active: true, currentPrice: 8.50 },
  { id: 'NOM-012', name: 'Шприц 10мл', category: 'Расходный материал', unit: 'Штуки', manufacturer: '', active: true, currentPrice: 12.00 },
  { id: 'NOM-013', name: 'Бинт стерильный 7м', category: 'Расходный материал', unit: 'Штуки', manufacturer: '', active: true, currentPrice: 25.00 },
  { id: 'NOM-014', name: 'Вата медицинская 50г', category: 'Расходный материал', unit: 'Штуки', manufacturer: '', active: true, currentPrice: 35.00 },
  { id: 'NOM-015', name: 'Система для в/в вливания', category: 'Расходный материал', unit: 'Штуки', manufacturer: '', active: true, currentPrice: 45.00 },
];

export const arrivals: Arrival[] = [
  { id: 'ARR-001', employeeId: 'EMP-001', date: fmt(daysAgo(25)), month: currentMonth, amount: 15000, shifts: 15, addedBy: 'Руководитель', type: 'Плановый', comment: 'Плановое обеспечение' },
  { id: 'ARR-002', employeeId: 'EMP-002', date: fmt(daysAgo(25)), month: currentMonth, amount: 12000, shifts: 12, addedBy: 'Руководитель', type: 'Плановый', comment: '' },
  { id: 'ARR-003', employeeId: 'EMP-004', date: fmt(daysAgo(25)), month: currentMonth, amount: 14000, shifts: 14, addedBy: 'Руководитель', type: 'Плановый', comment: '' },
  { id: 'ARR-004', employeeId: 'EMP-005', date: fmt(daysAgo(25)), month: currentMonth, amount: 16000, shifts: 16, addedBy: 'Руководитель', type: 'Плановый', comment: '' },
  { id: 'ARR-005', employeeId: 'EMP-006', date: fmt(daysAgo(25)), month: currentMonth, amount: 13000, shifts: 13, addedBy: 'Руководитель', type: 'Плановый', comment: '' },
  { id: 'ARR-006', employeeId: 'EMP-007', date: fmt(daysAgo(25)), month: currentMonth, amount: 15500, shifts: 15, addedBy: 'Руководитель', type: 'Плановый', comment: '' },
  { id: 'ARR-007', employeeId: 'EMP-008', date: fmt(daysAgo(25)), month: currentMonth, amount: 12500, shifts: 12, addedBy: 'Руководитель', type: 'Плановый', comment: '' },
  { id: 'ARR-008', employeeId: 'EMP-009', date: fmt(daysAgo(25)), month: currentMonth, amount: 14500, shifts: 14, addedBy: 'Руководитель', type: 'Плановый', comment: '' },
  { id: 'ARR-009', employeeId: 'EMP-001', date: fmt(daysAgo(10)), month: currentMonth, amount: 3000, shifts: 0, addedBy: 'Руководитель', type: 'Дополнительный', comment: 'Доп. обеспечение' },
];

const patientNames = [
  { name: 'Абрамов Пётр Сергеевич', bd: '1965-03-12' },
  { name: 'Белова Ирина Константиновна', bd: '1978-07-22' },
  { name: 'Григорьев Олег Николаевич', bd: '1952-11-05' },
  { name: 'Дмитриева Светлана Юрьевна', bd: '1989-01-30' },
  { name: 'Егоров Виктор Павлович', bd: '1971-09-18' },
  { name: 'Жукова Наталья Ивановна', bd: '1945-04-02' },
  { name: 'Зайцев Михаил Андреевич', bd: '1983-06-25' },
  { name: 'Ильина Людмила Фёдоровна', bd: '1960-12-14' },
  { name: 'Кириллов Денис Олегович', bd: '1995-08-08' },
  { name: 'Лебедева Марина Александровна', bd: '1973-02-19' },
  { name: 'Макаров Артём Валерьевич', bd: '1988-05-27' },
  { name: 'Никитина Галина Петровна', bd: '1956-10-03' },
  { name: 'Орлов Роман Дмитриевич', bd: '1991-03-16' },
  { name: 'Павлова Елена Васильевна', bd: '1967-07-09' },
  { name: 'Романов Игорь Степанович', bd: '1949-11-21' },
];

const randItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const expenses: Expense[] = [];
let expCounter = 1;
employees.forEach(emp => {
  if (emp.status === 'Уволен' || emp.status === 'Отпуск') return;
  const numCalls = Math.floor(Math.random() * 12) + 3;
  for (let c = 0; c < numCalls; c++) {
    const patient = randItem(patientNames);
    const callDate = daysAgo(Math.floor(Math.random() * 25));
    const numItems = Math.floor(Math.random() * 4) + 1;
    const usedNoms = new Set<string>();
    for (let n = 0; n < numItems; n++) {
      let nom: NomenclatureItem;
      do { nom = randItem(nomenclature.filter(x => x.category !== 'Оборудование')); } while (usedNoms.has(nom.id));
      usedNoms.add(nom.id);
      expenses.push({
        id: `EXP-${String(expCounter++).padStart(4, '0')}`,
        employeeId: emp.id,
        date: fmtDT(callDate),
        callDate: fmt(callDate),
        month: currentMonth,
        nomenclatureId: nom.id,
        quantity: nom.category === 'Лекарство' ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 3) + 1,
        patientName: patient.name,
        patientBirthDate: patient.bd,
        callId: `CALL-${emp.id}-${c + 1}`,
      });
    }
  }
});

export const returns: ReturnOperation[] = [
  { id: 'RET-001', employeeId: 'EMP-001', date: fmtDT(daysAgo(3)), nomenclatureId: 'NOM-003', quantity: 5, status: 'Новый', correctedBy: '', correctedQuantity: null, comment: '', reason: 'Остаток после смены' },
  { id: 'RET-002', employeeId: 'EMP-004', date: fmtDT(daysAgo(5)), nomenclatureId: 'NOM-011', quantity: 20, status: 'Принят', correctedBy: 'Руководитель', correctedQuantity: 20, comment: 'Принято на склад', reason: 'Лишнее после ревизии' },
  { id: 'RET-003', employeeId: 'EMP-006', date: fmtDT(daysAgo(1)), nomenclatureId: 'NOM-001', quantity: 3, status: 'Новый', correctedBy: '', correctedQuantity: null, comment: '', reason: 'Истёк срок годности' },
  { id: 'RET-004', employeeId: 'EMP-002', date: fmtDT(daysAgo(7)), nomenclatureId: 'NOM-005', quantity: 10, status: 'Скорректирован', correctedBy: 'Кладовщик', correctedQuantity: 8, comment: 'Принято 8 из 10', reason: 'Возврат на склад' },
];

export const chatMessages: ChatMessage[] = [
  { id: 'MSG-001', fromId: 'MGR', fromName: 'Руководитель', toId: 'EMP-001', toName: 'Иванов И.И.', role: 'Руководитель', text: 'Иван, проверьте остатки адреналина, нужно заказать.', date: fmtDT(daysAgo(2)), read: true, priority: 'Обычное' },
  { id: 'MSG-002', fromId: 'EMP-001', fromName: 'Иванов И.И.', toId: 'MGR', toName: 'Руководитель', role: 'Сотрудник', text: 'Проверил, осталось 15 ампул. Хватит на неделю.', date: fmtDT(daysAgo(2)), read: true, priority: 'Обычное' },
  { id: 'MSG-003', fromId: 'MGR', fromName: 'Руководитель', toId: 'EMP-005', toName: 'Морозов Д.А.', role: 'Руководитель', text: 'Дмитрий, почему не выходите на связь уже 8 дней?', date: fmtDT(daysAgo(1)), read: false, priority: 'Важное' },
  { id: 'MSG-004', fromId: 'EMP-004', fromName: 'Козлова Е.Д.', toId: 'STORE', toName: 'Кладовщик', role: 'Сотрудник', text: 'Нужны дополнительные шприцы 10мл, 50 штук.', date: fmtDT(daysAgo(0)), read: false, priority: 'Обычное' },
  { id: 'MSG-005', fromId: 'STORE', fromName: 'Кладовщик', toId: 'EMP-004', toName: 'Козлова Е.Д.', role: 'Кладовщик', text: 'Принято, подготовлю завтра к 9:00.', date: fmtDT(daysAgo(0)), read: true, priority: 'Обычное' },
  { id: 'MSG-006', fromId: 'MGR', fromName: 'Руководитель', toId: 'EMP-006', toName: 'Волкова А.И.', role: 'Руководитель', text: 'Анна, отличный отчёт за прошлую неделю!', date: fmtDT(daysAgo(3)), read: true, priority: 'Обычное' },
  { id: 'MSG-007', fromId: 'EMP-009', fromName: 'Кузнецов А.М.', toId: 'MGR', toName: 'Руководитель', role: 'Сотрудник', text: 'Прошу увеличить лимит по преднизолону.', date: fmtDT(daysAgo(4)), read: false, priority: 'Обычное' },
];

export const auditLog: AuditEntry[] = [
  { id: 'LOG-001', date: fmtDT(daysAgo(0)), userId: 'MGR', userName: 'Руководитель', role: 'Руководитель', sheet: 'Приход', recordId: 'ARR-009', action: 'Создание', field: '', oldValue: '', newValue: 'Приход 3000₽ для EMP-001' },
  { id: 'LOG-002', date: fmtDT(daysAgo(1)), userId: 'MGR', userName: 'Руководитель', role: 'Руководитель', sheet: 'Сотрудники', recordId: 'EMP-005', action: 'Изменение', field: 'Статус', oldValue: 'Активен', newValue: 'Неактивен (8 дней)' },
  { id: 'LOG-003', date: fmtDT(daysAgo(2)), userId: 'STORE', userName: 'Кладовщик Петров', role: 'Кладовщик', sheet: 'Цены', recordId: 'NOM-001', action: 'Изменение', field: 'Цена', oldValue: '42.00 ₽', newValue: '45.00 ₽' },
  { id: 'LOG-004', date: fmtDT(daysAgo(3)), userId: 'EMP-001', userName: 'Иванов И.И.', role: 'Сотрудник', sheet: 'Расход', recordId: 'EXP-0012', action: 'Создание', field: '', oldValue: '', newValue: 'Расход: Адреналин 2 ампулы' },
  { id: 'LOG-005', date: fmtDT(daysAgo(3)), userId: 'EMP-001', userName: 'Иванов И.И.', role: 'Сотрудник', sheet: 'Возвраты', recordId: 'RET-001', action: 'Создание', field: '', oldValue: '', newValue: 'Возврат: Натрия хлорид 5 флаконов' },
  { id: 'LOG-006', date: fmtDT(daysAgo(5)), userId: 'MGR', userName: 'Руководитель', role: 'Руководитель', sheet: 'Возвраты', recordId: 'RET-002', action: 'Изменение', field: 'Статус', oldValue: 'Новый', newValue: 'Принят' },
  { id: 'LOG-007', date: fmtDT(daysAgo(7)), userId: 'STORE', userName: 'Кладовщик Петров', role: 'Кладовщик', sheet: 'Возвраты', recordId: 'RET-004', action: 'Изменение', field: 'Количество', oldValue: '10', newValue: '8' },
  { id: 'LOG-008', date: fmtDT(daysAgo(10)), userId: 'MGR', userName: 'Руководитель', role: 'Руководитель', sheet: 'Сотрудники', recordId: 'EMP-003', action: 'Изменение', field: 'Статус', oldValue: 'Активен', newValue: 'Отпуск' },
];

export const notifications: Notification[] = [
  { id: 'NOT-001', type: 'inactive', title: 'Неактивный сотрудник', message: 'Морозов Д.А. не вносит расход уже 8 дней', date: fmtDT(daysAgo(0)), read: false, employeeId: 'EMP-005' },
  { id: 'NOT-002', type: 'overconsumption', title: 'Перерасход', message: 'У Волковой А.И. расход превышает приход на 15%', date: fmtDT(daysAgo(1)), read: false, employeeId: 'EMP-006' },
  { id: 'NOT-003', type: 'return', title: 'Новый возврат', message: 'Иванов И.И. оформил возврат: Натрия хлорид 5 флаконов', date: fmtDT(daysAgo(1)), read: false, employeeId: 'EMP-001' },
  { id: 'NOT-004', type: 'return', title: 'Новый возврат', message: 'Волкова А.И. оформила возврат: Адреналин 3 ампулы', date: fmtDT(daysAgo(0)), read: false, employeeId: 'EMP-006' },
  { id: 'NOT-005', type: 'message', title: 'Новое сообщение', message: 'Кузнецов А.М. отправил сообщение', date: fmtDT(daysAgo(4)), read: true, employeeId: 'EMP-009' },
  { id: 'NOT-006', type: 'report', title: 'Ежемесячный отчёт', message: 'Отчёт за прошлый месяц готов к просмотру', date: fmtDT(daysAgo(8)), read: true },
];

// Функции расчёта
export function getEmployeeArrival(empId: string, month: string): number {
  return arrivals
    .filter(a => a.employeeId === empId && a.month === month)
    .reduce((sum, a) => sum + a.amount, 0);
}

export function getEmployeeExpenseValue(empId: string, month: string): number {
  return expenses
    .filter(e => e.employeeId === empId && e.month === month)
    .reduce((sum, e) => {
      const nom = nomenclature.find(n => n.id === e.nomenclatureId);
      return sum + (nom ? nom.currentPrice * e.quantity : 0);
    }, 0);
}

export function getEmployeeCallsCount(empId: string, month: string): number {
  const callIds = new Set(expenses.filter(e => e.employeeId === empId && e.month === month).map(e => e.callId));
  return callIds.size;
}

export function getEmployeePatientsCount(empId: string, month: string): number {
  const patients = new Set(
    expenses
      .filter(e => e.employeeId === empId && e.month === month)
      .map(e => `${e.patientName}_${e.patientBirthDate}`)
  );
  return patients.size;
}

export function getEmployeeStock(empId: string): { nomId: string; name: string; unit: string; qty: number; price: number; value: number }[] {
  const stock: Record<string, number> = {};
  
  // Начальные остатки (упрощённо - берём приход в штуках из расчёта)
  // Для демо считаем: приход в рублях / цена = примерное кол-во
  // Реальная система хранит начальные остатки отдельно
  
  expenses
    .filter(e => e.employeeId === empId && e.month === currentMonth)
    .forEach(e => {
      if (!stock[e.nomenclatureId]) stock[e.nomenclatureId] = 0;
      stock[e.nomenclatureId] -= e.quantity;
    });
  
  returns
    .filter(r => r.employeeId === empId && (r.status === 'Принят' || r.status === 'Скорректирован'))
    .forEach(r => {
      if (!stock[r.nomenclatureId]) stock[r.nomenclatureId] = 0;
      stock[r.nomenclatureId] += (r.correctedQuantity ?? r.quantity);
    });
  
  // Добавим базовый "приход в штуках" (демо: приход / средняя цена)
  const arrivalAmount = getEmployeeArrival(empId, currentMonth);
  nomenclature.forEach(nom => {
    if (nom.category !== 'Оборудование') {
      if (!stock[nom.id]) stock[nom.id] = 0;
      // Распределяем приход пропорционально
      const share = arrivalAmount / (nomenclature.filter(n => n.category !== 'Оборудование').length);
      stock[nom.id] += Math.round(share / nom.currentPrice);
    }
  });
  
  return Object.entries(stock)
    .filter(([, qty]) => qty > 0)
    .map(([nomId, qty]) => {
      const nom = nomenclature.find(n => n.id === nomId)!;
      return {
        nomId,
        name: nom.name,
        unit: nom.unit,
        qty,
        price: nom.currentPrice,
        value: qty * nom.currentPrice,
      };
    });
}

export function getTotalDepartmentStock(): number {
  return employees
    .filter(e => e.status === 'Активен')
    .reduce((sum, emp) => {
      const stock = getEmployeeStock(emp.id);
      return sum + stock.reduce((s, item) => s + item.value, 0);
    }, 0);
}

export function getTotalDepartmentStockItems(): number {
  return employees
    .filter(e => e.status === 'Активен')
    .reduce((sum, emp) => {
      const stock = getEmployeeStock(emp.id);
      return sum + stock.reduce((s, item) => s + item.qty, 0);
    }, 0);
}
