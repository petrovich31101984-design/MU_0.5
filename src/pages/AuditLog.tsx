import { useState } from 'react';
import { auditLog } from '../mockData';

export default function AuditLog() {
  const [filter, setFilter] = useState({ sheet: 'all', action: 'all', user: 'all' });
  const [search, setSearch] = useState('');

  const sheets = [...new Set(auditLog.map(l => l.sheet))];
  const actions = [...new Set(auditLog.map(l => l.action))];
  const users = [...new Set(auditLog.map(l => l.userName))];

  const filtered = auditLog.filter(log => {
    const matchSheet = filter.sheet === 'all' || log.sheet === filter.sheet;
    const matchAction = filter.action === 'all' || log.action === filter.action;
    const matchUser = filter.user === 'all' || log.userName === filter.user;
    const matchSearch = !search || 
      log.newValue.toLowerCase().includes(search.toLowerCase()) ||
      log.oldValue.toLowerCase().includes(search.toLowerCase()) ||
      log.recordId.toLowerCase().includes(search.toLowerCase());
    return matchSheet && matchAction && matchUser && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Журнал изменений</h2>
        <p className="text-slate-400 text-sm mt-1">История всех действий в системе (версионность данных)</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Поиск по записи..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <select
          value={filter.sheet}
          onChange={e => setFilter({ ...filter, sheet: e.target.value })}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">Все листы</option>
          {sheets.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={filter.action}
          onChange={e => setFilter({ ...filter, action: e.target.value })}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">Все действия</option>
          {actions.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <select
          value={filter.user}
          onChange={e => setFilter({ ...filter, user: e.target.value })}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">Все пользователи</option>
          {users.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
          <div className="text-2xl font-bold text-white">{auditLog.length}</div>
          <div className="text-xs text-slate-400">Всего записей</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
          <div className="text-2xl font-bold text-emerald-400">{auditLog.filter(l => l.action === 'Создание').length}</div>
          <div className="text-xs text-slate-400">Созданий</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
          <div className="text-2xl font-bold text-blue-400">{auditLog.filter(l => l.action === 'Изменение').length}</div>
          <div className="text-xs text-slate-400">Изменений</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
          <div className="text-2xl font-bold text-yellow-400">{users.length}</div>
          <div className="text-xs text-slate-400">Пользователей</div>
        </div>
      </div>

      {/* Log table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 text-left">
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Дата</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Пользователь</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Роль</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Лист</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Запись</th>
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
                    <div className="text-xs text-slate-500 font-mono">{log.userId}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      log.role === 'Руководитель' ? 'bg-emerald-500/20 text-emerald-400' :
                      log.role === 'Кладовщик' ? 'bg-purple-500/20 text-purple-400' :
                      log.role === 'Сотрудник' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>{log.role}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-1 rounded bg-slate-700 text-xs text-slate-300">{log.sheet}</span>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-400 font-mono">{log.recordId}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      log.action === 'Создание' ? 'bg-emerald-500/20 text-emerald-400' :
                      log.action === 'Изменение' ? 'bg-blue-500/20 text-blue-400' :
                      log.action === 'Удаление' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>{log.action}</span>
                  </td>
                  <td className="px-5 py-3 text-sm">
                    {log.oldValue || log.newValue ? (
                      <div className="flex items-center gap-1">
                        {log.oldValue && <span className="text-red-400 line-through text-xs">{log.oldValue}</span>}
                        {log.oldValue && log.newValue && <span className="text-slate-500">→</span>}
                        {log.newValue && <span className="text-emerald-400 text-xs">{log.newValue}</span>}
                      </div>
                    ) : (
                      <span className="text-slate-500 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            <div className="text-3xl mb-2">📝</div>
            <p>Записи не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}
