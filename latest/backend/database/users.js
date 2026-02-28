import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_DB_PATH = path.join(__dirname, 'users.json');

// Initialize users database
export const initializeUsersDB = () => {
  if (!fs.existsSync(USERS_DB_PATH)) {
    fs.writeFileSync(USERS_DB_PATH, JSON.stringify({ users: [] }, null, 2));
    console.log('Users database initialized: users.json');
  }
};

// Read all users
export const readUsers = () => {
  try {
    const data = fs.readFileSync(USERS_DB_PATH, 'utf-8');
    return JSON.parse(data).users;
  } catch (error) {
    console.error('Error reading users database:', error);
    return [];
  }
};

// Write users
export const writeUsers = (users) => {
  try {
    fs.writeFileSync(
      USERS_DB_PATH, 
      JSON.stringify({ users }, null, 2),
      'utf-8'
    );
    return true;
  } catch (error) {
    console.error('Error writing to users database:', error);
    return false;
  }
};

// Find user by email
export const findUserByEmail = (email) => {
  const users = readUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

// Find user by ID
export const findUserById = (id) => {
  const users = readUsers();
  return users.find(u => u.id === id);
};

// Create new user
export const createUser = async (userData) => {
  const users = readUsers();
  
  // Check if user already exists
  if (findUserByEmail(userData.email)) {
    throw new Error('User already exists');
  }
  
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);
  
  const newUser = {
    id: Date.now(),
    email: userData.email.toLowerCase(),
    name: userData.name,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  users.push(newUser);
  writeUsers(users);
  
  // Return user without password
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

// Verify password
export const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// Update user
export const updateUser = (id, updates) => {
  const users = readUsers();
  const index = users.findIndex(u => u.id === id);
  
  if (index === -1) {
    return null;
  }
  
  users[index] = {
    ...users[index],
    ...updates,
    id, // Preserve ID
    password: users[index].password, // Don't allow password update here
    updatedAt: new Date().toISOString()
  };
  
  writeUsers(users);
  
  const { password, ...userWithoutPassword } = users[index];
  return userWithoutPassword;
};

// Get user's transactions
export const getUserTransactions = (userId, allTransactions) => {
  return allTransactions.filter(t => t.userId === userId);
};
