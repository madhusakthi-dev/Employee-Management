# Employee Management System (EMS)

A full-stack Employee Management System built with React, Node.js, Express, and MongoDB. The system features separate dashboards for Admins and Employees, allowing for efficient management and personal tracking.

## 🚀 Key Features

### 👨‍💼 Admin Dashboard
- **Employee Management**: Add, edit, and delete employee records.
- **Attendance Tracking**: View and manage attendance for all employees.
- **Stats Dashboard**: Real-time overview of total/active employees and attendance rates.
- **Queries & Complaints**: Monitor and respond to employee submissions.

### 👤 Employee Dashboard
- **Personal Stats**: Visualize your attendance rate, days present, and current status.
- **Attendance History**: View your recent attendance records with remarks.
- **Queries & Complaints System**: Submit queries or complaints directly to the admin and track their status (Pending, In Progress, Resolved).
- **Profile Management**: View and update personal information.

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide React (Icons), React Hot Toast.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Authentication.
- **Design**: Premium dark-themed UI with glassmorphism and smooth animations.

## 📦 Setup Instructions

### 1. Prerequisites
- Node.js installed
- MongoDB database (local or Atlas)

### 2. Backend Setup
```bash
cd server
npm install
# Configure your .env file with MONGODB_URI and JWT_SECRET
npm start
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

### 4. Admin Credentials (Default)
- **Email**: `admin@ems.com`
- **Password**: `adminpassword123`

## 🛣️ API Routes

### Auth
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/auth/me` - Get current user info

### Employees
- `GET /api/v1/employees` - Get all employees (Admin)
- `GET /api/v1/employees/:id` - Get single employee details
- `GET /api/v1/employees/stats` - Get system-wide stats (Admin)
- `GET /api/v1/employees/me/stats/:id` - Get personal stats (Employee)

### Queries
- `POST /api/v1/queries` - Submit a query/complaint
- `GET /api/v1/queries/me/:employeeId` - View personal submissions
- `GET /api/v1/queries` - View all submissions (Admin)
- `PUT /api/v1/queries/:id` - Update submission status (Admin)

## 📄 License
MIT License
