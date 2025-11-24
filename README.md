# Employee Management System

A full-stack employee management system built with **Next.js**, **Express**, **GraphQL**, and **MongoDB**.

## 🌟 Features

- **Modern UI**: Beautiful dashboard with grid/tile views, Nunito font
- **Authentication**: OTP-based login with session management
- **Authorization**: Role-based access control (Admin/Employee)
- **GraphQL API**: Complete CRUD operations with Apollo Server
- **MongoDB**: Persistent database with schema validation
- **Real-time Filtering**: Search, sort, and filter employees
- **Department Management**: Dynamic department CRUD
- **Responsive Design**: Mobile-friendly interface
- **Performance**: Optimized with indexes and pagination

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB 7.0+ (local or Atlas)
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Install MongoDB** (if not already installed):
   ```bash
   # macOS
   brew tap mongodb/brew
   brew install mongodb-community@7.0
   brew services start mongodb-community@7.0
   ```

   Or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)

3. **Configure environment** (already created):
   ```bash
   # .env.local is pre-configured with defaults
   # Edit if needed for custom configuration
   ```

4. **Start the application:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   - App: http://localhost:3000
   - GraphQL: http://localhost:3000/graphql

### First Login

1. Use one of these emails:
   - `admin@company.com` (Admin access)
   - `employee@company.com` (Employee access)

2. Click "Send OTP"

3. Check your **terminal/console** for the OTP code

4. Enter the OTP and login

## 📁 Project Structure

```
ultraship-poc/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── components/           # React components
│   │   ├── context/              # Auth & Apollo context
│   │   ├── lib/                  # Apollo Client
│   │   └── page.tsx              # Dashboard
│   └── backend/
│       ├── config/               # MongoDB connection
│       ├── models/               # Mongoose models
│       ├── resolvers/            # GraphQL resolvers
│       ├── schema/               # GraphQL schema
│       ├── middleware/           # Auth middleware
│       └── utils/                # Utilities (email, seed)
├── server.js                     # Express + Next.js server
└── package.json
```

## 🗄️ Database Schema

### Models

- **User**: Authentication with bcrypt hashing
- **Employee**: Full employee data with validation
- **Department**: Department management
- **OTP**: Temporary OTP storage with TTL

### Seed Data

On first run, the database is automatically seeded with:
- 2 users (admin, employee)
- 6 departments (Engineering, Marketing, Sales, HR, Finance, Operations)
- 10 sample employees

## 🔐 Authentication Flow

1. **Request OTP**: User enters email
2. **Send OTP**: 6-digit code sent (logged to console in dev)
3. **Verify OTP**: User enters code
4. **Create Session**: HTTPOnly session cookie set
5. **Access Protected Routes**: Session validated on each request

## 🎨 UI Components

- **Header**: Top navigation with horizontal menu
- **Sidebar**: Hamburger menu with department filters
- **Grid View**: Table layout with all employee data
- **Tile View**: Card layout with key information
- **Detail View**: Expanded employee information
- **Modals**: Add Employee, Add Department, Manage Departments

## 🔧 API Endpoints

### REST APIs

- `GET /api/hello` - Health check
- `GET /api/health` - Server status

### GraphQL

- `POST /graphql` - All GraphQL operations
- `GET /graphql` - GraphQL playground

### GraphQL Operations

**Queries:**
- `employees` - List employees (with filtering, pagination, sorting)
- `employee(id)` - Get single employee
- `departments` - List departments
- `department(id)` - Get single department
- `me` - Get current user

**Mutations:**
- `requestOTP(email)` - Request OTP for login
- `verifyOTP(email, otp)` - Verify OTP and login
- `logout` - Destroy session
- `addEmployee(input)` - Create employee (Admin)
- `updateEmployee(id, input)` - Update employee (Admin)
- `deleteEmployee(id)` - Delete employee (Admin)
- `addDepartment(input)` - Create department (Admin)
- `updateDepartment(id, input)` - Update department (Admin)
- `deleteDepartment(id)` - Delete department (Admin)

## 📊 Performance Features

- **Database Indexes**: On name, email, department, class, status
- **Pagination**: Cursor-based pagination for large datasets
- **Lean Queries**: Optimized read operations
- **TTL Index**: Automatic OTP cleanup
- **Connection Pooling**: MongoDB connection pool management

## 🛡️ Security

- **BCrypt**: Password hashing with salt rounds
- **Sessions**: HTTPOnly cookies (no localStorage tokens)
- **CORS**: Configured for same-origin
- **Validation**: Schema-level validation on all inputs
- **Authorization**: Role-based middleware on mutations
- **OTP Limits**: Max 3 attempts, 5-minute expiry

## 📚 Documentation

- **Setup Guide**: `SETUP_INSTRUCTIONS.md` - Quick start guide
- **MongoDB Guide**: `MONGODB_SETUP.md` - Detailed MongoDB setup
- **OTP Guide**: `OTP_LOGIN_GUIDE.md` - Authentication documentation

## 🔨 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

### Environment Variables

See `.env.example` for all available options:

```bash
MONGODB_URI          # MongoDB connection string
SESSION_SECRET       # Session encryption key
ADMIN_EMAIL          # Admin user email (seed)
EMPLOYEE_EMAIL       # Employee user email (seed)
EMAIL_USER           # SMTP user (optional)
EMAIL_PASS           # SMTP password (optional)
PORT                 # Server port (default: 3000)
NODE_ENV             # Environment (development/production)
```

## 🧪 Testing

### Test GraphQL API

Visit `http://localhost:3000/graphql` and try:

```graphql
# Request OTP
mutation {
  requestOTP(email: "admin@company.com") {
    success
    message
  }
}

# Verify OTP
mutation {
  verifyOTP(email: "admin@company.com", otp: "123456") {
    user { id username email role }
    message
  }
}

# Get Employees
query {
  employees(page: 1, pageSize: 10) {
    employees { id name email department }
    totalCount
  }
}
```

### Test MongoDB

```bash
mongosh
use employee-management
db.employees.find().pretty()
```

## 🐛 Troubleshooting

**MongoDB Connection Error:**
```bash
brew services start mongodb-community@7.0
```

**Port Already in Use:**
```bash
lsof -ti:3000 | xargs kill -9
```

**Clear Database:**
```bash
mongosh
use employee-management
db.dropDatabase()
```

## 🚀 Deployment

### MongoDB Atlas

1. Create cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Update `.env.local`:
   ```bash
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/employee-management
   ```

### Vercel/Netlify

1. Set environment variables in deployment settings
2. Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
3. Set `NODE_ENV=production`
4. Deploy!

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

---

**Built with ❤️ using Next.js, Express, GraphQL, and MongoDB**
