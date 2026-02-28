# Expense Tracker - Full Stack Application

A modern expense tracking application with React frontend and Express backend, deployed on MCP Server.

## 🚀 Features

- ✅ Add, edit, and delete transactions
- 📊 Real-time analytics dashboard
- 💰 Track income and expenses
- 📈 Category-based expense breakdown
- 🎨 Black & White minimalist design
- 💾 Persistent data storage
- 🔌 RESTful API backend
- 📱 Responsive design

## 🏗️ Architecture

```
Frontend (React/Vite) → Backend (Express) → Database (JSON)
         ↓                    ↓
    Port 3000           Port 5000
         ↓                    ↓
         MCP Server (Unified Hosting)
```

## 📦 Installation

Install all dependencies:
```bash
npm install
```

## 🎮 Running the Application

### Development Mode

**Run both frontend and backend concurrently:**
```bash
npm run dev:fullstack
```

**Or run separately:**

Terminal 1 (Frontend):
```bash
npm run dev
```

Terminal 2 (Backend):
```bash
npm run dev:backend
```

### Production Mode (MCP Server)

1. Build the frontend:
```bash
npm run build
```

2. Start MCP server:
```bash
npm start
```

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get all transactions |
| GET | `/api/transactions/:id` | Get single transaction |
| POST | `/api/transactions` | Create new transaction |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |
| GET | `/api/transactions/analytics/summary` | Get analytics |
| GET | `/api/health` | Health check |

## 📁 Project Structure

```
expense-tracker/
├── backend/
│   ├── database/
│   │   ├── db.js              # Database operations
│   │   └── transactions.json  # Data storage
│   ├── routes/
│   │   └── transactions.js    # API routes
│   └── server.js              # Express server
├── src/
│   ├── components/            # React components
│   ├── services/              # API client
│   └── App.jsx                # Main app
├── mcp-server.js              # MCP hosting server
├── mcp-config.json            # MCP configuration
└── package.json
```

## 🔧 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (backend/.env)
```
PORT=5000
NODE_ENV=development
```

## 🎨 Design

- **Theme**: Pure black & white minimalist design
- **Typography**: Inter font family
- **Responsive**: Mobile-first approach
- **Components**: Modular architecture

## 📊 Data Model

```javascript
{
  id: Number,
  title: String,
  amount: Number,
  type: "income" | "expense",
  category: String,
  date: String,
  notes: String
}
```

## 🚀 Deployment

The application uses MCP Server for unified hosting of both frontend and backend:

```bash
npm run build  # Build frontend
npm start      # Start MCP server
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📝 License

MIT License

---

Built with React, Express, and MCP Server
