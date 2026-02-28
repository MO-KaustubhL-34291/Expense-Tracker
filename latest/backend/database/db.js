import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'transactions.json');

// Initialize database file
export const initializeDatabase = () => {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ transactions: [] }, null, 2));
    console.log('Database initialized: transactions.json');
  }
};

// Read all transactions
export const readTransactions = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data).transactions;
  } catch (error) {
    console.error('Error reading database:', error);
    return [];
  }
};

// Write transactions
export const writeTransactions = (transactions) => {
  try {
    fs.writeFileSync(
      DB_PATH, 
      JSON.stringify({ transactions }, null, 2),
      'utf-8'
    );
    return true;
  } catch (error) {
    console.error('Error writing to database:', error);
    return false;
  }
};

// Get transaction by ID
export const getTransactionById = (id) => {
  const transactions = readTransactions();
  return transactions.find(t => t.id === id);
};

// Add transaction
export const addTransaction = (transaction) => {
  const transactions = readTransactions();
  const newTransaction = {
    ...transaction,
    id: Date.now(),
    createdAt: new Date().toISOString()
  };
  transactions.unshift(newTransaction);
  writeTransactions(transactions);
  return newTransaction;
};

// Update transaction
export const updateTransaction = (id, updatedData) => {
  const transactions = readTransactions();
  const index = transactions.findIndex(t => t.id === id);
  
  if (index === -1) {
    return null;
  }
  
  transactions[index] = {
    ...transactions[index],
    ...updatedData,
    id, // Preserve original ID
    updatedAt: new Date().toISOString()
  };
  
  writeTransactions(transactions);
  return transactions[index];
};

// Delete transaction
export const deleteTransaction = (id) => {
  const transactions = readTransactions();
  const filteredTransactions = transactions.filter(t => t.id !== id);
  
  if (transactions.length === filteredTransactions.length) {
    return false; // Transaction not found
  }
  
  writeTransactions(filteredTransactions);
  return true;
};

// Get analytics
export const getAnalytics = () => {
  const transactions = readTransactions();
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  const balance = totalIncome - totalExpense;
  
  // Category breakdown
  const categoryData = transactions.reduce((acc, t) => {
    if (t.type === 'expense') {
      acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
    }
    return acc;
  }, {});
  
  const categories = Object.entries(categoryData)
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount);
  
  return {
    totalIncome,
    totalExpense,
    balance,
    categories,
    transactionCount: transactions.length
  };
};
