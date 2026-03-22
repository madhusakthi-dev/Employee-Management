import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    LayoutDashboard, 
    Users, 
    CalendarCheck, 
    UserCircle, 
    LogOut, 
    Building2 
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['admin', 'employee'] },
        { name: 'Employees', icon: Users, path: '/employees', roles: ['admin'] },
        { name: 'Attendance', icon: CalendarCheck, path: '/attendance', roles: ['admin', 'employee'] },
        { name: 'Profile', icon: UserCircle, path: '/profile', roles: ['admin', 'employee'] },
    ];

    const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role));

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 shadow-2xl">
            <div className="p-6 flex items-center gap-3 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
                    <Building2 size={24} />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
                    EMS Pro
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {filteredMenu.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                            ${isActive 
                                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 shadow-lg shadow-indigo-500/5' 
                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
                        `}
                    >
                        <item.icon size={20} className="transition-transform group-hover:scale-110" />
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                <div className="mb-4 px-4 py-3 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Signed in as</p>
                    <p className="text-sm text-white font-semibold truncate flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        {user?.username}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium capitalize mt-0.5">{user?.role}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-colors group"
                >
                    <LogOut size={20} className="transition-transform group-hover:-translate-x-1" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
