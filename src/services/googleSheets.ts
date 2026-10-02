/**
 * Google Sheets API Service
 * Интеграция с Google Sheets для хранения данных системы учёта
 */

export interface SheetsConfig {
  apiKey: string;
  spreadsheetId: string;
  connected: boolean;
}

const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

class GoogleSheetsService {
  private config: SheetsConfig = {
    apiKey: '',
    spreadsheetId: '',
    connected: false,
  };

  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadConfig();
  }

  /**
   * Загрузка конфигурации из localStorage
   */
  private loadConfig() {
    const saved = localStorage.getItem('googleSheetsConfig');
    if (saved) {
      try {
        this.config = JSON.parse(saved);
      } catch (e) {
        console.error('Ошибка загрузки конфигурации:', e);
      }
    }
  }

  /**
   * Сохранение конфигурации в localStorage
   */
  private saveConfig() {
    localStorage.setItem('googleSheetsConfig', JSON.stringify(this.config));
    this.notifyListeners();
  }

  /**
   * Уведомление подписчиков об изменении
   */
  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  /**
   * Подписка на изменения конфигурации
   */
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Получить текущую конфигурацию
   */
  getConfig(): SheetsConfig {
    return { ...this.config };
  }

  /**
   * Установить конфигурацию
   */
  setConfig(apiKey: string, spreadsheetId: string) {
    this.config = {
      apiKey,
      spreadsheetId,
      connected: false,
    };
    this.saveConfig();
  }

  /**
   * Проверка подключения
   */
  async testConnection(): Promise<boolean> {
    if (!this.config.apiKey || !this.config.spreadsheetId) {
      return false;
    }

    try {
      const url = `${BASE_URL}/${this.config.spreadsheetId}?key=${this.config.apiKey}&fields=properties.title`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Подключение успешно:', data.properties?.title);
      
      this.config.connected = true;
      this.saveConfig();
      return true;
    } catch (error) {
      console.error('Ошибка подключения:', error);
      this.config.connected = false;
      this.saveConfig();
      return false;
    }
  }

  /**
   * Чтение данных из листа
   */
  async readSheet(sheetName: string, range?: string): Promise<any[][]> {
    if (!this.config.connected) {
      throw new Error('Не подключено к Google Sheets');
    }

    const rangeParam = range ? `!${range}` : '';
    const url = `${BASE_URL}/${this.config.spreadsheetId}/values/${encodeURIComponent(sheetName)}${rangeParam}?key=${this.config.apiKey}`;

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

  /**
   * Запись данных в лист
   */
  async writeToSheet(sheetName: string, values: any[][], range?: string): Promise<void> {
    if (!this.config.connected) {
      throw new Error('Не подключено к Google Sheets');
    }

    const rangeParam = range ? `!${range}` : ':A1';
    const url = `${BASE_URL}/${this.config.spreadsheetId}/values/${encodeURIComponent(sheetName)}${rangeParam}:append?valueInputOption=USER_ENTERED&key=${this.config.apiKey}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Ошибка записи в лист ${sheetName}:`, error);
      throw error;
    }
  }

  /**
   * Обновление ячейки
   */
  async updateCell(sheetName: string, cell: string, value: any): Promise<void> {
    if (!this.config.connected) {
      throw new Error('Не подключено к Google Sheets');
    }

    const url = `${BASE_URL}/${this.config.spreadsheetId}/values/${encodeURIComponent(sheetName)}!${cell}?valueInputOption=USER_ENTERED&key=${this.config.apiKey}`;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [[value]],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Ошибка обновления ячейки ${cell}:`, error);
      throw error;
    }
  }

  /**
   * Получение списка всех листов
   */
  async getSheetsList(): Promise<string[]> {
    if (!this.config.connected) {
      throw new Error('Не подключено к Google Sheets');
    }

    const url = `${BASE_URL}/${this.config.spreadsheetId}?key=${this.config.apiKey}&fields=sheets.properties.title`;

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.sheets.map((s: any) => s.properties.title);
    } catch (error) {
      console.error('Ошибка получения списка листов:', error);
      throw error;
    }
  }

  /**
   * Чтение сотрудников
   */
  async readEmployees(): Promise<any[]> {
    const data = await this.readSheet('Сотрудники');
    if (data.length < 2) return [];

    const headers = data[0];
    return data.slice(1).map(row => {
      const obj: any = {};
      headers.forEach((h, i) => {
        obj[h] = row[i] || '';
      });
      return obj;
    });
  }

  /**
   * Чтение номенклатуры
   */
  async readNomenclature(): Promise<any[]> {
    const data = await this.readSheet('Номенклатура');
    if (data.length < 2) return [];

    const headers = data[0];
    return data.slice(1).map(row => {
      const obj: any = {};
      headers.forEach((h, i) => {
        obj[h] = row[i] || '';
      });
      return obj;
    });
  }

  /**
   * Чтение цен
   */
  async readPrices(): Promise<any[]> {
    const data = await this.readSheet('Цены');
    if (data.length < 2) return [];

    const headers = data[0];
    return data.slice(1).map(row => {
      const obj: any = {};
      headers.forEach((h, i) => {
        obj[h] = row[i] || '';
      });
      return obj;
    });
  }

  /**
   * Чтение прихода
   */
  async readArrivals(): Promise<any[]> {
    const data = await this.readSheet('Приход');
    if (data.length < 2) return [];

    const headers = data[0];
    return data.slice(1).map(row => {
      const obj: any = {};
      headers.forEach((h, i) => {
        obj[h] = row[i] || '';
      });
      return obj;
    });
  }

  /**
   * Чтение расхода
   */
  async readExpenses(): Promise<any[]> {
    const data = await this.readSheet('Расход');
    if (data.length < 2) return [];

    const headers = data[0];
    return data.slice(1).map(row => {
      const obj: any = {};
      headers.forEach((h, i) => {
        obj[h] = row[i] || '';
      });
      return obj;
    });
  }

  /**
   * Чтение возвратов
   */
  async readReturns(): Promise<any[]> {
    const data = await this.readSheet('Возвраты');
    if (data.length < 2) return [];

    const headers = data[0];
    return data.slice(1).map(row => {
      const obj: any = {};
      headers.forEach((h, i) => {
        obj[h] = row[i] || '';
      });
      return obj;
    });
  }

  /**
   * Чтение чата
   */
  async readChat(): Promise<any[]> {
    const data = await this.readSheet('Чат');
    if (data.length < 2) return [];

    const headers = data[0];
    return data.slice(1).map(row => {
      const obj: any = {};
      headers.forEach((h, i) => {
        obj[h] = row[i] || '';
      });
      return obj;
    });
  }

  /**
   * Запись нового сотрудника
   */
  async addEmployee(employee: any): Promise<void> {
    const values = [[
      employee.id,
      employee.personalNumber,
      employee.fullName,
      employee.passwordHash,
      employee.status,
      employee.position,
      employee.hireDate,
      employee.fireDate || '',
      employee.blocked ? 'ДА' : 'НЕТ',
      employee.phone,
      employee.email || '',
      new Date().toISOString(),
      '',
      employee.note || '',
    ]];
    await this.writeToSheet('Сотрудники', values);
  }

  /**
   * Запись расхода
   */
  async addExpense(expense: any): Promise<void> {
    const values = [[
      expense.id,
      expense.employeeId,
      expense.employeeName,
      new Date().toISOString(),
      expense.callDate,
      expense.month,
      expense.nomenclatureId,
      expense.nomenclatureName,
      expense.quantity,
      expense.unit,
      expense.patientName,
      expense.patientBirthDate,
      expense.callId,
      'ДА',
      expense.localTime,
      'НЕТ',
      expense.note || '',
    ]];
    await this.writeToSheet('Расход', values);
  }

  /**
   * Запись прихода
   */
  async addArrival(arrival: any): Promise<void> {
    const values = [[
      arrival.id,
      arrival.employeeId,
      arrival.employeeName,
      arrival.date,
      arrival.month,
      arrival.amount,
      arrival.shifts,
      arrival.addedBy,
      arrival.type,
      arrival.comment || '',
      new Date().toISOString(),
    ]];
    await this.writeToSheet('Приход', values);
  }

  /**
   * Запись возврата
   */
  async addReturn(returnOp: any): Promise<void> {
    const values = [[
      returnOp.id,
      returnOp.employeeId,
      returnOp.employeeName,
      new Date().toISOString(),
      returnOp.month,
      returnOp.nomenclatureId,
      returnOp.nomenclatureName,
      returnOp.quantity,
      returnOp.unit,
      returnOp.status,
      returnOp.correctedBy || '',
      returnOp.correctedQuantity || '',
      '',
      returnOp.comment || '',
      returnOp.reason || '',
    ]];
    await this.writeToSheet('Возвраты', values);
  }

  /**
   * Запись сообщения в чат
   */
  async addChatMessage(message: any): Promise<void> {
    const values = [[
      message.id,
      message.fromId,
      message.fromName,
      message.toId,
      message.toName,
      message.role,
      message.text,
      new Date().toISOString(),
      'НЕТ',
      message.type || 'Личное',
      message.priority || 'Обычное',
    ]];
    await this.writeToSheet('Чат', values);
  }

  /**
   * Запись в журнал изменений
   */
  async addAuditLog(log: any): Promise<void> {
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
      log.ip || '',
      log.device || '',
    ]];
    await this.writeToSheet('Журнал изменений', values);
  }

  /**
   * Отключение
   */
  disconnect() {
    this.config.connected = false;
    this.saveConfig();
  }
}

// Singleton instance
export const googleSheetsService = new GoogleSheetsService();
