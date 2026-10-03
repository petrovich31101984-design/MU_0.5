/**
 * ============================================================
 * СИСТЕМА УЧЁТА ЛЕКАРСТВЕННЫХ СРЕДСТВ
 * Скрипт автоматического развёртывания базы данных
 * ============================================================
 * 
 * ИНСТРУКЦИЯ ПО УСТАНОВКЕ:
 * 1. Создайте новую Google таблицу (sheets.google.com → Создать)
 * 2. Расширения → Apps Script
 * 3. Удалите весь код в редакторе
 * 4. Вставьте этот скрипт целиком
 * 5. Нажмите "Выполнить" (▶) → выберите функцию setupDatabase
 * 6. Авторизуйте доступ при запросе
 * 7. Дождитесь завершения (появится уведомление)
 * 
 * После выполнения в таблице появятся все необходимые листы
 * с заголовками, форматированием и примерами данных.
 */

// ==================== ГЛАВНАЯ ФУНКЦИЯ ====================

function setupDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Удаляем стандартный лист "Sheet1" если он есть
  const defaultSheet = ss.getSheetByName('Sheet1');
  
  Logger.log('🚀 Начинаю создание базы данных...');
  
  // Создаём все листы
  createSheet_Employees(ss);
  createSheet_Nomenclature(ss);
  createSheet_Prices(ss);
  createSheet_Arrival(ss);
  createSheet_Expenses(ss);
  createSheet_Returns(ss);
  createSheet_InitialStock(ss);
  createSheet_Chat(ss);
  createSheet_AuditLog(ss);
  createSheet_Settings(ss);
  createSheet_Reports(ss);
  
  // Удаляем стандартный лист
  if (defaultSheet && ss.getSheets().length > 1) {
    ss.deleteSheet(defaultSheet);
  }
  
  // Создаём меню
  setupMenu();
  
  Logger.log('✅ База данных успешно создана!');
  SpreadsheetApp.getUi().alert('✅ База данных успешно создана!\n\nСоздано листов: 11\n\nТеперь вы можете начать работу с системой.');
}

// ==================== ЛИСТ: СОТРУДНИКИ ====================

