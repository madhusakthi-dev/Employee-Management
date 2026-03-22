import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../api/api';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, User, Briefcase, DollarSign, Mail, Phone, MapPin } from 'lucide-react';

const employeeSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    employeeId: z.string().min(1, 'Employee ID is required'),
    position: z.string().min(1, 'Position is required'),
    salary: z.preprocess((val) => Number(val), z.number().min(0, 'Salary must be positive')),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone must be at least 10 digits'),
    address: z.string().min(1, 'Address is required'),
    status: z.enum(['Active', 'Inactive', 'On Leave']).default('Active'),
});

const AddEmployee = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(employeeSchema),
        defaultValues: { status: 'active' }
    });

    const onSubmit = async (data) => {
        setSubmitting(true);
        try {
            const res = await api.post('/employees', data);
            if (res.data.success) {
                toast.success('Employee added successfully');
                navigate('/employees');
            }
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to add employee');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex justify-between items-center">
                <div>
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-2 group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Directory
                    </button>
                    <h2 className="text-3xl font-black text-white tracking-tight">New Employee</h2>
                </div>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-indigo-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                            <User size={18} /> Personal Details
                        </h3>
                        
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Full Name</label>
                            <input
                                {...register('name')}
                                className="w-full bg-slate-800/50 border border-slate-700 focus:border-indigo-500 rounded-xl py-3 px-4 text-white outline-none transition-all placeholder:text-slate-600"
                                placeholder="John Doe"
                            />
                            {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                            <input
                                {...register('email')}
                                className="w-full bg-slate-800/50 border border-slate-700 focus:border-indigo-500 rounded-xl py-3 px-4 text-white outline-none transition-all placeholder:text-slate-600"
                                placeholder="john@company.com"
                            />
                            {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Phone Number</label>
                            <input
                                {...register('phone')}
                                className="w-full bg-slate-800/50 border border-slate-700 focus:border-indigo-500 rounded-xl py-3 px-4 text-white outline-none transition-all placeholder:text-slate-600"
                                placeholder="+1 234 567 890"
                            />
                        </div>
                        <div className="space-y-2">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Status</label>
                                <select
                                    {...register('status')}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="On Leave">On Leave</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Professional Info */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-indigo-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                            <Briefcase size={18} /> Professional Details
                        </h3>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Employee ID</label>
                            <input
                                {...register('employeeId')}
                                className="w-full bg-slate-800/50 border border-slate-700 focus:border-indigo-500 rounded-xl py-3 px-4 text-white outline-none transition-all placeholder:text-slate-600 font-mono"
                                placeholder="EMP-101"
                            />
                            {errors.employeeId && <p className="text-rose-500 text-xs mt-1">{errors.employeeId.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Position / Role</label>
                            <input
                                {...register('position')}
                                className="w-full bg-slate-800/50 border border-slate-700 focus:border-indigo-500 rounded-xl py-3 px-4 text-white outline-none transition-all placeholder:text-slate-600"
                                placeholder="Senior Software Engineer"
                            />
                            {errors.position && <p className="text-rose-500 text-xs mt-1">{errors.position.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Base Salary ($)</label>
                            <input
                                type="number"
                                {...register('salary')}
                                className="w-full bg-slate-800/50 border border-slate-700 focus:border-indigo-500 rounded-xl py-3 px-4 text-white outline-none transition-all placeholder:text-slate-600 font-mono"
                                placeholder="80000"
                            />
                            {errors.salary && <p className="text-rose-500 text-xs mt-1">{errors.salary.message}</p>}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Residential Address</label>
                    <textarea
                        {...register('address')}
                        rows="3"
                        className="w-full bg-slate-800/50 border border-slate-700 focus:border-indigo-500 rounded-xl py-3 px-4 text-white outline-none transition-all placeholder:text-slate-600"
                        placeholder="123 Street Name, City, Country"
                    ></textarea>
                </div>

                <div className="pt-6 border-t border-slate-800 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/employees')}
                        className="px-8 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-all font-bold"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/30 transition-all font-bold flex items-center gap-2 disabled:opacity-50"
                    >
                        {submitting ? 'Creating...' : (
                            <>
                                <Save size={18} />
                                <span>Create Employee</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddEmployee;
