import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { 
    Search, 
    Plus, 
    Edit2, 
    Trash2, 
    Printer, 
    Briefcase,
    DollarSign,
    Loader2,
    FileText
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/employees?search=${searchTerm}`);
            if (res.data.success) {
                setEmployees(res.data.data);
            }
        } catch (err) {
            toast.error('Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchEmployees();
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                const res = await api.delete(`/employees/${id}`);
                if (res.data.success) {
                    toast.success('Employee deleted successfully');
                    fetchEmployees();
                }
            } catch (err) {
                toast.error('Failed to delete employee');
            }
        }
    };

    const handlePrint = (employee) => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Employee Details - ${employee.name}</title>
                    <style>
                        body { font-family: sans-serif; padding: 40px; color: #333; }
                        .header { border-bottom: 2px solid #4f46e5; padding-bottom: 10px; margin-bottom: 30px; }
                        .detail-row { display: flex; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
                        .label { width: 150px; font-weight: bold; color: #666; }
                        .value { flex: 1; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Employee Information</h1>
                    </div>
                    <div class="detail-row"><span class="label">Name:</span> <span class="value">${employee.name}</span></div>
                    <div class="detail-row"><span class="label">ID:</span> <span class="value">${employee.employeeId}</span></div>
                    <div class="detail-row"><span class="label">Position:</span> <span class="value">${employee.position}</span></div>
                    <div class="detail-row"><span class="label">Salary:</span> <span class="value">$${employee.salary.toLocaleString()}</span></div>
                    <div class="detail-row"><span class="label">Email:</span> <span class="value">${employee.email}</span></div>
                    <div class="detail-row"><span class="label">Status:</span> <span class="value">${employee.status}</span></div>
                    <button onclick="window.print()" style="margin-top:20px;">Print</button>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    const generateReport = () => {
        const printWindow = window.open('', '_blank');
        const content = `
            <html>
            <head>
                <title>Staff Report - ${new Date().toLocaleDateString()}</title>
                <style>
                    body { font-family: sans-serif; padding: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                    th { background-color: #f4f4f4; }
                </style>
            </head>
            <body>
                <h1>Staff Report - ${new Date().toLocaleDateString()}</h1>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Position</th>
                            <th>Salary</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${employees.map(emp => `
                            <tr>
                                <td>${emp.employeeId}</td>
                                <td>${emp.name}</td>
                                <td>${emp.position}</td>
                                <td>$${emp.salary.toLocaleString()}</td>
                                <td>${emp.status}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;
        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="space-y-8 p-4">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white">Employee Directory</h2>
                    <p className="text-slate-500">Manage and track your workforce.</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={generateReport}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-2xl border border-slate-700 transition-all shadow-lg"
                    >
                        <FileText size={20} />
                        <span>Generate Report</span>
                    </button>
                    <Link 
                        to="/employees/add" 
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition-all flex items-center gap-2"
                    >
                        <Plus size={20} />
                        <span>Add Employee</span>
                    </Link>
                </div>
            </header>

            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                        <Search size={20} />
                    </span>
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-2xl py-4 pl-12 pr-4 text-white outline-none transition-all"
                    />
                </div>
                {loading && <Loader2 className="animate-spin text-indigo-400" size={24} />}
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-800/50">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Employee</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Position</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Salary</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {employees.map((emp) => (
                                <tr key={emp._id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                                                {emp.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">{emp.name}</p>
                                                <p className="text-xs text-slate-500">#{emp.employeeId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-slate-300">
                                        {emp.position}
                                    </td>
                                    <td className="px-6 py-5 font-mono font-bold text-slate-300">
                                        ${emp.salary.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            emp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                                            emp.status === 'On Leave' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                            'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                        }`}>
                                            {emp.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handlePrint(emp)} className="p-2 text-slate-400 hover:text-white"><Printer size={18} /></button>
                                            <button onClick={() => navigate(`/employees/edit/${emp._id}`)} className="p-2 text-slate-400 hover:text-indigo-400"><Edit2 size={18} /></button>
                                            <button onClick={() => handleDelete(emp._id)} className="p-2 text-slate-400 hover:text-rose-400"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployeeList;