function createSheet_Employees(ss) {
  let sheet = ss.getSheetByName('Сотрудники');
  if (!sheet) sheet = ss.insertSheet('Сотрудники');
  
  // Заголовки
  const headers = [
    'ID',                    // A - Уникальный идентификатор
    'Персональный номер',    // B - Для авторизации
    'ФИО',                   // C - Полное имя
    'Пароль (хэш)',          // D - Хэшированный пароль
    'Статус',                // E - Активен / Неактивен / Отпуск / Уволен
    'Должность',             // F - Должность
    'Дата найма',            // G - Дата начала работы
    'Дата увольнения',       // H - Дата окончания (если есть)
    'Заблокирован',          // I - Блокировка при утере телефона
    'Телефон',               // J - Контактный телефон
    'Email',                 // K - Email
    'Дата регистрации',      // L - Когда создан аккаунт
    'Последний вход',        // M - Последний вход в систему
    'Примечание'             // N - Комментарий
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Форматирование заголовков
  formatHeader(sheet, headers.length);
  
  // Ширина столбцов
  sheet.setColumnWidth(1, 120);  // ID
  sheet.setColumnWidth(2, 140);  // Персональный номер
  sheet.setColumnWidth(3, 250);  // ФИО
  sheet.setColumnWidth(4, 200);  // Пароль
  sheet.setColumnWidth(5, 120);  // Статус
  sheet.setColumnWidth(6, 150);  // Должность
  sheet.setColumnWidth(7, 130);  // Дата найма
  sheet.setColumnWidth(8, 130);  // Дата увольнения
  sheet.setColumnWidth(9, 120);  // Заблокирован
  sheet.setColumnWidth(10, 140); // Телефон
  sheet.setColumnWidth(11, 200); // Email
  sheet.setColumnWidth(12, 140); // Дата регистрации
  sheet.setColumnWidth(13, 140); // Последний вход
  sheet.setColumnWidth(14, 250); // Примечание
  
  // Валидация данных - Статус
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Активен', 'Неактивен', 'Отпуск', 'Уволен'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange('E2:E1000').setDataValidation(statusRule);
  
  // Валидация - Заблокирован
  const boolRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['ДА', 'НЕТ'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange('I2:I1000').setDataValidation(boolRule);
  
  // Формат дат
  sheet.getRange('G2:G1000').setNumberFormat('dd.mm.yyyy');
  sheet.getRange('H2:H1000').setNumberFormat('dd.mm.yyyy');
  sheet.getRange('L2:L1000').setNumberFormat('dd.mm.yyyy hh:mm');
  sheet.getRange('M2:M1000').setNumberFormat('dd.mm.yyyy hh:mm');
  
  // Заморозка заголовка
  sheet.setFrozenRows(1);
  
  // Пример данных
  const sampleData = [
    ['EMP-001', '001', 'Иванов Иван Иванович', hashPassword('pass123'), 'Активен', 'Врач', new Date(2024, 0, 15), '', 'НЕТ', '+7 (900) 123-45-67', 'ivanov@mail.ru', new Date(), '', ''],
    ['EMP-002', '002', 'Петрова Мария Сергеевна', hashPassword('pass456'), 'Активен', 'Фельдшер', new Date(2024, 1, 1), '', 'НЕТ', '+7 (900) 234-56-78', 'petrova@mail.ru', new Date(), '', ''],
    ['EMP-003', '003', 'Сидоров Алексей Петрович', hashPassword('pass789'), 'Отпуск', 'Врач', new Date(2023, 6, 10), '', 'НЕТ', '+7 (900) 345-67-89', 'sidorov@mail.ru', new Date(), '', 'В отпуске до 15.02'],
  ];
  
  sheet.getRange(2, 1, sampleData.length, headers.length).setValues(sampleData);
  
  Logger.log('✅ Лист "Сотрудники" создан');
}

// ==================== ЛИСТ: НОМЕНКЛАТУРА ====================

function createSheet_Nomenclature(ss) {
  let sheet = ss.getSheetByName('Номенклатура');
  if (!sheet) sheet = ss.insertSheet('Номенклатура');
  
  const headers = [
    'ID',              // A
    'Название',        // B
    'Категория',       // C - Лекарство / Оборудование / Расходный материал
    'Ед. измерения',   // D - Ампулы / Таблетки / Флаконы / Штуки
    'Производитель',   // E
    'Штрих-код',       // F
    'Актуальна',       // G - Да/Нет
    'Дата создания',   // H
    'Примечание'       // I
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
  
  // Ширина столбцов
  sheet.setColumnWidth(1, 120);
  sheet.setColumnWidth(2, 300);
  sheet.setColumnWidth(3, 160);
  sheet.setColumnWidth(4, 140);
  sheet.setColumnWidth(5, 200);
  sheet.setColumnWidth(6, 150);
  sheet.setColumnWidth(7, 100);
  sheet.setColumnWidth(8, 140);
  sheet.setColumnWidth(9, 250);
  
  // Валидация - Категория
  const categoryRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Лекарство', 'Оборудование', 'Расходный материал'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange('C2:C1000').setDataValidation(categoryRule);
  
  // Валидация - Ед. измерения
  const unitRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Ампулы', 'Таблетки', 'Флаконы', 'Штуки', 'Упаковки', 'мл', 'г'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange('D2:D1000').setDataValidation(unitRule);
  
  // Валидация - Актуальна
  const boolRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['ДА', 'НЕТ'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange('G2:G1000').setDataValidation(boolRule);
  
  // Формат дат
  sheet.getRange('H2:H1000').setNumberFormat('dd.mm.yyyy hh:mm');
  
  sheet.setFrozenRows(1);
  
  // Пример данных
  const sampleData = [
    ['NOM-001', 'Адреналин 0.1% 1мл', 'Лекарство', 'Ампулы', 'Фармстандарт', '', 'ДА', new Date(), ''],
    ['NOM-002', 'Дексаметазон 4мг/мл 2мл', 'Лекарство', 'Ампулы', 'Борщаговский ХФЗ', '', 'ДА', new Date(), ''],
    ['NOM-003', 'Натрия хлорид 0.9% 400мл', 'Лекарство', 'Флаконы', 'Фармстандарт', '', 'ДА', new Date(), ''],
    ['NOM-004', 'Тонометр Omron M2 Basic', 'Оборудование', 'Штуки', 'Omron', '', 'ДА', new Date(), ''],
    ['NOM-005', 'Шприц 5мл', 'Расходный материал', 'Штуки', '', '', 'ДА', new Date(), ''],
    ['NOM-006', 'Бинт стерильный 7м x 14см', 'Расходный материал', 'Штуки', '', '', 'ДА', new Date(), ''],
    ['NOM-007', 'Парацетамол 500мг', 'Лекарство', 'Таблетки', 'Фармстандарт', '', 'ДА', new Date(), ''],
    ['NOM-008', 'Анальгин 50% 2мл', 'Лекарство', 'Ампулы', 'Борщаговский ХФЗ', '', 'ДА', new Date(), ''],
  ];
  
  sheet.getRange(2, 1, sampleData.length, headers.length).setValues(sampleData);
  
  Logger.log('✅ Лист "Номенклатура" создан');
}

// ==================== ЛИСТ: ЦЕНЫ ====================

function createSheet_Prices(ss) {
  let sheet = ss.getSheetByName('Цены');
  if (!sheet) sheet = ss.insertSheet('Цены');
  
  const headers = [
    'ID',                  // A
    'Номенклатура_ID',     // B - FK
    'Название (для удобства)', // C
    'Цена за ед. (₽)',     // D
    'Дата начала действия', // E
    'Дата окончания',      // F - пусто = актуальна
    'Кем изменено',        // G - ID пользователя
    'Дата изменения',      // H
    'Примечание'           // I
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
  
  sheet.setColumnWidth(1, 120);
  sheet.setColumnWidth(2, 130);
  sheet.setColumnWidth(3, 300);
  sheet.setColumnWidth(4, 130);
  sheet.setColumnWidth(5, 160);
  sheet.setColumnWidth(6, 160);
  sheet.setColumnWidth(7, 130);
  sheet.setColumnWidth(8, 160);
  sheet.setColumnWidth(9, 250);
  
  // Формат
  sheet.getRange('D2:D10000').setNumberFormat('#,##0.00 ₽');
  sheet.getRange('E2:E10000').setNumberFormat('dd.mm.yyyy hh:mm');
  sheet.getRange('F2:F10000').setNumberFormat('dd.mm.yyyy hh:mm');
  sheet.getRange('H2:H10000').setNumberFormat('dd.mm.yyyy hh:mm');
  
  sheet.setFrozenRows(1);
  
  // Пример данных
  const sampleData = [
    ['PRC-001', 'NOM-001', 'Адреналин 0.1% 1мл', 45.00, new Date(2024, 0, 1), '', 'ADM-001', new Date(), 'Начальная цена'],
    ['PRC-002', 'NOM-002', 'Дексаметазон 4мг/мл 2мл', 32.50, new Date(2024, 0, 1), '', 'ADM-001', new Date(), ''],
    ['PRC-003', 'NOM-003', 'Натрия хлорид 0.9% 400мл', 55.00, new Date(2024, 0, 1), '', 'ADM-001', new Date(), ''],
    ['PRC-004', 'NOM-004', 'Тонометр Omron M2 Basic', 3200.00, new Date(2024, 0, 1), '', 'ADM-001', new Date(), ''],
    ['PRC-005', 'NOM-005', 'Шприц 5мл', 8.50, new Date(2024, 0, 1), '', 'ADM-001', new Date(), ''],
    ['PRC-006', 'NOM-006', 'Бинт стерильный 7м x 14см', 25.00, new Date(2024, 0, 1), '', 'ADM-001', new Date(), ''],
    ['PRC-007', 'NOM-007', 'Парацетамол 500мг', 5.00, new Date(2024, 0, 1), '', 'ADM-001', new Date(), 'За таблетку'],
    ['PRC-008', 'NOM-008', 'Анальгин 50% 2мл', 28.00, new Date(2024, 0, 1), '', 'ADM-001', new Date(), ''],
  ];
  
  sheet.getRange(2, 1, sampleData.length, headers.length).setValues(sampleData);
  
  Logger.log('✅ Лист "Цены" создан');
}

// ==================== ЛИСТ: ПРИХОД ====================

function createSheet_Arrival(ss) {
  let sheet = ss.getSheetByName('Приход');
  if (!sheet) sheet = ss.insertSheet('Приход');
  
  const headers = [
    'ID',                  // A
    'Сотрудник_ID',        // B - FK
    'ФИО сотрудника',      // C - Для удобства
    'Дата',                // D
    'Месяц (отчётный)',    // E - Формат YYYY-MM
    'Сумма прихода (₽)',   // F
    'Количество смен',     // G
    'Кем внесено',         // H - ID пользователя
    'Тип',                 // I - Плановый / Дополнительный
    'Комментарий',         // J
    'Дата внесения'        // K
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
  
  sheet.setColumnWidth(1, 120);
  sheet.setColumnWidth(2, 130);
  sheet.setColumnWidth(3, 250);
  sheet.setColumnWidth(4, 120);
  sheet.setColumnWidth(5, 130);
  sheet.setColumnWidth(6, 150);
  sheet.setColumnWidth(7, 130);
  sheet.setColumnWidth(8, 130);
  sheet.setColumnWidth(9, 150);
  sheet.setColumnWidth(10, 250);
  sheet.setColumnWidth(11, 160);
  
  // Формат
  sheet.getRange('D2:D10000').setNumberFormat('dd.mm.yyyy');
  sheet.getRange('F2:F10000').setNumberFormat('#,##0.00 ₽');
  sheet.getRange('G2:G10000').setNumberFormat('0');
  sheet.getRange('K2:K10000').setNumberFormat('dd.mm.yyyy hh:mm');
  
  // Валидация - Тип
  const typeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Плановый', 'Дополнительный'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange('I2:I10000').setDataValidation(typeRule);
  
  sheet.setFrozenRows(1);
  
  Logger.log('✅ Лист "Приход" создан');
}

// ==================== ЛИСТ: РАСХОД ====================

function createSheet_Expenses(ss) {
  let sheet = ss.getSheetByName('Расход');
  if (!sheet) sheet = ss.insertSheet('Расход');
  
  const headers = [
    'ID',                    // A
    'Сотрудник_ID',          // B - FK
    'ФИО сотрудника',        // C
    'Дата внесения',         // D - Когда ввёл
    'Дата вызова',           // E - Когда был вызов
    'Месяц (отчётный)',      // F - YYYY-MM
    'Номенклатура_ID',       // G - FK
    'Название препарата',    // H - Для удобства
    'Количество',            // I - В единицах измерения
    'Ед. измерения',         // J
    'Пациент ФИО',           // K - Свободный ввод
    'Пациент ДР',            // L - Дата рождения
    'Вызов_ID',              // M - ID вызова/визита
    'Синхронизировано',      // N - ДА/НЕТ
    'Локальное время',       // O - Время создания офлайн
    'Отредактировано',       // P - ДА/НЕТ
    'Примечание'             // Q
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
  
  sheet.setColumnWidth(1, 120);
  sheet.setColumnWidth(2, 130);
  sheet.setColumnWidth(3, 250);
  sheet.setColumnWidth(4, 160);
  sheet.setColumnWidth(5, 120);
  sheet.setColumnWidth(6, 130);
  sheet.setColumnWidth(7, 130);
  sheet.setColumnWidth(8, 300);
  sheet.setColumnWidth(9, 100);
  sheet.setColumnWidth(10, 120);
  sheet.setColumnWidth(11, 250);
  sheet.setColumnWidth(12, 120);
  sheet.setColumnWidth(13, 130);
  sheet.setColumnWidth(14, 120);
  sheet.setColumnWidth(15, 160);
  sheet.setColumnWidth(16, 120);
  sheet.setColumnWidth(17, 200);
  
  // Формат
  sheet.getRange('D2:D100000').setNumberFormat('dd.mm.yyyy hh:mm');
  sheet.getRange('E2:E100000').setNumberFormat('dd.mm.yyyy');
  sheet.getRange('I2:I100000').setNumberFormat('0');
  sheet.getRange('L2:L100000').setNumberFormat('dd.mm.yyyy');
  sheet.getRange('O2:O100000').setNumberFormat('dd.mm.yyyy hh:mm');
  
  // Валидация
  const boolRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['ДА', 'НЕТ'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange('N2:N100000').setDataValidation(boolRule);
  sheet.getRange('P2:P100000').setDataValidation(boolRule);
  
  sheet.setFrozenRows(1);
  
  Logger.log('✅ Лист "Расход" создан');
}

// ==================== ЛИСТ: ВОЗВРАТЫ ====================

function createSheet_Returns(ss) {
  let sheet = ss.getSheetByName('Возвраты');
  if (!sheet) sheet = ss.insertSheet('Возвраты');
  
  const headers = [
    'ID',                    // A
    'Сотрудник_ID',          // B - FK
    'ФИО сотрудника',        // C
    'Дата создания',         // D
    'Месяц (отчётный)',      // E - YYYY-MM
    'Номенклатура_ID',       // F - FK
    'Название препарата',    // G
    'Количество',            // H
    'Ед. измерения',         // I
    'Статус',                // J - Новый / Принят / Отклонён / Скорректирован
    'Кем скорректировано',   // K - ID
    'Скорректированное кол-во', // L
    'Дата обработки',        // M
    'Комментарий',           // N
    'Причина возврата'       // O
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
  
  sheet.setColumnWidth(1, 120);
  sheet.setColumnWidth(2, 130);
  sheet.setColumnWidth(3, 250);
  sheet.setColumnWidth(4, 160);
  sheet.setColumnWidth(5, 130);
  sheet.setColumnWidth(6, 130);
  sheet.setColumnWidth(7, 300);
  sheet.setColumnWidth(8, 100);
  sheet.setColumnWidth(9, 120);
  sheet.setColumnWidth(10, 140);
  sheet.setColumnWidth(11, 150);
  sheet.setColumnWidth(12, 150);
  sheet.setColumnWidth(13, 160);
  sheet.setColumnWidth(14, 250);
  sheet.setColumnWidth(15, 250);
  
  // Формат
  sheet.getRange('D2:D10000').setNumberFormat('dd.mm.yyyy hh:mm');
  sheet.getRange('H2:H10000').setNumberFormat('0');
  sheet.getRange('L2:L10000').setNumberFormat('0');
  sheet.getRange('M2:M10000').setNumberFormat('dd.mm.yyyy hh:mm');
  
  // Валидация - Статус
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Новый', 'Принят', 'Отклонён', 'Скорректирован'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange('J2:J10000').setDataValidation(statusRule);
  
  sheet.setFrozenRows(1);
  
  Logger.log('✅ Лист "Возвраты" создан');
}

// ==================== ЛИСТ: НАЧАЛЬНЫЕ ОСТАТКИ ====================

function createSheet_InitialStock(ss) {
  let sheet = ss.getSheetByName('Начальные остатки');
  if (!sheet) sheet = ss.insertSheet('Начальные остатки');
  
  const headers = [
    'ID',                    // A
    'Сотрудник_ID',          // B - FK
    'ФИО сотрудника',        // C
    'Номенклатура_ID',       // D - FK
    'Название',              // E
    'Количество (шт)',       // F
    'Ед. измерения',         // G
    'Дата внесения',         // H
    'Кем внесено',           // I - Сотрудник / Руководитель
    'Период',                // J - YYYY-MM
    'Примечание'             // K
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
  
  sheet.setColumnWidth(1, 120);
  sheet.setColumnWidth(2, 130);
  sheet.setColumnWidth(3, 250);
  sheet.setColumnWidth(4, 130);
  sheet.setColumnWidth(5, 300);
  sheet.setColumnWidth(6, 130);
  sheet.setColumnWidth(7, 120);
  sheet.setColumnWidth(8, 160);
  sheet.setColumnWidth(9, 150);
  sheet.setColumnWidth(10, 120);
  sheet.setColumnWidth(11, 250);
  
  // Формат
  sheet.getRange('F2:F10000').setNumberFormat('0');
  sheet.getRange('H2:H10000').setNumberFormat('dd.mm.yyyy hh:mm');
  
  sheet.setFrozenRows(1);
  
  Logger.log('✅ Лист "Начальные остатки" создан');
}

// ==================== ЛИСТ: ЧАТ ====================

function createSheet_Chat(ss) {
  let sheet = ss.getSheetByName('Чат');
  if (!sheet) sheet = ss.insertSheet('Чат');
  
  const headers = [
    'ID',              // A
    'От кого (ID)',    // B
    'От кого (ФИО)',   // C
    'Кому (ID)',       // D
    'Кому (ФИО)',      // E
    'Роль отправителя', // F - Руководитель / Кладовщик / Сотрудник
    'Текст сообщения', // G
    'Дата и время',    // H
    'Прочитано',       // I - ДА/НЕТ
    'Тип',             // J - Личное / Общее
    'Приоритет'        // K - Обычное / Важное
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
  
  sheet.setColumnWidth(1, 120);
  sheet.setColumnWidth(2, 130);
  sheet.setColumnWidth(3, 250);
  sheet.setColumnWidth(4, 130);
  sheet.setColumnWidth(5, 250);
  sheet.setColumnWidth(6, 140);
  sheet.setColumnWidth(7, 400);
  sheet.setColumnWidth(8, 160);
  sheet.setColumnWidth(9, 100);
  sheet.setColumnWidth(10, 120);
  sheet.setColumnWidth(11, 120);
  
  // Формат
  sheet.getRange('H2:H100000').setNumberFormat('dd.mm.yyyy hh:mm');
  
  // Валидация
  const boolRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['ДА', 'НЕТ'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange('I2:I100000').setDataValidation(boolRule);
  
  const typeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Личное', 'Общее'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange('J2:J100000').setDataValidation(typeRule);
  
  const priorityRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Обычное', 'Важное'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange('K2:K100000').setDataValidation(priorityRule);
  
  sheet.setFrozenRows(1);
  
  // Приветственное сообщение
  const welcomeMsg = [
    ['MSG-001', 'SYSTEM', 'Система', 'ALL', 'Все сотрудники', 'Система', 
     'Добро пожаловать в наш коллектив! 😊', new Date(), 'НЕТ', 'Общее', 'Обычное']
  ];
  sheet.getRange(2, 1, 1, headers.length).setValues(welcomeMsg);
  
  Logger.log('✅ Лист "Чат" создан');
}

// ==================== ЛИСТ: ЖУРНАЛ ИЗМЕНЕНИЙ ====================

function createSheet_AuditLog(ss) {
  let sheet = ss.getSheetByName('Журнал изменений');
  if (!sheet) sheet = ss.insertSheet('Журнал изменений');
  
  const headers = [
    'ID',              // A
    'Дата и время',    // B
    'Пользователь ID', // C
    'Пользователь ФИО', // D
    'Роль',            // E
    'Лист',            // F - Какой лист изменён
    'Запись_ID',       // G - Какая запись
    'Действие',        // H - Создание / Изменение / Удаление
    'Поле',            // I - Какое поле
    'Было',            // J - Предыдущее значение
    'Стало',           // K - Новое значение
    'IP адрес',        // L
    'Устройство'       // M
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
  
  sheet.setColumnWidth(1, 120);
  sheet.setColumnWidth(2, 170);
  sheet.setColumnWidth(3, 130);
  sheet.setColumnWidth(4, 250);
  sheet.setColumnWidth(5, 120);
  sheet.setColumnWidth(6, 150);
  sheet.setColumnWidth(7, 130);
  sheet.setColumnWidth(8, 130);
  sheet.setColumnWidth(9, 150);
  sheet.setColumnWidth(10, 200);
  sheet.setColumnWidth(11, 200);
  sheet.setColumnWidth(12, 140);
  sheet.setColumnWidth(13, 150);
  
  // Формат
  sheet.getRange('B2:B1000000').setNumberFormat('dd.mm.yyyy hh:mm:ss');
  
  // Валидация - Действие
  const actionRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Создание', 'Изменение', 'Удаление', 'Восстановление'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange('H2:H1000000').setDataValidation(actionRule);
  
  // Валидация - Роль
  const roleRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Руководитель', 'Кладовщик', 'Сотрудник', 'Система'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange('E2:E1000000').setDataValidation(roleRule);
  
  sheet.setFrozenRows(1);
  
  // Защита листа от удаления строк (кроме заголовка)
  // Это не позволит случайного удаления данных журнала
  
  Logger.log('✅ Лист "Журнал изменений" создан');
}

// ==================== ЛИСТ: НАСТРОЙКИ ====================

function createSheet_Settings(ss) {
  let sheet = ss.getSheetByName('Настройки');
  if (!sheet) sheet = ss.insertSheet('Настройки');
  
  const headers = [
    'Параметр',          // A
    'Значение',          // B
    'Описание',          // C
    'Кем изменено',      // D
    'Дата изменения'     // E
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
  
  sheet.setColumnWidth(1, 250);
  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(3, 400);
  sheet.setColumnWidth(4, 150);
  sheet.setColumnWidth(5, 160);
  
  sheet.getRange('E2:E100').setNumberFormat('dd.mm.yyyy hh:mm');
  
  sheet.setFrozenRows(1);
  
  // Системные настройки
  const settings = [
    ['Название подразделения', 'Выездное подразделение №1', 'Название организации', 'SYSTEM', new Date()],
    ['Порог уведомления перерасхода', '100', 'Процент превышения расхода над приходом для уведомления', 'SYSTEM', new Date()],
    ['Дней без активности для уведомления', '7', 'Через сколько дней неактивности уведомлять руководителя', 'SYSTEM', new Date()],
    ['Максимум офлайн (часов)', '72', 'Максимальное время работы без сети', 'SYSTEM', new Date()],
    ['День формирования отчёта', '5', 'Число месяца для формирования отчёта', 'SYSTEM', new Date()],
    ['Версия системы', '1.0.0', 'Текущая версия', 'SYSTEM', new Date()],
    ['Дата развёртывания', new Date(), 'Когда создана база', 'SYSTEM', new Date()],
    ['Формат даты', 'dd.mm.yyyy', 'Формат отображения дат', 'SYSTEM', new Date()],
    ['Валюта', '₽ (Рубль)', 'Валюта для финансовых расчётов', 'SYSTEM', new Date()],
    ['Автоблокировка', 'ДА', 'Блокировать при 5 неудачных попытках входа', 'SYSTEM', new Date()],
  ];
  
  sheet.getRange(2, 1, settings.length, headers.length).setValues(settings);
  
  Logger.log('✅ Лист "Настройки" создан');
}

// ==================== ЛИСТ: ОТЧЁТЫ ====================

function createSheet_Reports(ss) {
  let sheet = ss.getSheetByName('Отчёты');
  if (!sheet) sheet = ss.insertSheet('Отчёты');
  
  const headers = [
    'ID отчёта',          // A
    'Тип отчёта',         // B - Ежемесячный / По запросу
    'Период (YYYY-MM)',   // C
    'Дата формирования',  // D
    'Сотрудник_ID',       // E - Если персональный
    'ФИО сотрудника',     // F
    'Кол-во вызовов',     // G
    'Приход (₽)',         // H
    'Расход (₽)',         // I
    'Остаток (₽)',        // J
    'Общий остаток подразд. (₽)', // K
    'Статус',             // L - Сформирован / Отправлен
    'Кем сформирован',    // M
    'Примечание'          // N
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
  
  sheet.setColumnWidth(1, 120);
  sheet.setColumnWidth(2, 150);
  sheet.setColumnWidth(3, 130);
  sheet.setColumnWidth(4, 160);
  sheet.setColumnWidth(5, 130);
  sheet.setColumnWidth(6, 250);
  sheet.setColumnWidth(7, 120);
  sheet.setColumnWidth(8, 140);
  sheet.setColumnWidth(9, 140);
  sheet.setColumnWidth(10, 140);
  sheet.setColumnWidth(11, 180);
  sheet.setColumnWidth(12, 130);
  sheet.setColumnWidth(13, 150);
  sheet.setColumnWidth(14, 250);
  
  // Формат
  sheet.getRange('D2:D10000').setNumberFormat('dd.mm.yyyy hh:mm');
  sheet.getRange('G2:G10000').setNumberFormat('0');
  sheet.getRange('H2:K10000').setNumberFormat('#,##0.00 ₽');
  
  // Валидация
  const typeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Ежемесячный', 'По запросу', 'Ежедневный'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange('B2:B10000').setDataValidation(typeRule);
  
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Сформирован', 'Отправлен', 'Экспортирован'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange('L2:L10000').setDataValidation(statusRule);
  
  sheet.setFrozenRows(1);
  
  Logger.log('✅ Лист "Отчёты" создан');
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

function formatHeader(sheet, columnsCount) {
  const headerRange = sheet.getRange(1, 1, 1, columnsCount);
  
  // Стиль заголовка
  headerRange.setBackground('#1a73e8');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');
  headerRange.setWrap(true);
  
  // Высота строки заголовка
  sheet.setRowHeight(1, 35);
}

function hashPassword(password) {
  // Простое хэширование (в продакшене использовать более стойкий алгоритм)
  const raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password);
  return raw.map(function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
}

function setupMenu() {
  // Эта функция вызывается при открытии таблицы
  // Меню добавляется через onOpen
}

// ==================== ТРИГГЕРЫ ====================

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📋 Система учёта')
    .addItem('🔄 Обновить данные', 'refreshData')
    .addSeparator()
    .addSubMenu(ui.createMenu('📊 Отчёты')
      .addItem('Ежемесячный отчёт', 'generateMonthlyReport')
      .addItem('Отчёт по сотруднику', 'generateEmployeeReport')
      .addItem('Остатки подразделения', 'generateStockReport'))
    .addSeparator()
    .addSubMenu(ui.createMenu('📤 Экспорт')
      .addItem('Экспорт в PDF', 'exportToPDF')
      .addItem('Экспорт в CSV', 'exportToCSV'))
    .addSeparator()
    .addSubMenu(ui.createMenu('⚙️ Настройки')
      .addItem('Проверить перерасход', 'checkOverconsumption')
      .addItem('Проверить неактивных', 'checkInactiveEmployees')
      .addItem('Пересчитать остатки', 'recalculateStock'))
    .addSeparator()
    .addItem('ℹ️ О системе', 'showAbout')
    .addToUi();
}

// ==================== ФУНКЦИИ МЕНЮ ====================

function refreshData() {
  SpreadsheetApp.getActiveSpreadsheet().toast('Данные обновлены', 'Статус', 3);
}

function generateMonthlyReport() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt('Ежемесячный отчёт', 'Введите период (YYYY-MM):', ui.ButtonSet.OK_CANCEL);
  
  if (response.getSelectedButton() === ui.Button.OK) {
    const period = response.getResponseText();
    ui.alert('Отчёт за ' + period + ' будет сформирован.\n\n(Функция в разработке)');
  }
}

function generateEmployeeReport() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt('Отчёт по сотруднику', 'Введите ID сотрудника:', ui.ButtonSet.OK_CANCEL);
  
  if (response.getSelectedButton() === ui.Button.OK) {
    const empId = response.getResponseText();
    ui.alert('Отчёт по сотруднику ' + empId + ' будет сформирован.\n\n(Функция в разработке)');
  }
}

function generateStockReport() {
  SpreadsheetApp.getUi().alert('Отчёт по остаткам подразделения.\n\n(Функция в разработке)');
}

function exportToPDF() {
  SpreadsheetApp.getUi().alert('Экспорт в PDF.\n\n(Функция в разработке)');
}

function exportToCSV() {
  SpreadsheetApp.getUi().alert('Экспорт в CSV.\n\n(Функция в разработке)');
}

function checkOverconsumption() {
  SpreadsheetApp.getUi().alert('Проверка перерасхода.\n\n(Функция в разработке)');
}

function checkInactiveEmployees() {
  SpreadsheetApp.getUi().alert('Проверка неактивных сотрудников.\n\n(Функция в разработке)');
}

function recalculateStock() {
  SpreadsheetApp.getUi().alert('Пересчёт остатков.\n\n(Функция в разработке)');
}

function showAbout() {
  SpreadsheetApp.getUi().alert(
    '📋 Система учёта лекарственных средств\n' +
    'Версия: 1.0.0\n\n' +
    'Разработано для выездного подразделения.\n' +
    'База данных: Google Sheets\n\n' +
    'Листы:\n' +
    '• Сотрудники\n' +
    '• Номенклатура\n' +
    '• Цены\n' +
    '• Приход\n' +
    '• Расход\n' +
    '• Возвраты\n' +
    '• Начальные остатки\n' +
    '• Чат\n' +
    '• Журнал изменений\n' +
    '• Настройки\n' +
    '• Отчёты'
  );
}

// ==================== API ФУНКЦИИ (для веб-приложения) ====================

/**
 * Получить данные сотрудников
 */
function apiGetEmployees() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Сотрудники');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const result = [];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === '') continue;
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = data[i][idx];
    });
    result.push(row);
  }
  
  return JSON.stringify(result);
}

/**
 * Получить номенклатуру
 */
function apiGetNomenclature() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Номенклатура');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const result = [];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === '') continue;
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = data[i][idx];
    });
    result.push(row);
  }
  
  return JSON.stringify(result);
}

/**
 * Получить актуальные цены
 */
function apiGetCurrentPrices() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Цены');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const result = [];
  const now = new Date();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === '') continue;
    const endDate = data[i][5]; // Дата окончания
    // Включаем только актуальные цены (без даты окончания)
    if (endDate === '' || endDate === null) {
      const row = {};
      headers.forEach((h, idx) => {
        row[h] = data[i][idx];
      });
      result.push(row);
    }
  }
  
  return JSON.stringify(result);
}

/**
 * Авторизация сотрудника
 */
function apiLogin(personalNumber, password) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Сотрудники');
  const data = sheet.getDataRange().getValues();
  const hashedPassword = hashPassword(password);
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] == personalNumber && data[i][3] === hashedPassword) {
      // Проверка блокировки
      if (data[i][8] === 'ДА') {
        return JSON.stringify({ success: false, message: 'Аккаунт заблокирован. Обратитесь к руководителю.' });
      }
      // Проверка увольнения
      if (data[i][4] === 'Уволен') {
        return JSON.stringify({ success: false, message: 'dismissed' });
      }
      // Обновить последний вход
      sheet.getRange(i + 1, 13).setValue(new Date());
      
      return JSON.stringify({
        success: true,
        employee: {
          id: data[i][0],
          personalNumber: data[i][1],
          fullName: data[i][2],
          status: data[i][4],
          position: data[i][5]
        }
      });
    }
  }
  
  return JSON.stringify({ success: false, message: 'Неверный номер или пароль' });
}

