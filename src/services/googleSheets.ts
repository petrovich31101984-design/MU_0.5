/**
 * Google Sheets API Service
 * Конфигурация хранится в localStorage
 */

interface Config {
  apiKey: string;
  spreadsheetId: string;
}

const CONFIG_KEY = 'googleSheetsConfig';

// Получение конфигурации из localStorage
function getConfig(): Config {
  const saved = localStorage.getItem(CONFIG_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return { apiKey: '', spreadsheetId: '' };
    }
  }
  return { apiKey: '', spreadsheetId: '' };
}

// Сохранение конфигурации в localStorage
export function saveConfig(apiKey: string, spreadsheetId: string): void {
  localStorage.setItem(CONFIG_KEY, JSON.stringify({ apiKey, spreadsheetId }));
}

// Очистка конфигурации
export function clearConfig(): void {
  localStorage.removeItem(CONFIG_KEY);
}

// Проверка подключения
export function isConnected(): boolean {
  const config = getConfig();
  return !!(config.apiKey && config.spreadsheetId);
}

// Получение текущей конфигурации
export function getCurrentConfig(): Config {
  return getConfig();
}

const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

export interface Employee {
  id: string;
  personalNumber: string;
  fullName: string;
  status: string;
  position: string;
  hireDate: string;
  blocked: boolean;
  phone: string;
  lastActivity: string;
  note: string;
}

export interface Nomenclature {
  id: string;
  name: string;
  category: string;
  unit: string;
  manufacturer: string;
  active: boolean;
  currentPrice: number;
}

export interface Arrival {
  id: string;
  employeeId: string;
  date: string;
  month: string;
  amount: number;
  shifts: number;
  addedBy: string;
  type: string;
  comment: string;
}

export interface Expense {
  id: string;
  employeeId: string;
  date: string;
  callDate: string;
  month: string;
  nomenclatureId: string;
  quantity: number;
  patientName: string;
  patientBirthDate: string;
  callId: string;
}

export interface ReturnOperation {
  id: string;
  employeeId: string;
  date: string;
  nomenclatureId: string;
  quantity: number;
  status: string;
  correctedBy: string;
  correctedQuantity: number | null;
  comment: string;
  reason: string;
}

export interface ChatMessage {
  id: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  role: string;
  text: string;
  date: string;
  read: boolean;
  priority: string;
}

export interface AuditEntry {
  id: string;
  date: string;
  userId: string;
  userName: string;
  role: string;
  sheet: string;
  recordId: string;
  action: string;
  field: string;
  oldValue: string;
  newValue: string;
}

// Проверка подключения к Google Sheets
export async function testConnection(): Promise<{ success: boolean; title?: string; error?: string }> {
  const config = getConfig();
  if (!config.apiKey || !config.spreadsheetId) {
    return { success: false, error: 'API ключ или ID таблицы не указаны' };
  }

  try {
    const url = `${BASE_URL}/${config.spreadsheetId}?key=${config.apiKey}&fields=properties.title`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      return { 
        success: false, 
        error: `Ошибка ${response.status}: ${errorData.error?.message || response.statusText}` 
      };
    }

    const data = await response.json();
    return { success: true, title: data.properties?.title };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Неизвестная ошибка' 
    };
  }
}

