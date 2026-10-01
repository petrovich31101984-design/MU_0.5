import { useState } from 'react';
import { employees, nomenclature, arrivals as initialArrivals, expenses, returns as initialReturns, currentMonth, getEmployeeArrival, getEmployeeExpenseValue } from '../mockData';
import { Arrival, ReturnOperation, ReturnStatus } from '../types';

type SubTab = 'arrival' | 'expense' | 'returns';

export default function Operations() {
  const [subTab, setSubTab] = useState<SubTab>('arrival');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Операции</h2>
        <p className="text-slate-400 text-sm mt-1">Приход, расход и возвраты препаратов</p>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 bg-slate-800 rounded-xl p-1 border border-slate-700">
        <button
          onClick={() => setSubTab('arrival')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            subTab === 'arrival' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          💰 Приход
        </button>
        <button
          onClick={() => setSubTab('expense')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            subTab === 'expense' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          📤 Расход
        </button>
        <button
          onClick={() => setSubTab('returns')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all relative ${
            subTab === 'returns' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          ↩️ Возвраты
          {initialReturns.filter(r => r.status === 'Новый').length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
              {initialReturns.filter(r => r.status === 'Новый').length}
            </span>
          )}
        </button>
      </div>

      {subTab === 'arrival' && <ArrivalTab />}
      {subTab === 'expense' && <ExpenseTab />}
      {subTab === 'returns' && <ReturnsTab />}
    </div>
  );
}

function ArrivalTab() {
  const [arrs, setArrs] = useState<Arrival[]>(initialArrivals);
  const [showAdd, setShowAdd] = useState(false);
  const [editArr, setEditArr] = useState<Arrival | null>(null);

  const totalArrival = arrs.reduce((s, a) => s + a.amount, 0);

  const addArrival = (data: { employeeId: string; amount: number; shifts: number; type: 'Плановый' | 'Дополнительный'; comment: string }) => {
    const newArr: Arrival = {
      id: `ARR-${String(arrs.length + 1).padStart(3, '0')}`,
      employeeId: data.employeeId,
      date: new Date().toISOString().split('T')[0],
      month: currentMonth,
      amount: data.amount,
      shifts: data.shifts,
      addedBy: 'Руководитель',
      type: data.type,
      comment: data.comment,
    };
    setArrs([...arrs, newArr]);
    setShowAdd(false);
  };

  const updateArrival = (id: string, data: Partial<Arrival>) => {
    setArrs(arrs.map(a => a.id === id ? { ...a, ...data } : a));
    setEditArr(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-400">
          Общий приход за {currentMonth}: <span className="text-emerald-400 font-bold">{totalArrival.toLocaleString('ru-RU')} ₽</span>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white text-sm font-medium transition-colors"
        >
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
              <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Комментарий</th>
              <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-center">Действия</th>
            </tr>
          </thead>
          <tbody>
            {arrs.sort((a, b) => b.date.localeCompare(a.date)).map(arr => {
              const emp = employees.find(e => e.id === arr.employeeId);
              return (
                <tr key={arr.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                  <td className="px-5 py-3 text-sm text-slate-300">{arr.date}</td>
                  <td className="px-5 py-3 text-sm text-white">{emp?.fullName || arr.employeeId}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      arr.type === 'Плановый' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>{arr.type}</span>
                  </td>
                  <td className="px-5 py-3 text-right text-sm font-semibold text-emerald-400">{arr.amount.toLocaleString('ru-RU')} ₽</td>
                  <td className="px-5 py-3 text-right text-sm text-slate-300">{arr.shifts}</td>
                  <td className="px-5 py-3 text-sm text-slate-400">{arr.comment || '-'}</td>
                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => setEditArr(arr)}
                      className="p-1.5 rounded bg-slate-700 text-slate-400 hover:bg-blue-600/30 hover:text-blue-400 transition-colors"
                    >
                      ✏️
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showAdd && <AddArrivalModal onClose={() => setShowAdd(false)} onAdd={addArrival} />}
      {editArr && <EditArrivalModal arrival={editArr} onClose={() => setEditArr(null)} onSave={(data) => updateArrival(editArr.id, data)} />}
    </div>
  );
}

function ExpenseTab() {
  const [viewMode, setViewMode] = useState<'byEmployee' | 'byPatient'>('byEmployee');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');

  const filteredExpenses = selectedEmployee === 'all' 
    ? expenses 
    : expenses.filter(e => e.employeeId === selectedEmployee);

  const empSummary = employees
    .filter(e => e.status === 'Активен')
    .map(emp => {
      const empExp = expenses.filter(e => e.employeeId === emp.id && e.month === currentMonth);
      const totalValue = empExp.reduce((s, e) => {
        const nom = nomenclature.find(n => n.id === e.nomenclatureId);
        return s + (nom ? nom.currentPrice * e.quantity : 0);
      }, 0);
      const patients = new Set(empExp.map(e => `${e.patientName}_${e.patientBirthDate}`));
      const arrival = getEmployeeArrival(emp.id, currentMonth);
      return { emp, totalValue, patients: patients.size, arrival, balance: arrival - totalValue };
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('byEmployee')}
            className={`px-3 py-1.5 rounded-lg text-sm ${viewMode === 'byEmployee' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}`}
          >
            По сотрудникам
          </button>
          <button
            onClick={() => setViewMode('byPatient')}
            className={`px-3 py-1.5 rounded-lg text-sm ${viewMode === 'byPatient' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}`}
          >
            По пациентам
          </button>
        </div>
        <select
          value={selectedEmployee}
          onChange={e => setSelectedEmployee(e.target.value)}
          className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="all">Все сотрудники</option>
          {employees.filter(e => e.status === 'Активен').map(emp => (
            <option key={emp.id} value={emp.id}>{emp.fullName}</option>
          ))}
        </select>
      </div>

      {viewMode === 'byEmployee' ? (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 text-left">
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Сотрудник</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Приход</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Расход</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Разница</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Пациентов</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-center">Статус</th>
              </tr>
            </thead>
            <tbody>
              {empSummary.map(({ emp, totalValue, patients, arrival, balance }) => (
                <tr key={emp.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                  <td className="px-5 py-3">
                    <div className="text-sm font-medium text-white">{emp.fullName}</div>
                    <div className="text-xs text-slate-400">{emp.position}</div>
                  </td>
                  <td className="px-5 py-3 text-right text-sm text-emerald-400">{arrival.toLocaleString('ru-RU')} ₽</td>
                  <td className="px-5 py-3 text-right text-sm text-blue-400">{totalValue.toLocaleString('ru-RU')} ₽</td>
                  <td className={`px-5 py-3 text-right text-sm font-semibold ${balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {balance.toLocaleString('ru-RU')} ₽
                  </td>
                  <td className="px-5 py-3 text-right text-sm text-white">{patients}</td>
                  <td className="px-5 py-3 text-center">
                    {balance < 0 ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400">Перерасход</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400">Норма</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 text-left">
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Дата</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Сотрудник</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Пациент</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Препарат</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Кол-во</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Сумма</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.slice(0, 50).map(exp => {
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
                    <td className="px-5 py-3 text-right text-sm text-emerald-400">
                      {nom ? (nom.currentPrice * exp.quantity).toLocaleString('ru-RU') : '0'} ₽
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredExpenses.length > 50 && (
            <div className="p-3 text-center text-sm text-slate-500">
              Показано 50 из {filteredExpenses.length} записей
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ReturnsTab() {
  const [rets, setRets] = useState<ReturnOperation[]>(initialReturns);

  const updateReturn = (id: string, status: ReturnStatus, correctedQty: number | null) => {
    setRets(rets.map(r => r.id === id ? { ...r, status, correctedBy: 'Руководитель', correctedQuantity: correctedQty } : r));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
          <span className="text-sm text-slate-400">Новые: {rets.filter(r => r.status === 'Новый').length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
          <span className="text-sm text-slate-400">Приняты: {rets.filter(r => r.status === 'Принят').length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-400"></span>
          <span className="text-sm text-slate-400">Скорректированы: {rets.filter(r => r.status === 'Скорректирован').length}</span>
        </div>
      </div>

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
              <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-center">Действия</th>
            </tr>
          </thead>
          <tbody>
            {rets.map(ret => {
              const emp = employees.find(e => e.id === ret.employeeId);
              const nom = nomenclature.find(n => n.id === ret.nomenclatureId);
              return (
                <tr key={ret.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                  <td className="px-5 py-3 text-sm text-slate-300">{ret.date}</td>
                  <td className="px-5 py-3 text-sm text-white">{emp?.fullName}</td>
                  <td className="px-5 py-3 text-sm text-slate-300">{nom?.name}</td>
                  <td className="px-5 py-3 text-right text-sm text-white">
                    {ret.quantity} {nom?.unit}
                    {ret.correctedQuantity !== null && ret.correctedQuantity !== ret.quantity && (
                      <span className="text-xs text-blue-400 ml-1">→ {ret.correctedQuantity}</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-400">{ret.reason}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      ret.status === 'Новый' ? 'bg-yellow-500/20 text-yellow-400' :
                      ret.status === 'Принят' ? 'bg-emerald-500/20 text-emerald-400' :
                      ret.status === 'Скорректирован' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>{ret.status}</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    {ret.status === 'Новый' && (
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => updateReturn(ret.id, 'Принят', ret.quantity)}
                          className="px-2 py-1 rounded bg-emerald-600/20 text-emerald-400 text-xs hover:bg-emerald-600/30"
                        >
                          ✓ Принять
                        </button>
                        <button
                          onClick={() => {
                            const qty = prompt('Скорректированное количество:', String(ret.quantity));
                            if (qty) updateReturn(ret.id, 'Скорректирован', parseInt(qty));
                          }}
                          className="px-2 py-1 rounded bg-blue-600/20 text-blue-400 text-xs hover:bg-blue-600/30"
                        >
                          ✏️ Изменить
                        </button>
                        <button
                          onClick={() => updateReturn(ret.id, 'Отклонён', null)}
                          className="px-2 py-1 rounded bg-red-600/20 text-red-400 text-xs hover:bg-red-600/30"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddArrivalModal({ onClose, onAdd }: { onClose: () => void; onAdd: (data: any) => void }) {
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
            <select
              value={form.employeeId}
              onChange={e => setForm({ ...form, employeeId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              {employees.filter(e => e.status === 'Активен').map(emp => (
                <option key={emp.id} value={emp.id}>{emp.fullName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Сумма прихода (₽)</label>
            <input
              type="number"
              value={form.amount || ''}
              onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="15000"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Количество смен</label>
            <input
              type="number"
              value={form.shifts || ''}
              onChange={e => setForm({ ...form, shifts: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="15"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Тип</label>
            <select
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option>Плановый</option>
              <option>Дополнительный</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Комментарий</label>
            <input
              type="text"
              value={form.comment}
              onChange={e => setForm({ ...form, comment: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Необязательно"
            />
          </div>
        </div>
        <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white">Отмена</button>
          <button
            onClick={() => onAdd(form)}
            disabled={form.amount <= 0}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg text-white font-medium"
          >
            Внести
          </button>
        </div>
      </div>
    </div>
  );
}

function EditArrivalModal({ arrival, onClose, onSave }: { arrival: Arrival; onClose: () => void; onSave: (data: Partial<Arrival>) => void }) {
  const [form, setForm] = useState({ amount: arrival.amount, shifts: arrival.shifts, comment: arrival.comment });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-bold text-white">Редактировать приход</h3>
          <p className="text-sm text-slate-400 mt-1">{arrival.date} • {employees.find(e => e.id === arrival.employeeId)?.fullName}</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Сумма (₽)</label>
            <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Смены</label>
            <input type="number" value={form.shifts} onChange={e => setForm({ ...form, shifts: parseInt(e.target.value) || 0 })}
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
          <button onClick={() => onSave(form)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium">Сохранить</button>
        </div>
      </div>
    </div>
  );
}
