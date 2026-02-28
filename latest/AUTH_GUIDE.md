# 🔐 Authentication Implementation Guide

## ✅ What Has Been Implemented

### Backend Authentication

#### 1. **User Database** (`backend/database/users.js`)
- User registration with password hashing (bcrypt)
- User login with password verification
- JWT token generation
- User storage in JSON file

#### 2. **Auth Middleware** (`backend/middleware/auth.js`)
- JWT token verification
- Protected route middleware
- Token-based authentication

#### 3. **Auth Routes** (`backend/routes/auth.js`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

#### 4. **Protected Transactions**
- All transaction routes now require authentication
- Transactions are associated with specific users
- Users can only see their own transactions

### Frontend Authentication

#### 1. **Auth Context** (`src/context/AuthContext.jsx`)
- Global authentication state management
- Login/Register/Logout functions
- Automatic token management
- User session persistence

#### 2. **Auth Form** (`src/components/AuthForm.jsx`)
- Login and Register forms
- Form validation
- Error handling
- Toggle between login/register modes

#### 3. **Protected App**
- App only accessible when logged in
- Automatic redirect to login when not authenticated
- User info displayed in header
- Logout functionality

## 🚀 How to Use

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `jsonwebtoken` - JWT token generation/verification
- `bcryptjs` - Password hashing

### 2. Start the Application

```bash
npm run dev:fullstack
```

### 3. Register a New User

1. Open http://localhost:5173
2. You'll see the login/register form
3. Click "Register" link
4. Fill in:
   - Name: Your name
   - Email: your@email.com
   - Password: At least 6 characters
5. Click Register button

### 4. Login

Use your registered credentials to login. The app will:
- Authenticate your credentials
- Generate a JWT token
- Store token in localStorage
- Redirect to main app

### 5. Use the App

Once logged in:
- Add transactions (they're saved to your account)
- View your transactions
- See your analytics
- Logout button in top-right

## 🔒 Security Features

### Password Security
- Passwords hashed using bcryptjs (salt rounds: 10)
- Never stored in plain text
- Never sent in API responses

### Token Security
- JWT tokens with 7-day expiration
- Stored in localStorage
- Sent in Authorization header: `Bearer <token>`
- Verified on every protected route

### API Protection
- All transaction endpoints require valid JWT
- Users can only access their own data
- Invalid tokens return 401/403 errors

## 📊 Data Structure

### User Object
```json
{
  "id": 1234567890,
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2026-02-28T10:00:00.000Z",
  "updatedAt": "2026-02-28T10:00:00.000Z"
}
```

### Transaction Object (Updated)
```json
{
  "id": 1234567890,
  "userId": 1234567890,
  "title": "Grocery Shopping",
  "amount": 75.50,
  "type": "expense",
  "category": "Food",
  "date": "2026-02-28",
  "notes": "Weekly groceries",
  "createdAt": "2026-02-28T10:30:00.000Z"
}
```

## 🔧 API Endpoints

### Authentication Endpoints

#### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure123"
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "id": 123, "email": "john@example.com", "name": "John Doe" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure123"
}
```

Response: Same as register

#### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer <token>
```

### Transaction Endpoints (Now Protected)

All transaction endpoints now require:
```bash
Authorization: Bearer <your-jwt-token>
```

Example:
```bash
GET /api/transactions
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🎨 UI/UX Features

### Auth Form Design
- Black & white theme consistent with app
- Clean, modern login/register interface
- Toggle between login and register
- Real-time form validation
- Error message display
- Loading states

### Header Updates
- User name display with icon
- Logout button
- Connection status indicator

## 🔍 Testing the Authentication

### Test User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123"
  }'
```

### Test User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

### Test Protected Route
```bash
# First, copy the token from login response
curl http://localhost:5000/api/transactions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🛠️ Customization

### Change Token Expiration
Edit `backend/middleware/auth.js`:
```javascript
const JWT_EXPIRES_IN = '30d'; // Change to 30 days
```

### Change JWT Secret
Edit `backend/.env`:
```
JWT_SECRET=your-super-secure-secret-key-here
```

**Important:** Use a strong, random secret in production!

### Password Requirements
Edit `backend/routes/auth.js`:
```javascript
if (password.length < 8) { // Change to 8 characters
  return res.status(400).json({
    error: { message: 'Password must be at least 8 characters' }
  });
}
```

## 📁 New File Structure

```
backend/
├── database/
│   ├── db.js
│   ├── users.js          # NEW: User database operations
│   ├── transactions.json
│   └── users.json        # NEW: User storage (auto-created)
├── middleware/
│   └── auth.js           # NEW: JWT auth middleware
├── routes/
│   ├── auth.js           # NEW: Auth routes
│   └── transactions.js   # UPDATED: Now protected
└── server.js             # UPDATED: Added auth routes

src/
├── components/
│   ├── AuthForm.jsx      # NEW: Login/Register form
│   ├── AuthForm.css      # NEW: Auth styling
│   └── ...
├── context/
│   └── AuthContext.jsx   # NEW: Auth state management
├── services/
│   └── api.js            # UPDATED: Added JWT headers
├── App.jsx               # UPDATED: Auth protection
└── main.jsx              # UPDATED: Added AuthProvider
```

## ⚠️ Important Notes

1. **Database Files**: Two new JSON files will be created:
   - `backend/database/users.json` - User accounts
   - `backend/database/transactions.json` - User transactions

2. **JWT Secret**: Change `JWT_SECRET` in `backend/.env` for production

3. **Token Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)

4. **Password Reset**: Not implemented (can be added later)

5. **Email Verification**: Not implemented (can be added later)

## 🚀 Next Steps

Optional enhancements:
- Add "Forgot Password" functionality
- Add email verification
- Add OAuth (Google, GitHub) login
- Add refresh tokens
- Add user profile editing
- Add password change functionality
- Migrate to httpOnly cookies instead of localStorage

## ✅ Authentication Complete!

Your expense tracker now has full JWT-based authentication with:
- ✅ User registration
- ✅ User login
- ✅ Protected routes
- ✅ User-specific transactions
- ✅ Logout functionality
- ✅ Token management
- ✅ Password security

Run `npm install` and `npm run dev:fullstack` to start using it!
