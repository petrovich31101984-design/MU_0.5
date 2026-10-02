/**
 * Data Adapter
 * Адаптер для работы с данными из Google Sheets или mock-данными
 */

import { googleSheetsService } from '../services/googleSheets';
import { employees as mockEmployees, nomenclature as mockNomenclature, arrivals as mockArrivals, expenses as mockExpenses, returns as mockReturns, chatMessages as mockChatMessages, auditLog as mockAuditLog } from '../mockData';
import { Employee, NomenclatureItem, Arrival, Expense, ReturnOperation, ChatMessage, AuditEntry } from '../types';

export class DataAdapter {
  private useRealData: boolean;

  constructor() {
    this.useRealData = googleSheetsService.getConfig().connected;
  }

  /**
   * Проверка режима работы
   */
  isUsingRealData(): boolean {
    return this.useRealData && googleSheetsService.getConfig().connected;
  }

  /**
   * Обновить режим работы
   */
  refreshMode() {
    this.useRealData = googleSheetsService.getConfig().connected;
  }

  /**
   * Получить сотрудников
   */
  async getEmployees(): Promise<Employee[]> {
    if (!this.isUsingRealData()) {
      return mockEmployees;
    }

    try {
      const data = await googleSheetsService.readEmployees();
      return data.map(row => ({
        id: row['ID'] || '',
        personalNumber: row['Персональный номер'] || '',
        fullName: row['ФИО'] || '',
        status: row['Статус'] || 'Активен',
        position: row['Должность'] || '',
        hireDate: row['Дата найма'] || '',
        blocked: row['Заблокирован'] === 'ДА',
        phone: row['Телефон'] || '',
        lastActivity: row['Последний вход'] || '',
        note: row['Примечание'] || '',
      }));
    } catch (error) {
      console.error('Ошибка загрузки сотрудников:', error);
      return mockEmployees;
    }
  }

  /**
   * Получить номенклатуру
   */
  async getNomenclature(): Promise<NomenclatureItem[]> {
    if (!this.isUsingRealData()) {
      return mockNomenclature;
    }

    try {
      const data = await googleSheetsService.readNomenclature();
      const prices = await googleSheetsService.readPrices();
      
      return data.map(row => {
        const currentPriceRow = prices.find(p => 
          p['Номенклатура_ID'] === row['ID'] && 
          (!p['Дата окончания'] || p['Дата окончания'] === '')
        );
        
        return {
          id: row['ID'] || '',
          name: row['Название'] || '',
          category: row['Категория'] || 'Лекарство',
          unit: row['Ед. измерения'] || 'Штуки',
          manufacturer: row['Производитель'] || '',
          active: row['Актуальна'] === 'ДА',
          currentPrice: parseFloat(currentPriceRow?.['Цена за ед. (₽)'] || '0'),
        };
      });
    } catch (error) {
      console.error('Ошибка загрузки номенклатуры:', error);
      return mockNomenclature;
    }
  }

  /**
   * Получить приход
   */
  async getArrivals(): Promise<Arrival[]> {
    if (!this.isUsingRealData()) {
      return mockArrivals;
    }

    try {
      const data = await googleSheetsService.readArrivals();
      return data.map(row => ({
        id: row['ID'] || '',
        employeeId: row['Сотрудник_ID'] || '',
        date: row['Дата'] || '',
        month: row['Месяц (отчётный)'] || '',
        amount: parseFloat(row['Сумма прихода (₽)'] || '0'),
        shifts: parseInt(row['Количество смен'] || '0'),
        addedBy: row['Кем внесено'] || '',
        type: row['Тип'] || 'Плановый',
        comment: row['Комментарий'] || '',
      }));
    } catch (error) {
      console.error('Ошибка загрузки прихода:', error);
      return mockArrivals;
    }
  }

  /**
   * Получить расход
   */
  async getExpenses(): Promise<Expense[]> {
    if (!this.isUsingRealData()) {
      return mockExpenses;
    }

    try {
      const data = await googleSheetsService.readExpenses();
      return data.map(row => ({
        id: row['ID'] || '',
        employeeId: row['Сотрудник_ID'] || '',
        date: row['Дата внесения'] || '',
        callDate: row['Дата вызова'] || '',
        month: row['Месяц (отчётный)'] || '',
        nomenclatureId: row['Номенклатура_ID'] || '',
        quantity: parseInt(row['Количество'] || '0'),
        patientName: row['Пациент ФИО'] || '',
        patientBirthDate: row['Пациент ДР'] || '',
        callId: row['Вызов_ID'] || '',
      }));
    } catch (error) {
      console.error('Ошибка загрузки расхода:', error);
      return mockExpenses;
    }
  }

