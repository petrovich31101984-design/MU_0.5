import { useState } from 'react';

export default function Settings() {
  const [settings, setSettings] = useState({
    departmentName: 'Выездное подразделение №1',
    overconsumptionThreshold: 100,
    inactiveDays: 7,
    maxOfflineHours: 72,
    reportDay: 5,
    autoBlock: true,
    notifications: {
      overconsumption: true,
      inactive: true,
      returns: true,
      messages: true,
    },
  });

  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Настройки</h2>
        <p className="text-slate-400 text-sm mt-1">Параметры системы и уведомления</p>
      </div>

      {/* General settings */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-5 border-b border-slate-700">
          <h3 className="text-lg font-bold text-white">⚙️ Общие настройки</h3>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Название подразделения</label>
            <input
              type="text"
              value={settings.departmentName}
              onChange={e => setSettings({ ...settings, departmentName: e.target.value })}
              className="w-full md:w-96 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">
              Порог уведомления о перерасходе (%)
            </label>
            <input
              type="number"
              value={settings.overconsumptionThreshold}
              onChange={e => setSettings({ ...settings, overconsumptionThreshold: parseInt(e.target.value) || 0 })}
              className="w-full md:w-48 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
            <p className="text-xs text-slate-500 mt-1">Уведомление при превышении расхода над приходом на указанный %</p>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">
              Дней без активности для уведомления
            </label>
            <input
              type="number"
              value={settings.inactiveDays}
              onChange={e => setSettings({ ...settings, inactiveDays: parseInt(e.target.value) || 0 })}
              className="w-full md:w-48 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
            <p className="text-xs text-slate-500 mt-1">Уведомление если сотрудник не вносит расход указанное кол-во дней</p>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">
              Максимум часов офлайн
            </label>
            <input
              type="number"
              value={settings.maxOfflineHours}
              onChange={e => setSettings({ ...settings, maxOfflineHours: parseInt(e.target.value) || 0 })}
              className="w-full md:w-48 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
            <p className="text-xs text-slate-500 mt-1">Максимальное время работы сотрудника без сети</p>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">
              День формирования отчёта
            </label>
            <input
              type="number"
              value={settings.reportDay}
              onChange={e => setSettings({ ...settings, reportDay: parseInt(e.target.value) || 0 })}
              className="w-full md:w-48 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              min="1"
              max="28"
            />
            <p className="text-xs text-slate-500 mt-1">Число месяца для автоматического формирования отчёта</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoBlock}
                onChange={e => setSettings({ ...settings, autoBlock: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
            <div>
              <div className="text-sm text-white">Автоблокировка</div>
              <div className="text-xs text-slate-500">Блокировать после 5 неудачных попыток входа</div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-5 border-b border-slate-700">
          <h3 className="text-lg font-bold text-white">🔔 Уведомления</h3>
        </div>
        <div className="p-5 space-y-4">
          {Object.entries(settings.notifications).map(([key, value]) => {
            const labels: Record<string, { title: string; desc: string }> = {
              overconsumption: { title: 'Перерасход', desc: 'Уведомление при превышении расхода над приходом' },
              inactive: { title: 'Неактивность', desc: 'Уведомление о сотрудниках без активности' },
              returns: { title: 'Возвраты', desc: 'Уведомления о новых возвратах от сотрудников' },
              messages: { title: 'Сообщения', desc: 'Уведомления о новых сообщениях' },
            };
            const label = labels[key];
            return (
              <div key={key} className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm text-white">{label.title}</div>
                  <div className="text-xs text-slate-500">{label.desc}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={e => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, [key]: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data management */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-5 border-b border-slate-700">
          <h3 className="text-lg font-bold text-white">🗄️ Управление данными</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm text-white">Подключение к Google Sheets</div>
              <div className="text-xs text-slate-500">URL таблицы и API ключ</div>
            </div>
            <button className="px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg text-sm hover:bg-blue-600/30">
              Настроить
            </button>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm text-white">Резервное копирование</div>
              <div className="text-xs text-slate-500">Последняя копия: сегодня, 09:00</div>
            </div>
            <button className="px-3 py-1.5 bg-emerald-600/20 text-emerald-400 rounded-lg text-sm hover:bg-emerald-600/30">
              Создать копию
            </button>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm text-white">Очистка кэша</div>
              <div className="text-xs text-slate-500">Размер кэша: 2.4 МБ</div>
            </div>
            <button className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-600">
              Очистить
            </button>
          </div>
        </div>
      </div>

      {/* System info */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-5 border-b border-slate-700">
          <h3 className="text-lg font-bold text-white">ℹ️ О системе</h3>
        </div>
        <div className="p-5 space-y-2">
          <div className="flex justify-between py-2 border-b border-slate-700/50">
            <span className="text-sm text-slate-400">Версия</span>
            <span className="text-sm text-white">1.0.0</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-700/50">
            <span className="text-sm text-slate-400">Дата развёртывания</span>
            <span className="text-sm text-white">{new Date().toLocaleDateString('ru-RU')}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-700/50">
            <span className="text-sm text-slate-400">Хранилище</span>
            <span className="text-sm text-white">Google Sheets</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-700/50">
            <span className="text-sm text-slate-400">Сотрудников в системе</span>
            <span className="text-sm text-white">10</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-slate-400">Позиций номенклатуры</span>
            <span className="text-sm text-white">15</span>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center gap-4">
        <button
          onClick={save}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-colors"
        >
          💾 Сохранить настройки
        </button>
        {saved && (
          <span className="text-emerald-400 text-sm flex items-center gap-1">
            ✅ Настройки сохранены
          </span>
        )}
      </div>
    </div>
  );
}