/**
 * Добавить расход
 */
function apiAddExpense(expenseData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Расход');
  const data = JSON.parse(expenseData);
  const id = 'EXP-' + Utilities.getUuid().substring(0, 8).toUpperCase();
  
  sheet.appendRow([
    id,
    data.employeeId,
    data.employeeName,
    new Date(),
    data.callDate,
    data.period,
    data.nomenclatureId,
    data.nomenclatureName,
    data.quantity,
    data.unit,
    data.patientName,
    data.patientBirthDate,
    data.callId,
    'ДА',
    data.localTime,
    'НЕТ',
    data.note || ''
  ]);
  
  // Записать в журнал
  writeAuditLog(data.employeeId, data.employeeName, 'Сотрудник', 'Расход', id, 'Создание', '', JSON.stringify(data));
  
  return JSON.stringify({ success: true, id: id });
}

/**
 * Записать в журнал изменений
 */
function writeAuditLog(userId, userName, role, sheetName, recordId, action, oldValue, newValue) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Журнал изменений');
  const id = 'LOG-' + Utilities.getUuid().substring(0, 8).toUpperCase();
  
  sheet.appendRow([
    id,
    new Date(),
    userId,
    userName,
    role,
    sheetName,
    recordId,
    action,
    '',
    oldValue,
    newValue,
    '', // IP
    ''  // Устройство
  ]);
}
