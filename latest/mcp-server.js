import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const FRONTEND_PORT = process.env.PORT || 3000;
const BACKEND_PORT = process.env.API_PORT || 5000;

// Start backend server
let backendProcess;

const startBackend = () => {
  console.log('Starting backend server...');
  backendProcess = spawn('node', ['backend/server.js'], {
    env: { ...process.env, PORT: BACKEND_PORT },
    stdio: 'inherit'
  });

  backendProcess.on('error', (error) => {
    console.error('Failed to start backend:', error);
  });

  backendProcess.on('exit', (code) => {
    console.log(`Backend process exited with code ${code}`);
  });
};

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'dist')));

// API proxy to backend (optional - for unified port access)
app.use('/api', (req, res) => {
  const backendUrl = `http://localhost:${BACKEND_PORT}${req.url}`;
  res.redirect(307, backendUrl);
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start servers
startBackend();

app.listen(FRONTEND_PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║                                                ║
║        EXPENSE TRACKER MCP SERVER              ║
║                                                ║
║  Frontend:  http://localhost:${FRONTEND_PORT}              ║
║  Backend:   http://localhost:${BACKEND_PORT}              ║
║                                                ║
║  Status: RUNNING                               ║
║                                                ║
╚════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing servers');
  if (backendProcess) {
    backendProcess.kill();
  }
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing servers');
  if (backendProcess) {
    backendProcess.kill();
  }
  process.exit(0);
});
