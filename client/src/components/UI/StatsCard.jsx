import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color, trend }) => {
    return (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-3xl group hover:border-indigo-500/50 transition-all duration-300 shadow-xl hover:shadow-indigo-500/5 relative overflow-hidden">
            {/* Background pattern */}
            <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500 ${color || 'text-indigo-400'}`}>
                <Icon size={120} />
            </div>

            <div className="flex justify-between items-start relative z-10">
                <div>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">{title}</p>
                    <h3 className="text-3xl font-black text-white tracking-tight">{value}</h3>
                    {trend && (
                        <p className={`text-xs mt-2 font-bold px-2 py-1 rounded-full inline-block ${
                            trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                            {trend} from last month
                        </p>
                    )}
                </div>
                <div className={`${color || 'bg-indigo-600'} p-3 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
