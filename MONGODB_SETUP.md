# MongoDB Setup Guide

## Overview

This application now uses **MongoDB** as the database instead of in-memory storage. All employee, department, user, and OTP data is stored in MongoDB with proper schema validation and indexing for optimal performance.

---

## Prerequisites

### 1. Install MongoDB

Choose one of the following options:

#### Option A: MongoDB Community Edition (Local)
```bash
# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0

# Verify installation
mongosh
```

#### Option B: MongoDB Atlas (Cloud - Free Tier)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a free cluster
4. Get your connection string
5. Whitelist your IP address or allow access from anywhere (0.0.0.0/0)

---

## Configuration

### 1. Environment Variables

Create a `.env.local` file in the project root:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/employee-management
# For MongoDB Atlas, use:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/employee-management

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-in-production

# Email Configuration (Optional - for production)
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASS=your-app-specific-password
# EMAIL_FROM=noreply@yourcompany.com

# Admin User Credentials (for initial seed)
ADMIN_EMAIL=admin@company.com
ADMIN_PASSWORD=admin123

# Employee User Credentials (for initial seed)
EMPLOYEE_EMAIL=employee@company.com
EMPLOYEE_PASSWORD=employee123

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 2. Important Notes

- **MONGODB_URI**: Connection string to your MongoDB instance
- **SESSION_SECRET**: Used for session encryption (change in production!)
- **EMAIL_USER/PASS**: Gmail app-specific password for OTP emails (optional in dev)
- **ADMIN_EMAIL**: Email for the admin user (created during seed)
- **EMPLOYEE_EMAIL**: Email for the test employee user (created during seed)

---

## Database Schema

### User Model
```javascript
{
  username: String (required, min: 3)
  email: String (required, unique, validated)
  password: String (required, hashed with bcrypt)
  role: String (enum: ['admin', 'employee'], default: 'employee')
  isActive: Boolean (default: true)
  timestamps: true (createdAt, updatedAt)
}
```

### Employee Model
```javascript
{
  name: String (required)
  age: Number (required, 18-100)
  class: String (enum: ['Junior', 'Mid-Level', 'Senior', 'Lead', 'Manager'])
  subjects: [String] (required)
  attendance: Number (required, 0-100)
  email: String (required, unique)
  phone: String (required)
  department: String (required)
  position: String (required)
  joinDate: Date (required)
  salary: Number (required, min: 0)
  address: String (required)
  status: String (enum: ['Active', 'Inactive', 'On Leave'], default: 'Active')
  timestamps: true
  indexes: name, email, department, class, status
}
```

### Department Model
```javascript
{
  name: String (required, unique)
  description: String
  timestamps: true
  indexes: name
}
```

### OTP Model (TTL)
```javascript
{
  email: String (required)
  otp: String (required)
  attempts: Number (default: 0, max: 3)
  expiresAt: Date (required, TTL index - auto-delete)
  timestamps: true
  indexes: email, expiresAt (TTL)
}
```

---

## Automatic Database Seeding

The application automatically seeds the database with initial data on first run:

### Created Users
1. **Admin User**
   - Email: `admin@company.com` (or from ADMIN_EMAIL env var)
   - Role: admin
   - Access: Full CRUD operations

2. **Employee User**
   - Email: `employee@company.com` (or from EMPLOYEE_EMAIL env var)
   - Role: employee
   - Access: Read-only operations

### Created Departments (6 departments)
- Engineering
- Marketing
- Sales
- Human Resources
- Finance
- Operations

### Created Employees (10 sample employees)
- Distributed across all departments
- Realistic data with proper validation
- Different classes, positions, and salaries

**Note**: The seed script only runs if the database is empty. It will skip if data already exists.

---

## Running the Application

### 1. Start MongoDB (if using local installation)
```bash
# macOS
brew services start mongodb-community@7.0

# Or start manually
mongod --config /opt/homebrew/etc/mongod.conf
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Application
```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
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

## Testing the Setup

### 1. Check MongoDB Connection
```bash
mongosh
use employee-management
db.users.find().pretty()
db.employees.find().pretty()
db.departments.find().pretty()
```

### 2. Test GraphQL API

Visit: `http://localhost:3000/graphql`

#### Request OTP
```graphql
mutation {
  requestOTP(email: "admin@company.com") {
    success
    message
  }
}
```

Check console for OTP code (in development mode).

#### Verify OTP and Login
```graphql
mutation {
  verifyOTP(email: "admin@company.com", otp: "YOUR_OTP_HERE") {
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

#### Query Employees
```graphql
query {
  employees(page: 1, pageSize: 10) {
    employees {
      id
      name
      email
      department
      position
      attendance
    }
    totalCount
    pageInfo {
      currentPage
      totalPages
      hasNextPage
    }
  }
}
```

---

## Performance Optimizations

### 1. Database Indexes
- Employee: `name`, `email`, `department`, `class`, `status`
- Department: `name`
- OTP: `email`, `expiresAt` (TTL)
- User: `email` (unique)

### 2. TTL (Time-To-Live) Index
- OTP documents automatically expire and are deleted after expiration
- No manual cleanup required
- Keeps database clean

### 3. Lean Queries
- Uses `.lean()` for read operations
- Returns plain JavaScript objects instead of Mongoose documents
- Faster and more memory-efficient

### 4. Pagination
- Implements cursor-based pagination
- Prevents loading large datasets into memory
- Efficient for large collections

---

## Production Considerations

### 1. MongoDB Atlas Setup
```bash
# Use connection string with credentials
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/employee-management?retryWrites=true&w=majority
```

### 2. Security
- Use strong `SESSION_SECRET`
- Enable IP whitelisting
- Use database authentication
- Enable SSL/TLS connections

### 3. Backups
- Enable automated backups in MongoDB Atlas
- Set up regular backup schedule
- Test restore procedures

### 4. Monitoring
- Monitor connection pool
- Track query performance
- Set up alerts for errors
- Use MongoDB Atlas monitoring tools

---

## Troubleshooting

### Connection Errors
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Check connection
mongosh mongodb://localhost:27017/employee-management
```

### Seed Script Issues
```bash
# Clear database and re-seed
mongosh
use employee-management
db.dropDatabase()
# Restart application
```

### Port Already in Use
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

---

## Additional Commands

### Clear Database
```bash
mongosh
use employee-management
db.dropDatabase()
```

### View Collections
```bash
mongosh
use employee-management
show collections
```

### Check Document Count
```bash
mongosh
use employee-management
db.employees.countDocuments()
db.users.countDocuments()
db.departments.countDocuments()
```

---

## Support

For MongoDB issues:
- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Atlas Support](https://www.mongodb.com/cloud/atlas/support)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

---

**Ready to go!** 🚀 Your application is now powered by MongoDB with no hardcoded values!

