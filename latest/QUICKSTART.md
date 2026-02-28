# 🚀 Quick Start Guide - Expense Tracker with Authentication

## ✅ Authentication Successfully Implemented!

Your expense tracker now has JWT-based authentication with user registration and login!

## 📋 Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

This installs all required packages including:
- **jsonwebtoken** - JWT token management
- **bcryptjs** - Password hashing
- **express, cors, dotenv** - Backend
- **react, react-dom** - Frontend

### 2. Start the Application

```bash
npm run dev:fullstack
```

This starts:
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:5000 (Express API)

## 🔐 Using Authentication

### First Time - Register

1. Open http://localhost:5173
2. You'll see the login page
3. Click **"Register"** link at the bottom
4. Fill in:
   - **Name**: Your name
   - **Email**: your@email.com
   - **Password**: At least 6 characters
5. Click **"Register"** button
6. You'll be automatically logged in!

### Returning User - Login

1. Open http://localhost:5173
2. Enter your email and password
3. Click **"Login"** button
4. Access your expense tracker!

### Using the App

Once logged in:
- ✅ **Add transactions** - Income or expenses
- ✅ **View your transactions** - Only yours, not other users'
- ✅ **See analytics** - Real-time stats
- ✅ **Logout** - Click logout button in top-right

## 🎯 Key Features

### Security
- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens for authentication
- ✅ Protected API endpoints
- ✅ User-specific data isolation

### User Experience
- ✅ Clean login/register interface
- ✅ User name displayed in header
- ✅ Logout functionality
- ✅ Session persistence (stays logged in)
- ✅ Error messages for invalid login

## 📊 What Data is Private?

Each user has their own:
- **Transactions** - Only see your own
- **Analytics** - Based on your transactions only
- **Categories** - Your expense breakdown

## 🔧 Testing Multiple Users

Want to test with multiple accounts?

### Create Test User 1
```
Name: Alice Smith
Email: alice@test.com
Password: test123
```

### Create Test User 2
```
Name: Bob Jones
Email: bob@test.com  
Password: test123
```

Log in with each to see they have separate data!

## 🗂️ Data Storage

Two JSON files store your data:
- `backend/database/users.json` - User accounts (auto-created)
- `backend/database/transactions.json` - All transactions (auto-created)

Both files are created automatically on first use.

## 💡 Tips

### Stay Logged In
- Your session persists in browser localStorage
- Close browser and reopen - still logged in!
- Click logout to end session

### Forgot Password?
- Currently no "forgot password" feature
- Delete user from `backend/database/users.json` and re-register
- Or implement password reset (future enhancement)

### Clear All Data
To start fresh:
- Delete `backend/database/users.json`
- Delete `backend/database/transactions.json`
- Restart server

## 🚨 Troubleshooting

### "Invalid email or password"
- Check your credentials
- Email is case-insensitive
- Password is case-sensitive

### "User already exists"
- Email is already registered
- Try a different email
- Or login with existing credentials

### "Access token required"
- You've been logged out
- Refresh the page to see login form
- Log back in

### Can't connect to API
- Make sure backend is running on port 5000
- Check console for errors
- Run `npm run dev:backend` separately to test

## 📝 Quick Commands Reference

```bash
# Install everything
npm install

# Start both servers (recommended)
npm run dev:fullstack

# Start frontend only
npm run dev

# Start backend only
npm run dev:backend

# Production build
npm run build
npm start
```

## 🎨 Features Overview

### Before Authentication
- Single shared data
- No user accounts
- Anyone could see/modify any transaction

### After Authentication ✅
- **User accounts** - Secure registration/login
- **Private data** - Each user sees only their transactions
- **JWT security** - Token-based authentication
- **Password security** - Hashed with bcrypt
- **Session management** - Stay logged in
- **User isolation** - Complete data privacy

## 🔒 Security Notes

### JWT Secret
The JWT secret is in `backend/.env`:
```
JWT_SECRET=expense-tracker-secret-key-change-in-production-abc123
```

⚠️ **Change this in production!**

### Token Expiration
Tokens expire after 7 days. To change:
Edit `backend/middleware/auth.js`:
```javascript
const JWT_EXPIRES_IN = '30d'; // Change to 30 days
```

## 🎉 You're All Set!

Your expense tracker now has:
- ✅ Secure user authentication
- ✅ JWT token management
- ✅ Password hashing
- ✅ Protected routes
- ✅ User-specific data
- ✅ Beautiful black & white UI
- ✅ Complete privacy

**Start tracking your expenses securely!** 💰🔒

---

### Need Help?
Check these files:
- **AUTH_GUIDE.md** - Detailed authentication documentation
- **DEPLOYMENT.md** - Deployment instructions 
- **README.md** - Project overview

Happy expense tracking! 🚀
