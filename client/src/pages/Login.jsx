import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { Building2, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        setSubmitting(true);
        try {
            const result = await login(data.email, data.password);
            if (result.success) {
                toast.success('Login successful!');
                navigate('/dashboard');
            } else {
                toast.error(result.error || 'Invalid credentials');
            }
        } catch (err) {
            toast.error('An unexpected error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-950 items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 -right-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>

            <div className="w-full max-w-md relative">
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl relative z-10">
                    <div className="text-center mb-10">
                        <div className="bg-indigo-600 inline-flex p-4 rounded-2xl text-white shadow-xl shadow-indigo-600/30 mb-4 animate-bounce-slow">
                            <Building2 size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
                        <p className="text-slate-400 mt-2 text-sm">Sign in to manage your workspace</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                            <div className="relative group">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                    <Mail size={18} />
                                </span>
                                <input
                                    {...register('email')}
                                    type="email"
                                    placeholder="admin@ems.com"
                                    className="w-full bg-slate-800/50 border border-slate-700/50 focus:border-indigo-500 rounded-xl py-3 pl-10 pr-4 text-white outline-none transition-all focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-600"
                                />
                            </div>
                            {errors.email && <p className="text-rose-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Password</label>
                            <div className="relative group">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                    <Lock size={18} />
                                </span>
                                <input
                                    {...register('password')}
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-slate-800/50 border border-slate-700/50 focus:border-indigo-500 rounded-xl py-3 pl-10 pr-4 text-white outline-none transition-all focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-600"
                                />
                            </div>
                            {errors.password && <p className="text-rose-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 group overflow-hidden"
                        >
                            {submitting ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-800/50 text-center">
                        <p className="text-slate-500 text-xs">
                            © 2024 EMS Pro • Modern Employee Management
                        </p>
                    </div>
                </div>
                
                {/* Decorative dots */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-dots grid grid-cols-4 gap-2 opacity-20">
                    {[...Array(16)].map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-white rounded-full"></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Login;
