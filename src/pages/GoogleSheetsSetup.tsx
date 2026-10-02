import { useState } from 'react';
import { useGoogleSheets } from '../hooks/useGoogleSheets';

export default function GoogleSheetsSetup() {
  const { config, loading, error, connect, disconnect } = useGoogleSheets();
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [spreadsheetId, setSpreadsheetId] = useState(config.spreadsheetId);
  const [showHelp, setShowHelp] = useState(false);

  const handleConnect = async () => {
    await connect(apiKey, spreadsheetId);
  };

  const handleDisconnect = () => {
    disconnect();
    setApiKey('');
    setSpreadsheetId('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Подключение к Google Sheets</h2>
        <p className="text-slate-400 text-sm mt-1">Настройка интеграции с Google Sheets API</p>
      </div>

      {/* Статус подключения */}
      <div className={`rounded-xl p-5 border ${
        config.connected 
          ? 'bg-emerald-500/10 border-emerald-500/30' 
          : 'bg-slate-800 border-slate-700'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            config.connected ? 'bg-emerald-600' : 'bg-slate-700'
          }`}>
            {config.connected ? '✓' : '○'}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">
              {config.connected ? 'Подключено' : 'Не подключено'}
            </h3>
            <p className="text-sm text-slate-400">
              {config.connected 
                ? `Таблица: ${config.spreadsheetId.substring(0, 20)}...`
                : 'Настройте подключение для синхронизации данных'}
            </p>
          </div>
          {config.connected && (
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm hover:bg-red-600/30 transition-colors"
            >
              Отключить
            </button>
          )}
        </div>
      </div>

      {/* Форма подключения */}
      {!config.connected && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-5 border-b border-slate-700">
            <h3 className="text-lg font-bold text-white">Настройка подключения</h3>
          </div>
          <div className="p-5 space-y-5">
            <div>
              <label className="text-sm text-slate-400 mb-2 block">
                API ключ Google Cloud *
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">
                Получите ключ в Google Cloud Console
              </p>
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-2 block">
                ID таблицы Google Sheets *
              </label>
              <input
                type="text"
                value={spreadsheetId}
                onChange={e => setSpreadsheetId(e.target.value)}
                placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">
                ID находится в URL таблицы: docs.google.com/spreadsheets/d/<strong>ID</strong>/edit
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
                ⚠️ {error}
              </div>
            )}

            <button
              onClick={handleConnect}
              disabled={loading || !apiKey || !spreadsheetId}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg text-white font-medium transition-colors"
            >
              {loading ? 'Подключение...' : 'Подключиться'}
            </button>
          </div>
        </div>
      )}

      {/* Инструкция */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-700/30 transition-colors"
        >
          <h3 className="text-lg font-bold text-white">📖 Инструкция по настройке</h3>
          <span className="text-slate-400">{showHelp ? '▼' : '▶'}</span>
        </button>

        {showHelp && (
          <div className="p-5 border-t border-slate-700 space-y-4">
            <div>
              <h4 className="font-semibold text-white mb-2">Шаг 1: Создание таблицы</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-slate-300">
                <li>Перейдите на <a href="https://sheets.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">sheets.google.com</a></li>
                <li>Создайте новую таблицу</li>
                <li>Выполните скрипт установки базы данных (вкладка "Установка БД")</li>
                <li>Скопируйте ID таблицы из URL</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">Шаг 2: Получение API ключа</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-slate-300">
                <li>Перейдите в <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google Cloud Console</a></li>
                <li>Создайте новый проект или выберите существующий</li>
                <li>Включите Google Sheets API</li>
                <li>Создайте API ключ (Credentials → Create Credentials → API Key)</li>
                <li>Скопируйте ключ</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">Шаг 3: Настройка доступа</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-slate-300">
                <li>Откройте таблицу в Google Sheets</li>
                <li>Нажмите "Поделиться" (Share)</li>
                <li>Добавьте доступ для "Все, у кого есть ссылка" с правом просмотра</li>
                <li>Или используйте сервисный аккаунт для безопасного доступа</li>
              </ol>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-400 mb-2">⚠️ Безопасность</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
                <li>API ключ хранится локально в браузере</li>
                <li>Для продакшена используйте серверный прокси</li>
                <li>Ограничьте API ключ только для Google Sheets API</li>
                <li>Регулярно ротируйте ключи</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Информация о синхронизации */}
      {config.connected && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-5 border-b border-slate-700">
            <h3 className="text-lg font-bold text-white">🔄 Синхронизация данных</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
              <div>
                <div className="text-sm text-white">Автосинхронизация</div>
                <div className="text-xs text-slate-500">Автоматическое обновление данных каждые 30 секунд</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
              <div>
                <div className="text-sm text-white">Последняя синхронизация</div>
                <div className="text-xs text-slate-500">{new Date().toLocaleString('ru-RU')}</div>
              </div>
              <button className="px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg text-sm hover:bg-blue-600/30 transition-colors">
                Обновить
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm text-white">Режим работы</div>
                <div className="text-xs text-slate-500">Онлайн с кэшированием</div>
              </div>
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">Активно</span>
            </div>
          </div>
        </div>
      )}

      {/* Листы таблицы */}
      {config.connected && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-5 border-b border-slate-700">
            <h3 className="text-lg font-bold text-white">📑 Листы таблицы</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                'Сотрудники',
                'Номенклатура',
                'Цены',
                'Приход',
                'Расход',
                'Возвраты',
                'Начальные остатки',
                'Чат',
                'Журнал изменений',
                'Настройки',
                'Отчёты',
              ].map(sheet => (
                <div key={sheet} className="bg-slate-900 rounded-lg p-3 border border-slate-700">
                  <div className="text-sm font-medium text-white">{sheet}</div>
                  <div className="text-xs text-slate-500 mt-1">Готов к работе</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
