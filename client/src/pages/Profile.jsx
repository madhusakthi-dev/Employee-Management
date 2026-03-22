import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { User, Mail, Briefcase, Calendar, Phone, MapPin, Database } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                if (user.employeeId) {
                    const res = await api.get(`/employees/${user.employeeId}`);
                    setDetails(res.data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [user]);

    if (loading) return <div className="text-white">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header>
                <h2 className="text-3xl font-black text-white tracking-tight">Personal Profile</h2>
                <p className="text-slate-500 font-medium mt-1">Manage your account and personal information.</p>
            </header>

            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                {/* Profile Header */}
                <div className="h-32 bg-indigo-600/20 border-b border-slate-800 relative">
                    <div className="absolute -bottom-16 left-8 bg-slate-900 p-2 rounded-3xl border border-slate-800">
                        <div className="w-24 h-24 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-indigo-600/30">
                            {user?.username.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>

                <div className="pt-20 px-8 pb-8 space-y-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl font-black text-white">{user?.username}</h3>
                            <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs mt-1">{user?.role} Account</p>
                        </div>
                        <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all border border-slate-700">
                            Edit Account
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h4 className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-xs border-b border-slate-800 pb-2">
                                <Database size={14} /> System Information
                            </h4>
                            <div className="space-y-4">
                                <InfoRow label="Email Address" value={user?.email} icon={Mail} />
                                <InfoRow label="User ID" value={user?.id} icon={User} />
                                <InfoRow label="Account Status" value="Active" icon={Calendar} highlight="text-emerald-400" />
                            </div>
                        </div>

                        {details ? (
                            <div className="space-y-6">
                                <h4 className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-xs border-b border-slate-800 pb-2">
                                    <Briefcase size={14} /> Employment Details
                                </h4>
                                <div className="space-y-4">
                                    <InfoRow label="Employee ID" value={details.employeeId} icon={Database} />
                                    <InfoRow label="Position" value={details.position} icon={Briefcase} />
                                    <InfoRow label="Salary" value={`$${details.salary.toLocaleString()}`} icon={Calendar} />
                                    <InfoRow label="Joined On" value={new Date(details.joinedAt).toLocaleDateString()} icon={Calendar} />
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-800/30 p-6 rounded-2xl border border-dashed border-slate-700 text-center">
                                <p className="text-slate-500 text-sm italic">Employment details not linked to this user account.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoRow = ({ label, value, icon: Icon, highlight }) => (
    <div className="flex items-start gap-4">
        <div className="bg-slate-800 p-2.5 rounded-xl text-slate-400 mt-0.5">
            <Icon size={16} />
        </div>
        <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{label}</p>
            <p className={`text-sm font-semibold truncate max-w-[200px] ${highlight || 'text-slate-200'}`}>{value}</p>
        </div>
    </div>
);

export default Profile;
