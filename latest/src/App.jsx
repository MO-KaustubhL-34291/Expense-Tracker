import { useState, useEffect } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Analytics from './components/Analytics';
import { transactionAPI, checkHealth } from './services/api';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');

  // Check API health on mount
  useEffect(() => {
    const checkAPI = async () => {
      const health = await checkHealth();
      setApiStatus(health.status === 'OK' ? 'online' : 'offline');
    };
    checkAPI();
  }, []);

  // Fetch transactions on mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await transactionAPI.getAll();
      setTransactions(data);
    } catch (err) {
      setError('Failed to load transactions. Using offline mode.');
      // Fallback to localStorage in case API is down
      const saved = localStorage.getItem('transactions');
      if (saved) {
        setTransactions(JSON.parse(saved));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (transaction) => {
    try {
      const newTransaction = await transactionAPI.create(transaction);
      setTransactions(prev => [newTransaction, ...prev]);
      setError(null);
    } catch (err) {
      setError('Failed to add transaction');
      // Fallback to local storage
      const localTransaction = { ...transaction, id: Date.now() };
      setTransactions(prev => [localTransaction, ...prev]);
      localStorage.setItem('transactions', JSON.stringify([localTransaction, ...transactions]));
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await transactionAPI.delete(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete transaction');
      // Still update UI but show error
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Expense Tracker</h1>
          <p className="app-subtitle">Manage Your Finances with Style</p>
          <div className="api-status">
            <span className={`status-indicator ${apiStatus}`}></span>
            <span className="status-text">
              {apiStatus === 'online' ? 'Connected' : apiStatus === 'offline' ? 'Offline Mode' : 'Connecting...'}
            </span>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {error && (
            <div className="error-banner">
              <span>⚠️ {error}</span>
              <button onClick={() => setError(null)}>✕</button>
            </div>
          )}
          
          {loading ? (
            <div className="loading-container">
              <div className="loader"></div>
              <p>Loading transactions...</p>
            </div>
          ) : (
            <>
              <Analytics transactions={transactions} />
              <TransactionForm onAddTransaction={handleAddTransaction} />
              <TransactionList 
                transactions={transactions} 
                onDeleteTransaction={handleDeleteTransaction} 
              />
            </>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>© 2026 Expense Tracker | Built with React & Express</p>
      </footer>
    </div>
  );
}

export default App;
