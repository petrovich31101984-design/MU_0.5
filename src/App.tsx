import { useState, useEffect } from 'react';

type Tab = 'overview' | 'roles' | 'architecture' | 'database' | 'flows' | 'features' | 'roadmap' | 'setup';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Обзор', icon: '📋' },
    { id: 'roles', label: 'Роли', icon: '👥' },
    { id: 'architecture', label: 'Архитектура', icon: '🏗️' },
    { id: 'database', label: 'База данных', icon: '🗄️' },
    { id: 'flows', label: 'Потоки данных', icon: '🔄' },
    { id: 'features', label: 'Функции', icon: '⚙️' },
    { id: 'roadmap', label: 'Дорожная карта', icon: '🗺️' },
    { id: 'setup', label: 'Установка БД', icon: '🚀' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center text-xl">
              💊
            </div>
            <div>
              <h1 className="text-xl font-bold">Система учёта лекарственных средств</h1>
              <p className="text-sm text-blue-300">Концепция проекта • Выездное подразделение</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/10 backdrop-blur-sm overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-blue-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'roles' && <RolesTab />}
        {activeTab === 'architecture' && <ArchitectureTab />}
        {activeTab === 'database' && <DatabaseTab />}
        {activeTab === 'flows' && <FlowsTab />}
        {activeTab === 'features' && <FeaturesTab />}
        {activeTab === 'roadmap' && <RoadmapTab />}
        {activeTab === 'setup' && <SetupTab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-blue-400">
          Концептуальная документация • Версия 1.0 • {new Date().toLocaleDateString('ru-RU')}
        </div>
      </footer>
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-8">
      <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold mb-4 text-emerald-400">🎯 Цель проекта</h2>
        <p className="text-lg text-blue-100 leading-relaxed">
          Создание единой системы учёта лекарственных средств, оборудования и расходных материалов 
          для выездного подразделения медицинской помощи. Система обеспечивает полный цикл: 
          от поступления препаратов на склад до их использования у пациента, с контролем остатков, 
          финансовых показателей и коммуникацией между участниками.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-xl p-6 border border-emerald-500/30">
          <div className="text-3xl mb-3">👨‍💼</div>
          <h3 className="text-lg font-bold text-emerald-300 mb-2">Руководитель</h3>
          <p className="text-sm text-blue-200">Веб-приложение. Полный контроль: приход, расход, остатки, сотрудники, отчёты, уведомления.</p>
          <div className="mt-3 text-xs text-emerald-400">Платформа: Desktop Web</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl p-6 border border-purple-500/30">
          <div className="text-3xl mb-3">📦</div>
          <h3 className="text-lg font-bold text-purple-300 mb-2">Кладовщик</h3>
          <p className="text-sm text-blue-200">Веб-приложение. Просмотр расхода, внесение прихода, управление ценами, чат с сотрудниками.</p>
          <div className="mt-3 text-xs text-purple-400">Платформа: Desktop Web</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-xl p-6 border border-orange-500/30">
          <div className="text-3xl mb-3">📱</div>
          <h3 className="text-lg font-bold text-orange-300 mb-2">Сотрудники (30 чел.)</h3>
          <p className="text-sm text-blue-200">Мобильное приложение (PWA). Ввод расхода по пациентам, история, чат. Офлайн-режим.</p>
          <div className="mt-3 text-xs text-orange-400">Платформа: PWA (Android/iOS)</div>
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold mb-4 text-blue-400">📊 Ключевые метрики</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard value="30" label="Сотрудников" />
          <MetricCard value="3" label="Роли пользователей" />
          <MetricCard value="Google Sheets" label="Хранилище данных" />
          <MetricCard value="PWA" label="Мобильная платформа" />
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">⚡ Ключевые принципы</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <PrincipleItem icon="🔒" title="Единая база данных" desc="Все приложения работают с одной Google таблицей" />
          <PrincipleItem icon="📴" title="Офлайн-режим" desc="Сотрудники работают без сети до 72 часов" />
          <PrincipleItem icon="📝" title="Версионность" desc="Каждое изменение фиксируется: кто, когда, что" />
          <PrincipleItem icon="💰" title="Финансовый контроль" desc="Приход, расход, остаток в рублях и штуках" />
          <PrincipleItem icon="🔄" title="Пересчёт по ценам" desc="Остаток в рублях пересчитывается при изменении цен" />
          <PrincipleItem icon="📤" title="Экспорт" desc="Отчёты в PDF и Excel по запросу" />
        </div>
      </div>
    </div>
  );
}

