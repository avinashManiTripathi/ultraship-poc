# 🚀 Setup Instructions - MongoDB Migration Complete

## ✅ What's Been Done

Your application has been **completely migrated from in-memory storage to MongoDB**. Here's what changed:

### 1. **Database Layer** ✅
- ✅ Installed `mongoose` for MongoDB integration
- ✅ Created MongoDB connection module
- ✅ Removed all hardcoded data from code

### 2. **Database Models** ✅
Created 4 Mongoose models with full schema validation:
- `User` - Authentication and authorization
- `Employee` - Employee management with indexes
- `Department` - Department management
- `OTP` - OTP storage with TTL (auto-expiry)

### 3. **GraphQL Resolvers** ✅
- ✅ Completely rewritten to use MongoDB
- ✅ Implemented proper error handling
- ✅ Added authorization middleware
- ✅ Optimized queries with indexes and pagination

### 4. **Authentication** ✅
- ✅ Session-based auth (no tokens in cookies)
- ✅ OTP-based login via email
- ✅ Role-based access control (Admin/Employee)

### 5. **Database Seeding** ✅
- ✅ Automatic seeding on first run
- ✅ Creates 2 users (admin, employee)
- ✅ Creates 6 departments
- ✅ Creates 10 sample employees
- ✅ Uses environment variables (no hardcoded values)

### 6. **Server Integration** ✅
- ✅ Updated `server.js` to connect to MongoDB
- ✅ Integrated automatic seeding
- ✅ Updated GraphQL playground

### 7. **Environment Configuration** ✅
- ✅ Created `.env.local` with defaults
- ✅ Created `.env.example` for reference
- ✅ All sensitive data moved to environment variables

---

## 📋 Next Steps (What You Need To Do)

### Step 1: Install MongoDB

Choose **ONE** of these options:

#### Option A: Local MongoDB (Recommended for Development)

**macOS:**
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB
brew services start mongodb-community@7.0

# Verify it's running
mongosh
```

**Windows:**
1. Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer
3. Start MongoDB service from Services

**Linux (Ubuntu/Debian):**
```bash
# Install
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Option B: MongoDB Atlas (Cloud - Free Tier)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a free M0 cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Update `.env.local`:
   ```bash
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/employee-management
   ```
7. **Important:** Whitelist your IP or allow 0.0.0.0/0 in Network Access

---

### Step 2: Install Dependencies (if not already done)

```bash
npm install
```

---

### Step 3: Start the Application

```bash
# Kill any running dev servers first
pkill -f "node server.js"

# Start fresh
npm run dev
```

---

### Step 4: Verify Everything Works

You should see this output:

```
✅ MongoDB Connected: localhost (or your Atlas host)
📊 Database: employee-management
🌱 Seeding database...
✅ Created admin user: admin@company.com
✅ Created employee user: employee@company.com
✅ Created 6 departments
✅ Created 10 employees
✅ Database seeding completed successfully!

🚀 Server started successfully!
> App URL: http://localhost:3000
> GraphQL: http://localhost:3000/graphql
> Environment: development
> MongoDB: Connected
```

---

### Step 5: Test Login

1. **Open the app:** `http://localhost:3000`

2. **Login with OTP:**
   - Email: `admin@company.com` or `employee@company.com`
   - Click "Send OTP"
   - **Check your terminal/console** for the OTP (it will be printed in development)
   - Enter the OTP and login

3. **You should see:**
   - Dashboard with 10 employees
   - Grid/Tile view toggle
   - Department filters (6 departments)
   - Search and pagination

---

## 🗂️ File Structure

```
ultraship-poc/
├── src/
│   └── backend/
│       ├── config/
│       │   └── database.js          # MongoDB connection
│       ├── models/
│       │   ├── User.js              # User model
│       │   ├── Employee.js          # Employee model
│       │   ├── Department.js        # Department model
│       │   └── OTP.js               # OTP model (TTL)
│       ├── resolvers/
│       │   └── index.js             # GraphQL resolvers (MongoDB)
│       ├── middleware/
│       │   └── auth.js              # Auth middleware
│       ├── schema/
│       │   └── typeDefs.js          # GraphQL schema
│       └── utils/
│           ├── seed.js              # Database seeding
│           └── email.js             # OTP email sending
├── server.js                        # Express + MongoDB integration
├── .env.local                       # Environment variables (created)
├── .env.example                     # Template
├── MONGODB_SETUP.md                 # Detailed MongoDB guide
└── SETUP_INSTRUCTIONS.md            # This file
```