  /**
   * Получить возвраты
   */
  async getReturns(): Promise<ReturnOperation[]> {
    if (!this.isUsingRealData()) {
      return mockReturns;
    }

    try {
      const data = await googleSheetsService.readReturns();
      return data.map(row => ({
        id: row['ID'] || '',
        employeeId: row['Сотрудник_ID'] || '',
        date: row['Дата создания'] || '',
        nomenclatureId: row['Номенклатура_ID'] || '',
        quantity: parseInt(row['Количество'] || '0'),
        status: row['Статус'] || 'Новый',
        correctedBy: row['Кем скорректировано'] || '',
        correctedQuantity: row['Скорректированное кол-во'] ? parseInt(row['Скорректированное кол-во']) : null,
        comment: row['Комментарий'] || '',
        reason: row['Причина возврата'] || '',
      }));
    } catch (error) {
      console.error('Ошибка загрузки возвратов:', error);
      return mockReturns;
    }
  }

  /**
   * Получить чат
   */
  async getChatMessages(): Promise<ChatMessage[]> {
    if (!this.isUsingRealData()) {
      return mockChatMessages;
    }

    try {
      const data = await googleSheetsService.readChat();
      return data.map(row => ({
        id: row['ID'] || '',
        fromId: row['От кого (ID)'] || '',
        fromName: row['От кого (ФИО)'] || '',
        toId: row['Кому (ID)'] || '',
        toName: row['Кому (ФИО)'] || '',
        role: row['Роль отправителя'] || 'Сотрудник',
        text: row['Текст сообщения'] || '',
        date: row['Дата и время'] || '',
        read: row['Прочитано'] === 'ДА',
        priority: row['Приоритет'] || 'Обычное',
      }));
    } catch (error) {
      console.error('Ошибка загрузки чата:', error);
      return mockChatMessages;
    }
  }

  /**
   * Получить журнал изменений
   */
  async getAuditLog(): Promise<AuditEntry[]> {
    if (!this.isUsingRealData()) {
      return mockAuditLog;
    }

    try {
      const data = await googleSheetsService.readSheet('Журнал изменений');
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
    } catch (error) {
      console.error('Ошибка загрузки журнала:', error);
      return mockAuditLog;
    }
  }

  /**
   * Добавить сотрудника
   */
  async addEmployee(employee: any): Promise<void> {
    if (!this.isUsingRealData()) {
      console.log('Mock: добавление сотрудника', employee);
      return;
    }

    await googleSheetsService.addEmployee(employee);
  }

  /**
   * Добавить расход
   */
  async addExpense(expense: any): Promise<void> {
    if (!this.isUsingRealData()) {
      console.log('Mock: добавление расхода', expense);
      return;
    }

    await googleSheetsService.addExpense(expense);
  }

  /**
   * Добавить приход
   */
  async addArrival(arrival: any): Promise<void> {
    if (!this.isUsingRealData()) {
      console.log('Mock: добавление прихода', arrival);
      return;
    }

    await googleSheetsService.addArrival(arrival);
  }

  /**
   * Добавить возврат
   */
  async addReturn(returnOp: any): Promise<void> {
    if (!this.isUsingRealData()) {
      console.log('Mock: добавление возврата', returnOp);
      return;
    }

    await googleSheetsService.addReturn(returnOp);
  }

  /**
   * Добавить сообщение в чат
   */
  async addChatMessage(message: any): Promise<void> {
    if (!this.isUsingRealData()) {
      console.log('Mock: добавление сообщения', message);
      return;
    }

    await googleSheetsService.addChatMessage(message);
  }

  /**
   * Добавить запись в журнал
   */
  async addAuditLog(log: any): Promise<void> {
    if (!this.isUsingRealData()) {
      console.log('Mock: добавление в журнал', log);
      return;
    }

    await googleSheetsService.addAuditLog(log);
  }
}

// Singleton instance
export const dataAdapter = new DataAdapter();
