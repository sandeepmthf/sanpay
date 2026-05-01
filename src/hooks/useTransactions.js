import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getTransactions();
      setTransactions(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const sendMoney = async (data) => {
    try {
      const response = await api.sendTransaction(data);
      // Optimistically add to local state
      setTransactions((prev) => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      console.error('Send failed', err);
      throw err;
    }
  };

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    sendMoney,
  };
}
