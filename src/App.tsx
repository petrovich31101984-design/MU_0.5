import { useState, useEffect, useCallback } from 'react';
import * as gs from './services/googleSheets';

// Проверка подключения
const isConfigured = gs.isConnected();

// ============ КОНТЕКСТ ДАННЫХ ============
function useData() {
  const [employees, setEmployees] = useState<gs.Employee[]>([]);
  const [nomenclature, setNomenclature] = useState<gs.Nomenclature[]>([]);
  const [arrivals, setArrivals] = useState<gs.Arrival[]>([]);
  const [expenses, setExpenses] = useState<gs.Expense[]>([]);
  const [returns, setReturns] = useState<gs.ReturnOperation[]>([]);
  const [chatMessages, setChatMessages] = useState<gs.ChatMessage[]>([]);
  const [auditLog, setAuditLog] = useState<gs.AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [emps, noms, arrs, exps, rets, msgs, logs] = await Promise.all([
        gs.getEmployees(),
        gs.getNomenclature(),
        gs.getArrivals(),
        gs.getExpenses(),
        gs.getReturns(),
        gs.getChatMessages(),
        gs.getAuditLog(),
      ]);
      setEmployees(emps);
      setNomenclature(noms);
      setArrivals(arrs);
      setExpenses(exps);
      setReturns(rets);
      setChatMessages(msgs);
      setAuditLog(logs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return {
    employees, setEmployees, nomenclature, setNomenclature,
    arrivals, setArrivals, expenses, setExpenses,
    returns, setReturns, chatMessages, setChatMessages,
    auditLog, setAuditLog, loading, error, refresh,
  };
}

// ============ ТИПЫ ============
type Page = 'dashboard' | 'employees' | 'nomenclature' | 'operations' | 'stock' | 'chat' | 'reports' | 'audit' | 'settings';

// ============ СТРАНИЦА НАСТРОЙКИ ПОДКЛЮЧЕНИЯ ============
function SetupPage() {
  const [scriptUrl, setScriptUrl] = useState('');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleConnect = async () => {
    setTesting(true);
    setResult(null);
    
    gs.saveConfig(scriptUrl);
    const testResult = await gs.testConnection();
    
    if (testResult.success) {
      setResult({ success: true, message: `✓ Подключено! Таблица: ${testResult.title}` });
      setTimeout(() => window.location.reload(), 1500);
    } else {
      setResult({ success: false, message: `✗ Ошибка: ${testResult.error}` });
    }
    
    setTesting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-950/20 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Логотип АлкоСпас */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full"></div>
            <img 
              src="https://avatars.mds.yandex.net/i?id=e00a0fe18058bd1b9bd6695beaec20f7_l-5232129-images-thumbs&n=13" 
              alt="АлкоСпас" 
              className="relative w-56 h-56 object-contain drop-shadow-2xl rounded-2xl bg-white p-2"
            />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">АлкоСпас</span>
          </h1>
          <p className="text-lg text-slate-300 mb-1">Система учёта лекарственных средств</p>
          <p className="text-sm text-slate-500">Выездное подразделение медицинской помощи</p>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-red-500/20 shadow-2xl shadow-red-500/5 space-y-6">
          {/* Шаг 1 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-sm">1</span>
              Создайте Google таблицу
            </h3>
            <div className="bg-slate-900 rounded-lg p-4 text-sm text-slate-300 space-y-2">
              <p>1. Перейдите в <a href="https://sheets.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google Sheets</a></p>
              <p>2. Создайте новую таблицу</p>
              <p>3. Откройте <strong>Расширения → Apps Script</strong></p>
              <p>4. Вставьте код из файла <code className="bg-slate-800 px-2 py-0.5 rounded">public/google-apps-script-webapp.js</code></p>
              <p>5. Выполните функцию <code className="bg-slate-800 px-2 py-0.5 rounded">setupDatabase()</code></p>
            </div>
          </div>

          {/* Шаг 2 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-sm">2</span>
              Разверните как веб-приложение
            </h3>
            <div className="bg-slate-900 rounded-lg p-4 text-sm text-slate-300 space-y-2">
              <p>1. В Apps Script нажмите <strong>Развернуть → Новое развертывание</strong></p>
              <p>2. Тип: <strong>Веб-приложение</strong></p>
              <p>3. Выполнять от имени: <strong>Меня</strong></p>
              <p>4. Доступ: <strong>Все</strong> (или "Все, у кого есть ссылка")</p>
              <p>5. Нажмите <strong>Развернуть</strong> и скопируйте URL</p>
            </div>
          </div>

          {/* Шаг 3 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-sm">3</span>
              Вставьте URL
            </h3>
            <div className="bg-slate-900 rounded-lg p-4 text-sm text-slate-300">
              <p>Скопированный URL вставьте в поле ниже и нажмите "Подключиться"</p>
            </div>
          </div>

          {/* Форма подключения */}
          <div className="border-t border-slate-700 pt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">URL веб-приложения Apps Script</label>
              <input
                type="text"
                value={scriptUrl}
                onChange={(e) => setScriptUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/AKfycbx..."
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">
                Скопируйте URL после развертывания Apps Script как веб-приложения
              </p>
            </div>

            {result && (
              <div className={`p-4 rounded-lg ${result.success ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
                {result.message}
              </div>
            )}

            <button
              onClick={handleConnect}
              disabled={testing || !scriptUrl}
              className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 rounded-lg text-white font-medium transition-all shadow-lg shadow-red-600/20 disabled:shadow-none"
            >
              {testing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Проверка подключения...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  🔌 Подключиться
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Футер с брендингом */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} АлкоСпас • Выездная наркологическая помощь
          </p>
          <p className="text-xs text-slate-600 mt-1">
            Подключение через Google Apps Script • Без API ключей
          </p>
        </div>
      </div>
    </div>
  );
}

// ============ ГЛАВНОЕ ПРИЛОЖЕНИЕ ============
export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const data = useData();

  // Если подключение не настроено, показываем страницу настройки
  if (!isConfigured) {
    return <SetupPage />;
  }

  const menuItems: { id: Page; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Панель управления', icon: '📊' },
    { id: 'employees', label: 'Сотрудники', icon: '👥' },
    { id: 'nomenclature', label: 'Номенклатура', icon: '💊' },
    { id: 'operations', label: 'Операции', icon: '📋' },
    { id: 'stock', label: 'Остатки', icon: '📦' },
    { id: 'chat', label: 'Сообщения', icon: '💬' },
    { id: 'reports', label: 'Отчёты', icon: '📈' },
    { id: 'audit', label: 'Журнал', icon: '📝' },
    { id: 'settings', label: 'Настройки', icon: '⚙️' },
  ];

  if (data.loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <img 
            src="https://avatars.mds.yandex.net/i?id=e00a0fe18058bd1b9bd6695beaec20f7_l-5232129-images-thumbs&n=13" 
            alt="АлкоСпас" 
            className="w-48 h-48 object-contain mx-auto mb-6 animate-pulse"
          />
          <div className="text-slate-800 text-xl font-semibold mb-2">Загрузка данных...</div>
          <div className="text-slate-500 text-sm">Подключение к Google Sheets</div>
          <div className="mt-6 flex justify-center gap-1.5">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 border border-red-200 shadow-lg max-w-lg w-full">
          <img 
            src="https://avatars.mds.yandex.net/i?id=e00a0fe18058bd1b9bd6695beaec20f7_l-5232129-images-thumbs&n=13" 
            alt="АлкоСпас" 
            className="w-32 h-32 object-contain mx-auto mb-4"
          />
          <h2 className="text-xl font-bold text-slate-800 text-center mb-2">Ошибка подключения</h2>
          <p className="text-red-600 text-sm text-center mb-4">{data.error}</p>
          <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-200">
            <p className="text-sm text-slate-600 mb-2 font-medium">Проверьте:</p>
            <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside">
              <li>URL веб-приложения Apps Script</li>
              <li>Доступ к таблице (публичный)</li>
              <li>Структуру таблицы (должны быть все листы)</li>
              <li>Интернет-соединение</li>
            </ul>
          </div>
          <button
            onClick={() => data.refresh()}
            className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg text-white font-medium shadow-lg shadow-red-600/20"
          >
            🔄 Повторить попытку
          </button>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard data={data} />;
      case 'employees': return <EmployeesPage data={data} />;
      case 'nomenclature': return <NomenclaturePage data={data} />;
      case 'operations': return <OperationsPage data={data} />;
      case 'stock': return <StockPage data={data} />;
      case 'chat': return <ChatPage data={data} />;
      case 'reports': return <ReportsPage data={data} />;
      case 'audit': return <AuditPage data={data} />;
      case 'settings': return <SettingsPage data={data} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-80' : 'w-20'} bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 fixed h-full z-40`}>
        <div className="p-4 border-b border-slate-700 flex items-center gap-3">
          <img 
            src="https://avatars.mds.yandex.net/i?id=e00a0fe18058bd1b9bd6695beaec20f7_l-5232129-images-thumbs&n=13" 
            alt="АлкоСпас" 
            className="w-10 h-10 rounded-lg object-contain shrink-0 bg-white p-0.5"
          />
          {sidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-white whitespace-nowrap">АлкоСпас</h1>
              <p className="text-xs text-slate-400 leading-tight">
                Система учёта лекарственных средств <span className="text-emerald-400 font-semibold">(v. 0.5)</span>
              </p>
            </div>
          )}
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                currentPage === item.id
                  ? 'bg-blue-600/20 text-blue-400 border-r-2 border-blue-400'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <span className="text-xl shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>
        {sidebarOpen && (
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              <span className="text-xs text-slate-400">Подключено к Google Sheets</span>
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-80' : 'ml-20'} transition-all duration-300`}>
        <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-slate-700 text-slate-400">
              {sidebarOpen ? '◀' : '▶'}
            </button>
            <h2 className="text-lg font-semibold text-white">
              {menuItems.find(m => m.id === currentPage)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => data.refresh()} className="p-2 rounded-lg hover:bg-slate-700 text-slate-400" title="Обновить данные">🔄</button>
            <div className="text-sm text-slate-400 hidden md:block">
              {new Date().toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' })}
            </div>
          </div>
        </header>
        <main className="p-6">{renderPage()}</main>
      </div>
    </div>
  );
}

// ============ DASHBOARD ============
function Dashboard({ data }: { data: ReturnType<typeof useData> }) {
  const { employees, nomenclature, arrivals, expenses, returns } = data;
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const activeEmployees = employees.filter(e => e.status === 'Активен');

  const getArrival = (empId: string) => arrivals.filter(a => a.employeeId === empId && a.month === currentMonth).reduce((s, a) => s + a.amount, 0);
  const getExpenseValue = (empId: string) => expenses.filter(e => e.employeeId === empId && e.month === currentMonth).reduce((s, e) => {
    const nom = nomenclature.find(n => n.id === e.nomenclatureId);
    return s + (nom ? nom.currentPrice * e.quantity : 0);
  }, 0);
  const getCalls = (empId: string) => new Set(expenses.filter(e => e.employeeId === empId && e.month === currentMonth).map(e => e.callId)).size;

  const totalArrival = activeEmployees.reduce((s, e) => s + getArrival(e.id), 0);
  const totalExpense = activeEmployees.reduce((s, e) => s + getExpenseValue(e.id), 0);
  const totalCalls = activeEmployees.reduce((s, e) => s + getCalls(e.id), 0);
  const pendingReturns = returns.filter(r => r.status === 'Новый').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
          <div className="text-2xl mb-2">💰</div>
          <div className="text-2xl font-bold text-emerald-400">{totalArrival.toLocaleString('ru-RU')} ₽</div>
          <div className="text-sm text-slate-400">Общий приход</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
          <div className="text-2xl mb-2">📤</div>
          <div className="text-2xl font-bold text-blue-400">{totalExpense.toLocaleString('ru-RU')} ₽</div>
          <div className="text-sm text-slate-400">Общий расход</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
          <div className="text-2xl mb-2">📊</div>
          <div className="text-2xl font-bold text-white">{(totalArrival - totalExpense).toLocaleString('ru-RU')} ₽</div>
          <div className="text-sm text-slate-400">Остаток</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
          <div className="text-2xl mb-2">🚑</div>
          <div className="text-2xl font-bold text-white">{totalCalls}</div>
          <div className="text-sm text-slate-400">Вызовов за месяц</div>
        </div>
      </div>

      {/* Alerts */}
      {pendingReturns > 0 && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">↩️</span>
          <div className="flex-1">
            <span className="text-orange-300 font-semibold">Ожидают обработки возвратов:</span>
            <span className="text-orange-200 ml-2">{pendingReturns}</span>
          </div>
        </div>
      )}

      {/* Employees table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-5 border-b border-slate-700">
          <h3 className="text-lg font-bold text-white">📊 Сводка по сотрудникам ({currentMonth})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 text-left">
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Сотрудник</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Статус</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Вызовы</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Приход (₽)</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Расход (₽)</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Остаток (₽)</th>
              </tr>
            </thead>
            <tbody>
              {employees.filter(e => e.status !== 'Уволен').map(emp => {
                const arr = getArrival(emp.id);
                const exp = getExpenseValue(emp.id);
                const bal = arr - exp;
                const calls = getCalls(emp.id);
                return (
                  <tr key={emp.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          emp.status === 'Активен' ? 'bg-emerald-600' : emp.status === 'Отпуск' ? 'bg-yellow-600' : 'bg-slate-600'
                        }`}>{emp.fullName[0]}</div>
                        <div>
                          <div className="text-sm font-medium text-white">{emp.fullName}</div>
                          <div className="text-xs text-slate-400">{emp.position}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        emp.status === 'Активен' ? 'bg-emerald-500/20 text-emerald-400' :
                        emp.status === 'Отпуск' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-500/20 text-slate-400'
                      }`}>{emp.status}</span>
                    </td>
                    <td className="px-5 py-3 text-right text-sm text-white">{calls}</td>
                    <td className="px-5 py-3 text-right text-sm text-emerald-400">{arr.toLocaleString('ru-RU')} ₽</td>
                    <td className="px-5 py-3 text-right text-sm text-blue-400">{exp.toLocaleString('ru-RU')} ₽</td>
                    <td className={`px-5 py-3 text-right text-sm font-semibold ${bal >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {bal.toLocaleString('ru-RU')} ₽
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {employees.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            <div className="text-3xl mb-2">👥</div>
            <p>Нет данных о сотрудниках</p>
            <p className="text-sm">Добавьте сотрудников через Google Sheets</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ СОТРУДНИКИ ============
function EmployeesPage({ data }: { data: ReturnType<typeof useData> }) {
  const { employees, arrivals, expenses, nomenclature } = data;
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const filtered = employees.filter(e =>
    e.fullName.toLowerCase().includes(search.toLowerCase()) || e.personalNumber.includes(search)
  );

  const getArrival = (empId: string) => arrivals.filter(a => a.employeeId === empId && a.month === currentMonth).reduce((s, a) => s + a.amount, 0);
  const getExpenseValue = (empId: string) => expenses.filter(e => e.employeeId === empId && e.month === currentMonth).reduce((s, e) => {
    const nom = nomenclature.find(n => n.id === e.nomenclatureId);
    return s + (nom ? nom.currentPrice * e.quantity : 0);
  }, 0);
  const getCalls = (empId: string) => new Set(expenses.filter(e => e.employeeId === empId && e.month === currentMonth).map(e => e.callId)).size;

  const handleAdd = async (form: { fullName: string; personalNumber: string; position: string; phone: string }) => {
    await gs.addEmployee({
      id: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
      ...form,
      status: 'Активен',
      hireDate: new Date().toISOString().split('T')[0],
      blocked: false,
      lastActivity: '',
      note: '',
    });
    setShowAdd(false);
    data.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Сотрудники</h2>
          <p className="text-slate-400 text-sm mt-1">Всего: {employees.length} | Активных: {employees.filter(e => e.status === 'Активен').length}</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-medium">
          + Добавить сотрудника
        </button>
      </div>

      <input
        type="text"
        placeholder="Поиск по ФИО или номеру..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
      />

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 text-left">
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Сотрудник</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">№</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Статус</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Вызовы</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Приход</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Расход</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => (
                <tr key={emp.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                        emp.status === 'Активен' ? 'bg-emerald-600' : emp.status === 'Отпуск' ? 'bg-yellow-600' : 'bg-slate-600'
                      }`}>{emp.fullName[0]}</div>
                      <div>
                        <div className="text-sm font-medium text-white">{emp.fullName}</div>
                        <div className="text-xs text-slate-400">{emp.position}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-300 font-mono">{emp.personalNumber}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      emp.status === 'Активен' ? 'bg-emerald-500/20 text-emerald-400' :
                      emp.status === 'Отпуск' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-500/20 text-slate-400'
                    }`}>{emp.status}</span>
                  </td>
                  <td className="px-5 py-3 text-right text-sm text-white">{getCalls(emp.id)}</td>
                  <td className="px-5 py-3 text-right text-sm text-emerald-400">{getArrival(emp.id).toLocaleString('ru-RU')} ₽</td>
                  <td className="px-5 py-3 text-right text-sm text-blue-400">{getExpenseValue(emp.id).toLocaleString('ru-RU')} ₽</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            <div className="text-3xl mb-2">👥</div>
            <p>{search ? 'Ничего не найдено' : 'Нет сотрудников'}</p>
          </div>
        )}
      </div>

      {showAdd && <AddEmployeeModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
    </div>
  );
}

function AddEmployeeModal({ onClose, onAdd }: { onClose: () => void; onAdd: (form: any) => void }) {
  const [form, setForm] = useState({ fullName: '', personalNumber: '', position: 'Врач', phone: '' });
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-bold text-white">Добавить сотрудника</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">ФИО *</label>
            <input type="text" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Персональный номер *</label>
            <input type="text" value={form.personalNumber} onChange={e => setForm({ ...form, personalNumber: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Должность</label>
            <select value={form.position} onChange={e => setForm({ ...form, position: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
              <option>Врач</option><option>Фельдшер</option><option>Медсестра</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Телефон</label>
            <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
          </div>
        </div>
        <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white">Отмена</button>
          <button onClick={() => onAdd(form)} disabled={!form.fullName || !form.personalNumber}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 rounded-lg text-white font-medium">Добавить</button>
        </div>
      </div>
    </div>
  );
}

// ============ НОМЕНКЛАТУРА ============
function NomenclaturePage({ data }: { data: ReturnType<typeof useData> }) {
  const { nomenclature } = data;
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');

  const filtered = nomenclature.filter(n => {
    const matchSearch = n.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'all' || n.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Номенклатура</h2>
        <p className="text-slate-400 text-sm mt-1">Всего позиций: {nomenclature.length}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-2xl font-bold text-emerald-400">{nomenclature.filter(n => n.category === 'Лекарство').length}</div>
          <div className="text-xs text-slate-400">Лекарств</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-2xl font-bold text-blue-400">{nomenclature.filter(n => n.category === 'Оборудование').length}</div>
          <div className="text-xs text-slate-400">Оборудования</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-2xl font-bold text-purple-400">{nomenclature.filter(n => n.category === 'Расходный материал').length}</div>
          <div className="text-xs text-slate-400">Расходных материалов</div>
        </div>
      </div>

      <div className="flex gap-3">
        <input type="text" placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
          <option value="all">Все категории</option>
          <option value="Лекарство">Лекарства</option>
          <option value="Оборудование">Оборудование</option>
          <option value="Расходный материал">Расходные материалы</option>
        </select>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700 text-left">
              <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Название</th>
              <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Категория</th>
              <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Ед. изм.</th>
              <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Цена (₽)</th>
              <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-center">Статус</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                <td className="px-5 py-3">
                  <div className="text-sm font-medium text-white">{item.name}</div>
                  <div className="text-xs text-slate-500 font-mono">{item.id}</div>
                </td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.category === 'Лекарство' ? 'bg-emerald-500/20 text-emerald-400' :
                    item.category === 'Оборудование' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                  }`}>{item.category}</span>
                </td>
                <td className="px-5 py-3 text-sm text-slate-300">{item.unit}</td>
                <td className="px-5 py-3 text-right text-sm font-semibold text-emerald-400">{item.currentPrice.toLocaleString('ru-RU')} ₽</td>
                <td className="px-5 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${item.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                    {item.active ? 'Активна' : 'Неактивна'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            <div className="text-3xl mb-2">💊</div>
            <p>Номенклатура пуста</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ ОПЕРАЦИИ ============
function OperationsPage({ data }: { data: ReturnType<typeof useData> }) {
  const { employees, nomenclature, arrivals, expenses, returns } = data;
  const [subTab, setSubTab] = useState<'arrival' | 'expense' | 'returns'>('arrival');
  const [showAddArrival, setShowAddArrival] = useState(false);
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Операции</h2>
        <p className="text-slate-400 text-sm mt-1">Приход, расход и возвраты</p>
      </div>

      <div className="flex gap-2 bg-slate-800 rounded-xl p-1 border border-slate-700">
        <button onClick={() => setSubTab('arrival')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium ${subTab === 'arrival' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>
          💰 Приход
        </button>
        <button onClick={() => setSubTab('expense')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium ${subTab === 'expense' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>
          📤 Расход
        </button>
        <button onClick={() => setSubTab('returns')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium relative ${subTab === 'returns' ? 'bg-orange-600 text-white' : 'text-slate-400'}`}>
          ↩️ Возвраты
          {returns.filter(r => r.status === 'Новый').length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
              {returns.filter(r => r.status === 'Новый').length}
            </span>
          )}
        </button>
      </div>

      {subTab === 'arrival' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-400">
              Приход за {currentMonth}: <span className="text-emerald-400 font-bold">
                {arrivals.filter(a => a.month === currentMonth).reduce((s, a) => s + a.amount, 0).toLocaleString('ru-RU')} ₽
              </span>
            </div>
            <button onClick={() => setShowAddArrival(true)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white text-sm font-medium">
              + Внести приход
            </button>
          </div>
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 text-left">
                  <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Дата</th>
                  <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Сотрудник</th>
                  <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Тип</th>
                  <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Сумма (₽)</th>
                  <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Смены</th>
                </tr>
              </thead>
              <tbody>
                {arrivals.sort((a, b) => b.date.localeCompare(a.date)).map(arr => {
                  const emp = employees.find(e => e.id === arr.employeeId);
                  return (
                    <tr key={arr.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                      <td className="px-5 py-3 text-sm text-slate-300">{arr.date}</td>
                      <td className="px-5 py-3 text-sm text-white">{emp?.fullName || arr.employeeId}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${arr.type === 'Плановый' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                          {arr.type}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right text-sm font-semibold text-emerald-400">{arr.amount.toLocaleString('ru-RU')} ₽</td>
                      <td className="px-5 py-3 text-right text-sm text-slate-300">{arr.shifts}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {arrivals.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                <div className="text-3xl mb-2">💰</div>
                <p>Нет записей о приходе</p>
              </div>
            )}
          </div>
          {showAddArrival && <AddArrivalModal employees={employees.filter(e => e.status === 'Активен')} currentMonth={currentMonth}
            onClose={() => setShowAddArrival(false)} onAdd={async (form) => {
              await gs.addArrival({
                id: `ARR-${String(arrivals.length + 1).padStart(3, '0')}`,
                ...form,
                date: new Date().toISOString().split('T')[0],
                month: currentMonth,
                addedBy: 'Руководитель',
              });
              setShowAddArrival(false);
              data.refresh();
            }} />}
        </div>
      )}

      {subTab === 'expense' && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 text-left">
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Дата</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Сотрудник</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Пациент</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Препарат</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Кол-во</th>
              </tr>
            </thead>
            <tbody>
              {expenses.slice(0, 100).map(exp => {
                const emp = employees.find(e => e.id === exp.employeeId);
                const nom = nomenclature.find(n => n.id === exp.nomenclatureId);
                return (
                  <tr key={exp.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                    <td className="px-5 py-3 text-sm text-slate-300">{exp.callDate}</td>
                    <td className="px-5 py-3 text-sm text-white">{emp?.fullName.split(' ').slice(0, 2).join(' ')}</td>
                    <td className="px-5 py-3">
                      <div className="text-sm text-white">{exp.patientName}</div>
                      <div className="text-xs text-slate-500">ДР: {exp.patientBirthDate}</div>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-300">{nom?.name}</td>
                    <td className="px-5 py-3 text-right text-sm text-white">{exp.quantity} {nom?.unit}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {expenses.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              <div className="text-3xl mb-2">📤</div>
              <p>Нет записей о расходе</p>
            </div>
          )}
        </div>
      )}

      {subTab === 'returns' && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 text-left">
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Дата</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Сотрудник</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Препарат</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Кол-во</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Причина</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-center">Статус</th>
              </tr>
            </thead>
            <tbody>
              {returns.map(ret => {
                const emp = employees.find(e => e.id === ret.employeeId);
                const nom = nomenclature.find(n => n.id === ret.nomenclatureId);
                return (
                  <tr key={ret.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                    <td className="px-5 py-3 text-sm text-slate-300">{ret.date}</td>
                    <td className="px-5 py-3 text-sm text-white">{emp?.fullName}</td>
                    <td className="px-5 py-3 text-sm text-slate-300">{nom?.name}</td>
                    <td className="px-5 py-3 text-right text-sm text-white">{ret.quantity} {nom?.unit}</td>
                    <td className="px-5 py-3 text-sm text-slate-400">{ret.reason}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        ret.status === 'Новый' ? 'bg-yellow-500/20 text-yellow-400' :
                        ret.status === 'Принят' ? 'bg-emerald-500/20 text-emerald-400' :
                        ret.status === 'Скорректирован' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'
                      }`}>{ret.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {returns.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              <div className="text-3xl mb-2">↩️</div>
              <p>Нет возвратов</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AddArrivalModal({ employees, currentMonth, onClose, onAdd }: { employees: gs.Employee[]; currentMonth: string; onClose: () => void; onAdd: (form: any) => void }) {
  const [form, setForm] = useState({ employeeId: employees[0]?.id || '', amount: 0, shifts: 0, type: 'Плановый' as 'Плановый' | 'Дополнительный', comment: '' });
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-bold text-white">Внести приход</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Сотрудник</label>
            <select value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
              {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.fullName}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Сумма (₽)</label>
            <input type="number" value={form.amount || ''} onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Смены</label>
            <input type="number" value={form.shifts || ''} onChange={e => setForm({ ...form, shifts: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Комментарий</label>
            <input type="text" value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
          </div>
        </div>
        <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white">Отмена</button>
          <button onClick={() => onAdd(form)} disabled={form.amount <= 0}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 rounded-lg text-white font-medium">Внести</button>
        </div>
      </div>
    </div>
  );
}

// ============ ОСТАТКИ ============
function StockPage({ data }: { data: ReturnType<typeof useData> }) {
  const { employees, nomenclature, expenses, returns } = data;
  const activeEmployees = employees.filter(e => e.status === 'Активен');
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const stockByNomenclature = () => {
    const map: Record<string, { qty: number; value: number; name: string; unit: string; price: number }> = {};
    // Упрощённый расчёт: приход - расход + возвраты
    // В реальной системе нужны начальные остатки
    expenses.filter(e => e.month === currentMonth).forEach(e => {
      if (!map[e.nomenclatureId]) {
        const nom = nomenclature.find(n => n.id === e.nomenclatureId);
        if (nom) map[e.nomenclatureId] = { qty: 0, value: 0, name: nom.name, unit: nom.unit, price: nom.currentPrice };
      }
      if (map[e.nomenclatureId]) map[e.nomenclatureId].qty -= e.quantity;
    });
    returns.filter(r => r.status === 'Принят' || r.status === 'Скорректирован').forEach(r => {
      if (map[r.nomenclatureId]) map[r.nomenclatureId].qty += (r.correctedQuantity ?? r.quantity);
    });
    return Object.entries(map).filter(([, v]) => v.qty > 0).map(([id, v]) => ({ id, ...v, value: v.qty * v.price }));
  };

  const totalValue = stockByNomenclature().reduce((s, i) => s + i.value, 0);
  const totalItems = stockByNomenclature().reduce((s, i) => s + i.qty, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Остатки</h2>
        <p className="text-slate-400 text-sm mt-1">Период: {currentMonth}</p>
      </div>

      <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/10 rounded-2xl p-6 border border-purple-500/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-300">{totalValue.toLocaleString('ru-RU')} ₽</div>
            <div className="text-xs text-slate-400 mt-1">Общая стоимость</div>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-300">{totalItems}</div>
            <div className="text-xs text-slate-400 mt-1">Единиц</div>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-300">{activeEmployees.length}</div>
            <div className="text-xs text-slate-400 mt-1">Сотрудников</div>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-300">{stockByNomenclature().length}</div>
            <div className="text-xs text-slate-400 mt-1">Позиций</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-5 border-b border-slate-700">
          <h3 className="text-lg font-bold text-white">Остатки по номенклатуре</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700 text-left">
              <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Препарат</th>
              <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Кол-во</th>
              <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Цена/ед.</th>
              <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Стоимость</th>
            </tr>
          </thead>
          <tbody>
            {stockByNomenclature().sort((a, b) => b.value - a.value).map(item => (
              <tr key={item.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                <td className="px-5 py-3 text-sm text-white">{item.name}</td>
                <td className="px-5 py-3 text-right text-sm text-white">{item.qty} {item.unit}</td>
                <td className="px-5 py-3 text-right text-sm text-slate-300">{item.price.toLocaleString('ru-RU')} ₽</td>
                <td className="px-5 py-3 text-right text-sm font-semibold text-emerald-400">{item.value.toLocaleString('ru-RU')} ₽</td>
              </tr>
            ))}
          </tbody>
        </table>
        {stockByNomenclature().length === 0 && (
          <div className="p-8 text-center text-slate-500">
            <div className="text-3xl mb-2">📦</div>
            <p>Нет данных об остатках</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ ЧАТ ============
function ChatPage({ data }: { data: ReturnType<typeof useData> }) {
  const { chatMessages, employees } = data;
  const [selectedChat, setSelectedChat] = useState<string>(employees[0]?.id || '');
  const [newMessage, setNewMessage] = useState('');

  const chatWith = chatMessages.filter(m =>
    (m.fromId === selectedChat && m.toId === 'MGR') || (m.fromId === 'MGR' && m.toId === selectedChat)
  ).sort((a, b) => a.date.localeCompare(b.date));

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;
    const emp = employees.find(e => e.id === selectedChat);
    await gs.addChatMessage({
      id: `MSG-${Date.now()}`,
      fromId: 'MGR', fromName: 'Руководитель',
      toId: selectedChat, toName: emp?.fullName || '',
      role: 'Руководитель', text: newMessage,
      priority: 'Обычное',
    });
    setNewMessage('');
    data.refresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Сообщения</h2>
        <p className="text-slate-400 text-sm mt-1">Чат с сотрудниками</p>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex h-[600px]">
        <div className="w-80 border-r border-slate-700 flex flex-col">
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-bold text-white text-sm">Диалоги</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {employees.filter(e => e.status === 'Активен').map(emp => (
              <button key={emp.id} onClick={() => setSelectedChat(emp.id)}
                className={`w-full p-4 flex items-center gap-3 text-left border-b border-slate-700/50 ${
                  selectedChat === emp.id ? 'bg-blue-600/10 border-l-2 border-l-blue-400' : 'hover:bg-slate-700/30'
                }`}>
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-sm font-bold">{emp.fullName[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{emp.fullName}</div>
                  <div className="text-xs text-slate-400">{emp.position}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-slate-700 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-sm font-bold">
              {employees.find(e => e.id === selectedChat)?.fullName[0] || '?'}
            </div>
            <div>
              <div className="font-medium text-white">{employees.find(e => e.id === selectedChat)?.fullName}</div>
              <div className="text-xs text-slate-400">{employees.find(e => e.id === selectedChat)?.position}</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatWith.length === 0 ? (
              <div className="text-center text-slate-500 mt-8">
                <div className="text-4xl mb-2">💬</div>
                <p>Нет сообщений</p>
              </div>
            ) : chatWith.map(msg => (
              <div key={msg.id} className={`flex ${msg.fromId === 'MGR' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                  msg.fromId === 'MGR' ? 'bg-blue-600 text-white rounded-br-md' : 'bg-slate-700 text-white rounded-bl-md'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <div className={`text-xs mt-1 ${msg.fromId === 'MGR' ? 'text-blue-200' : 'text-slate-400'}`}>{msg.date}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-700">
            <div className="flex gap-2">
              <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Введите сообщение..."
                className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
              <button onClick={sendMessage} disabled={!newMessage.trim()}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 rounded-xl text-white font-medium">➤</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ ОТЧЁТЫ ============
function ReportsPage({ data }: { data: ReturnType<typeof useData> }) {
  const { employees, arrivals, expenses, nomenclature } = data;
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date(); d.setMonth(d.getMonth() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const reportData = employees.filter(e => e.status !== 'Уволен').map(emp => {
    const calls = new Set(expenses.filter(e => e.employeeId === emp.id && e.month === selectedMonth).map(e => e.callId)).size;
    const arrival = arrivals.filter(a => a.employeeId === emp.id && a.month === selectedMonth).reduce((s, a) => s + a.amount, 0);
    const expense = expenses.filter(e => e.employeeId === emp.id && e.month === selectedMonth).reduce((s, e) => {
      const nom = nomenclature.find(n => n.id === e.nomenclatureId);
      return s + (nom ? nom.currentPrice * e.quantity : 0);
    }, 0);
    return { emp, calls, arrival, expense, balance: arrival - expense };
  });

  const totals = {
    calls: reportData.reduce((s, r) => s + r.calls, 0),
    arrival: reportData.reduce((s, r) => s + r.arrival, 0),
    expense: reportData.reduce((s, r) => s + r.expense, 0),
    balance: reportData.reduce((s, r) => s + r.balance, 0),
  };

  const exportCSV = () => {
    const headers = ['ФИО', 'Должность', 'Вызовы', 'Приход (₽)', 'Расход (₽)', 'Остаток (₽)'];
    const rows = reportData.map(r => [r.emp.fullName, r.emp.position, r.calls, r.arrival, r.expense, r.balance]);
    const csv = [headers, ...rows].map(row => row.join(';')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `Отчет_${selectedMonth}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Отчёты</h2>
          <p className="text-slate-400 text-sm mt-1">Ежемесячные отчёты</p>
        </div>
        <button onClick={exportCSV} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white text-sm font-medium">
          📊 Экспорт CSV
        </button>
      </div>

      <input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}
        className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-xs text-slate-400">Приход</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">{totals.arrival.toLocaleString('ru-RU')} ₽</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-xs text-slate-400">Расход</div>
          <div className="text-xl font-bold text-blue-400 mt-1">{totals.expense.toLocaleString('ru-RU')} ₽</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-xs text-slate-400">Остаток</div>
          <div className="text-xl font-bold text-purple-400 mt-1">{totals.balance.toLocaleString('ru-RU')} ₽</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-xs text-slate-400">Вызовов</div>
          <div className="text-xl font-bold text-white mt-1">{totals.calls}</div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-5 border-b border-slate-700">
          <h3 className="text-lg font-bold text-white">📋 Отчёт за {selectedMonth}</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700 text-left">
              <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">№</th>
              <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">ФИО</th>
              <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Вызовы</th>
              <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Приход</th>
              <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Расход</th>
              <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Остаток</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((row, i) => (
              <tr key={row.emp.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                <td className="px-5 py-3 text-sm text-slate-500">{i + 1}</td>
                <td className="px-5 py-3">
                  <div className="text-sm font-medium text-white">{row.emp.fullName}</div>
                  <div className="text-xs text-slate-400">{row.emp.position}</div>
                </td>
                <td className="px-5 py-3 text-right text-sm text-white">{row.calls}</td>
                <td className="px-5 py-3 text-right text-sm text-emerald-400">{row.arrival.toLocaleString('ru-RU')} ₽</td>
                <td className="px-5 py-3 text-right text-sm text-blue-400">{row.expense.toLocaleString('ru-RU')} ₽</td>
                <td className={`px-5 py-3 text-right text-sm font-semibold ${row.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {row.balance.toLocaleString('ru-RU')} ₽
                </td>
              </tr>
            ))}
            <tr className="bg-slate-900/50 font-bold">
              <td className="px-5 py-3" colSpan={2}><span className="text-sm text-white">ИТОГО</span></td>
              <td className="px-5 py-3 text-right text-sm text-white">{totals.calls}</td>
              <td className="px-5 py-3 text-right text-sm text-emerald-400">{totals.arrival.toLocaleString('ru-RU')} ₽</td>
              <td className="px-5 py-3 text-right text-sm text-blue-400">{totals.expense.toLocaleString('ru-RU')} ₽</td>
              <td className={`px-5 py-3 text-right text-sm ${totals.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {totals.balance.toLocaleString('ru-RU')} ₽
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============ ЖУРНАЛ ============
function AuditPage({ data }: { data: ReturnType<typeof useData> }) {
  const { auditLog } = data;
  const [search, setSearch] = useState('');

  const filtered = auditLog.filter(log =>
    !search || log.newValue.toLowerCase().includes(search.toLowerCase()) ||
    log.oldValue.toLowerCase().includes(search.toLowerCase()) || log.recordId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Журнал изменений</h2>
        <p className="text-slate-400 text-sm mt-1">История всех действий • Всего записей: {auditLog.length}</p>
      </div>

      <input type="text" placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)}
        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700 text-left">
              <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Дата</th>
              <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Пользователь</th>
              <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Лист</th>
              <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Действие</th>
              <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Было → Стало</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(log => (
              <tr key={log.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                <td className="px-5 py-3 text-sm text-slate-300 whitespace-nowrap">{log.date}</td>
                <td className="px-5 py-3">
                  <div className="text-sm text-white">{log.userName}</div>
                  <div className="text-xs text-slate-500">{log.role}</div>
                </td>
                <td className="px-5 py-3"><span className="px-2 py-1 rounded bg-slate-700 text-xs text-slate-300">{log.sheet}</span></td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    log.action === 'Создание' ? 'bg-emerald-500/20 text-emerald-400' :
                    log.action === 'Изменение' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'
                  }`}>{log.action}</span>
                </td>
                <td className="px-5 py-3 text-sm">
                  <div className="flex items-center gap-1">
                    {log.oldValue && <span className="text-red-400 line-through text-xs">{log.oldValue}</span>}
                    {log.oldValue && log.newValue && <span className="text-slate-500">→</span>}
                    {log.newValue && <span className="text-emerald-400 text-xs">{log.newValue}</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            <div className="text-3xl mb-2">📝</div>
            <p>Журнал пуст</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ НАСТРОЙКИ ============
function SettingsPage({ data }: { data: ReturnType<typeof useData> }) {
  const { employees, nomenclature, arrivals, expenses, returns, chatMessages, auditLog } = data;
  const config = gs.getCurrentConfig();

  const handleDisconnect = () => {
    if (confirm('Вы уверены? Приложение перестанет работать с Google Sheets.')) {
      gs.clearConfig();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Настройки</h2>
        <p className="text-slate-400 text-sm mt-1">Информация о системе и подключении</p>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-5 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">📊 Подключение к Google Sheets</h3>
          <button
            onClick={handleDisconnect}
            className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded-lg text-sm hover:bg-red-600/30 transition-colors"
          >
            Отключить
          </button>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-emerald-400 rounded-full"></span>
            <span className="text-sm text-white">Статус: Подключено</span>
          </div>
          <div className="bg-slate-900 rounded-lg p-3">
            <div className="text-xs text-slate-400">URL веб-приложения</div>
            <div className="text-sm text-white font-mono break-all">{config.scriptUrl.substring(0, 50)}...</div>
          </div>
          <p className="text-xs text-slate-500">
            Подключение через Google Apps Script Web App
          </p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-5 border-b border-slate-700">
          <h3 className="text-lg font-bold text-white">📈 Статистика данных</h3>
        </div>
        <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">{employees.length}</div>
            <div className="text-xs text-slate-400">Сотрудников</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">{nomenclature.length}</div>
            <div className="text-xs text-slate-400">Позиций номенклатуры</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">{arrivals.length}</div>
            <div className="text-xs text-slate-400">Записей прихода</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">{expenses.length}</div>
            <div className="text-xs text-slate-400">Записей расхода</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">{returns.length}</div>
            <div className="text-xs text-slate-400">Возвратов</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">{chatMessages.length}</div>
            <div className="text-xs text-slate-400">Сообщений</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">{auditLog.length}</div>
            <div className="text-xs text-slate-400">Записей журнала</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-5 border-b border-slate-700">
          <h3 className="text-lg font-bold text-white">ℹ️ О системе</h3>
        </div>
        <div className="p-5 space-y-2">
          <div className="flex justify-between py-2 border-b border-slate-700/50">
            <span className="text-sm text-slate-400">Версия</span>
            <span className="text-sm text-white">2.0.0 (Google Sheets)</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-700/50">
            <span className="text-sm text-slate-400">Хранилище</span>
            <span className="text-sm text-white">Google Sheets API v4</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-slate-400">Дата</span>
            <span className="text-sm text-white">{new Date().toLocaleDateString('ru-RU')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
