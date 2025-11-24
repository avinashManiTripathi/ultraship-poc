# 🚀 Quick Start Guide

## Get Started in 3 Steps!

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Server
```bash
npm run dev
```

### Step 3: Open Your Browser
Navigate to **http://localhost:3000**

---

## 🔐 Login

You'll see a beautiful login page with test credentials displayed.

### Admin Account (Full Access)
```
Email: admin@company.com
Password: admin123
```
**Can**: View, Add, Edit, Delete employees

### Employee Account (Read-Only)
```
Email: employee@company.com  
Password: employee123
```
**Can**: View employees only

---

## 🎯 What You'll See

### 1. Dashboard with Navigation
- **Hamburger Menu** (left) - Click to open sidebar
- **Horizontal Menu** (top) - Dashboard, Reports, Analytics, Admin Panel
- **User Profile** (right) - Shows your role, click to logout

### 2. Employee Management
- **Search Bar** - Search employees by name
- **Sort Dropdown** - Sort by name, age, department, attendance
- **View Toggle** - Switch between Grid (table) and Tile (cards) views

### 3. Grid View (Table)
- 10-column table showing all employee details
- Color-coded attendance badges
- Click any row to see full details

### 4. Tile View (Cards)
- Beautiful card layout
- **⋮ Button** on each card for actions:
  - Edit (Admin only)
  - Delete (Admin only)  
  - Flag (Coming soon)
- Click any card to see full details

### 5. Detail View (Expanded)
- Full employee information in a modal
- Personal info, Professional info, Skills
- Close button or click outside to return

---

## 🧪 Try These Features

1. **Login as Admin**
   - Login with admin credentials
   - See Edit/Delete options in tile view
   - Try searching for "John"
   - Switch between Grid and Tile views

2. **Login as Employee**
   - Logout (click profile → Sign Out)
   - Login with employee credentials
   - Notice Edit/Delete options are hidden
   - You can still view all employees

3. **Navigation**
   - Open the hamburger menu
   - Expand "Employees" submenu
   - See role-based Admin Panel (admin only)

4. **Sorting & Filtering**
   - Change sort field to "Attendance"
   - Toggle sort order (ascending/descending)
   - Search for employee names

5. **Detail View**
   - Click any employee card or table row
   - See all 14 fields of information
   - Close and try another employee

---

## 🔧 GraphQL Playground

Want to test the API directly? Visit **http://localhost:3000/graphql**

### Sample Query
```graphql
query {
  employees(page: 1, pageSize: 10) {
    employees {
      name
      department
      attendance
    }
    totalCount
  }
}
```

**Don't forget to add authentication header:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

Get your token from browser localStorage after logging in, or use the login mutation.

---

## 📱 Responsive Design

Try resizing your browser or opening on mobile:
- Hamburger menu becomes overlay on mobile
- Grid view becomes horizontally scrollable
- Tile view adjusts from 4 columns → 1 column
- All interactions are touch-friendly

---

## 🎨 Dark Mode

Your system's dark mode preference is automatically detected!

---

## ⚡ Performance

- **Pagination**: Only 12 employees loaded at a time
- **Fast Search**: Instant results as you type
- **Smooth Animations**: 60fps transitions
- **Optimized Images**: Lazy loading

---

## 🛑 Troubleshooting

### Port Already in Use?
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Then run npm run dev again
```

### Can't Login?
- Make sure you copied credentials exactly
- Check browser console for errors
- Try refreshing the page

### Server Won't Start?
- Check Node.js version: `node --version` (need 20.x+)
- Delete node_modules: `rm -rf node_modules && npm install`
- Check for errors in terminal

---

## 📚 More Documentation

- **PROJECT_README.md** - Full documentation
- **FEATURES.md** - Complete feature list
- **DEPLOYMENT.md** - Deployment guide
- **SETUP.md** - Original setup notes

---

## 🎉 That's It!

You now have a fully functional, production-ready employee management system!

**Built with:**
- ⚛️ Next.js 16 & React 19
- 🔷 GraphQL & Apollo
- 🎨 Tailwind CSS v4
- 🔐 JWT Authentication
- 🚀 Express Server

Enjoy exploring! 🚀

