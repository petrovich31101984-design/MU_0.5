import { useState } from 'react';
import { employees as initialEmployees, currentMonth, getEmployeeArrival, getEmployeeExpenseValue, getEmployeeCallsCount, getEmployeePatientsCount } from '../mockData';
import { Employee, EmployeeStatus } from '../types';

export default function Employees() {
  const [emps, setEmps] = useState<Employee[]>(initialEmployees);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const filtered = emps.filter(e => {
    const matchSearch = e.fullName.toLowerCase().includes(search.toLowerCase()) || e.personalNumber.includes(search);
    const matchStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const changeStatus = (id: string, status: EmployeeStatus) => {
    setEmps(emps.map(e => e.id === id ? { ...e, status } : e));
  };

  const toggleBlock = (id: string) => {
    setEmps(emps.map(e => e.id === id ? { ...e, blocked: !e.blocked } : e));
  };

  const addEmployee = (data: Partial<Employee>) => {
    const newEmp: Employee = {
      id: `EMP-${String(emps.length + 1).padStart(3, '0')}`,
      personalNumber: data.personalNumber || '',
      fullName: data.fullName || '',
      status: 'Активен',
      position: data.position || '',
      hireDate: new Date().toISOString().split('T')[0],
      blocked: false,
      phone: data.phone || '',
      lastActivity: '-',
      note: '',
    };
    setEmps([...emps, newEmp]);
    setShowAddModal(false);
  };

  const removeEmployee = (id: string) => {
    if (confirm('Уволить сотрудника?')) {
      changeStatus(id, 'Уволен');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Сотрудники</h2>
          <p className="text-slate-400 text-sm mt-1">Управление сотрудниками подразделения</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
        >
          <span>+</span> Добавить сотрудника
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Поиск по ФИО или номеру..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">Все статусы</option>
          <option value="Активен">Активен</option>
          <option value="Неактивен">Неактивен</option>
          <option value="Отпуск">Отпуск</option>
          <option value="Уволен">Уволен</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
          <div className="text-2xl font-bold text-emerald-400">{emps.filter(e => e.status === 'Активен').length}</div>
          <div className="text-xs text-slate-400">Активных</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
          <div className="text-2xl font-bold text-yellow-400">{emps.filter(e => e.status === 'Отпуск').length}</div>
          <div className="text-xs text-slate-400">В отпуске</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
          <div className="text-2xl font-bold text-slate-400">{emps.filter(e => e.status === 'Неактивен').length}</div>
          <div className="text-xs text-slate-400">Неактивных</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
          <div className="text-2xl font-bold text-red-400">{emps.filter(e => e.blocked).length}</div>
          <div className="text-xs text-slate-400">Заблокированных</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 text-left">
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Сотрудник</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">№</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Статус</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Вызовы</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Пациенты</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Приход</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Расход</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Посл. активность</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-center">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => {
                const arr = getEmployeeArrival(emp.id, currentMonth);
                const exp = getEmployeeExpenseValue(emp.id, currentMonth);
                const calls = getEmployeeCallsCount(emp.id, currentMonth);
                const patients = getEmployeePatientsCount(emp.id, currentMonth);

                return (
                  <tr key={emp.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                    <td className="px-5 py-3">
                      <button onClick={() => { setSelectedEmp(emp); setShowDetail(true); }} className="flex items-center gap-3 hover:opacity-80">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                          emp.blocked ? 'bg-red-600' :
                          emp.status === 'Активен' ? 'bg-emerald-600' :
                          emp.status === 'Отпуск' ? 'bg-yellow-600' : 'bg-slate-600'
                        }`}>
                          {emp.fullName[0]}
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-medium text-white">{emp.fullName}</div>
                          <div className="text-xs text-slate-400">{emp.position}</div>
                        </div>
                      </button>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-300 font-mono">{emp.personalNumber}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        emp.blocked ? 'bg-red-500/20 text-red-400' :
                        emp.status === 'Активен' ? 'bg-emerald-500/20 text-emerald-400' :
                        emp.status === 'Отпуск' ? 'bg-yellow-500/20 text-yellow-400' :
                        emp.status === 'Неактивен' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {emp.blocked ? '🔒 Заблокирован' : emp.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-sm text-white">{calls}</td>
                    <td className="px-5 py-3 text-right text-sm text-blue-400">{patients}</td>
                    <td className="px-5 py-3 text-right text-sm text-emerald-400">{arr.toLocaleString('ru-RU')} ₽</td>
                    <td className="px-5 py-3 text-right text-sm text-blue-400">{exp.toLocaleString('ru-RU')} ₽</td>
                    <td className="px-5 py-3 text-sm text-slate-400">{emp.lastActivity || '-'}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => toggleBlock(emp.id)}
                          className={`p-1.5 rounded ${emp.blocked ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                          title={emp.blocked ? 'Разблокировать' : 'Заблокировать'}
                        >
                          {emp.blocked ? '🔓' : '🔒'}
                        </button>
                        <button
                          onClick={() => { setSelectedEmp(emp); setShowDetail(true); }}
                          className="p-1.5 rounded bg-slate-700 text-slate-400 hover:bg-blue-600/30 hover:text-blue-400"
                          title="Подробнее"
                        >
                          👁
                        </button>
                        {emp.status !== 'Уволен' && (
                          <button
                            onClick={() => removeEmployee(emp.id)}
                            className="p-1.5 rounded bg-slate-700 text-slate-400 hover:bg-red-600/30 hover:text-red-400"
                            title="Уволить"
                          >
                            🚪
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && <AddEmployeeModal onClose={() => setShowAddModal(false)} onAdd={addEmployee} />}

      {/* Detail Modal */}
      {showDetail && selectedEmp && (
        <EmployeeDetailModal emp={selectedEmp} onClose={() => setShowDetail(false)} onChangeStatus={changeStatus} />
      )}
    </div>
  );
}

function AddEmployeeModal({ onClose, onAdd }: { onClose: () => void; onAdd: (data: any) => void }) {
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
            <input
              type="text"
              value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Иванов Иван Иванович"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Персональный номер *</label>
            <input
              type="text"
              value={form.personalNumber}
              onChange={e => setForm({ ...form, personalNumber: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="011"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Должность</label>
            <select
              value={form.position}
              onChange={e => setForm({ ...form, position: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option>Врач</option>
              <option>Фельдшер</option>
              <option>Медсестра</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Телефон</label>
            <input
              type="text"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="+7 (900) 000-00-00"
            />
          </div>
        </div>
        <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors">
            Отмена
          </button>
          <button
            onClick={() => onAdd(form)}
            disabled={!form.fullName || !form.personalNumber}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg text-white font-medium transition-colors"
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
}

function EmployeeDetailModal({ emp, onClose, onChangeStatus }: { emp: Employee; onClose: () => void; onChangeStatus: (id: string, status: EmployeeStatus) => void }) {
  const arr = getEmployeeArrival(emp.id, currentMonth);
  const exp = getEmployeeExpenseValue(emp.id, currentMonth);
  const calls = getEmployeeCallsCount(emp.id, currentMonth);
  const patients = getEmployeePatientsCount(emp.id, currentMonth);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
              emp.status === 'Активен' ? 'bg-emerald-600' :
              emp.status === 'Отпуск' ? 'bg-yellow-600' : 'bg-slate-600'
            }`}>
              {emp.fullName[0]}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{emp.fullName}</h3>
              <p className="text-sm text-slate-400">{emp.position} • №{emp.personalNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">✕</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900 rounded-lg p-3">
              <div className="text-xs text-slate-400">Вызовов</div>
              <div className="text-xl font-bold text-white">{calls}</div>
            </div>
            <div className="bg-slate-900 rounded-lg p-3">
              <div className="text-xs text-slate-400">Пациентов</div>
              <div className="text-xl font-bold text-blue-400">{patients}</div>
            </div>
            <div className="bg-slate-900 rounded-lg p-3">
              <div className="text-xs text-slate-400">Приход</div>
              <div className="text-xl font-bold text-emerald-400">{arr.toLocaleString('ru-RU')} ₽</div>
            </div>
            <div className="bg-slate-900 rounded-lg p-3">
              <div className="text-xs text-slate-400">Расход</div>
              <div className="text-xl font-bold text-blue-400">{exp.toLocaleString('ru-RU')} ₽</div>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-slate-700/50">
              <span className="text-sm text-slate-400">Телефон</span>
              <span className="text-sm text-white">{emp.phone}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-700/50">
              <span className="text-sm text-slate-400">Дата найма</span>
              <span className="text-sm text-white">{emp.hireDate}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-700/50">
              <span className="text-sm text-slate-400">Последний вход</span>
              <span className="text-sm text-white">{emp.lastActivity}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-700/50">
              <span className="text-sm text-slate-400">Статус</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                emp.status === 'Активен' ? 'bg-emerald-500/20 text-emerald-400' :
                emp.status === 'Отпуск' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-slate-500/20 text-slate-400'
              }`}>{emp.status}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-400">Изменить статус:</h4>
            <div className="flex flex-wrap gap-2">
              {(['Активен', 'Неактивен', 'Отпуск'] as EmployeeStatus[]).map(status => (
                <button
                  key={status}
                  onClick={() => onChangeStatus(emp.id, status)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    emp.status === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