// Чтение данных из листа
async function readSheet(sheetName: string): Promise<any[][]> {
  const config = getConfig();
  if (!config.apiKey || !config.spreadsheetId) {
    throw new Error('Не настроено подключение к Google Sheets');
  }

  const url = `${BASE_URL}/${config.spreadsheetId}/values/${encodeURIComponent(sheetName)}?key=${config.apiKey}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error(`Ошибка чтения листа ${sheetName}:`, error);
    throw error;
  }
}

// Запись данных в лист
async function writeToSheet(sheetName: string, values: any[][]): Promise<void> {
  const config = getConfig();
  if (!config.apiKey || !config.spreadsheetId) {
    throw new Error('Не настроено подключение к Google Sheets');
  }

  const url = `${BASE_URL}/${config.spreadsheetId}/values/${encodeURIComponent(sheetName)}:append?valueInputOption=USER_ENTERED&key=${config.apiKey}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Ошибка записи в лист ${sheetName}:`, error);
    throw error;
  }
}

// Получение сотрудников
export async function getEmployees(): Promise<Employee[]> {
  const data = await readSheet('Сотрудники');
  if (data.length < 2) return [];
  
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj: any = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] || '';
    });
    
    return {
      id: obj['ID'] || '',
      personalNumber: obj['Персональный номер'] || '',
      fullName: obj['ФИО'] || '',
      status: obj['Статус'] || 'Активен',
      position: obj['Должность'] || '',
      hireDate: obj['Дата найма'] || '',
      blocked: obj['Заблокирован'] === 'ДА',
      phone: obj['Телефон'] || '',
      lastActivity: obj['Последний вход'] || '',
      note: obj['Примечание'] || '',
    };
  });
}

// Получение номенклатуры
export async function getNomenclature(): Promise<Nomenclature[]> {
  const data = await readSheet('Номенклатура');
  if (data.length < 2) return [];
  
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj: any = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] || '';
    });
    
    return {
      id: obj['ID'] || '',
      name: obj['Название'] || '',
      category: obj['Категория'] || 'Лекарство',
      unit: obj['Ед. измерения'] || 'Штуки',
      manufacturer: obj['Производитель'] || '',
      active: obj['Актуальна'] === 'ДА',
      currentPrice: parseFloat(obj['Цена'] || '0'),
    };
  });
}

// Получение прихода
export async function getArrivals(): Promise<Arrival[]> {
  const data = await readSheet('Приход');
  if (data.length < 2) return [];
  
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj: any = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] || '';
    });
    
    return {
      id: obj['ID'] || '',
      employeeId: obj['Сотрудник_ID'] || '',
      date: obj['Дата'] || '',
      month: obj['Месяц'] || '',
      amount: parseFloat(obj['Сумма (₽)'] || '0'),
      shifts: parseInt(obj['Количество смен'] || '0'),
      addedBy: obj['Кем внесено'] || '',
      type: obj['Тип'] || 'Плановый',
      comment: obj['Комментарий'] || '',
    };
  });
}

// Получение расхода
export async function getExpenses(): Promise<Expense[]> {
  const data = await readSheet('Расход');
  if (data.length < 2) return [];
  
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj: any = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] || '';
    });
    
    return {
      id: obj['ID'] || '',
      employeeId: obj['Сотрудник_ID'] || '',
      date: obj['Дата внесения'] || '',
      callDate: obj['Дата вызова'] || '',
      month: obj['Месяц'] || '',
      nomenclatureId: obj['Номенклатура_ID'] || '',
      quantity: parseInt(obj['Количество'] || '0'),
      patientName: obj['Пациент ФИО'] || '',
      patientBirthDate: obj['Пациент ДР'] || '',
      callId: obj['Вызов_ID'] || '',
    };
  });
}

// Получение возвратов
export async function getReturns(): Promise<ReturnOperation[]> {
  const data = await readSheet('Возвраты');
  if (data.length < 2) return [];
  
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj: any = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] || '';
    });
    
    return {
      id: obj['ID'] || '',
      employeeId: obj['Сотрудник_ID'] || '',
      date: obj['Дата создания'] || '',
      nomenclatureId: obj['Номенклатура_ID'] || '',
      quantity: parseInt(obj['Количество'] || '0'),
      status: obj['Статус'] || 'Новый',
      correctedBy: obj['Кем скорректировано'] || '',
      correctedQuantity: obj['Скорректированное кол-во'] ? parseInt(obj['Скорректированное кол-во']) : null,
      comment: obj['Комментарий'] || '',
      reason: obj['Причина возврата'] || '',
    };
  });
}

// Получение сообщений чата
export async function getChatMessages(): Promise<ChatMessage[]> {
  const data = await readSheet('Чат');
  if (data.length < 2) return [];
  
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj: any = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] || '';
    });
    
    return {
      id: obj['ID'] || '',
      fromId: obj['От кого (ID)'] || '',
      fromName: obj['От кого (ФИО)'] || '',
      toId: obj['Кому (ID)'] || '',
      toName: obj['Кому (ФИО)'] || '',
      role: obj['Роль отправителя'] || 'Сотрудник',
      text: obj['Текст сообщения'] || '',
      date: obj['Дата и время'] || '',
      read: obj['Прочитано'] === 'ДА',
      priority: obj['Приоритет'] || 'Обычное',
    };
  });
}

// Получение журнала изменений
export async function getAuditLog(): Promise<AuditEntry[]> {
  const data = await readSheet('Журнал изменений');
  if (data.length < 2) return [];
  
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj: any = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] || '';
    });
    
    return {
      id: obj['ID'] || '',
      date: obj['Дата и время'] || '',
      userId: obj['Пользователь ID'] || '',
      userName: obj['Пользователь ФИО'] || '',
      role: obj['Роль'] || '',
      sheet: obj['Лист'] || '',
      recordId: obj['Запись_ID'] || '',
      action: obj['Действие'] || '',
      field: obj['Поле'] || '',
      oldValue: obj['Было'] || '',
      newValue: obj['Стало'] || '',
    };
  });
}

// Добавление сотрудника
export async function addEmployee(employee: Partial<Employee>): Promise<void> {
  const values = [[
    employee.id,
    employee.personalNumber,
    employee.fullName,
    employee.status || 'Активен',
    employee.position || '',
    employee.hireDate || new Date().toISOString().split('T')[0],
    employee.blocked ? 'ДА' : 'НЕТ',
    employee.phone || '',
    employee.lastActivity || '',
    employee.note || '',
  ]];
  await writeToSheet('Сотрудники', values);
}

// Добавление расхода
export async function addExpense(expense: Partial<Expense>): Promise<void> {
  const values = [[
    expense.id,
    expense.employeeId,
    expense.date || new Date().toISOString(),
    expense.callDate,
    expense.month,
    expense.nomenclatureId,
    expense.quantity,
    expense.patientName,
    expense.patientBirthDate,
    expense.callId,
  ]];
  await writeToSheet('Расход', values);
}

// Добавление прихода
export async function addArrival(arrival: Partial<Arrival>): Promise<void> {
  const values = [[
    arrival.id,
    arrival.employeeId,
    arrival.date || new Date().toISOString().split('T')[0],
    arrival.month,
    arrival.amount,
    arrival.shifts,
    arrival.addedBy || 'Руководитель',
    arrival.type || 'Плановый',
    arrival.comment || '',
  ]];
  await writeToSheet('Приход', values);
}

// Добавление возврата
export async function addReturn(returnOp: Partial<ReturnOperation>): Promise<void> {
  const values = [[
    returnOp.id,
    returnOp.employeeId,
    returnOp.date || new Date().toISOString(),
    returnOp.nomenclatureId,
    returnOp.quantity,
    returnOp.status || 'Новый',
    returnOp.correctedBy || '',
    returnOp.correctedQuantity || '',
    returnOp.comment || '',
    returnOp.reason || '',
  ]];
  await writeToSheet('Возвраты', values);
}

// Добавление сообщения в чат
export async function addChatMessage(message: Partial<ChatMessage>): Promise<void> {
  const values = [[
    message.id,
    message.fromId,
    message.fromName,
    message.toId,
    message.toName,
    message.role || 'Руководитель',
    message.text,
    new Date().toISOString(),
    'НЕТ',
    message.priority || 'Обычное',
  ]];
  await writeToSheet('Чат', values);
}

// Добавление записи в журнал
export async function addAuditLog(log: Partial<AuditEntry>): Promise<void> {
  const values = [[
    log.id,
    new Date().toISOString(),
    log.userId,
    log.userName,
    log.role,
    log.sheet,
    log.recordId,
    log.action,
    log.field || '',
    log.oldValue || '',
    log.newValue || '',
  ]];
  await writeToSheet('Журнал изменений', values);
}
