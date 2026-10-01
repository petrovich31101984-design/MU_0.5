import { useState } from 'react';
import { employees, currentMonth, lastMonth, getEmployeeArrival, getEmployeeExpenseValue, getEmployeeCallsCount, getTotalDepartmentStock } from '../mockData';

export default function Reports() {
  const [selectedMonth, setSelectedMonth] = useState(lastMonth);
  const [reportType, setReportType] = useState<'monthly' | 'employee' | 'department'>('monthly');

  const activeEmployees = employees.filter(e => e.status !== 'Уволен');
  const totalDeptStock = getTotalDepartmentStock();

  const reportData = activeEmployees.map(emp => {
    const calls = getEmployeeCallsCount(emp.id, selectedMonth);
    const arrival = getEmployeeArrival(emp.id, selectedMonth);
    const expense = getEmployeeExpenseValue(emp.id, selectedMonth);
    const balance = arrival - expense;
    return { emp, calls, arrival, expense, balance };
  });

  const totals = {
    calls: reportData.reduce((s, r) => s + r.calls, 0),
    arrival: reportData.reduce((s, r) => s + r.arrival, 0),
    expense: reportData.reduce((s, r) => s + r.expense, 0),
    balance: reportData.reduce((s, r) => s + r.balance, 0),
  };

  const exportToCSV = () => {
    const headers = ['ФИО', 'Должность', 'Вызовы', 'Приход (₽)', 'Расход (₽)', 'Остаток (₽)'];
    const rows = reportData.map(r => [
      r.emp.fullName, r.emp.position, r.calls, r.arrival, r.expense, r.balance
    ]);
    const csv = [headers, ...rows].map(row => row.join(';')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Отчет_${selectedMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Отчёты</h2>
          <p className="text-slate-400 text-sm mt-1">Ежемесячные отчёты и экспорт данных</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2"
          >
            📊 Экспорт Excel
          </button>
          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2"
          >
            📄 Экспорт PDF
          </button>
        </div>
      </div>

      {/* Month selector */}
      <div className="flex flex-wrap gap-2">
        <input
          type="month"
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
        />
        <div className="flex bg-slate-800 rounded-lg border border-slate-700 p-1">
          <button
            onClick={() => setReportType('monthly')}
            className={`px-3 py-1.5 rounded-md text-sm ${reportType === 'monthly' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
          >
            Общий
          </button>
          <button
            onClick={() => setReportType('department')}
            className={`px-3 py-1.5 rounded-md text-sm ${reportType === 'department' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
          >
            Подразделение
          </button>
        </div>
      </div>

      {reportType === 'monthly' && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <div className="text-xs text-slate-400">Общий приход</div>
              <div className="text-xl font-bold text-emerald-400 mt-1">{totals.arrival.toLocaleString('ru-RU')} ₽</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <div className="text-xs text-slate-400">Общий расход</div>
              <div className="text-xl font-bold text-blue-400 mt-1">{totals.expense.toLocaleString('ru-RU')} ₽</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <div className="text-xs text-slate-400">Остаток подразд.</div>
              <div className="text-xl font-bold text-purple-400 mt-1">{totalDeptStock.toLocaleString('ru-RU')} ₽</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <div className="text-xs text-slate-400">Всего вызовов</div>
              <div className="text-xl font-bold text-white mt-1">{totals.calls}</div>
            </div>
          </div>

          {/* Report table */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="p-5 border-b border-slate-700">
              <h3 className="text-lg font-bold text-white">
                📋 Отчёт за {selectedMonth}
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Сформирован: {new Date().toLocaleDateString('ru-RU')} | Подразделение: Выездное под. №1
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700 text-left">
                    <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">№</th>
                    <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">ФИО сотрудника</th>
                    <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Кол-во вызовов</th>
                    <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Приход (₽)</th>
                    <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Расход (₽)</th>
                    <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Остаток (₽)</th>
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
                    <td className="px-5 py-3" colSpan={2}>
                      <span className="text-sm text-white">ИТОГО</span>
                    </td>
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

          {/* Department total */}
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-5 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-white">💼 Общий остаток на подразделение</h4>
                <p className="text-sm text-slate-400">На начало следующего месяца</p>
              </div>
              <div className="text-3xl font-bold text-purple-300">
                {totalDeptStock.toLocaleString('ru-RU')} ₽
              </div>
            </div>
          </div>
        </>
      )}

      {reportType === 'department' && (
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">📊 Сводный отчёт по подразделению</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-400 mb-3">Финансовые показатели</h4>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-700/50">
                    <span className="text-sm text-slate-300">Общий приход</span>
                    <span className="text-sm font-semibold text-emerald-400">{totals.arrival.toLocaleString('ru-RU')} ₽</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-700/50">
                    <span className="text-sm text-slate-300">Общий расход</span>
                    <span className="text-sm font-semibold text-blue-400">{totals.expense.toLocaleString('ru-RU')} ₽</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-700/50">
                    <span className="text-sm text-slate-300">Разница (приход - расход)</span>
                    <span className={`text-sm font-semibold ${totals.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {totals.balance.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-slate-300">Остаток на подразделение</span>
                    <span className="text-sm font-semibold text-purple-400">{totalDeptStock.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-400 mb-3">Операционные показатели</h4>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-700/50">
                    <span className="text-sm text-slate-300">Всего вызовов</span>
                    <span className="text-sm font-semibold text-white">{totals.calls}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-700/50">
                    <span className="text-sm text-slate-300">Среднее вызовов/сотрудник</span>
                    <span className="text-sm font-semibold text-white">
                      {activeEmployees.length > 0 ? Math.round(totals.calls / activeEmployees.length) : 0}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-700/50">
                    <span className="text-sm text-slate-300">Средний расход/сотрудник</span>
                    <span className="text-sm font-semibold text-white">
                      {activeEmployees.length > 0 ? Math.round(totals.expense / activeEmployees.length).toLocaleString('ru-RU') : 0} ₽
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-slate-300">Сотрудников с перерасходом</span>
                    <span className="text-sm font-semibold text-red-400">
                      {reportData.filter(r => r.balance < 0).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart placeholder */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">📈 Распределение расхода по сотрудникам</h3>
            <div className="space-y-3">
              {reportData
                .sort((a, b) => b.expense - a.expense)
                .map(row => {
                  const maxExpense = Math.max(...reportData.map(r => r.expense));
                  const pct = maxExpense > 0 ? (row.expense / maxExpense * 100) : 0;
                  return (
                    <div key={row.emp.id} className="flex items-center gap-3">
                      <div className="w-40 text-sm text-slate-300 truncate">{row.emp.fullName.split(' ').slice(0, 2).join(' ')}</div>
                      <div className="flex-1 h-6 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${row.balance < 0 ? 'bg-red-500' : 'bg-blue-500'}`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                      <div className="w-24 text-right text-sm text-white">{row.expense.toLocaleString('ru-RU')} ₽</div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
