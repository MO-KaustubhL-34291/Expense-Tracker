const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to handle API requests
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'API request failed');
  }
  
  return data;
};

// Transaction API methods
export const transactionAPI = {
  // Get all transactions
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`);
      const data = await handleResponse(response);
      return data.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  // Get single transaction
  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`);
      const data = await handleResponse(response);
      return data.data;
    } catch (error) {
      console.error(`Error fetching transaction ${id}:`, error);
      throw error;
    }
  },

  // Create new transaction
  create: async (transaction) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });
      const data = await handleResponse(response);
      return data.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  // Update transaction
  update: async (id, transaction) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });
      const data = await handleResponse(response);
      return data.data;
    } catch (error) {
      console.error(`Error updating transaction ${id}:`, error);
      throw error;
    }
  },

  // Delete transaction
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'DELETE',
      });
      const data = await handleResponse(response);
      return data;
    } catch (error) {
      console.error(`Error deleting transaction ${id}:`, error);
      throw error;
    }
  },

  // Get analytics
  getAnalytics: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/analytics/summary`);
      const data = await handleResponse(response);
      return data.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },
};

// Health check
export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/api/health`);
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'ERROR', message: 'API is not reachable' };
  }
};
