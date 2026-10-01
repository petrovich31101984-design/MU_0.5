import { useState, useRef, useEffect } from 'react';
import { chatMessages as initialMessages, employees } from '../mockData';
import { ChatMessage } from '../types';

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [selectedChat, setSelectedChat] = useState<string>('EMP-001');
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chats = [
    { id: 'EMP-001', name: 'Иванов И.И.', role: 'Сотрудник', lastMsg: 'Проверил, осталось 15 ампул', unread: 0 },
    { id: 'EMP-004', name: 'Козлова Е.Д.', role: 'Сотрудник', lastMsg: 'Нужны дополнительные шприцы', unread: 1 },
    { id: 'EMP-005', name: 'Морозов Д.А.', role: 'Сотрудник', lastMsg: '—', unread: 0 },
    { id: 'EMP-006', name: 'Волкова А.И.', role: 'Сотрудник', lastMsg: '—', unread: 0 },
    { id: 'EMP-009', name: 'Кузнецов А.М.', role: 'Сотрудник', lastMsg: 'Прошу увеличить лимит', unread: 1 },
    { id: 'STORE', name: 'Кладовщик', role: 'Кладовщик', lastMsg: 'Принято, подготовлю', unread: 0 },
  ];

  const currentChat = chats.find(c => c.id === selectedChat);
  const chatMessages = messages
    .filter(m => (m.fromId === selectedChat && m.toId === 'MGR') || (m.fromId === 'MGR' && m.toId === selectedChat))
    .sort((a, b) => a.date.localeCompare(b.date));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages.length]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: ChatMessage = {
      id: `MSG-${String(messages.length + 1).padStart(3, '0')}`,
      fromId: 'MGR',
      fromName: 'Руководитель',
      toId: selectedChat,
      toName: currentChat?.name || '',
      role: 'Руководитель',
      text: newMessage,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false,
      priority: 'Обычное',
    };
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Сообщения</h2>
        <p className="text-slate-400 text-sm mt-1">Чат с сотрудниками и кладовщиком</p>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex h-[600px]">
        {/* Chat list */}
        <div className="w-80 border-r border-slate-700 flex flex-col">
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-bold text-white text-sm">Диалоги</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chats.map(chat => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`w-full p-4 flex items-start gap-3 text-left border-b border-slate-700/50 transition-colors ${
                  selectedChat === chat.id ? 'bg-blue-600/10 border-l-2 border-l-blue-400' : 'hover:bg-slate-700/30'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  chat.role === 'Кладовщик' ? 'bg-purple-600' : 'bg-emerald-600'
                }`}>
                  {chat.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white truncate">{chat.name}</span>
                    {chat.unread > 0 && (
                      <span className="w-5 h-5 bg-blue-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{chat.role}</div>
                  <div className="text-xs text-slate-500 mt-1 truncate">{chat.lastMsg}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="p-4 border-b border-slate-700 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
              currentChat?.role === 'Кладовщик' ? 'bg-purple-600' : 'bg-emerald-600'
            }`}>
              {currentChat?.name[0]}
            </div>
            <div>
              <div className="font-medium text-white">{currentChat?.name}</div>
              <div className="text-xs text-slate-400">{currentChat?.role}</div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.length === 0 ? (
              <div className="text-center text-slate-500 mt-8">
                <div className="text-4xl mb-2">💬</div>
                <p>Нет сообщений</p>
                <p className="text-sm">Начните диалог, отправив сообщение</p>
              </div>
            ) : (
              chatMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.fromId === 'MGR' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                    msg.fromId === 'MGR'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-slate-700 text-white rounded-bl-md'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <div className={`text-xs mt-1 ${msg.fromId === 'MGR' ? 'text-blue-200' : 'text-slate-400'}`}>
                      {msg.date}
                      {msg.fromId === 'MGR' && (
                        <span className="ml-1">{msg.read ? '✓✓' : '✓'}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Введите сообщение..."
                className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-xl text-white font-medium transition-colors"
              >
                ➤
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-600" />
                Важное сообщение
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
        <h3 className="text-sm font-bold text-white mb-3">⚡ Быстрые действия</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              const msg: ChatMessage = {
                id: `MSG-${Date.now()}`,
                fromId: 'MGR', fromName: 'Руководитель',
                toId: selectedChat, toName: currentChat?.name || '',
                role: 'Руководитель',
                text: 'Прошу предоставить отчёт по остаткам на текущую дату.',
                date: new Date().toISOString().replace('T', ' ').substring(0, 16),
                read: false, priority: 'Важное',
              };
              setMessages([...messages, msg]);
            }}
            className="px-3 py-1.5 bg-slate-700 rounded-lg text-xs text-slate-300 hover:bg-slate-600 transition-colors"
          >
            📋 Запросить отчёт
          </button>
          <button
            onClick={() => {
              const msg: ChatMessage = {
                id: `MSG-${Date.now()}`,
                fromId: 'MGR', fromName: 'Руководитель',
                toId: selectedChat, toName: currentChat?.name || '',
                role: 'Руководитель',
                text: 'Напоминаю о необходимости внести данные расхода.',
                date: new Date().toISOString().replace('T', ' ').substring(0, 16),
                read: false, priority: 'Важное',
              };
              setMessages([...messages, msg]);
            }}
            className="px-3 py-1.5 bg-slate-700 rounded-lg text-xs text-slate-300 hover:bg-slate-600 transition-colors"
          >
            ⏰ Напомнить о расходе
          </button>
          <button
            onClick={() => {
              const msg: ChatMessage = {
                id: `MSG-${Date.now()}`,
                fromId: 'MGR', fromName: 'Руководитель',
                toId: selectedChat, toName: currentChat?.name || '',
                role: 'Руководитель',
                text: 'Прошу подтвердить получение препаратов.',
                date: new Date().toISOString().replace('T', ' ').substring(0, 16),
                read: false, priority: 'Обычное',
              };
              setMessages([...messages, msg]);
            }}
            className="px-3 py-1.5 bg-slate-700 rounded-lg text-xs text-slate-300 hover:bg-slate-600 transition-colors"
          >
            ✅ Подтверждение получения
          </button>
        </div>
      </div>
    </div>
  );
}
