# OTP-Based Login Guide

## ✅ What's Implemented

Your application now uses **OTP (One-Time Password) based authentication** with **session management** instead of JWT tokens.

### Key Features:
- ✅ **Email OTP Login** - No passwords needed
- ✅ **Session-Based Auth** - Secure server-side sessions (no tokens in cookies/localStorage)
- ✅ **6-Digit OTP** - Expires in 5 minutes
- ✅ **Rate Limiting** - Max 3 OTP verification attempts
- ✅ **Security** - HTTPOnly session cookies
- ✅ **Resend OTP** - Users can request new OTP

## 🚀 How It Works

### Login Flow:

1. **User enters email** → Click "Send OTP"
2. **System generates OTP** → Sends to email (logged in console for dev)
3. **User receives OTP** → Enters 6-digit code
4. **System verifies OTP** → Creates session
5. **User authenticated** → Session stored server-side

### Security Features:

- **No tokens in browser** - Session ID only (HTTPOnly cookie)
- **OTP expires** - 5 minutes validity
- **Rate limiting** - 3 attempts max
- **Server-side validation** - All checks on backend
- **Session expiry** - 24 hours

## 🧪 How to Test

### 1. Start the Server

```bash
npm run dev
```

### 2. Open Browser

Navigate to **http://localhost:3000**

### 3. Login as Admin

1. **Enter email:** `admin@company.com`
2. **Click "Send OTP"**
3. **Check console** for OTP (development mode logs it)
4. **Enter the 6-digit OTP**
5. **Click "Verify & Sign In"**

### 4. Login as Employee

1. **Enter email:** `employee@company.com`
2. Follow same steps

### 5. Check Console for OTP

When you click "Send OTP", the server console will show:

```
🔐 OTP for admin@company.com: 123456
```

Copy this OTP and paste it in the login form.

## 📧 Email Configuration

### Development Mode (Current)

- OTPs are **logged to console**
- No actual emails sent
- Perfect for testing

### Production Mode (To Configure)

Update `src/backend/utils/email.js` with your email service:

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // or your SMTP server
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS  // your password/app password
  }
});
```

Add to `.env.local`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
SESSION_SECRET=your-secret-session-key-change-this
```

## 🔒 Session Management

### How Sessions Work:

1. **Login** → Server creates session with user data
2. **Session ID** → Stored in HTTPOnly cookie (client can't access)
3. **Every request** → Cookie sent automatically
4. **Server validates** → Checks session exists and is valid
5. **Logout** → Session destroyed

### Session Storage:

- **Development:** In-memory (resets on server restart)
- **Production:** Use Redis or database for persistence

Example production setup:

```javascript
// Install: npm install connect-redis redis
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');

const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379
});

server.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // HTTPS in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
```

## 🛠 GraphQL API

### Request OTP

```graphql
mutation {
  requestOTP(email: "admin@company.com") {
    success
    message
  }
}
```

### Verify OTP & Login

```graphql
mutation {
  verifyOTP(email: "admin@company.com", otp: "123456") {
    user {
      id
      username
      email
      role
    }
    message
  }
}
```

### Logout

```graphql
mutation {
  logout
}
```

### Check Current User

```graphql
query {
  me {
    id
    username
    email
    role
  }
}
```

## 🔐 Security Best Practices

### What We Did Right:

✅ **No tokens in localStorage** - Can't be stolen via XSS
✅ **HTTPOnly cookies** - JavaScript can't access session ID
✅ **SameSite cookie** - CSRF protection
✅ **OTP expiry** - 5 minutes timeout
✅ **Rate limiting** - Max 3 attempts
✅ **Server-side sessions** - User data never exposed to client

### Additional Recommendations:

1. **HTTPS in Production** - Set `secure: true` for cookies
2. **Redis for Sessions** - Persistent session storage
3. **Email verification** - Verify email ownership on signup
4. **IP rate limiting** - Prevent brute force attacks
5. **2FA backup** - SMS or authenticator app as backup

## 🐛 Troubleshooting

### OTP Not Working?

1. **Check console** - OTP is logged in server console
2. **Check email** - Verify email address exists in users
3. **OTP expired?** - Request new one (5 min expiry)
4. **Too many attempts?** - Request new OTP

### Session Issues?

1. **Cookies enabled?** - Check browser settings
2. **CORS configured?** - Check `credentials: 'include'`
3. **SameSite setting** - May need adjustment for localhost

### Server Restart Loses Sessions?

- Normal in development (in-memory storage)
- Use Redis for production persistence

## 📊 Test Accounts

| Email | Role | Access |
|-------|------|--------|
| admin@company.com | Admin | Full access (CRUD) |
| employee@company.com | Employee | Read-only |

## 🎯 Features

- ✅ OTP-based login
- ✅ Email delivery (dev mode: console)
- ✅ 6-digit OTP
- ✅ 5-minute expiry
- ✅ 3 attempt limit
- ✅ Resend OTP
- ✅ Session management
- ✅ HTTPOnly cookies
- ✅ Automatic session validation
- ✅ Secure logout

## 🚀 Next Steps

For production deployment:

1. Configure real email service (Gmail, SendGrid, etc.)
2. Set up Redis for session storage
3. Enable HTTPS
4. Set strong SESSION_SECRET
5. Configure proper CORS origins
6. Add monitoring and logging
7. Set up email templates

---

**Your authentication is now more secure with OTP and session-based auth!** 🎉

