import { useMemo } from 'react';
import './Analytics.css';

const Analytics = ({ transactions }) => {
  const analytics = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpense;
    
    // Category breakdown
    const categoryData = transactions.reduce((acc, t) => {
      if (t.type === 'expense') {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
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
      categories
    };
  }, [transactions]);

  return (
    <div className="analytics-container">
      <h2>Financial Overview</h2>
      
      <div className="analytics-grid">
        <div className="stat-card income-card">
          <div className="stat-label">Total Income</div>
          <div className="stat-value">${analytics.totalIncome.toFixed(2)}</div>
        </div>
        
        <div className="stat-card expense-card">
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value">${analytics.totalExpense.toFixed(2)}</div>
        </div>
        
        <div className="stat-card balance-card">
          <div className="stat-label">Current Balance</div>
          <div className={`stat-value ${analytics.balance >= 0 ? 'positive' : 'negative'}`}>
            ${analytics.balance.toFixed(2)}
          </div>
        </div>
      </div>

      {analytics.categories.length > 0 && (
        <div className="category-breakdown">
          <h3>Expense Breakdown by Category</h3>
          <div className="category-list">
            {analytics.categories.map(cat => (
              <div key={cat.name} className="category-item">
                <div className="category-info">
                  <span className="category-name">{cat.name}</span>
                  <span className="category-amount">${cat.amount.toFixed(2)}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
                <div className="category-percentage">{cat.percentage.toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
