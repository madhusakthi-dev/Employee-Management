import React, { useState, useEffect } from 'react';
import api from '../api/api';
import StatsCard from '../components/UI/StatsCard';
import { Users, UserCheck, CalendarDays, TrendingUp, Bell, Send, MessageSquare, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { user } = useAuth();
    console.log('Current user:', user);
    const [stats, setStats] = useState({ total: 0, active: 0 });
    const [empData, setEmpData] = useState(null);
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [queryForm, setQueryForm] = useState({ type: 'QUERY', subject: '', message: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user?.role === 'admin') {
                    const res = await api.get('/employees/stats');
                    if (res.data.success) setStats(res.data.data);
                } else if (user?.employeeId) {
                    const [statsRes, queriesRes] = await Promise.all([
                        api.get(`/employees/me/stats/${user.employeeId}`),
                        api.get(`/queries/me/${user.employeeId}`)
                    ]);
                    if (statsRes.data.success) setEmpData(statsRes.data.data);
                    if (queriesRes.data.success) setQueries(queriesRes.data.data);
                }
            } catch (err) {
                console.error(err);
                toast.error('Failed to fetch dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleQuerySubmit = async (e) => {
        e.preventDefault();
        if (!queryForm.subject || !queryForm.message) {
            return toast.error('Please fill in all fields');
        }

        setSubmitting(true);
        try {
            const res = await api.post('/queries', { ...queryForm, employeeId: user.employeeId });
            if (res.data.success) {
                toast.success(`${queryForm.type === 'QUERY' ? 'Query' : 'Complaint'} submitted successfully`);
                setQueries([res.data.data, ...queries]);
                setQueryForm({ type: 'QUERY', subject: '', message: '' });
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to submit. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-white">Loading Dashboard...</div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">System Overview</h2>
                    <p className="text-slate-500 font-medium mt-1">Welcome back, {user?.username}. Here's what's happening today.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-slate-800/50 p-3 rounded-2xl text-slate-400 hover:text-white transition-colors border border-slate-700/50">
                        <Bell size={20} />
                    </button>
                    <div className="bg-indigo-600/10 px-4 py-2 rounded-2xl border border-indigo-500/20 text-indigo-400 font-bold text-sm flex items-center gap-2">
                        <CalendarDays size={18} />
                        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                </div>
            </header>

            {user?.role === 'admin' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard 
                        title="Total Employees" 
                        value={stats.total} 
                        icon={Users} 
                        color="bg-blue-600" 
                        trend="+3" 
                    />
                    <StatsCard 
                        title="Active Employees" 
                        value={stats.active} 
                        icon={UserCheck} 
                        color="bg-emerald-600" 
                        trend="92%" 
                    />
                    <StatsCard 
                        title="Attendance Rate" 
                        value="94%" 
                        icon={CalendarDays} 
                        color="bg-amber-600" 
                        trend="+1.2%" 
                    />
                    <StatsCard 
                        title="Performance Index" 
                        value="8.4" 
                        icon={TrendingUp} 
                        color="bg-purple-600" 
                        trend="+0.3" 
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatsCard 
                        title="Attendance Rate" 
                        value={empData?.stats?.attendanceRate || '0%'} 
                        icon={TrendingUp} 
                        color="bg-indigo-600" 
                    />
                    <StatsCard 
                        title="Days Present" 
                        value={empData?.stats?.presentDays || 0} 
                        icon={UserCheck} 
                        color="bg-emerald-600" 
                    />
                    <StatsCard 
                        title="Employment Status" 
                        value={empData?.stats?.status || 'Active'} 
                        icon={Users} 
                        color="bg-amber-600" 
                    />
                </div>
            )}

            {user?.role === 'employee' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Attendance History */}
                    <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-xl">
                        <h4 className="text-xl font-bold text-white mb-6">Recent Attendance</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-slate-500 text-xs uppercase tracking-widest border-b border-slate-800">
                                        <th className="pb-4 font-bold">Date</th>
                                        <th className="pb-4 font-bold">Status</th>
                                        <th className="pb-4 font-bold">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {empData?.recentAttendance?.map((record, i) => (
                                        <tr key={i} className="border-b border-slate-800/50 group hover:bg-slate-800/20 transition-colors">
                                            <td className="py-4 text-slate-300 font-medium">
                                                {new Date(record.date).toLocaleDateString()}
                                            </td>
                                            <td className="py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                                    record.status === 'PRESENT' ? 'bg-emerald-500/10 text-emerald-400' : 
                                                    record.status === 'ABSENT' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                                                }`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td className="py-4 text-slate-500 italic">
                                                {record.remarks || 'No remarks'}
                                            </td>
                                        </tr>
                                    ))}
                                    {(!empData?.recentAttendance || empData.recentAttendance.length === 0) && (
                                        <tr>
                                            <td colSpan="3" className="py-8 text-center text-slate-500 italic">No attendance records found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Submit Query/Complaint */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col">
                        <h4 className="text-xl font-bold text-white mb-6">Queries & Complaints</h4>
                        <form onSubmit={handleQuerySubmit} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Type</label>
                                <select 
                                    value={queryForm.type}
                                    onChange={(e) => setQueryForm({ ...queryForm, type: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                >
                                    <option value="QUERY">Query</option>
                                    <option value="COMPLAINT">Complaint</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Subject</label>
                                <input 
                                    type="text"
                                    value={queryForm.subject}
                                    onChange={(e) => setQueryForm({ ...queryForm, subject: e.target.value })}
                                    placeholder="Brief subject..."
                                    className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Message</label>
                                <textarea 
                                    value={queryForm.message}
                                    onChange={(e) => setQueryForm({ ...queryForm, message: e.target.value })}
                                    placeholder="Describe your query or complaint in detail..."
                                    rows="4"
                                    className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                            >
                                {submitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={18} />}
                                {submitting ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {user?.role === 'employee' && (
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-xl mt-8">
                    <h4 className="text-xl font-bold text-white mb-6">Recent Requests</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {queries.length === 0 ? (
                            <p className="text-slate-500 italic col-span-full">You haven't submitted any queries or complaints yet.</p>
                        ) : (
                            queries.map((q) => (
                                <div key={q._id} className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl group hover:border-indigo-500/30 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                            q.type === 'QUERY' ? 'bg-blue-500/10 text-blue-400' : 'bg-rose-500/10 text-rose-400'
                                        }`}>
                                            {q.type}
                                        </span>
                                        <span className={`flex items-center gap-1 text-[10px] font-bold ${
                                            q.status === 'RESOLVED' ? 'text-emerald-400' : 
                                            q.status === 'IN_PROGRESS' ? 'text-amber-400' : 'text-slate-400'
                                        }`}>
                                            {q.status === 'RESOLVED' ? <CheckCircle2 size={12} /> : 
                                             q.status === 'IN_PROGRESS' ? <Clock size={12} /> : <AlertCircle size={12} />}
                                            {q.status}
                                        </span>
                                    </div>
                                    <h5 className="text-white font-bold mb-2 group-hover:text-indigo-400 transition-colors">{q.subject}</h5>
                                    <p className="text-slate-400 text-xs line-clamp-2 mb-4">{q.message}</p>
                                    <div className="text-[10px] text-slate-500 border-t border-slate-700/50 pt-3">
                                        Submitted on {new Date(q.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {user?.role === 'admin' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-xl">
                        <h4 className="text-xl font-bold text-white mb-6">Recent Activities</h4>
                        <div className="space-y-6">
                            {[
                                { user: 'Admin', act: 'Added new employee "John Doe"', time: '2 mins ago' },
                                { user: 'System', act: 'Attendance reports generated', time: '1 hour ago' },
                                { user: 'Admin', act: 'Updated salary for "Jane Smith"', time: '3 hours ago' },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-start group">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 group-hover:scale-150 transition-transform"></div>
                                    <div className="flex-1">
                                        <p className="text-slate-200 text-sm font-semibold">{item.act}</p>
                                        <p className="text-slate-500 text-xs mt-0.5">{item.time} • By {item.user}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-xl">
                        <h4 className="text-xl font-bold text-white mb-6">Quick Actions</h4>
                        <div className="space-y-4">
                            <button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-2xl transition-all border border-slate-700/50 flex items-center justify-center gap-2">
                                + Add New Employee
                            </button>
                            <button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-2xl transition-all border border-slate-700/50 flex items-center justify-center gap-2">
                                Generate Monthly Report
                            </button>
                            <button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-2xl transition-all border border-slate-700/50 flex items-center justify-center gap-2">
                                <MessageSquare size={18} /> View All Queries
                            </button>
                            <button className="w-full bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 font-bold py-3 rounded-2xl transition-all border border-indigo-500/20 flex items-center justify-center gap-2">
                                Global Settings
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
