import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import AuthForm from './components/AuthForm';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Analytics from './components/Analytics';
import { transactionAPI, checkHealth } from './services/api';
import './App.css';

function App() {
  const { user, logout, loading: authLoading } = useAuth();
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

  // Fetch transactions only when user is authenticated
  useEffect(() => {
    if (user) {
      fetchTransactions();
    } else {
      setTransactions([]);
      setLoading(false);
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await transactionAPI.getAll();
      setTransactions(data);
    } catch (err) {
      setError('Failed to load transactions');
      console.error(err);
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
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await transactionAPI.delete(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete transaction');
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Show auth form if not logged in
  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-main">
            <div>
              <h1 className="app-title">Expense Tracker</h1>
              <p className="app-subtitle">Manage Your Finances with Style</p>
            </div>
            <div className="user-section">
              <span className="user-name">👤 {user.name}</span>
              <button onClick={logout} className="logout-btn">Logout</button>
            </div>
          </div>
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
