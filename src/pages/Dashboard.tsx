import { employees, nomenclature, arrivals, expenses, returns, notifications, currentMonth, getEmployeeArrival, getEmployeeExpenseValue, getEmployeeCallsCount, getTotalDepartmentStock, getTotalDepartmentStockItems } from '../mockData';

interface Props {
  onNavigate: (page: any) => void;
}

export default function Dashboard({ onNavigate }: Props) {
  const activeEmployees = employees.filter(e => e.status === 'Активен');
  const totalArrival = activeEmployees.reduce((s, e) => s + getEmployeeArrival(e.id, currentMonth), 0);
  const totalExpense = activeEmployees.reduce((s, e) => s + getEmployeeExpenseValue(e.id, currentMonth), 0);
  const totalBalance = totalArrival - totalExpense;
  const totalCalls = activeEmployees.reduce((s, e) => s + getEmployeeCallsCount(e.id, currentMonth), 0);
  const totalPatients = activeEmployees.reduce((s, e) => {
    const patients = new Set(expenses.filter(exp => exp.employeeId === e.id && exp.month === currentMonth).map(exp => `${exp.patientName}_${exp.patientBirthDate}`));
    return s + patients.size;
  }, 0);
  const totalDeptStock = getTotalDepartmentStock();
  const totalDeptItems = getTotalDepartmentStockItems();
  const pendingReturns = returns.filter(r => r.status === 'Новый').length;
  const unreadNotifs = notifications.filter(n => !n.read).length;

  // Сотрудники с перерасходом
  const overconsumption = activeEmployees.filter(e => {
    const arr = getEmployeeArrival(e.id, currentMonth);
    const exp = getEmployeeExpenseValue(e.id, currentMonth);
    return exp > arr;
  });

  // Неактивные (>7 дней)
  const inactive = activeEmployees.filter(e => {
    const lastDate = new Date(e.lastActivity);
    const diff = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
    return diff > 7;
  });

  const stats = [
    { label: 'Общий приход', value: `${totalArrival.toLocaleString('ru-RU')} ₽`, icon: '💰', color: 'emerald', change: '+12%' },
    { label: 'Общий расход', value: `${totalExpense.toLocaleString('ru-RU')} ₽`, icon: '📤', color: 'blue', change: '+8%' },
    { label: 'Остаток', value: `${totalBalance.toLocaleString('ru-RU')} ₽`, icon: '📊', color: totalBalance >= 0 ? 'emerald' : 'red', change: '' },
    { label: 'Остаток на подразделение', value: `${totalDeptStock.toLocaleString('ru-RU')} ₽`, icon: '📦', color: 'purple', change: `${totalDeptItems} ед.` },
  ];

  const secondaryStats = [
    { label: 'Сотрудников активно', value: activeEmployees.length, total: employees.length, icon: '👥' },
    { label: 'Вызовов за месяц', value: totalCalls, icon: '🚑' },
    { label: 'Пациентов за месяц', value: totalPatients, icon: '🏥' },
    { label: 'Позиций номенклатуры', value: nomenclature.filter(n => n.active).length, icon: '💊' },
  ];

  return (
    <div className="space-y-6">
      {/* Alert banners */}
      {(overconsumption.length > 0 || inactive.length > 0 || pendingReturns > 0) && (
        <div className="space-y-3">
          {overconsumption.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <span className="text-red-300 font-semibold">Перерасход:</span>
                <span className="text-red-200 ml-2">
                  {overconsumption.map(e => e.fullName.split(' ')[0]).join(', ')}
                </span>
              </div>
              <button onClick={() => onNavigate('operations')} className="px-3 py-1 bg-red-600/30 rounded-lg text-sm text-red-300 hover:bg-red-600/50">
                Подробнее
              </button>
            </div>
          )}
          {inactive.length > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">🔴</span>
              <div className="flex-1">
                <span className="text-yellow-300 font-semibold">Неактивны 7+ дней:</span>
                <span className="text-yellow-200 ml-2">
                  {inactive.map(e => e.fullName.split(' ')[0]).join(', ')}
                </span>
              </div>
              <button onClick={() => onNavigate('employees')} className="px-3 py-1 bg-yellow-600/30 rounded-lg text-sm text-yellow-300 hover:bg-yellow-600/50">
                Подробнее
              </button>
            </div>
          )}
          {pendingReturns > 0 && (
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">↩️</span>
              <div className="flex-1">
                <span className="text-orange-300 font-semibold">Ожидают обработки возвратов:</span>
                <span className="text-orange-200 ml-2">{pendingReturns}</span>
              </div>
              <button onClick={() => onNavigate('operations')} className="px-3 py-1 bg-orange-600/30 rounded-lg text-sm text-orange-300 hover:bg-orange-600/50">
                Обработать
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-slate-600 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              {stat.change && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  stat.color === 'red' ? 'bg-red-500/20 text-red-400' :
                  stat.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {stat.change}
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {secondaryStats.map((stat, i) => (
          <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-3">
              <span className="text-xl">{stat.icon}</span>
              <div>
                <div className="text-xl font-bold text-white">
                  {stat.value}
                  {'total' in stat && <span className="text-sm text-slate-500 font-normal"> / {stat.total}</span>}
                </div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Employee overview table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-5 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">📊 Сводка по сотрудникам ({currentMonth})</h3>
          <button onClick={() => onNavigate('employees')} className="text-sm text-blue-400 hover:text-blue-300">
            Все сотрудники →
          </button>
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
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-center">Статус</th>
              </tr>
            </thead>
            <tbody>
              {employees.filter(e => e.status !== 'Уволен').map(emp => {
                const arr = getEmployeeArrival(emp.id, currentMonth);
                const exp = getEmployeeExpenseValue(emp.id, currentMonth);
                const bal = arr - exp;
                const calls = getEmployeeCallsCount(emp.id, currentMonth);
                const isOver = exp > arr;
                
                return (
                  <tr key={emp.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          emp.status === 'Активен' ? 'bg-emerald-600' :
                          emp.status === 'Отпуск' ? 'bg-yellow-600' : 'bg-slate-600'
                        }`}>
                          {emp.fullName[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{emp.fullName}</div>
                          <div className="text-xs text-slate-400">{emp.position}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        emp.status === 'Активен' ? 'bg-emerald-500/20 text-emerald-400' :
                        emp.status === 'Отпуск' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-sm text-white">{calls}</td>
                    <td className="px-5 py-3 text-right text-sm text-emerald-400">{arr.toLocaleString('ru-RU')} ₽</td>
                    <td className="px-5 py-3 text-right text-sm text-blue-400">{exp.toLocaleString('ru-RU')} ₽</td>
                    <td className={`px-5 py-3 text-right text-sm font-semibold ${bal >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {bal.toLocaleString('ru-RU')} ₽
                    </td>
                    <td className="px-5 py-3 text-center">
                      {isOver && <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400">Перерасход</span>}
                      {!isOver && emp.status === 'Активен' && <span className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-emerald-400">Норма</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-5 border-b border-slate-700">
            <h3 className="text-lg font-bold text-white">🔔 Последние уведомления</h3>
          </div>
          <div className="divide-y divide-slate-700/50">
            {notifications.slice(0, 5).map(notif => (
              <div key={notif.id} className={`p-4 ${!notif.read ? 'bg-blue-900/10' : ''}`}>
                <div className="flex items-start gap-3">
                  <span className="text-lg">
                    {notif.type === 'overconsumption' && '⚠️'}
                    {notif.type === 'inactive' && '🔴'}
                    {notif.type === 'return' && '↩️'}
                    {notif.type === 'message' && '💬'}
                    {notif.type === 'report' && '📊'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">{notif.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{notif.message}</div>
                    <div className="text-xs text-slate-500 mt-1">{notif.date}</div>
                  </div>
                  {!notif.read && <span className="w-2 h-2 bg-blue-400 rounded-full mt-2"></span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-5 border-b border-slate-700 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">📈 Топ сотрудников по вызовам</h3>
          </div>
          <div className="divide-y divide-slate-700/50">
            {employees
              .filter(e => e.status === 'Активен')
              .map(e => ({ ...e, calls: getEmployeeCallsCount(e.id, currentMonth) }))
              .sort((a, b) => b.calls - a.calls)
              .slice(0, 5)
              .map((emp, i) => (
                <div key={emp.id} className="p-4 flex items-center gap-4">
                  <span className="text-lg font-bold text-slate-500 w-6">{i + 1}</span>
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {emp.fullName[0]}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{emp.fullName}</div>
                    <div className="text-xs text-slate-400">{emp.position}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-400">{emp.calls}</div>
                    <div className="text-xs text-slate-500">вызовов</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
