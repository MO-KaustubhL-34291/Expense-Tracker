import express from 'express';
import {
  readTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionById,
  getAnalytics
} from '../database/db.js';

const router = express.Router();

// Validation middleware
const validateTransaction = (req, res, next) => {
  const { title, amount, type, category } = req.body;
  
  if (!title || !amount || !type || !category) {
    return res.status(400).json({
      error: {
        message: 'Missing required fields: title, amount, type, category',
        status: 400
      }
    });
  }
  
  if (type !== 'income' && type !== 'expense') {
    return res.status(400).json({
      error: {
        message: 'Type must be either "income" or "expense"',
        status: 400
      }
    });
  }
  
  if (isNaN(amount) || parseFloat(amount) <= 0) {
    return res.status(400).json({
      error: {
        message: 'Amount must be a positive number',
        status: 400
      }
    });
  }
  
  next();
};

// GET /api/transactions - Get all transactions
router.get('/', (req, res) => {
  try {
    const transactions = readTransactions();
    res.json({
      success: true,
      data: transactions,
      count: transactions.length
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to fetch transactions',
        status: 500
      }
    });
  }
});

// GET /api/transactions/:id - Get single transaction
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const transaction = getTransactionById(id);
    
    if (!transaction) {
      return res.status(404).json({
        error: {
          message: 'Transaction not found',
          status: 404
        }
      });
    }
    
    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to fetch transaction',
        status: 500
      }
    });
  }
});

// POST /api/transactions - Create new transaction
router.post('/', validateTransaction, (req, res) => {
  try {
    const transaction = addTransaction(req.body);
    res.status(201).json({
      success: true,
      data: transaction,
      message: 'Transaction created successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to create transaction',
        status: 500
      }
    });
  }
});

// PUT /api/transactions/:id - Update transaction
router.put('/:id', validateTransaction, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedTransaction = updateTransaction(id, req.body);
    
    if (!updatedTransaction) {
      return res.status(404).json({
        error: {
          message: 'Transaction not found',
          status: 404
        }
      });
    }
    
    res.json({
      success: true,
      data: updatedTransaction,
      message: 'Transaction updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to update transaction',
        status: 500
      }
    });
  }
});

// DELETE /api/transactions/:id - Delete transaction
router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = deleteTransaction(id);
    
    if (!deleted) {
      return res.status(404).json({
        error: {
          message: 'Transaction not found',
          status: 404
        }
      });
    }
    
    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to delete transaction',
        status: 500
      }
    });
  }
});

// GET /api/transactions/analytics/summary - Get analytics
router.get('/analytics/summary', (req, res) => {
  try {
    const analytics = getAnalytics();
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to fetch analytics',
        status: 500
      }
    });
  }
});

export default router;
