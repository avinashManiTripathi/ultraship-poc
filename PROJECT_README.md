# Employee Management System - Full Stack Application

A beautiful, modern full-stack employee management system built with Next.js, GraphQL, Express, and TypeScript.

## 🌟 Features Implemented

### Frontend Features
- ✅ **Hamburger Menu** with one-level deep submenu navigation
- ✅ **Horizontal Menu** with sample menu items
- ✅ **Grid View** displaying employee data in 10 columns
- ✅ **Tile View** showing essential employee information in beautiful cards
- ✅ **View Toggle** between grid and tile layouts
- ✅ **Action Menu** on each tile with Edit, Delete, and Flag options
- ✅ **Expanded Detail View** showing complete employee information
- ✅ **Smooth Navigation** between views
- ✅ **Responsive Design** - works on all screen sizes
- ✅ **Dark Mode** support
- ✅ **Search & Filter** functionality
- ✅ **Sorting** by multiple fields
- ✅ **Pagination** with page navigation

### Backend Features
- ✅ **GraphQL API** with Apollo Server
- ✅ **Employee Data Model** with all required fields (ID, name, age, class, subjects, attendance, email, phone, department, position, join date, salary, address, status)
- ✅ **Queries**:
  - List employees with optional filters
  - Retrieve single employee details
  - Pagination support
  - Sorting support
- ✅ **Mutations**:
  - Add employee (Admin only)
  - Update employee (Admin only)
  - Delete employee (Admin only)
- ✅ **Authentication** with JWT tokens
- ✅ **Role-Based Authorization** (Admin and Employee roles)
- ✅ **Performance Optimizations**:
  - Efficient filtering and sorting
  - Pagination to limit data transfer
  - In-memory caching with GraphQL
  - Optimized queries

## 🛠 Technology Stack

### Frontend
- **Next.js 16.0.3** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Modern utility-first CSS
- **Apollo Client** - GraphQL client

### Backend
- **Express 5.1.0** - Web server
- **Apollo Server** - GraphQL server
- **GraphQL** - API query language
- **JSON Web Tokens** - Authentication
- **bcryptjs** - Password hashing

## 📋 Prerequisites

- Node.js 20.x or higher
- npm or yarn

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ultraship-poc
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at **http://localhost:3000**

Both frontend and backend run on the same port (3000).

### 4. Access the Application

1. Open **http://localhost:3000** in your browser
2. You'll see the login page with test credentials

## 🔐 Test Credentials

### Admin Account (Full Access)
- **Email**: admin@company.com
- **Password**: admin123
- **Permissions**: View, Add, Edit, Delete employees

### Employee Account (Read Only)
- **Email**: employee@company.com
- **Password**: employee123
- **Permissions**: View employees only

## 📊 GraphQL API

The GraphQL playground is available at **http://localhost:3000/graphql**

### Sample Queries

