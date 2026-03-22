import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Pages (to be created)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import AddEmployee from './pages/AddEmployee';
import EditEmployee from './pages/EditEmployee';
import Attendance from './pages/Attendance';
import Profile from './pages/Profile';

// Components
import Sidebar from './components/Layout/Sidebar';

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="flex items-center justify-center h-screen bg-secondary text-white">Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) return <Navigate to="/dashboard" />;

    return (
        <div className="flex bg-slate-900 min-h-screen">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="bg-slate-950 text-slate-50 min-h-screen">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/employees" element={<ProtectedRoute role="admin"><EmployeeList /></ProtectedRoute>} />
                        <Route path="/employees/add" element={<ProtectedRoute role="admin"><AddEmployee /></ProtectedRoute>} />
                        <Route path="/employees/edit/:id" element={<ProtectedRoute role="admin"><EditEmployee /></ProtectedRoute>} />
                        <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Routes>
                </div>
                <Toaster position="top-right" reverseOrder={false} />
            </Router>
        </AuthProvider>
    );
}

export default App;