---

## 🔧 Configuration

Your `.env.local` file has been created with these defaults:

```bash
MONGODB_URI=mongodb://localhost:27017/employee-management
SESSION_SECRET=dev-secret-change-in-production-12345
ADMIN_EMAIL=admin@company.com
EMPLOYEE_EMAIL=employee@company.com
PORT=3000
NODE_ENV=development
```

**To change:**
- Edit `.env.local`
- Restart the server

---

## 🧪 Testing the GraphQL API

### Visit: `http://localhost:3000/graphql`

#### 1. Request OTP
```graphql
mutation {
  requestOTP(email: "admin@company.com") {
    success
    message
  }
}
```

#### 2. Verify OTP (check console for code)
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

#### 3. Get Employees
```graphql
query {
  employees(page: 1, pageSize: 10) {
    employees {
      id
      name
      email
      department
      position
    }
    totalCount
    pageInfo {
      currentPage
      totalPages
    }
  }
}
```

#### 4. Add Employee (Admin only)
```graphql
mutation {
  addEmployee(input: {
    name: "New Employee"
    age: 28
    class: "Mid-Level"
    subjects: ["JavaScript", "React"]
    attendance: 95
    email: "new@company.com"
    phone: "+1-555-1234"
    department: "Engineering"
    position: "Software Engineer"
    joinDate: "2024-01-01"
    salary: 90000
    address: "123 Street"
    status: "Active"
  }) {
    id
    name
    email
  }
}
```

---

## 📊 Database Management

### View Data with MongoDB Shell

```bash
mongosh
use employee-management
db.users.find().pretty()
db.employees.find().pretty()
db.departments.find().pretty()
```

### Clear Database and Re-seed

```bash
mongosh
use employee-management
db.dropDatabase()
# Then restart your application
```

### Check Collections

```bash
mongosh
use employee-management
show collections
db.employees.countDocuments()
```

---

## 🎯 Features

### ✅ No Hardcoded Values
- All data comes from MongoDB
- All credentials in environment variables
- Seed data uses env vars

### ✅ Performance Optimized
- Database indexes on key fields
- Lean queries for read operations
- Pagination for large datasets
- TTL index for OTP auto-cleanup

### ✅ Security
- Bcrypt password hashing
- Session-based authentication
- Role-based authorization
- OTP with attempt limits and expiry

### ✅ Scalable
- Proper MongoDB schema design
- Validation at database level
- Error handling throughout
- Production-ready structure

---

## 🚨 Troubleshooting

### MongoDB Connection Error

```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Start MongoDB
brew services start mongodb-community@7.0

# Or use mongosh to test connection
mongosh mongodb://localhost:27017
```

### Port 3000 Already in Use

```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9

# Or change port in .env.local
PORT=3001
```

### Seed Data Not Created

```bash
# Clear database and restart
mongosh
use employee-management
db.dropDatabase()
exit
npm run dev
```

### OTP Not Received

- Check console/terminal - OTPs are logged in development
- For production: Configure EMAIL_USER and EMAIL_PASS in `.env.local`

---

## 📚 Documentation

- **MongoDB Setup:** See `MONGODB_SETUP.md` for detailed MongoDB configuration
- **OTP Login:** See `OTP_LOGIN_GUIDE.md` for authentication flow
- **GraphQL Schema:** See `src/backend/schema/typeDefs.js`

---

## 🎉 You're All Set!

Your application is now:
- ✅ Using MongoDB (no hardcoded data)
- ✅ Session-based authentication
- ✅ OTP login via email
- ✅ Role-based access control
- ✅ Fully seeded with sample data
- ✅ Production-ready architecture

**Just install MongoDB and run `npm run dev`!** 🚀