#### Get All Employees with Pagination
```graphql
query {
  employees(page: 1, pageSize: 10, sortBy: name, sortOrder: ASC) {
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

#### Get Employee by ID
```graphql
query {
  employee(id: "1") {
    id
    name
    email
    department
    position
    subjects
    attendance
  }
}
```

#### Filter Employees
```graphql
query {
  employees(
    filter: { department: "Engineering", minAge: 25 }
    sortBy: attendance
    sortOrder: DESC
  ) {
    employees {
      name
      attendance
      department
    }
  }
}
```

### Sample Mutations

#### Add Employee (Admin Only)
```graphql
mutation {
  addEmployee(input: {
    name: "John Doe"
    age: 30
    class: "Senior"
    subjects: ["React", "Node.js"]
    attendance: 95.5
    email: "john@company.com"
    phone: "+1-555-0199"
    department: "Engineering"
    position: "Senior Developer"
    joinDate: "2024-01-15"
    salary: 100000
    address: "123 Main St"
    status: "Active"
  }) {
    id
    name
    email
  }
}
```

#### Update Employee (Admin Only)
```graphql
mutation {
  updateEmployee(
    id: "1"
    input: { attendance: 98.5 }
  ) {
    id
    name
    attendance
  }
}
```

## 🎨 UI Features

### Hamburger Menu
- Collapsible sidebar with smooth animations
- Submenu support for Employees, Reports, and Admin sections
- Mobile-responsive overlay

### Horizontal Menu
- Always visible top navigation
- Quick access to Dashboard, Reports, Analytics
- Admin Panel link for admin users

### Grid View
- 10-column table layout
- Color-coded attendance badges
- Clickable rows for detailed view
- Alternating row colors for readability

### Tile View
- Beautiful card-based layout
- Gradient headers
- Action menu button (⋮) on each card
- Edit, Delete, and Flag options
- Responsive grid (1-4 columns based on screen size)

### Detail View
- Full-screen modal with employee details
- Organized sections (Personal, Professional, Skills)
- Beautiful gradient design
- Close and navigation buttons

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Role-Based Access Control**: Admin and Employee roles
- **Password Hashing**: bcrypt with salt rounds
- **Protected Routes**: GraphQL resolvers check permissions
- **Token Expiry**: 24-hour token lifetime

## ⚡ Performance Optimizations

1. **Pagination**: Limits data transfer (12 items per page)
2. **Efficient Filtering**: Server-side filtering reduces payload
3. **Sorting**: Backend sorting for better performance
4. **In-Memory Cache**: Fast data access
5. **Lazy Loading**: Components load on demand
6. **Optimized Images**: Next.js Image component
7. **Code Splitting**: Automatic by Next.js

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly UI elements
- Hamburger menu for mobile navigation

## 🌙 Dark Mode

- System preference detection
- CSS variables for theming
- Smooth transitions between modes

## 📂 Project Structure

```
ultraship-poc/
├── src/
│   ├── app/
│   │   ├── components/          # React components
│   │   │   ├── Header.tsx       # Top navigation
│   │   │   ├── Sidebar.tsx      # Hamburger menu
│   │   │   ├── GridView.tsx     # Table view
│   │   │   ├── TileView.tsx     # Card view
│   │   │   ├── DetailView.tsx   # Expanded view
│   │   │   └── LoginPage.tsx    # Authentication
│   │   ├── context/             # React context
│   │   │   └── AuthContext.tsx  # Auth state management
│   │   ├── lib/                 # Utilities
│   │   │   └── apolloClient.ts  # GraphQL client
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Main page
│   │   └── globals.css          # Global styles
│   └── backend/
│       ├── schema/              # GraphQL schema
│       │   └── typeDefs.js      # Type definitions
│       ├── resolvers/           # GraphQL resolvers
│       │   └── index.js         # Query & mutation handlers
│       ├── models/              # Data models
│       │   └── data.js          # In-memory database
│       ├── middleware/          # Auth middleware
│       │   └── auth.js          # Authorization checks
│       └── utils/               # Helper functions
│           └── auth.js          # JWT & bcrypt utils
├── server.js                    # Express + Apollo server
├── package.json
└── README.md
```

## 🧪 Testing the Application

### Test Scenarios

1. **Login as Admin**
   - Use admin credentials
   - Verify access to all features
   - Test Edit and Delete actions

2. **Login as Employee**
   - Use employee credentials
   - Verify read-only access
   - Confirm Edit/Delete are hidden

3. **View Toggle**
   - Switch between Grid and Tile views
   - Verify data persists

4. **Search & Filter**
   - Search by employee name
   - Test filtering by department
   - Verify results update

5. **Pagination**
   - Navigate through pages
   - Verify page numbers
   - Test Previous/Next buttons

6. **Detail View**
   - Click on employee card/row
   - Verify all details shown
   - Test close navigation

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables

Create a `.env.local` file:

```env
PORT=3000
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this
```

### Deployment Platforms

**Vercel** (Recommended for Next.js):
```bash
vercel deploy
```

**Heroku**:
```bash
git push heroku main
```

**Docker**:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📝 API Documentation

### Authentication

All protected endpoints require a Bearer token:

```
Authorization: Bearer <your-jwt-token>
```

### Error Handling

GraphQL errors follow this format:

```json
{
  "errors": [
    {
      "message": "Error message",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ]
}
```

## 🎯 Future Enhancements

- Export data to CSV/Excel
- Advanced filtering (multiple criteria)
- Bulk operations
- Real-time updates with WebSockets
- Email notifications
- Performance analytics dashboard
- Audit logs
- File uploads for employee documents

## 👨‍💻 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- Functional components with hooks
- Async/await for asynchronous operations
- ESLint for code quality

## 📄 License

This project is created as a POC for demonstration purposes.

## 🙋‍♂️ Support

For questions or issues, please contact the development team.

---

**Built with ❤️ using Next.js, GraphQL, and Express**

