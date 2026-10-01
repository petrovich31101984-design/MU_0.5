import { useState } from 'react';
import { employees, nomenclature, currentMonth, getEmployeeStock, getTotalDepartmentStock, getTotalDepartmentStockItems } from '../mockData';

export default function Stock() {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'byEmployee' | 'byNomenclature'>('byEmployee');

  const totalDeptValue = getTotalDepartmentStock();
  const totalDeptItems = getTotalDepartmentStockItems();

  const activeEmployees = employees.filter(e => e.status === 'Активен');

  // Остатки по номенклатуре (суммарно по всем сотрудникам)
  const stockByNomenclature = () => {
    const map: Record<string, { qty: number; value: number; name: string; unit: string; price: number }> = {};
    activeEmployees.forEach(emp => {
      const stock = getEmployeeStock(emp.id);
      stock.forEach(item => {
        if (!map[item.nomId]) {
          map[item.nomId] = { qty: 0, value: 0, name: item.name, unit: item.unit, price: item.price };
        }
        map[item.nomId].qty += item.qty;
        map[item.nomId].value += item.value;
      });
    });
    return Object.entries(map)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.value - a.value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Остатки</h2>
        <p className="text-slate-400 text-sm mt-1">Остатки препаратов на руках у сотрудников и на подразделение</p>
      </div>

      {/* Total department stock */}
      <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/10 rounded-2xl p-6 border border-purple-500/30">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-3xl">📦</span>
          <div>
            <h3 className="text-lg font-bold text-white">Общий остаток на подразделение</h3>
            <p className="text-sm text-slate-400">Период: {currentMonth}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-300">{totalDeptValue.toLocaleString('ru-RU')} ₽</div>
            <div className="text-xs text-slate-400 mt-1">Общая стоимость</div>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-300">{totalDeptItems.toLocaleString('ru-RU')}</div>
            <div className="text-xs text-slate-400 mt-1">Единиц всего</div>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-300">{activeEmployees.length}</div>
            <div className="text-xs text-slate-400 mt-1">Сотрудников</div>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-300">
              {activeEmployees.length > 0 ? Math.round(totalDeptValue / activeEmployees.length).toLocaleString('ru-RU') : 0} ₽
            </div>
            <div className="text-xs text-slate-400 mt-1">Среднее на сотрудника</div>
          </div>
        </div>
      </div>

      {/* View mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('byEmployee')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            viewMode === 'byEmployee' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
          }`}
        >
          👥 По сотрудникам
        </button>
        <button
          onClick={() => setViewMode('byNomenclature')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            viewMode === 'byNomenclature' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
          }`}
        >
          💊 По номенклатуре
        </button>
      </div>

      {viewMode === 'byEmployee' ? (
        <div className="space-y-4">
          {/* Employee selector */}
          <select
            value={selectedEmployee}
            onChange={e => setSelectedEmployee(e.target.value)}
            className="w-full md:w-auto px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">Все сотрудники (сводка)</option>
            {activeEmployees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.fullName}</option>
            ))}
          </select>

          {selectedEmployee === 'all' ? (
            // Сводка по всем сотрудникам
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700 text-left">
                    <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Сотрудник</th>
                    <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Позиций</th>
                    <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Единиц</th>
                    <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Стоимость (₽)</th>
                    <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Доля</th>
                  </tr>
                </thead>
                <tbody>
                  {activeEmployees.map(emp => {
                    const stock = getEmployeeStock(emp.id);
                    const totalItems = stock.reduce((s, i) => s + i.qty, 0);
                    const totalValue = stock.reduce((s, i) => s + i.value, 0);
                    const share = totalDeptValue > 0 ? (totalValue / totalDeptValue * 100) : 0;
                    
                    return (
                      <tr key={emp.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-sm font-bold">
                              {emp.fullName[0]}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">{emp.fullName}</div>
                              <div className="text-xs text-slate-400">{emp.position}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-right text-sm text-white">{stock.length}</td>
                        <td className="px-5 py-3 text-right text-sm text-blue-400">{totalItems}</td>
                        <td className="px-5 py-3 text-right text-sm font-semibold text-emerald-400">{totalValue.toLocaleString('ru-RU')} ₽</td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${share}%` }}></div>
                            </div>
                            <span className="text-xs text-slate-400">{share.toFixed(1)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            // Детальный остаток конкретного сотрудника
            <EmployeeStockDetail employeeId={selectedEmployee} />
          )}
        </div>
      ) : (
        // По номенклатуре
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 text-left">
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Препарат</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Категория</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Кол-во</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Цена/ед.</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Стоимость</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Доля</th>
              </tr>
            </thead>
            <tbody>
              {stockByNomenclature().map(item => {
                const nom = nomenclature.find(n => n.id === item.id);
                const share = totalDeptValue > 0 ? (item.value / totalDeptValue * 100) : 0;
                return (
                  <tr key={item.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                    <td className="px-5 py-3">
                      <div className="text-sm font-medium text-white">{item.name}</div>
                      <div className="text-xs text-slate-500 font-mono">{item.id}</div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        nom?.category === 'Лекарство' ? 'bg-emerald-500/20 text-emerald-400' :
                        nom?.category === 'Оборудование' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>{nom?.category}</span>
                    </td>
                    <td className="px-5 py-3 text-right text-sm text-white">{item.qty} {item.unit}</td>
                    <td className="px-5 py-3 text-right text-sm text-slate-300">{item.price.toLocaleString('ru-RU')} ₽</td>
                    <td className="px-5 py-3 text-right text-sm font-semibold text-emerald-400">{item.value.toLocaleString('ru-RU')} ₽</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${share}%` }}></div>
                        </div>
                        <span className="text-xs text-slate-400">{share.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EmployeeStockDetail({ employeeId }: { employeeId: string }) {
  const emp = employees.find(e => e.id === employeeId);
  const stock = getEmployeeStock(employeeId);
  const totalItems = stock.reduce((s, i) => s + i.qty, 0);
  const totalValue = stock.reduce((s, i) => s + i.value, 0);

  if (!emp) return null;

  return (
    <div className="space-y-4">
      <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-lg font-bold">
            {emp.fullName[0]}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{emp.fullName}</h3>
            <p className="text-sm text-slate-400">{emp.position} • {totalItems} ед. • {totalValue.toLocaleString('ru-RU')} ₽</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
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
            {stock.sort((a, b) => b.value - a.value).map(item => (
              <tr key={item.nomId} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                <td className="px-5 py-3">
                  <div className="text-sm text-white">{item.name}</div>
                  <div className="text-xs text-slate-500">{item.unit}</div>
                </td>
                <td className="px-5 py-3 text-right text-sm text-white">{item.qty}</td>
                <td className="px-5 py-3 text-right text-sm text-slate-300">{item.price.toLocaleString('ru-RU')} ₽</td>
                <td className="px-5 py-3 text-right text-sm font-semibold text-emerald-400">{item.value.toLocaleString('ru-RU')} ₽</td>
              </tr>
            ))}
            <tr className="bg-slate-900/50">
              <td className="px-5 py-3 text-sm font-bold text-white">ИТОГО</td>
              <td className="px-5 py-3 text-right text-sm font-bold text-blue-400">{totalItems}</td>
              <td className="px-5 py-3"></td>
              <td className="px-5 py-3 text-right text-sm font-bold text-emerald-400">{totalValue.toLocaleString('ru-RU')} ₽</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