function RolesTab() {
  return (
    <div className="space-y-8">
      {/* Руководитель */}
      <RoleSection
        title="Руководитель выездного подразделения"
        platform="Веб-приложение (Desktop)"
        color="emerald"
        icon="👨‍💼"
        permissions={[
          'Внесение названий лекарств и оборудования',
          'Установка цен на позиции номенклатуры',
          'Простановка количества смен',
          'Простановка прихода (₽) по лекарствам и оборудованию на каждого сотрудника',
          'Изменение архивных данных',
          'Добавление/удаление сотрудников в любой период',
          'Отправка сообщений сотрудникам',
          'Корректировка операций «Возврат»',
          'Блокировка аккаунта сотрудника (при утере телефона)',
          'Внесение остатков при первом подключении сотрудника',
          'Получение отчёта 5-го числа за предыдущий месяц',
          'Просмотр остатков на руках у сотрудников (шт. и ₽)',
          'Просмотр общего остатка на подразделение',
          'Просмотр количества пациентов у каждого сотрудника',
        ]}
        notifications={[
          'Перерасход у сотрудника (расход > приход)',
          'Сотрудник не вносит расход 7+ дней',
          'Операция «Возврат» от сотрудника',
          'Ежемесячный отчёт (5-го числа)',
        ]}
        reports={[
          'ФИО сотрудника',
          'Количество вызовов',
          'Приход (₽)',
          'Расход (₽)',
          'Остаток (₽)',
          'Общий остаток на подразделение (₽)',
        ]}
      />

      {/* Кладовщик */}
      <RoleSection
        title="Кладовщик"
        platform="Веб-приложение (Desktop)"
        color="purple"
        icon="📦"
        permissions={[
          'Просмотр расхода в штуках',
          'Внесение изменений по приходу (₽)',
          'Проставление цен на лекарства и оборудование',
          'Изменение цен на лекарства',
          'Общение в чате с сотрудниками',
          'Просмотр расхода лекарств на каждого пациента (ФИО + ДР)',
          'Корректировка операций «Возврат»',
        ]}
        notifications={[
          'Операция «Возврат» от сотрудника',
          'Сообщения от сотрудников в чате',
        ]}
        reports={[]}
      />

      {/* Сотрудник */}
      <RoleSection
        title="Сотрудник (медицинский работник)"
        platform="PWA (Android / iOS)"
        color="orange"
        icon="📱"
        permissions={[
          'Авторизация по персональному номеру + пароль',
          'Сохранение учётных данных для повторных входов',
          'Отправка расхода (в штуках) через смартфон',
          'Ввод расхода лекарств на каждого пациента (ФИО + дата рождения)',
          'Свободный ввод ФИО пациента',
          'Просмотр истории своих расходов за текущий месяц',
          'Редактирование расхода на пациента (количество)',
          'Просмотр количества пациентов за месяц',
          'Доступ к архиву за каждый месяц (только количество, без финансов)',
          'Ответы на сообщения руководителя',
          'Отправка сообщений кладовщику',
          'Внесение остатков при первом подключении (в штуках)',
          'Операция «Возврат» на склад',
        ]}
        notifications={[
          'Сообщения от руководителя',
          'Приветственное сообщение при первом входе',
          'Сообщение об увольнении при открытии приложения',
        ]}
        reports={[]}
      />

      {/* Ограничения */}
      <div className="bg-red-500/10 rounded-2xl p-8 border border-red-500/30">
        <h2 className="text-xl font-bold mb-4 text-red-400">🚫 Ограничения по ролям</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-black/20 rounded-lg p-4">
            <h4 className="font-bold text-orange-300 mb-2">Сотрудник НЕ видит:</h4>
            <ul className="text-sm text-blue-200 space-y-1">
              <li>• Свои остатки в рублях</li>
              <li>• Финансовую составляющую</li>
              <li>• Данные других сотрудников</li>
              <li>• Цены на препараты</li>
            </ul>
          </div>
          <div className="bg-black/20 rounded-lg p-4">
            <h4 className="font-bold text-purple-300 mb-2">Кладовщик НЕ может:</h4>
            <ul className="text-sm text-blue-200 space-y-1">
              <li>• Управлять сотрудниками</li>
              <li>• Видеть финансовые итоги</li>
              <li>• Блокировать аккаунты</li>
              <li>• Формировать отчёты</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArchitectureTab() {
  return (
    <div className="space-y-8">
      <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold mb-6 text-blue-400">🏗️ Общая архитектура системы</h2>
        
        {/* Architecture Diagram */}
        <div className="bg-black/30 rounded-xl p-6 font-mono text-sm overflow-x-auto">
          <pre className="text-blue-200 leading-relaxed">
{`┌─────────────────────────────────────────────────────────────────────────┐
│                        GOOGLE SHEETS (База данных)                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │Сотрудники│ │Номенклат.│ │ Приход   │ │ Расход   │ │   Журнал     │  │
│  │  (Sheet) │ │  (Sheet) │ │  (Sheet) │ │  (Sheet) │ │  изменений   │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │  Цены    │ │ Остатки  │ │ Пациенты │ │  Чат     │ │   Возвраты   │  │
│  │  (Sheet) │ │  (Sheet) │ │  (Sheet) │ │  (Sheet) │ │   (Sheet)    │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │   API Слой      │
                    │ (Google Sheets  │
                    │    API v4)      │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────┴───────┐ ┌───┴────┐ ┌──────┴───────┐
     │   Руководитель  │ │Кладовщ.│ │  Сотрудники  │
     │   (Web App)     │ │(Web)   │ │  (PWA)       │
     │                 │ │        │ │              │
     │ • React + Vite  │ │• React │ │ • React PWA  │
     │ • Tailwind CSS  │ │+ Vite  │ │ • Offline    │
     │ • Desktop       │ │        │ │ • IndexedDB  │
     └─────────────────┘ └────────┘ └──────────────┘`}
          </pre>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-emerald-400 mb-4">🔧 Технологический стек</h3>
          <div className="space-y-3">
            <TechItem name="Frontend (Web)" items={['React 18+', 'TypeScript', 'Vite', 'Tailwind CSS']} />
            <TechItem name="Frontend (Mobile PWA)" items={['React + PWA', 'Service Worker', 'IndexedDB', 'Background Sync API']} />
            <TechItem name="Backend / API" items={['Google Sheets API v4', 'Google Apps Script (Webhook)', 'OAuth 2.0']} />
            <TechItem name="Хранилище" items={['Google Sheets (основное)', 'IndexedDB (офлайн-кэш)', 'Service Worker Cache']} />
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-yellow-400 mb-4">📐 Принципы проектирования</h3>
          <div className="space-y-3">
            <PrincipleItem icon="📱" title="Mobile First" desc="PWA для сотрудников, адаптивный веб для руководства" />
            <PrincipleItem icon="🔄" title="Offline First" desc="Все данные кэшируются локально, синхронизация при появлении сети" />
            <PrincipleItem icon="🔐" title="Role-Based Access" desc="Разделение прав на уровне API и UI" />
            <PrincipleItem icon="📝" title="Audit Trail" desc="Каждое изменение записывается в журнал" />
            <PrincipleItem icon="⚡" title="Real-time Sync" desc="Push-уведомления через polling Google Sheets" />
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold mb-4 text-purple-400">🔌 Схема взаимодействия</h2>
        <div className="space-y-4">
          <FlowStep step={1} title="Авторизация" desc="Сотрудник входит по номеру + пароль → проверка в Google Sheets → получение токена сессии" />
          <FlowStep step={2} title="Синхронизация" desc="При подключении: загрузка номенклатуры, цен → сохранение в IndexedDB" />
          <FlowStep step={3} title="Работа офлайн" desc="Сотрудник вводит расход → данные сохраняются в IndexedDB с меткой времени" />
          <FlowStep step={4} title="Синхронизация данных" desc="При появлении сети: Background Sync → отправка данных в Google Sheets" />
          <FlowStep step={5} title="Уведомления" desc="Google Apps Script проверяет условия → отправка push-уведомлений" />
        </div>
      </div>
    </div>
  );
}

function DatabaseTab() {
  return (
    <div className="space-y-8">
      <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold mb-2 text-blue-400">🗄️ Структура Google Sheets</h2>
        <p className="text-blue-300 mb-6">Единая таблица с разделением на листы (sheets). Каждый лист — отдельная сущность.</p>

        <div className="space-y-6">
          {/* Лист: Сотрудники */}
          <SheetTable
            name="Сотрудники"
            description="Основные данные сотрудников"
            columns={[
              { name: 'ID', type: 'string', desc: 'Уникальный идентификатор' },
              { name: 'Персональный номер', type: 'string', desc: 'Для авторизации' },
              { name: 'ФИО', type: 'string', desc: 'Полное имя' },
              { name: 'Пароль (хэш)', type: 'string', desc: 'Хэшированный пароль' },
              { name: 'Статус', type: 'enum', desc: 'Активен / Неактивен / Отпуск / Уволен' },
              { name: 'Дата найма', type: 'date', desc: 'Дата начала работы' },
              { name: 'Дата увольнения', type: 'date', desc: 'Дата окончания (если есть)' },
              { name: 'Заблокирован', type: 'boolean', desc: 'Блокировка при утере телефона' },
            ]}
          />

          {/* Лист: Номенклатура */}
          <SheetTable
            name="Номенклатура"
            description="Справочник лекарств, оборудования, расходных материалов"
            columns={[
              { name: 'ID', type: 'string', desc: 'Уникальный идентификатор' },
              { name: 'Название', type: 'string', desc: 'Наименование позиции' },
              { name: 'Категория', type: 'enum', desc: 'Лекарство / Оборудование / Расходный материал' },
              { name: 'Ед. измерения', type: 'string', desc: 'Ампулы / Таблетки / Флаконы / Штуки' },
              { name: 'Актуальна', type: 'boolean', desc: 'Используется ли сейчас' },
            ]}
          />

          {/* Лист: Цены */}
          <SheetTable
            name="Цены"
            description="История цен с версионностью"
            columns={[
              { name: 'ID', type: 'string', desc: 'Уникальный идентификатор записи' },
              { name: 'Номенклатура_ID', type: 'FK', desc: 'Ссылка на номенклатуру' },
              { name: 'Цена (₽)', type: 'number', desc: 'Цена за единицу' },
              { name: 'Дата начала', type: 'datetime', desc: 'С какой даты действует цена' },
              { name: 'Дата окончания', type: 'datetime', desc: 'До какой даты (null = актуальна)' },
              { name: 'Кем изменено', type: 'string', desc: 'ID пользователя, изменившего цену' },
            ]}
          />

          {/* Лист: Приход */}
          <SheetTable
            name="Приход"
            description="Поступление препаратов на сотрудника"
            columns={[
              { name: 'ID', type: 'string', desc: 'Уникальный идентификатор' },
              { name: 'Сотрудник_ID', type: 'FK', desc: 'Кому выдано' },
              { name: 'Дата', type: 'date', desc: 'Дата прихода' },
              { name: 'Месяц', type: 'string', desc: 'Отчётный месяц (YYYY-MM)' },
              { name: 'Сумма (₽)', type: 'number', desc: 'Общая сумма прихода в рублях' },
              { name: 'Количество смен', type: 'number', desc: 'Кол-во смен' },
              { name: 'Кем внесено', type: 'string', desc: 'Руководитель / Кладовщик' },
              { name: 'Комментарий', type: 'string', desc: 'Примечание' },
            ]}
          />

          {/* Лист: Расход */}
          <SheetTable
            name="Расход"
            description="Расход препаратов по пациентам"
            columns={[
              { name: 'ID', type: 'string', desc: 'Уникальный идентификатор' },
              { name: 'Сотрудник_ID', type: 'FK', desc: 'Кто потратил' },
              { name: 'Дата', type: 'datetime', desc: 'Дата и время внесения' },
              { name: 'Номенклатура_ID', type: 'FK', desc: 'Что потрачено' },
              { name: 'Количество', type: 'number', desc: 'Кол-во единиц' },
              { name: 'Пациент ФИО', type: 'string', desc: 'ФИО пациента (свободный ввод)' },
              { name: 'Пациент ДР', type: 'date', desc: 'Дата рождения пациента' },
              { name: 'Вызов_ID', type: 'string', desc: 'ID вызова/визита' },
              { name: 'Синхронизировано', type: 'boolean', desc: 'Отправлено ли на сервер' },
              { name: 'Локальное время', type: 'datetime', desc: 'Время создания офлайн' },
            ]}
          />

          {/* Лист: Возвраты */}
          <SheetTable
            name="Возвраты"
            description="Возврат препаратов на склад"
            columns={[
              { name: 'ID', type: 'string', desc: 'Уникальный идентификатор' },
              { name: 'Сотрудник_ID', type: 'FK', desc: 'Кто возвращает' },
              { name: 'Дата', type: 'datetime', desc: 'Дата возврата' },
              { name: 'Номенклатура_ID', type: 'FK', desc: 'Что возвращено' },
              { name: 'Количество', type: 'number', desc: 'Кол-во единиц' },
              { name: 'Статус', type: 'enum', desc: 'Новый / Принят / Отклонён' },
              { name: 'Кем скорректировано', type: 'string', desc: 'Кто подтвердил/изменил' },
              { name: 'Комментарий', type: 'string', desc: 'Примечание' },
            ]}
          />

          {/* Лист: Остатки */}
          <SheetTable
            name="Начальные остатки"
            description="Остатки при первом подключении сотрудника"
            columns={[
              { name: 'ID', type: 'string', desc: 'Уникальный идентификатор' },
              { name: 'Сотрудник_ID', type: 'FK', desc: 'Сотрудник' },
              { name: 'Номенклатура_ID', type: 'FK', desc: 'Препарат/оборудование' },
              { name: 'Количество', type: 'number', desc: 'Остаток в штуках' },
              { name: 'Дата внесения', type: 'datetime', desc: 'Когда внесено' },
              { name: 'Кем внесено', type: 'string', desc: 'Сотрудник / Руководитель' },
            ]}
          />

          {/* Лист: Чат */}
          <SheetTable
            name="Чат"
            description="Сообщения между участниками"
            columns={[
              { name: 'ID', type: 'string', desc: 'Уникальный идентификатор' },
              { name: 'От кого', type: 'FK', desc: 'ID отправителя' },
              { name: 'Кому', type: 'FK', desc: 'ID получателя' },
              { name: 'Текст', type: 'string', desc: 'Содержание сообщения' },
              { name: 'Дата', type: 'datetime', desc: 'Дата и время' },
              { name: 'Прочитано', type: 'boolean', desc: 'Статус прочтения' },
            ]}
          />

          {/* Лист: Журнал */}
          <SheetTable
            name="Журнал изменений"
            description="Аудит всех изменений в системе"
            columns={[
              { name: 'ID', type: 'string', desc: 'Уникальный идентификатор' },
              { name: 'Дата', type: 'datetime', desc: 'Когда изменено' },
              { name: 'Пользователь', type: 'string', desc: 'Кто изменил (ID + ФИО)' },
              { name: 'Лист', type: 'string', desc: 'Какой лист изменён' },
              { name: 'Запись_ID', type: 'string', desc: 'Какая запись изменена' },
              { name: 'Поле', type: 'string', desc: 'Какое поле' },
              { name: 'Было', type: 'string', desc: 'Предыдущее значение' },
              { name: 'Стало', type: 'string', desc: 'Новое значение' },
            ]}
          />
        </div>
      </div>

      {/* Формулы расчёта */}
      <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">📐 Формулы расчёта</h2>
        <div className="space-y-4">
          <FormulaCard
            title="Расчёт остатка в штуках"
            formula="Остаток(шт) = Начальный_остаток + Приход(шт) - Расход(шт) - Возврат(шт)"
            desc="Количество единиц на руках у сотрудника"
          />
          <FormulaCard
            title="Расчёт остатка в рублях (с учётом изменения цен)"
            formula="Остаток(₽) = Σ [Остаток_i(шт) × Цена_i(актуальная на сегодня)]"
            desc="Для каждой позиции номенклатуры берётся актуальная цена на текущую дату"
          />
          <FormulaCard
            title="Перерасход"
            formula="Перерасход = true, если Расход(₽) > Приход(₽)"
            desc="Уведомление руководителю при превышении"
          />
          <FormulaCard
            title="Общий остаток подразделения"
            formula="Общий_остаток(₽) = Σ Остаток_i(₽) по всем сотрудникам"
            desc="Сумма остатков всех активных сотрудников"
          />
        </div>
      </div>
    </div>
  );
}

function FlowsTab() {
  return (
    <div className="space-y-8">
      <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold mb-6 text-blue-400">🔄 Основные потоки данных</h2>

        <div className="space-y-8">
          {/* Поток 1: Приход */}
          <FlowCard
            number={1}
            title="Приход препаратов на сотрудника"
            color="emerald"
            steps={[
              { actor: 'Руководитель', action: 'Вносит сумму прихода (₽) на сотрудника', detail: 'Указывает сотрудника, месяц, сумму, кол-во смен' },
              { actor: 'Система', action: 'Записывает в лист «Приход»', detail: 'Создаёт запись с датой, ID сотрудника, суммой' },
              { actor: 'Система', action: 'Обновляет расчёт остатков', detail: 'Пересчитывает доступные препараты' },
              { actor: 'Журнал', action: 'Фиксирует изменение', detail: 'Кто, когда, что внёс' },
            ]}
          />

          {/* Поток 2: Расход */}
          <FlowCard
            number={2}
            title="Расход препаратов на пациента"
            color="orange"
            steps={[
              { actor: 'Сотрудник', action: 'Открывает приложение', detail: 'Авторизация или продолжение сессии' },
              { actor: 'Сотрудник', action: 'Вводит данные вызова', detail: 'ФИО пациента, дата рождения' },
              { actor: 'Сотрудник', action: 'Указывает расход по каждой позиции', detail: 'Выбирает из номенклатуры, ставит количество' },
              { actor: 'Система (локально)', action: 'Сохраняет в IndexedDB', detail: 'С меткой времени, статус «не синхронизировано»' },
              { actor: 'Система (онлайн)', action: 'Синхронизирует с Google Sheets', detail: 'Background Sync при наличии сети' },
              { actor: 'Журнал', action: 'Фиксирует изменение', detail: 'Запись о расходе с привязкой к пациенту' },
            ]}
          />

          {/* Поток 3: Возврат */}
          <FlowCard
            number={3}
            title="Операция «Возврат» на склад"
            color="yellow"
            steps={[
              { actor: 'Сотрудник', action: 'Создаёт операцию «Возврат»', detail: 'Выбирает препараты, указывает количество' },
              { actor: 'Система', action: 'Отправляет уведомление руководителю', detail: 'Push-уведомление о возврате' },
              { actor: 'Система', action: 'Отправляет уведомление кладовщику', detail: 'Кладовщик видит новый возврат' },
              { actor: 'Руководитель/Кладовщик', action: 'Подтверждает или корректирует', detail: 'Может изменить количество' },
              { actor: 'Система', action: 'Обновляет остатки', detail: 'Увеличивает складской остаток' },
            ]}
          />

          {/* Поток 4: Изменение цены */}
          <FlowCard
            number={4}
            title="Изменение цены на препарат"
            color="purple"
            steps={[
              { actor: 'Руководитель/Кладовщик', action: 'Вносит новую цену', detail: 'Указывает препарат и новую цену' },
              { actor: 'Система', action: 'Создаёт новую запись цены', detail: 'Старая цена помечается как «закрытая» с датой окончания' },
              { actor: 'Система', action: 'Пересчитывает все остатки в ₽', detail: 'Для всех сотрудников пересчитывается стоимость остатков' },
              { actor: 'Журнал', action: 'Фиксирует изменение', detail: 'Было/стало, кто изменил, когда' },
            ]}
          />

          {/* Поток 5: Офлайн-работа */}
          <FlowCard
            number={5}
            title="Офлайн-режим сотрудника"
            color="red"
            steps={[
              { actor: 'Сотрудник', action: 'Теряет соединение', detail: 'Нет сети до 72 часов' },
              { actor: 'Система (PWA)', action: 'Определяет отсутствие сети', detail: 'navigator.onLine = false' },
              { actor: 'Сотрудник', action: 'Продолжает вводить расход', detail: 'Данные сохраняются в IndexedDB' },
              { actor: 'Система (PWA)', action: 'Помечает данные как «ожидает синхронизации»', detail: 'С локальной меткой времени' },
              { actor: 'Система', action: 'При появлении сети: Background Sync', detail: 'Автоматическая отправка всех накопленных данных' },
              { actor: 'Система', action: 'Подтверждает синхронизацию', detail: 'Данные помечаются как «синхронизировано»' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function FeaturesTab() {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  const features = [
    {
      id: 'auth',
      title: 'Авторизация и безопасность',
      icon: '🔐',
      items: [
        'Авторизация по персональному номеру + пароль',
        'Сохранение учётных данных (remember me)',
        'Блокировка аккаунта руководителем (при утере телефона)',
        'При увольнении — сообщение «К сожалению, Вы с нами больше не сотрудничаете ☹»',
        'При первом входе — «Добро пожаловать в наш коллектив! 😊»',
      ],
    },
    {
      id: 'nomenclature',
      title: 'Управление номенклатурой',
      icon: '📋',
      items: [
        'Руководитель вручную вносит названия лекарств и оборудования',
        'Кладовщик может менять цены',
        'Единицы измерения: ампулы, таблетки, флаконы, штуки',
        'Для сотрудника номенклатура — цельный список (без цен)',
        'Категории: лекарства, оборудование, расходные материалы',
      ],
    },
    {
      id: 'patients',
      title: 'Учёт пациентов',
      icon: '🏥',
      items: [
        'Свободный ввод ФИО пациента',
        'Дата рождения пациента',
        'Расход лекарств (в штуках) на каждого пациента',
        'Подсчёт количества пациентов за месяц у каждого сотрудника',
        'Архив: только количество, без финансов',
      ],
    },
    {
      id: 'finance',
      title: 'Финансовый учёт',
      icon: '💰',
      items: [
        'Приход в рублях (общая сумма на сотрудника)',
        'Расход в штуках (по позициям)',
        'Автоматический пересчёт расхода в рубли по актуальным ценам',
        'Остаток в рублях с учётом изменения цен',
        'Уведомление при перерасходе',
        'Ежемесячный отчёт 5-го числа',
      ],
    },
    {
      id: 'offline',
      title: 'Офлайн-режим',
      icon: '📴',
      items: [
        'Работа без сети до 72 часов',
        'Сохранение данных расхода в IndexedDB',
        'Автоматическая синхронизация при появлении сети',
        'Background Sync API для фоновой отправки',
        'Индикатор статуса синхронизации',
      ],
    },
    {
      id: 'chat',
      title: 'Коммуникация',
      icon: '💬',
      items: [
        'Руководитель → Сотрудник: сообщения',
        'Сотрудник → Руководитель: ответы',
        'Сотрудник → Кладовщик: сообщения',
        'Кладовщик → Сотрудник: сообщения',
        'Уведомления о новых сообщениях',
      ],
    },
    {
      id: 'returns',
      title: 'Операция «Возврат»',
      icon: '↩️',
      items: [
        'Сотрудник создаёт возврат (препарат + количество)',
        'Уведомление руководителю и кладовщику',
        'Руководитель может корректировать возврат',
        'Кладовщик может корректировать возврат',
        'Обновление остатков после подтверждения',
      ],
    },
    {
      id: 'reports',
      title: 'Отчётность и экспорт',
      icon: '📊',
      items: [
        'Ежемесячный отчёт (5-го числа)',
        'Экспорт в PDF',
        'Экспорт в Excel',
        'Общий остаток на подразделение',
        'Остатки за прошлый месяц на начало следующего',
      ],
    },
    {
      id: 'audit',
      title: 'Версионность и аудит',
      icon: '📝',
      items: [
        'Журнал всех изменений',
        'Кто, когда, что изменил',
        'Предыдущее и новое значение',
        'Руководитель может изменять архивные данные',
        'История изменения цен',
      ],
    },
    {
      id: 'notifications',
      title: 'Система уведомлений',
      icon: '🔔',
      items: [
        'Перерасход у сотрудника (расход > приход)',
        'Сотрудник не вносит расход 7+ дней',
        'Новый возврат на склад',
        'Новое сообщение в чате',
        'Статусы: активен, неактивен, отпуск',
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white/5 rounded-2xl p-8 border border-white/10 mb-6">
        <h2 className="text-2xl font-bold text-blue-400">⚙️ Функциональные блоки</h2>
        <p className="text-blue-300 mt-2">Нажмите на блок для раскрытия подробностей</p>
      </div>

      {features.map((feature) => (
        <div
          key={feature.id}
          className="bg-white/5 rounded-xl border border-white/10 overflow-hidden transition-all"
        >
          <button
            onClick={() => setExpandedFeature(expandedFeature === feature.id ? null : feature.id)}
            className="w-full px-6 py-4 flex items-center gap-4 text-left hover:bg-white/5 transition-colors"
          >
            <span className="text-2xl">{feature.icon}</span>
            <span className="text-lg font-semibold flex-1">{feature.title}</span>
            <span className={`transition-transform ${expandedFeature === feature.id ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          {expandedFeature === feature.id && (
            <div className="px-6 pb-4 border-t border-white/10 pt-4">
              <ul className="space-y-2">
                {feature.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-blue-200">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function RoadmapTab() {
  const phases = [
    {
      phase: 'Фаза 1',
      title: 'MVP — Базовый функционал',
      duration: '4-6 недель',
      color: 'emerald',
      tasks: [
        'Настройка Google Sheets (все листы)',
        'Google Apps Script (API endpoints)',
        'Авторизация (номер + пароль)',
        'Веб-приложение руководителя: номенклатура, сотрудники',
        'Веб-приложение кладовщика: просмотр расхода, цены',
        'PWA сотрудника: ввод расхода по пациентам',
        'Базовая синхронизация данных',
      ],
    },
    {
      phase: 'Фаза 2',
      title: 'Финансовый модуль',
      duration: '3-4 недели',
      color: 'blue',
      tasks: [
        'Приход (рубли) на сотрудников',
        'Расчёт остатков в штуках и рублях',
        'Управление ценами с историей',
        'Пересчёт остатков при изменении цен',
        'Детекция перерасхода',
        'Ежемесячный отчёт',
      ],
    },
    {
      phase: 'Фаза 3',
      title: 'Офлайн и коммуникация',
      duration: '3-4 недели',
      color: 'purple',
      tasks: [
        'Service Worker для офлайн-работы',
        'IndexedDB для локального хранения',
        'Background Sync API',
        'Модуль чата (все направления)',
        'Push-уведомления',
        'Индикатор статуса сети/синхронизации',
      ],
    },
    {
      phase: 'Фаза 4',
      title: 'Расширенный функционал',
      duration: '3-4 недели',
      color: 'yellow',
      tasks: [
        'Операция «Возврат» (полный цикл)',
        'Журнал изменений (аудит)',
        'Экспорт в PDF',
        'Экспорт в Excel',
        'Блокировка аккаунтов',
        'Управление статусами сотрудников',
        'Архивные данные и редактирование',
      ],
    },
    {
      phase: 'Фаза 5',
      title: 'Оптимизация и тестирование',
      duration: '2-3 недели',
      color: 'red',
      tasks: [
        'Нагрузочное тестирование (30 сотрудников)',
        'Тестирование офлайн-режима (72 часа)',
        'Оптимизация Google Sheets API запросов',
        'UI/UX доработки по обратной связи',
        'Документация для пользователей',
        'Обучение персонала',
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold mb-2 text-blue-400">🗺️ Дорожная карта разработки</h2>
        <p className="text-blue-300">Общий срок: ~15-21 недель (4-5 месяцев)</p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-blue-500 via-purple-500 via-yellow-500 to-red-500" />

        <div className="space-y-8">
          {phases.map((phase, index) => (
            <div key={index} className="relative pl-16">
              {/* Timeline dot */}
              <div className={`absolute left-4 w-5 h-5 rounded-full bg-${phase.color}-500 border-4 border-${phase.color}-300 shadow-lg`} 
                   style={{ backgroundColor: 'currentColor' }} />
              
              <div className={`bg-white/5 rounded-xl p-6 border border-${phase.color}-500/30`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${phase.color}-500/20 text-${phase.color}-300`}>
                    {phase.phase}
                  </span>
                  <span className="text-sm text-blue-400">{phase.duration}</span>
                </div>
                <h3 className="text-xl font-bold mb-4">{phase.title}</h3>
                <ul className="space-y-2">
                  {phase.tasks.map((task, i) => (
                    <li key={i} className="flex items-start gap-2 text-blue-200 text-sm">
                      <span className="text-emerald-400 mt-0.5">▸</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Риски */}
      <div className="bg-red-500/10 rounded-2xl p-8 border border-red-500/30">
        <h2 className="text-xl font-bold mb-4 text-red-400">⚠️ Ключевые риски</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <RiskItem title="Google Sheets API квоты" desc="Лимит 60 запросов/минуту. При 30 сотрудниках нужна оптимизация batch-запросов." />
          <RiskItem title="Конфликты данных" desc="Одновременное редактирование офлайн-данных. Нужен механизм merge." />
          <RiskItem title="Размер таблицы" desc="Google Sheets лимит 10 млн ячеек. При активном использовании — мониторинг." />
          <RiskItem title="PWA на iOS" desc="Ограничения Background Sync на iOS. Альтернатива — периодическая синхронизация." />
        </div>
      </div>

      {/* Альтернативы */}
      <div className="bg-blue-500/10 rounded-2xl p-8 border border-blue-500/30">
        <h2 className="text-xl font-bold mb-4 text-blue-400">💡 Альтернативные решения (если потребуется масштабирование)</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <AltItem current="Google Sheets" alternative="Firebase Firestore" when="Если >50 пользователей или нужна real-time синхронизация" />
          <AltItem current="Google Apps Script" alternative="Cloud Functions / Node.js API" when="Если нужна сложная бизнес-логика" />
          <AltItem current="PWA" alternative="React Native / Flutter" when="Если нужен полноценный нативный опыт" />
          <AltItem current="Polling" alternative="Firebase Realtime DB / WebSocket" when="Если нужны мгновенные уведомления" />
        </div>
      </div>
    </div>
  );
}

// =================== HELPER COMPONENTS ===================

function MetricCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-black/20 rounded-lg p-4 text-center">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-blue-300 mt-1">{label}</div>
    </div>
  );
}

function PrincipleItem({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-xl">{icon}</span>
      <div>
        <div className="font-semibold text-white">{title}</div>
        <div className="text-sm text-blue-300">{desc}</div>
      </div>
    </div>
  );
}

function RoleSection({ title, platform, color, icon, permissions, notifications, reports }: {
  title: string;
  platform: string;
  color: string;
  icon: string;
  permissions: string[];
  notifications: string[];
  reports: string[];
}) {
  const colorClasses: Record<string, string> = {
    emerald: 'border-emerald-500/30 from-emerald-500/10',
    purple: 'border-purple-500/30 from-purple-500/10',
    orange: 'border-orange-500/30 from-orange-500/10',
  };
  const textColor: Record<string, string> = {
    emerald: 'text-emerald-400',
    purple: 'text-purple-400',
    orange: 'text-orange-400',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} to-transparent rounded-2xl p-8 border ${colorClasses[color].split(' ')[0]}`}>
      <div className="flex items-center gap-4 mb-6">
        <span className="text-4xl">{icon}</span>
        <div>
          <h2 className={`text-2xl font-bold ${textColor[color]}`}>{title}</h2>
          <p className="text-sm text-blue-300">{platform}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-bold text-white mb-3 flex items-center gap-2">
            <span>✅</span> Возможности
          </h4>
          <ul className="space-y-1.5">
            {permissions.map((p, i) => (
              <li key={i} className="text-sm text-blue-200 flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5 text-xs">●</span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          {notifications.length > 0 && (
            <div>
              <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                <span>🔔</span> Уведомления
              </h4>
              <ul className="space-y-1.5">
                {notifications.map((n, i) => (
                  <li key={i} className="text-sm text-blue-200 flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5 text-xs">●</span>
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {reports.length > 0 && (
            <div>
              <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                <span>📊</span> Ежемесячный отчёт (5-го числа)
              </h4>
              <ul className="space-y-1.5">
                {reports.map((r, i) => (
                  <li key={i} className="text-sm text-blue-200 flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5 text-xs">●</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SheetTable({ name, description, columns }: {
  name: string;
  description: string;
  columns: { name: string; type: string; desc: string }[];
}) {
  return (
    <div className="bg-black/20 rounded-xl p-5 border border-white/10">
      <div className="flex items-center gap-3 mb-3">
        <span className="px-2 py-1 bg-blue-600/30 rounded text-xs font-mono text-blue-300">Sheet</span>
        <h3 className="text-lg font-bold text-white">{name}</h3>
      </div>
      <p className="text-sm text-blue-300 mb-4">{description}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-2 px-3 text-blue-400 font-medium">Поле</th>
              <th className="text-left py-2 px-3 text-blue-400 font-medium">Тип</th>
              <th className="text-left py-2 px-3 text-blue-400 font-medium">Описание</th>
            </tr>
          </thead>
          <tbody>
            {columns.map((col, i) => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-2 px-3 font-mono text-emerald-300">{col.name}</td>
                <td className="py-2 px-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    col.type === 'FK' ? 'bg-purple-500/20 text-purple-300' :
                    col.type === 'enum' ? 'bg-yellow-500/20 text-yellow-300' :
                    col.type === 'boolean' ? 'bg-red-500/20 text-red-300' :
                    col.type === 'number' ? 'bg-blue-500/20 text-blue-300' :
                    col.type === 'date' || col.type === 'datetime' ? 'bg-green-500/20 text-green-300' :
                    'bg-white/10 text-blue-200'
                  }`}>
                    {col.type}
                  </span>
                </td>
                <td className="py-2 px-3 text-blue-200">{col.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FormulaCard({ title, formula, desc }: { title: string; formula: string; desc: string }) {
  return (
    <div className="bg-black/20 rounded-lg p-4 border border-white/10">
      <h4 className="font-bold text-white mb-2">{title}</h4>
      <div className="bg-emerald-500/10 rounded px-3 py-2 font-mono text-sm text-emerald-300 mb-2">
        {formula}
      </div>
      <p className="text-sm text-blue-300">{desc}</p>
    </div>
  );
}

function FlowStep({ step, title, desc }: { step: number; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold shrink-0">
        {step}
      </div>
      <div>
        <div className="font-semibold text-white">{title}</div>
        <div className="text-sm text-blue-300">{desc}</div>
      </div>
    </div>
  );
}

function FlowCard({ number, title, color, steps }: {
  number: number;
  title: string;
  color: string;
  steps: { actor: string; action: string; detail: string }[];
}) {
  const colorMap: Record<string, string> = {
    emerald: 'border-emerald-500/30',
    orange: 'border-orange-500/30',
    yellow: 'border-yellow-500/30',
    purple: 'border-purple-500/30',
    red: 'border-red-500/30',
  };

  return (
    <div className={`bg-black/20 rounded-xl p-6 border ${colorMap[color] || 'border-white/10'}`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
          {number}
        </span>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-3 pl-4 border-l-2 border-white/10">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-blue-300">{step.actor}</span>
                <span className="text-sm text-white font-medium">{step.action}</span>
              </div>
              <p className="text-xs text-blue-400 mt-1">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TechItem({ name, items }: { name: string; items: string[] }) {
  return (
    <div>
      <div className="text-sm font-semibold text-white mb-1">{name}</div>
      <div className="flex flex-wrap gap-1">
        {items.map((item, i) => (
          <span key={i} className="px-2 py-0.5 bg-white/10 rounded text-xs text-blue-200">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function RiskItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-black/20 rounded-lg p-4">
      <h4 className="font-bold text-red-300 mb-1">{title}</h4>
      <p className="text-sm text-blue-200">{desc}</p>
    </div>
  );
}

function AltItem({ current, alternative, when }: { current: string; alternative: string; when: string }) {
  return (
    <div className="bg-black/20 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-blue-300">{current}</span>
        <span className="text-blue-400">→</span>
        <span className="text-sm font-semibold text-emerald-300">{alternative}</span>
      </div>
      <p className="text-xs text-blue-400">{when}</p>
    </div>
  );
}

function SetupTab() {
  const [copied, setCopied] = useState(false);
  const [scriptCode, setScriptCode] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/google-apps-script.js')
      .then(res => res.text())
      .then(text => {
        setScriptCode(text);
        setLoading(false);
      })
      .catch(() => {
        setScriptCode('// Не удалось загрузить код. Файл: public/google-apps-script.js');
        setLoading(false);
      });
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(scriptCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const downloadScript = () => {
    const blob = new Blob([scriptCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'setup-database.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div className="bg-gradient-to-br from-emerald-500/20 to-blue-500/10 rounded-2xl p-8 border border-emerald-500/30">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center text-3xl">
            🚀
          </div>
          <div>
            <h2 className="text-2xl font-bold text-emerald-400">Установка базы данных</h2>
            <p className="text-blue-300">Автоматическое развёртывание всех листов в Google Sheets</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-black/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">11</div>
            <div className="text-xs text-blue-300">Листов будет создано</div>
          </div>
          <div className="bg-black/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">~30 сек</div>
            <div className="text-xs text-blue-300">Время установки</div>
          </div>
          <div className="bg-black/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">100+</div>
            <div className="text-xs text-blue-300">Столбцов с валидацией</div>
          </div>
          <div className="bg-black/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">0 ₽</div>
            <div className="text-xs text-blue-300">Стоимость</div>
          </div>
        </div>
      </div>

      {/* Пошаговая инструкция */}
      <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
        <h3 className="text-xl font-bold text-blue-400 mb-6">📋 Пошаговая инструкция</h3>
        
        <div className="space-y-4">
          <StepItem 
            number={1} 
            title="Создайте новую Google таблицу"
            description="Перейдите на sheets.google.com и создайте новую пустую таблицу. Назовите её, например: «Учёт лекарственных средств»"
            link="https://sheets.google.com"
          />
          <StepItem 
            number={2} 
            title="Откройте редактор Apps Script"
            description="В меню таблицы выберите: Расширения → Apps Script (Extensions → Apps Script)"
          />
          <StepItem 
            number={3} 
            title="Вставьте код скрипта"
            description="Удалите весь существующий код в редакторе и вставьте скопированный код (кнопка ниже). Или скачайте файл и откройте его."
          />
          <StepItem 
            number={4} 
            title="Запустите функцию setupDatabase"
            description="В верхней панели выберите функцию 'setupDatabase' и нажмите кнопку ▶ (Выполнить). При первом запуске потребуется авторизация — разрешите доступ."
          />
          <StepItem 
            number={5} 
            title="Дождитесь завершения"
            description="Скрипт создаст все 11 листов с заголовками, форматированием, валидацией данных и примерами. Появится уведомление об успешном завершении."
          />
          <StepItem 
            number={6} 
            title="Проверьте результат"
            description="Вернитесь в таблицу — внизу вы увидите все созданные листы. Можете удалить примеры данных и начать заполнение реальными данными."
          />
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
        <h3 className="text-xl font-bold text-blue-400 mb-6">⚡ Действия</h3>
        
        <div className="flex flex-wrap gap-4">
          <button
            onClick={copyToClipboard}
            disabled={loading}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              copied 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
            }`}
          >
            {copied ? (
              <>
                <span>✅</span>
                <span>Скопировано!</span>
              </>
            ) : (
              <>
                <span>📋</span>
                <span>Скопировать код</span>
              </>
            )}
          </button>

          <button
            onClick={downloadScript}
            disabled={loading}
            className="px-6 py-3 rounded-xl font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
          >
            <span>💾</span>
            <span>Скачать файл .js</span>
          </button>

          <a
            href="https://sheets.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
          >
            <span>📊</span>
            <span>Открыть Google Sheets</span>
          </a>
        </div>
      </div>

      {/* Код скрипта */}
      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/20">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-sm font-mono text-blue-300">setup-database.js</span>
          </div>
          <button
            onClick={copyToClipboard}
            className="px-3 py-1 rounded text-xs bg-white/10 hover:bg-white/20 text-blue-200 transition-colors"
          >
            {copied ? '✅ Скопировано' : '📋 Копировать'}
          </button>
        </div>
        
        <div className="max-h-[600px] overflow-auto">
          <pre className="p-6 text-xs font-mono text-blue-200 leading-relaxed whitespace-pre">
            {loading ? '⏳ Загрузка кода...' : scriptCode}
          </pre>
        </div>
      </div>

      {/* Список созданных листов */}
      <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
        <h3 className="text-xl font-bold text-blue-400 mb-6">📑 Будут созданы следующие листы</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <SheetPreview name="Сотрудники" desc="Данные сотрудников, авторизация, статусы" rows="~30" color="emerald" />
          <SheetPreview name="Номенклатура" desc="Справочник лекарств, оборудования, расходников" rows="~50" color="emerald" />
          <SheetPreview name="Цены" desc="История цен с версионностью" rows="~50" color="blue" />
          <SheetPreview name="Приход" desc="Поступление препаратов на сотрудника" rows="~360/год" color="blue" />
          <SheetPreview name="Расход" desc="Расход по каждому пациенту" rows="~10000/год" color="orange" />
          <SheetPreview name="Возвраты" desc="Операции возврата на склад" rows="~100/год" color="yellow" />
          <SheetPreview name="Начальные остатки" desc="Остатки при первом подключении" rows="~300" color="purple" />
          <SheetPreview name="Чат" desc="Сообщения между участниками" rows="~1000/мес" color="purple" />
          <SheetPreview name="Журнал изменений" desc="Аудит всех действий" rows="~50000/год" color="red" />
          <SheetPreview name="Настройки" desc="Системные параметры" rows="10" color="red" />
          <SheetPreview name="Отчёты" desc="Сформированные отчёты" rows="~100/год" color="emerald" />
        </div>
      </div>

      {/* Примеры данных */}
      <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
        <h3 className="text-xl font-bold text-blue-400 mb-6">📝 Примеры данных (предзаполнены)</h3>
        
        <div className="space-y-4">
          <div className="bg-black/20 rounded-lg p-4">
            <h4 className="font-bold text-emerald-300 mb-2">Сотрудники (3 примера)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-1 px-2 text-blue-400">Перс. номер</th>
                    <th className="text-left py-1 px-2 text-blue-400">ФИО</th>
                    <th className="text-left py-1 px-2 text-blue-400">Статус</th>
                    <th className="text-left py-1 px-2 text-blue-400">Должность</th>
                  </tr>
                </thead>
                <tbody className="text-blue-200">
                  <tr className="border-b border-white/5">
                    <td className="py-1 px-2">001</td>
                    <td className="py-1 px-2">Иванов Иван Иванович</td>
                    <td className="py-1 px-2"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Активен</span></td>
                    <td className="py-1 px-2">Врач</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-1 px-2">002</td>
                    <td className="py-1 px-2">Петрова Мария Сергеевна</td>
                    <td className="py-1 px-2"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Активен</span></td>
                    <td className="py-1 px-2">Фельдшер</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2">003</td>
                    <td className="py-1 px-2">Сидоров Алексей Петрович</td>
                    <td className="py-1 px-2"><span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300">Отпуск</span></td>
                    <td className="py-1 px-2">Врач</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-blue-400 mt-2">Пароли: pass123, pass456, pass789 (хэшированы в SHA-256)</p>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h4 className="font-bold text-emerald-300 mb-2">Номенклатура (8 примеров)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-1 px-2 text-blue-400">Название</th>
                    <th className="text-left py-1 px-2 text-blue-400">Категория</th>
                    <th className="text-left py-1 px-2 text-blue-400">Ед. изм.</th>
                    <th className="text-left py-1 px-2 text-blue-400">Цена</th>
                  </tr>
                </thead>
                <tbody className="text-blue-200">
                  <tr className="border-b border-white/5">
                    <td className="py-1 px-2">Адреналин 0.1% 1мл</td>
                    <td className="py-1 px-2">Лекарство</td>
                    <td className="py-1 px-2">Ампулы</td>
                    <td className="py-1 px-2">45.00 ₽</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-1 px-2">Дексаметазон 4мг/мл 2мл</td>
                    <td className="py-1 px-2">Лекарство</td>
                    <td className="py-1 px-2">Ампулы</td>
                    <td className="py-1 px-2">32.50 ₽</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-1 px-2">Тонометр Omron M2 Basic</td>
                    <td className="py-1 px-2">Оборудование</td>
                    <td className="py-1 px-2">Штуки</td>
                    <td className="py-1 px-2">3 200.00 ₽</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2">Шприц 5мл</td>
                    <td className="py-1 px-2">Расходный материал</td>
                    <td className="py-1 px-2">Штуки</td>
                    <td className="py-1 px-2">8.50 ₽</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Предупреждения */}
      <div className="bg-yellow-500/10 rounded-2xl p-8 border border-yellow-500/30">
        <h3 className="text-xl font-bold text-yellow-400 mb-4">⚠️ Важно знать</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-yellow-400">•</span>
            <p className="text-blue-200 text-sm">
              <strong className="text-white">Примеры данных</strong> — после установки вы можете удалить примеры и начать заполнение реальными данными. 
              IDs (EMP-001, NOM-001 и т.д.) используются для связи между листами.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-yellow-400">•</span>
            <p className="text-blue-200 text-sm">
              <strong className="text-white">Пароли</strong> — хранятся в хэшированном виде (SHA-256). Примеры: pass123, pass456, pass789. 
              В реальном использовании рекомендуем сменить пароли.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-yellow-400">•</span>
            <p className="text-blue-200 text-sm">
              <strong className="text-white">Безопасность</strong> — настройте доступ к таблице: только вы и API-сервис должны иметь доступ. 
              В Apps Script → Deploy → Web App для интеграции с веб-приложением.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-yellow-400">•</span>
            <p className="text-blue-200 text-sm">
              <strong className="text-white">Резервное копирование</strong> — Google Sheets автоматически хранит историю версий. 
              Дополнительно рекомендуем еженедельно делать копию таблицы.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-yellow-400">•</span>
            <p className="text-blue-200 text-sm">
              <strong className="text-white">Меню в таблице</strong> — после установки в таблице появится кастомное меню «📋 Система учёта» 
              с функциями отчётов, экспорта и проверки.
            </p>
          </div>
        </div>
      </div>

      {/* API функции */}
      <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
        <h3 className="text-xl font-bold text-blue-400 mb-4">🔌 API функции (для веб-приложения)</h3>
        <p className="text-blue-300 mb-4">Скрипт включает готовые функции для интеграции с веб-приложением:</p>
        
        <div className="grid md:grid-cols-2 gap-3">
          <ApiFunction name="apiGetEmployees()" desc="Получить список всех сотрудников" />
          <ApiFunction name="apiGetNomenclature()" desc="Получить справочник номенклатуры" />
          <ApiFunction name="apiGetCurrentPrices()" desc="Получить актуальные цены" />
          <ApiFunction name="apiLogin(number, password)" desc="Авторизация сотрудника" />
          <ApiFunction name="apiAddExpense(data)" desc="Добавить запись о расходе" />
          <ApiFunction name="writeAuditLog(...)" desc="Записать действие в журнал" />
        </div>
      </div>
    </div>
  );
}

function StepItem({ number, title, description, link }: { number: number; title: string; description: string; link?: string }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-black/20 rounded-lg">
      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold shrink-0">
        {number}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-white">{title}</h4>
          {link && (
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300">
              ↗
            </a>
          )}
        </div>
        <p className="text-sm text-blue-300 mt-1">{description}</p>
      </div>
    </div>
  );
}

function SheetPreview({ name, desc, rows, color }: { name: string; desc: string; rows: string; color: string }) {
  const colorClasses: Record<string, string> = {
    emerald: 'border-emerald-500/30 bg-emerald-500/5',
    blue: 'border-blue-500/30 bg-blue-500/5',
    orange: 'border-orange-500/30 bg-orange-500/5',
    yellow: 'border-yellow-500/30 bg-yellow-500/5',
    purple: 'border-purple-500/30 bg-purple-500/5',
    red: 'border-red-500/30 bg-red-500/5',
  };

  return (
    <div className={`rounded-lg p-4 border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-bold text-white text-sm">{name}</h4>
        <span className="text-xs text-blue-400">{rows}</span>
      </div>
      <p className="text-xs text-blue-300">{desc}</p>
    </div>
  );
}

function ApiFunction({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="bg-black/20 rounded-lg p-3">
      <code className="text-sm text-emerald-300 font-mono">{name}</code>
      <p className="text-xs text-blue-300 mt-1">{desc}</p>
    </div>
  );
}

export default App;
