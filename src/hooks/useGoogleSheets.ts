import { useState, useEffect, useCallback } from 'react';
import { googleSheetsService, SheetsConfig } from '../services/googleSheets';

export function useGoogleSheets() {
  const [config, setConfig] = useState<SheetsConfig>(googleSheetsService.getConfig());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = googleSheetsService.subscribe(() => {
      setConfig(googleSheetsService.getConfig());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const connect = useCallback(async (apiKey: string, spreadsheetId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      googleSheetsService.setConfig(apiKey, spreadsheetId);
      const success = await googleSheetsService.testConnection();
      
      if (!success) {
        setError('Не удалось подключиться. Проверьте API ключ и ID таблицы.');
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка подключения');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    googleSheetsService.disconnect();
  }, []);

  const readData = useCallback(async <T>(sheetName: string, parser: (data: any[]) => T[]): Promise<T[]> => {
    if (!config.connected) {
      throw new Error('Не подключено к Google Sheets');
    }

    setLoading(true);
    setError(null);

    try {
      const data = await googleSheetsService.readSheet(sheetName);
      return parser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка чтения данных');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [config.connected]);

  const writeData = useCallback(async (sheetName: string, values: any[][]) => {
    if (!config.connected) {
      throw new Error('Не подключено к Google Sheets');
    }

    setLoading(true);
    setError(null);

    try {
      await googleSheetsService.writeToSheet(sheetName, values);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка записи данных');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [config.connected]);

  return {
    config,
    loading,
    error,
    connect,
    disconnect,
    readData,
    writeData,
  };
}
