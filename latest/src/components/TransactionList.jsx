import './TransactionList.css';

const TransactionList = ({ transactions, onDeleteTransaction }) => {
  if (transactions.length === 0) {
    return (
      <div className="transaction-list-container">
        <h2>Recent Transactions</h2>
        <div className="empty-state">
          <p>No transactions yet. Add your first transaction above!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-list-container">
      <h2>Recent Transactions</h2>
      <div className="transaction-list">
        {transactions.map(transaction => (
          <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
            <div className="transaction-header">
              <div className="transaction-info">
                <h3>{transaction.title}</h3>
                <span className="transaction-category">{transaction.category}</span>
              </div>
              <div className="transaction-amount">
                <span className={`amount ${transaction.type}`}>
                  {transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="transaction-details">
              <span className="transaction-date">
                {new Date(transaction.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
              {transaction.notes && (
                <span className="transaction-notes">{transaction.notes}</span>
              )}
            </div>
            <button 
              className="delete-btn"
              onClick={() => onDeleteTransaction(transaction.id)}
              aria-label="Delete transaction"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
