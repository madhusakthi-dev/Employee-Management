import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { toast } from 'react-hot-toast';
import { CalendarCheck, User, Clock, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Attendance = () => {
    const { user } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [attendanceLogs, setAttendanceLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (user.role === 'admin') {
                const [empRes, attRes] = await Promise.all([
                    api.get('/employees'),
                    api.get('/attendance')
                ]);
                setEmployees(empRes.data.data);
                setAttendanceLogs(attRes.data.data);
            } else if (user.employeeId) {
                const res = await api.get(`/attendance/${user.employeeId}`);
                setAttendanceLogs(res.data.data);
            }
        } catch (err) {
            toast.error('Failed to fetch attendance data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleMarkAttendance = async (empId, status) => {
        try {
            const res = await api.post('/attendance', {
                employeeId: empId,
                status,
                date: new Date().toISOString()
            });
            if (res.data.success) {
                toast.success(`Marked as ${status}`);
                fetchData();
            }
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to mark attendance');
        }
    };

    if (loading) return <div className="text-white flex items-center gap-2"><Loader2 className="animate-spin" /> Loading attendance...</div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header>
                <h2 className="text-3xl font-black text-white tracking-tight">Attendance Management</h2>
                <p className="text-slate-500 font-medium mt-1">Track daily presence and generate history reports.</p>
            </header>

            {user.role === 'admin' && (
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <CalendarCheck size={20} className="text-indigo-400" />
                        Today's Attendance
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {employees.map((emp) => (
                            <div key={emp._id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 group hover:border-indigo-500/50 transition-all">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                                        {emp.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{emp.name}</p>
                                        <p className="text-xs text-slate-500 uppercase tracking-tighter">{emp.employeeId}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleMarkAttendance(emp._id, 'PRESENT')}
                                        className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 py-2 rounded-xl text-xs font-bold transition-colors"
                                    >
                                        PRESENT
                                    </button>
                                    <button 
                                        onClick={() => handleMarkAttendance(emp._id, 'ABSENT')}
                                        className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 py-2 rounded-xl text-xs font-bold transition-colors"
                                    >
                                        ABSENT
                                    </button>
                                    <button 
                                        onClick={() => handleMarkAttendance(emp._id, 'LEAVE')}
                                        className="flex-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 py-2 rounded-xl text-xs font-bold transition-colors"
                                    >
                                        LEAVE
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-800 bg-slate-800/20">
                    <h3 className="text-lg font-bold text-white">Attendance History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-800/30">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
                                {user.role === 'admin' && <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Employee</th>}
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Time Logs</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {attendanceLogs.map((log) => (
                                <tr key={log._id} className="hover:bg-slate-800/20 transition-colors">
                                    <td className="px-6 py-4 text-sm text-slate-300 font-mono">
                                        {new Date(log.date).toLocaleDateString()}
                                    </td>
                                    {user.role === 'admin' && (
                                        <td className="px-6 py-4 font-bold text-white">
                                            {log.employee?.name || 'Unknown'}
                                        </td>
                                    )}
                                    <td className="px-6 py-4">
                                        <span className={`
                                            px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                                            ${log.status === 'PRESENT' ? 'bg-emerald-500/10 text-emerald-400' : log.status === 'ABSENT' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'}
                                        `}>
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500">
                                        Last Updated: {new Date(log.updatedAt).toLocaleTimeString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {attendanceLogs.length === 0 && (
                    <div className="p-10 text-center text-slate-500 italic">
                        No attendance records found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Attendance;
