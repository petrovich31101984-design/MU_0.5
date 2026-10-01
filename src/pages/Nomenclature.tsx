import { useState } from 'react';
import { nomenclature as initialNomenclature } from '../mockData';
import { NomenclatureItem, NomenclatureCategory, Unit } from '../types';

export default function Nomenclature() {
  const [items, setItems] = useState<NomenclatureItem[]>(initialNomenclature);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<NomenclatureItem | null>(null);

  const filtered = items.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const addItem = (data: Partial<NomenclatureItem>) => {
    const newItem: NomenclatureItem = {
      id: `NOM-${String(items.length + 1).padStart(3, '0')}`,
      name: data.name || '',
      category: data.category || 'Лекарство',
      unit: data.unit || 'Штуки',
      manufacturer: data.manufacturer || '',
      active: true,
      currentPrice: data.currentPrice || 0,
    };
    setItems([...items, newItem]);
    setShowAddModal(false);
  };

  const updatePrice = (id: string, price: number) => {
    setItems(items.map(item => item.id === id ? { ...item, currentPrice: price } : item));
  };

  const toggleActive = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, active: !item.active } : item));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Номенклатура</h2>
          <p className="text-slate-400 text-sm mt-1">Лекарства, оборудование и расходные материалы</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
        >
          <span>+</span> Добавить позицию
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-2xl font-bold text-emerald-400">{items.filter(i => i.category === 'Лекарство').length}</div>
          <div className="text-xs text-slate-400">Лекарств</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-2xl font-bold text-blue-400">{items.filter(i => i.category === 'Оборудование').length}</div>
          <div className="text-xs text-slate-400">Оборудования</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-2xl font-bold text-purple-400">{items.filter(i => i.category === 'Расходный материал').length}</div>
          <div className="text-xs text-slate-400">Расходных материалов</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">Все категории</option>
          <option value="Лекарство">Лекарства</option>
          <option value="Оборудование">Оборудование</option>
          <option value="Расходный материал">Расходные материалы</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 text-left">
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Название</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Категория</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Ед. изм.</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase">Производитель</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-right">Цена (₽)</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-center">Статус</th>
                <th className="px-5 py-3 text-xs font-medium text-slate-400 uppercase text-center">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                  <td className="px-5 py-3">
                    <div className="text-sm font-medium text-white">{item.name}</div>
                    <div className="text-xs text-slate-500 font-mono">{item.id}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.category === 'Лекарство' ? 'bg-emerald-500/20 text-emerald-400' :
                      item.category === 'Оборудование' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-300">{item.unit}</td>
                  <td className="px-5 py-3 text-sm text-slate-400">{item.manufacturer || '-'}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      {item.currentPrice.toLocaleString('ru-RU')} ₽
                    </button>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => toggleActive(item.id)}
                      className={`px-2 py-1 rounded-full text-xs transition-colors ${
                        item.active ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-slate-500/20 text-slate-400 hover:bg-slate-500/30'
                      }`}
                    >
                      {item.active ? 'Активна' : 'Неактивна'}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="p-1.5 rounded bg-slate-700 text-slate-400 hover:bg-blue-600/30 hover:text-blue-400 transition-colors"
                      title="Редактировать"
                    >
                      ✏️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && <AddItemModal onClose={() => setShowAddModal(false)} onAdd={addItem} />}

      {/* Edit Price Modal */}
      {editingItem && (
        <EditPriceModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={(price) => { updatePrice(editingItem.id, price); setEditingItem(null); }}
        />
      )}
    </div>
  );
}

function AddItemModal({ onClose, onAdd }: { onClose: () => void; onAdd: (data: any) => void }) {
  const [form, setForm] = useState({
    name: '',
    category: 'Лекарство' as NomenclatureCategory,
    unit: 'Штуки' as Unit,
    manufacturer: '',
    currentPrice: 0,
  });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-bold text-white">Добавить позицию</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Название *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Например: Адреналин 0.1% 1мл"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Категория</label>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value as NomenclatureCategory })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option>Лекарство</option>
              <option>Оборудование</option>
              <option>Расходный материал</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Единица измерения</label>
            <select
              value={form.unit}
              onChange={e => setForm({ ...form, unit: e.target.value as Unit })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option>Ампулы</option>
              <option>Таблетки</option>
              <option>Флаконы</option>
              <option>Штуки</option>
              <option>Упаковки</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Производитель</label>
            <input
              type="text"
              value={form.manufacturer}
              onChange={e => setForm({ ...form, manufacturer: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Фармстандарт"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Цена за единицу (₽) *</label>
            <input
              type="number"
              value={form.currentPrice}
              onChange={e => setForm({ ...form, currentPrice: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="0.00"
              step="0.01"
            />
          </div>
        </div>
        <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors">
            Отмена
          </button>
          <button
            onClick={() => onAdd(form)}
            disabled={!form.name || form.currentPrice <= 0}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg text-white font-medium transition-colors"
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
}

function EditPriceModal({ item, onClose, onSave }: { item: NomenclatureItem; onClose: () => void; onSave: (price: number) => void }) {
  const [newPrice, setNewPrice] = useState(item.currentPrice);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-bold text-white">Изменить цену</h3>
          <p className="text-sm text-slate-400 mt-1">{item.name}</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="text-sm text-slate-400">Текущая цена</div>
            <div className="text-2xl font-bold text-emerald-400">{item.currentPrice.toLocaleString('ru-RU')} ₽</div>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Новая цена (₽)</label>
            <input
              type="number"
              value={newPrice}
              onChange={e => setNewPrice(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              step="0.01"
            />
          </div>
          {newPrice !== item.currentPrice && (
            <div className={`text-sm p-3 rounded-lg ${newPrice > item.currentPrice ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
              {newPrice > item.currentPrice ? '📈' : '📉'} Изменение: {((newPrice - item.currentPrice) / item.currentPrice * 100).toFixed(1)}%
            </div>
          )}
          <div className="text-xs text-slate-500 bg-slate-900 rounded-lg p-3">
            ⚠️ Изменение цены повлияет на расчёт остатков в рублях для всех сотрудников. Старая цена будет сохранена в истории.
          </div>
        </div>
        <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors">
            Отмена
          </button>
          <button
            onClick={() => onSave(newPrice)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium transition-colors"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
