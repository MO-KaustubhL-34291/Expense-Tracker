import express from 'express';
import {
  createUser,
  findUserByEmail,
  findUserById,
  verifyPassword
} from '../database/users.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const validateRegister = (req, res, next) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({
      error: {
        message: 'Email, password, and name are required',
        status: 400
      }
    });
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: {
        message: 'Invalid email format',
        status: 400
      }
    });
  }
  
  // Password validation
  if (password.length < 6) {
    return res.status(400).json({
      error: {
        message: 'Password must be at least 6 characters',
        status: 400
      }
    });
  }
  
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      error: {
        message: 'Email and password are required',
        status: 400
      }
    });
  }
  
  next();
};

// POST /api/auth/register - Register new user
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Create user
    const user = await createUser({ email, password, name });
    
    // Generate token
    const token = generateToken(user.id);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    if (error.message === 'User already exists') {
      return res.status(409).json({
        error: {
          message: 'User with this email already exists',
          status: 409
        }
      });
    }
    
    res.status(500).json({
      error: {
        message: 'Failed to register user',
        status: 500
      }
    });
  }
});

// POST /api/auth/login - Login user
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = findUserByEmail(email);
    
    if (!user) {
      return res.status(401).json({
        error: {
          message: 'Invalid email or password',
          status: 401
        }
      });
    }
    
    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({
        error: {
          message: 'Invalid email or password',
          status: 401
        }
      });
    }
    
    // Generate token
    const token = generateToken(user.id);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to login',
        status: 500
      }
    });
  }
});

// GET /api/auth/me - Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        error: {
          message: 'Access token required',
          status: 401
        }
      });
    }
    
    const { verifyToken } = await import('../middleware/auth.js');
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(403).json({
        error: {
          message: 'Invalid or expired token',
          status: 403
        }
      });
    }
    
    const user = findUserById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({
        error: {
          message: 'User not found',
          status: 404
        }
      });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to fetch user',
        status: 500
      }
    });
  }
});

export default router;
