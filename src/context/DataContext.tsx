import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import * as gs from '../services/googleSheets';

interface DataContextType {
  employees: gs.Employee[];
  nomenclature: gs.Nomenclature[];
  arrivals: gs.Arrival[];
  expenses: gs.Expense[];
  returns: gs.ReturnOperation[];
  chatMessages: gs.ChatMessage[];
  auditLog: gs.AuditEntry[];
  loading: boolean;
  error: string | null;
  connected: boolean;
  refresh: () => Promise<void>;
  addEmployee: (e: Partial<gs.Employee>) => Promise<void>;
  addArrival: (a: Partial<gs.Arrival>) => Promise<void>;
  addExpense: (e: Partial<gs.Expense>) => Promise<void>;
  addReturn: (r: Partial<gs.ReturnOperation>) => Promise<void>;
  addChatMessage: (m: Partial<gs.ChatMessage>) => Promise<void>;
  addAuditLog: (l: Partial<gs.AuditEntry>) => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<gs.Employee[]>([]);
  const [nomenclature, setNomenclature] = useState<gs.Nomenclature[]>([]);
  const [arrivals, setArrivals] = useState<gs.Arrival[]>([]);
  const [expenses, setExpenses] = useState<gs.Expense[]>([]);
  const [returns, setReturns] = useState<gs.ReturnOperation[]>([]);
  const [chatMessages, setChatMessages] = useState<gs.ChatMessage[]>([]);
  const [auditLog, setAuditLog] = useState<gs.AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [emps, noms, arrs, exps, rets, msgs, logs] = await Promise.all([
        gs.getEmployees(),
        gs.getNomenclature(),
        gs.getArrivals(),
        gs.getExpenses(),
        gs.getReturns(),
        gs.getChatMessages(),
        gs.getAuditLog(),
      ]);
      setEmployees(emps);
      setNomenclature(noms);
      setArrivals(arrs);
      setExpenses(exps);
      setReturns(rets);
      setChatMessages(msgs);
      setAuditLog(logs);
      setConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addEmployee = async (e: Partial<gs.Employee>) => {
    await gs.addEmployee(e);
    await refresh();
  };

  const addArrival = async (a: Partial<gs.Arrival>) => {
    await gs.addArrival(a);
    await refresh();
  };

  const addExpense = async (e: Partial<gs.Expense>) => {
    await gs.addExpense(e);
    await refresh();
  };

  const addReturn = async (r: Partial<gs.ReturnOperation>) => {
    await gs.addReturn(r);
    await refresh();
  };

  const addChatMessage = async (m: Partial<gs.ChatMessage>) => {
    await gs.addChatMessage(m);
    await refresh();
  };

  const addAuditLog = async (l: Partial<gs.AuditEntry>) => {
    await gs.addAuditLog(l);
    await refresh();
  };

  return (
    <DataContext.Provider value={{
      employees, nomenclature, arrivals, expenses, returns, chatMessages, auditLog,
      loading, error, connected, refresh,
      addEmployee, addArrival, addExpense, addReturn, addChatMessage, addAuditLog,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
