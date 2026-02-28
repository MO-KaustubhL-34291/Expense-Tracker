# Expense Tracker - Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ installed
- npm or yarn package manager

### Installation & Setup

1. **Clone and install dependencies:**
   ```bash
   cd expense-tracker
   npm install
   ```

2. **Configure environment variables:**
   - Frontend: Create `.env` file:
     ```
     VITE_API_URL=http://localhost:5000/api
     ```
   - Backend: Create `backend/.env` file:
     ```
     PORT=5000
     NODE_ENV=development
     ```

## 🎮 Running the Application

### Development Mode (Recommended for development)

**Option 1: Run both servers together**
```bash
npm run dev:fullstack
```
This will start:
- Frontend on http://localhost:5173 (Vite dev server)
- Backend on http://localhost:5000

**Option 2: Run servers separately**

Terminal 1:
```bash
npm run dev
```

Terminal 2:
```bash
npm run dev:backend
```

### Production Mode (MCP Server)

1. **Build the application:**
   ```bash
   npm run build
   ```
   This creates optimized production files in the `dist` folder.

2. **Start the MCP server:**
   ```bash
   npm start
   ```
   Or:
   ```bash
   node mcp-server.js
   ```

   The MCP server will:
   - Serve built frontend on **port 3000**
   - Run backend API on **port 5000**
   - Both services managed from single process

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Health Check: http://localhost:5000/api/health

## 📊 MCP Server Architecture

```
┌─────────────────────────────────────┐
│         MCP Server (Node.js)        │
│             Port 3000               │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────┐  ┌─────────────┐ │
│  │   Frontend   │  │   Backend   │ │
│  │  (React)     │  │  (Express)  │ │
│  │              │  │             │ │
│  │  Static      │  │  Port 5000  │ │
│  │  Files       │  │             │ │
│  └──────────────┘  └─────────────┘ │
│                                     │
└─────────────────────────────────────┘
           ↓              ↓
       Browser        Database
                   (transactions.json)
```

## 🔧 Configuration Files

### 1. mcp-server.js
Main server file that:
- Spawns backend process
- Serves frontend static files
- Routes API requests to backend
- Handles graceful shutdown

### 2. mcp-config.json
Configuration for MCP deployment:
```json
{
  "deployment": {
    "frontend": { "port": 3000 },
    "backend": { "port": 5000 }
  }
}
```

### 3. package.json Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start frontend dev server (Vite) |
| `npm run dev:backend` | Start backend dev server |
| `npm run dev:fullstack` | Start both servers concurrently |
| `npm run build` | Build frontend for production |
| `npm start` | Start MCP server (production) |
| `npm run start:backend` | Start backend only |

## 🌐 API Testing

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Get Transactions
```bash
curl http://localhost:5000/api/transactions
```

### Create Transaction
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Grocery Shopping",
    "amount": 75.50,
    "type": "expense",
    "category": "Food",
    "date": "2026-02-28",
    "notes": "Weekly groceries"
  }'
```

### Delete Transaction
```bash
curl -X DELETE http://localhost:5000/api/transactions/1234567890
```

## 📁 Directory Structure After Setup

```
expense-tracker/
├── backend/
│   ├── database/
│   │   ├── db.js
│   │   └── transactions.json       # Created automatically
│   ├── routes/
│   │   └── transactions.js
│   ├── server.js
│   └── .env                        # Create this
├── src/
│   ├── components/
│   ├── services/
│   └── ...
├── dist/                           # Created by npm run build
├── node_modules/                   # Created by npm install
├── .env                            # Create this
├── .env.production                 # Create this
├── mcp-server.js
├── mcp-config.json
└── package.json
```

## 🔍 Troubleshooting

### Port Already in Use
If you get "port already in use" error:

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
lsof -i :3000
kill -9 <PID>
```

### Backend Not Starting
1. Check if port 5000 is available
2. Verify `backend/.env` exists with correct PORT
3. Check Node.js version (v18+ required)

### Frontend Can't Connect to Backend
1. Verify backend is running: http://localhost:5000/api/health
2. Check `.env` has correct `VITE_API_URL`
3. Clear browser cache
4. Check browser console for CORS errors

### Database Issues
- Database file is created automatically on first run
- Located at: `backend/database/transactions.json`
- Delete file to reset all data

## 🔒 Security Notes

### Development
- CORS is enabled for all origins
- Suitable for local development only

### Production
- Update CORS settings in `backend/server.js`
- Use environment variables for sensitive data
- Enable HTTPS for production deployment
- Implement authentication if needed

## 📈 Performance Optimization

### Frontend
- Code splitting enabled (Vite)
- Static assets cached
- Minified production build

### Backend
- JSON file database (suitable for < 10,000 records)
- For larger scale, migrate to PostgreSQL/MongoDB
- Add Redis caching layer for analytics

## 🚀 Advanced Deployment

### PM2 (Process Manager)
```bash
npm install -g pm2
pm2 start mcp-server.js --name expense-tracker
pm2 startup
pm2 save
```

### Docker (Optional)
Create `Dockerfile`:
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000 5000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t expense-tracker .
docker run -p 3000:3000 -p 5000:5000 expense-tracker
```

## 📝 Monitoring

### Check Server Status
```bash
# MCP Server logs
node mcp-server.js

# Backend logs
npm run dev:backend

# Frontend logs
npm run dev
```

### Monitor Resources
- Check CPU/Memory usage
- Monitor API response times
- Track database file size

## 🆘 Support

For issues:
1. Check logs in console
2. Verify all environments variables
3. Ensure all dependencies installed
4. Check Node.js version compatibility

---

**Ready to Deploy!** 🎉

Start with: `npm run dev:fullstack` for development
Or: `npm run build && npm start` for production
