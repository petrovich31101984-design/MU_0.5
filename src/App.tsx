import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Nomenclature from './pages/Nomenclature';
import Operations from './pages/Operations';
import Stock from './pages/Stock';
import Chat from './pages/Chat';
import Reports from './pages/Reports';
import AuditLog from './pages/AuditLog';
import Settings from './pages/Settings';
import GoogleSheetsSetup from './pages/GoogleSheetsSetup';
import { notifications as initialNotifications } from './mockData';
import { googleSheetsService } from './services/googleSheets';

type Page = 'dashboard' | 'employees' | 'nomenclature' | 'operations' | 'stock' | 'chat' | 'reports' | 'audit' | 'settings' | 'google-sheets';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifs, setNotifs] = useState(initialNotifications);
  const [sheetsConnected, setSheetsConnected] = useState(googleSheetsService.getConfig().connected);

  useEffect(() => {
    const unsubscribe = googleSheetsService.subscribe(() => {
      setSheetsConnected(googleSheetsService.getConfig().connected);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const unreadCount = notifs.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifs(notifs.map(n => ({ ...n, read: true })));
  };

  const menuItems: { id: Page; label: string; icon: string; badge?: number }[] = [
    { id: 'dashboard', label: 'Панель управления', icon: '📊' },
    { id: 'employees', label: 'Сотрудники', icon: '👥' },
    { id: 'nomenclature', label: 'Номенклатура', icon: '💊' },
    { id: 'operations', label: 'Операции', icon: '📋', badge: notifs.filter(n => n.type === 'return' && !n.read).length },
    { id: 'stock', label: 'Остатки', icon: '📦' },
    { id: 'chat', label: 'Сообщения', icon: '💬', badge: notifs.filter(n => n.type === 'message' && !n.read).length },
    { id: 'reports', label: 'Отчёты', icon: '📈' },
    { id: 'audit', label: 'Журнал', icon: '📝' },
    { id: 'google-sheets', label: 'Google Sheets', icon: '📊' },
    { id: 'settings', label: 'Настройки', icon: '⚙️' },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={setCurrentPage} />;
      case 'employees': return <Employees />;
      case 'nomenclature': return <Nomenclature />;
      case 'operations': return <Operations />;
      case 'stock': return <Stock />;
      case 'chat': return <Chat />;
      case 'reports': return <Reports />;
      case 'audit': return <AuditLog />;
      case 'google-sheets': return <GoogleSheetsSetup />;
      case 'settings': return <Settings />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 fixed h-full z-40`}>
        {/* Logo */}
        <div className="p-4 border-b border-slate-700 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center text-lg shrink-0">
            💊
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-white whitespace-nowrap">Учёт лекарств</h1>
              <p className="text-xs text-slate-400 whitespace-nowrap">Руководитель</p>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all relative ${
                currentPage === item.id
                  ? 'bg-blue-600/20 text-blue-400 border-r-2 border-blue-400'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <span className="text-xl shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
              {item.badge && item.badge > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User info */}
        {sidebarOpen && (
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-sm font-bold">
                Р
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-medium text-white truncate">Руководитель</div>
                <div className="text-xs text-slate-400">Выездное под. №1</div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Header */}
        <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              {sidebarOpen ? '◀' : '▶'}
            </button>
            <h2 className="text-lg font-semibold text-white">
              {menuItems.find(m => m.id === currentPage)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Google Sheets Connection Status */}
            <button
              onClick={() => setCurrentPage('google-sheets')}
              className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
                sheetsConnected 
                  ? 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30' 
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
              title={sheetsConnected ? 'Google Sheets: Подключено' : 'Google Sheets: Не подключено'}
            >
              <span className="text-sm">📊</span>
              <span className={`w-2 h-2 rounded-full ${sheetsConnected ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors relative"
              >
                🔔
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-12 w-96 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                    <h3 className="font-bold text-white">Уведомления</h3>
                    <button onClick={markAllRead} className="text-xs text-blue-400 hover:text-blue-300">
                      Прочитать все
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifs.map(notif => (
                      <div
                        key={notif.id}
                        className={`p-4 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${
                          !notif.read ? 'bg-blue-900/20' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-lg">
                            {notif.type === 'overconsumption' && '⚠️'}
                            {notif.type === 'inactive' && '🔴'}
                            {notif.type === 'return' && '↩️'}
                            {notif.type === 'message' && '💬'}
                            {notif.type === 'report' && '📊'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-white">{notif.title}</span>
                              {!notif.read && <span className="w-2 h-2 bg-blue-400 rounded-full"></span>}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{notif.message}</p>
                            <p className="text-xs text-slate-500 mt-1">{notif.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Date */}
            <div className="text-sm text-slate-400 hidden md:block">
              {new Date().toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' })}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
